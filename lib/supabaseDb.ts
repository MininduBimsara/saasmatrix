import { getSupabaseClient } from "./supabase";
import { Tool, Review, BlogPost } from "./data";
import {
  getCustomTools,
  getCustomReviews,
  getCustomBlogPosts,
  saveCustomTool,
  saveCustomReview,
  saveCustomBlogPost,
} from "./clientDb";

export interface SupabaseSyncResult {
  success: boolean;
  message: string;
  count?: number;
}

/**
 * Pushes all custom local storage tables to Supabase.
 * Uses tables 'saas_tools', 'saas_reviews', and 'saas_blog_posts'.
 * Drops standard security logs if they fail, falling back gracefully with informative codes.
 */
export async function pushLocalToSupabase(): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  }

  const tools = getCustomTools();
  const reviews = getCustomReviews();
  const blogs = getCustomBlogPosts();

  try {
    let toolsUploaded = 0;
    let reviewsUploaded = 0;
    let blogsUploaded = 0;

    // 1. Sync Tools
    if (tools.length > 0) {
      const { error: toolsError } = await supabase.from("saas_tools").upsert(
        tools.map((t) => ({
          slug: t.slug,
          name: t.name,
          starting_price: t.startingPrice,
          numeric_price: t.numericPrice,
          category: t.category,
          one_line_opinion: t.oneLineOpinion,
          parent_slug: t.parentSlug || null,
          tier_name: t.tierName || null,
          pricing_model: t.pricingModel || null,
          key_features: t.keyFeatures || [],
          limitations: t.limitations || [],
          ai_included: t.aiIncluded ?? false,
          ai_cost: t.aiCost || null,
          free_trial: t.freeTrial ?? false,
          free_forever: t.freeForever ?? false,
          icon_url: t.iconUrl || null,
          publication_date: t.publicationDate || null,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "slug" },
      );

      if (toolsError)
        throw new Error(`Tools upsert failed: ${toolsError.message}`);
      toolsUploaded = tools.length;
    }

    // 2. Sync Reviews
    if (reviews.length > 0) {
      const { error: reviewsError } = await supabase
        .from("saas_reviews")
        .upsert(
          reviews.map((r) => ({
            slug: r.slug,
            title: r.title,
            tool_a: r.toolA || null,
            tool_b: r.toolB || null,
            category: r.category,
            excerpt: r.excerpt || null,
            read_time_minutes: r.readTimeMinutes !== null && r.readTimeMinutes !== undefined ? r.readTimeMinutes : 5,
            publication_date: r.publicationDate,
            verdict: r.verdict || null,
            winner_slug: r.winnerSlug || null,
            hot_take_quote: r.hotTakeQuote || null,
            final_verdict_paragraph: r.finalVerdictParagraph || null,
            best_for_a: r.bestForA || null,
            best_for_b: r.bestForB || null,
            table_rows: r.tableRows || [], // Store array values as jsonb
            updated_at: new Date().toISOString(),
          })),
          { onConflict: "slug" },
        );

      if (reviewsError)
        throw new Error(`Reviews upsert failed: ${reviewsError.message}`);
      reviewsUploaded = reviews.length;
    }

    // 3. Sync Blogs
    if (blogs.length > 0) {
      const { error: blogsError } = await supabase
        .from("saas_blog_posts")
        .upsert(
          blogs.map((b) => ({
            slug: b.slug,
            title: b.title,
            issue_number: b.issueNumber,
            excerpt: b.excerpt,
            read_time: b.readTime,
            publication_date: b.publicationDate,
            category: b.category,
            content_markdown: b.contentMarkdown,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: "slug" },
        );

      if (blogsError)
        throw new Error(`Blog posts upsert failed: ${blogsError.message}`);
      blogsUploaded = blogs.length;
    }

    return {
      success: true,
      message: `Successfully synchronized data with Supabase Cloud! Sync counts: ${toolsUploaded} tools, ${reviewsUploaded} reviews, ${blogsUploaded} blogs.`,
    };
  } catch (error: any) {
    console.error("Supabase Sync Push failed:", error);
    return {
      success: false,
      message:
        error.message || "Verification anomaly occurred while pushing values.",
    };
  }
}

/**
 * Pulls stored data from Supabase and populates localStorage.
 */
export async function pullSupabaseToLocal(): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  }

  try {
    // 1. Fetch Tools
    const { data: toolsData, error: toolsError } = await supabase
      .from("saas_tools")
      .select("*");

    if (toolsError && toolsError.code !== "PGRST116") {
      // Missing table count is okay, we'll try to explain.
      throw new Error(`Failed to read saas_tools: ${toolsError.message}`);
    }

    if (toolsData && toolsData.length > 0) {
      toolsData.forEach((t) => {
        saveCustomTool({
          slug: t.slug,
          name: t.name,
          startingPrice: t.starting_price,
          numericPrice: t.numeric_price,
          category: t.category,
          oneLineOpinion: t.one_line_opinion,
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
        });
      });
    }

    // 2. Fetch Reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("saas_reviews")
      .select("*");

    if (reviewsError && reviewsError.code !== "PGRST116") {
      throw new Error(`Failed to read saas_reviews: ${reviewsError.message}`);
    }

    if (reviewsData && reviewsData.length > 0) {
      reviewsData.forEach((r) => {
        saveCustomReview({
          slug: r.slug,
          title: r.title,
          toolA: r.tool_a || "",
          toolB: r.tool_b || "",
          category: r.category,
          excerpt: r.excerpt || "",
          readTimeMinutes: r.read_time_minutes !== null && r.read_time_minutes !== undefined ? Number(r.read_time_minutes) : 5,
          publicationDate: r.publication_date,
          verdict: r.verdict || null,
          winnerSlug: r.winner_slug || null,
          hotTakeQuote: r.hot_take_quote || "",
          finalVerdictParagraph: r.final_verdict_paragraph || "",
          bestForA: r.best_for_a || "",
          bestForB: r.best_for_b || "",
          tableRows: r.table_rows || [],
        });
      });
    }

    // 3. Fetch Blogs
    const { data: blogsData, error: blogsError } = await supabase
      .from("saas_blog_posts")
      .select("*");

    if (blogsError && blogsError.code !== "PGRST116") {
      throw new Error(`Failed to read saas_blog_posts: ${blogsError.message}`);
    }

    if (blogsData && blogsData.length > 0) {
      blogsData.forEach((b) => {
        saveCustomBlogPost({
          slug: b.slug,
          title: b.title,
          issueNumber: b.issue_number,
          excerpt: b.excerpt,
          readTime: b.read_time,
          publicationDate: b.publication_date,
          category: b.category,
          contentMarkdown: b.content_markdown,
        });
      });
    }

    const totalPulled =
      (toolsData?.length || 0) +
      (reviewsData?.length || 0) +
      (blogsData?.length || 0);

    return {
      success: true,
      message: `Pulled database snapshot from Supabase! Restored ${totalPulled} nodes in active browser cache.`,
      count: totalPulled,
    };
  } catch (error: any) {
    console.error("Supabase Sync Pull failed:", error);
    return {
      success: false,
      message: error.message || "Authentication or schema validation error.",
    };
  }
}

/* ============================================================
   Targeted batch upserts — used by the Content Pipeline bulk
   uploader to push exactly the queued batch straight to the
   cloud (so scheduled drops go live for every visitor without
   pushing the entire local overlay).
   ============================================================ */

export async function pushToolsBatch(
  tools: Tool[],
): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase)
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  if (tools.length === 0)
    return { success: true, message: "No tools to push.", count: 0 };

  const { error } = await supabase.from("saas_tools").upsert(
    tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      starting_price: t.startingPrice,
      numeric_price: t.numericPrice,
      category: t.category,
      one_line_opinion: t.oneLineOpinion,
      parent_slug: t.parentSlug || null,
      tier_name: t.tierName || null,
      pricing_model: t.pricingModel || null,
      key_features: t.keyFeatures || [],
      limitations: t.limitations || [],
      ai_included: t.aiIncluded ?? false,
      ai_cost: t.aiCost || null,
      free_trial: t.freeTrial ?? false,
      free_forever: t.freeForever ?? false,
      icon_url: t.iconUrl || null,
      publication_date: t.publicationDate || null,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "slug" },
  );

  if (error)
    return {
      success: false,
      message: `Tools batch upsert failed: ${error.message}`,
    };
  return {
    success: true,
    message: `Pushed ${tools.length} tools to Supabase.`,
    count: tools.length,
  };
}

