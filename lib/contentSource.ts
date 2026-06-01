// ============================================================
// Public content source (Supabase-backed, with graceful fallback).
// ------------------------------------------------------------
// The live website reads catalogue content from here. Each
// getter:
//   1. Pulls rows from Supabase (the shared source of truth).
//   2. Overlays them on the static baseline from lib/data.ts
//      (static items are kept unless a Supabase row shares the slug).
//   3. Returns only items whose publication moment has arrived,
//      so bulk-scheduled batches auto-publish over time.
//
// If Supabase is not configured, or a request fails (offline,
// transient error), we fall back to the browser-local merged
// dataset so the site keeps rendering. All functions are async
// and safe to call from client components.
// ============================================================

import { getSupabaseClient } from "./supabase";
import { Tool, Review, BlogPost, TOOLS, REVIEWS, BLOG_POSTS } from "./data";
import {
  getMergedTools,
  getMergedReviews,
  getMergedBlogPosts,
} from "./clientDb";
import { filterPublished } from "./contentSchedule";

function mergeWithStatic<T extends { slug: string }>(
  staticItems: T[],
  remoteItems: T[],
): T[] {
  const staticFiltered = staticItems.filter(
    (s) => !remoteItems.some((r) => r.slug === s.slug),
  );
  return [...staticFiltered, ...remoteItems];
}

/* ---------- row → entity mappers (snake_case → camelCase) ---------- */

function rowToTool(t: any): Tool {
  return {
    slug: t.slug,
    name: t.name,
    startingPrice: t.starting_price || "",
    numericPrice: Number(t.numeric_price || 0),
    category: t.category,
    oneLineOpinion: t.one_line_opinion || "",
    parentSlug: t.parent_slug || undefined,
    tierName: t.tier_name || undefined,
    pricingModel: t.pricing_model || undefined,
    keyFeatures: Array.isArray(t.key_features) ? t.key_features : [],
    limitations: Array.isArray(t.limitations) ? t.limitations : [],
    aiIncluded: Boolean(t.ai_included),
    aiCost: t.ai_cost || undefined,
    freeTrial: Boolean(t.free_trial),
    freeForever: Boolean(t.free_forever),
    iconUrl: t.icon_url || undefined,
    publicationDate: t.publication_date || undefined,
  };
}

function rowToReview(r: any): Review {
  return {
    slug: r.slug,
    title: r.title,
    toolA: r.tool_a,
    toolB: r.tool_b,
    category: r.category,
    excerpt: r.excerpt || "",
    readTimeMinutes: Number(r.read_time_minutes || 5),
    publicationDate: r.publication_date,
    verdict: r.verdict || "editor-pick",
    winnerSlug: r.winner_slug || "",
    hotTakeQuote: r.hot_take_quote || "",
    finalVerdictParagraph: r.final_verdict_paragraph || "",
    bestForA: r.best_for_a || "",
    bestForB: r.best_for_b || "",
    tableRows: r.table_rows || [],
  };
}

function rowToBlogPost(b: any): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    issueNumber: Number(b.issue_number || 0),
    excerpt: b.excerpt || "",
    readTime: b.read_time || "5 min read",
    publicationDate: b.publication_date,
    category: b.category,
    contentMarkdown: b.content_markdown || "",
  };
}

/* ---------- generic Supabase fetch with fallback ---------- */

async function fetchMerged<T extends { slug: string }>(
  table: string,
  mapper: (row: any) => T,
  staticItems: T[],
  localFallback: () => T[],
): Promise<T[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return localFallback();

  try {
    const { data, error } = await supabase.from(table).select("*");
    if (error || !data) return localFallback();
    return mergeWithStatic(staticItems, data.map(mapper));
  } catch {
    return localFallback();
  }
}

/* ---------- full (unfiltered) merged catalogues ---------- */

export async function getAllTools(): Promise<Tool[]> {
  return fetchMerged("saas_tools", rowToTool, TOOLS, getMergedTools);
}

export async function getAllReviews(): Promise<Review[]> {
  return fetchMerged("saas_reviews", rowToReview, REVIEWS, getMergedReviews);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return fetchMerged(
    "saas_blog_posts",
    rowToBlogPost,
    BLOG_POSTS,
    getMergedBlogPosts,
  );
}

/* ---------- published-only catalogues (what visitors see) ---------- */

export async function getPublishedTools(): Promise<Tool[]> {
  return filterPublished(await getAllTools());
}

export async function getPublishedReviews(): Promise<Review[]> {
  return filterPublished(await getAllReviews());
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return filterPublished(await getAllBlogPosts());
}