export async function pushReviewsBatch(
  reviews: Review[],
): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase)
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  if (reviews.length === 0)
    return { success: true, message: "No reviews to push.", count: 0 };

  const { error } = await supabase.from("saas_reviews").upsert(
    reviews.map((r) => ({
      slug: r.slug,
      title: r.title,
      tool_a: r.toolA || null,
      tool_b: r.toolB || null,
      category: r.category,
      excerpt: r.excerpt || null,
      read_time_minutes: r.readTimeMinutes !== null && r.readTimeMinutes !== undefined ? r.readTimeMinutes : 5,
      publication_date: r.publicationDate,
      verdict: r.verdict || null,
      winner_slug: r.winnerSlug || null,
      hot_take_quote: r.hotTakeQuote || null,
      final_verdict_paragraph: r.finalVerdictParagraph || null,
      best_for_a: r.bestForA || null,
      best_for_b: r.bestForB || null,
      table_rows: r.tableRows || [],
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "slug" },
  );

  if (error)
    return {
      success: false,
      message: `Reviews batch upsert failed: ${error.message}`,
    };
  return {
    success: true,
    message: `Pushed ${reviews.length} reviews to Supabase.`,
    count: reviews.length,
  };
}

export async function pushBlogsBatch(
  blogs: BlogPost[],
): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase)
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  if (blogs.length === 0)
    return { success: true, message: "No blog posts to push.", count: 0 };

  const { error } = await supabase.from("saas_blog_posts").upsert(
    blogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      issue_number: b.issueNumber,
      excerpt: b.excerpt,
      read_time: b.readTime,
      publication_date: b.publicationDate,
      category: b.category,
      content_markdown: b.contentMarkdown,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "slug" },
  );

  if (error)
    return {
      success: false,
      message: `Blog posts batch upsert failed: ${error.message}`,
    };
  return {
    success: true,
    message: `Pushed ${blogs.length} blog posts to Supabase.`,
    count: blogs.length,
  };
}

/** Delete a single row by slug from one of the catalogue tables. */
export async function deleteSupabaseRow(
  table: "saas_tools" | "saas_reviews" | "saas_blog_posts",
  slug: string,
): Promise<SupabaseSyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase)
    return {
      success: false,
      message: "Supabase credentials are not configured.",
    };
  const { error } = await supabase.from(table).delete().eq("slug", slug);
  if (error)
    return { success: false, message: `Delete failed: ${error.message}` };
  return { success: true, message: `Removed ${slug} from ${table}.` };
}
