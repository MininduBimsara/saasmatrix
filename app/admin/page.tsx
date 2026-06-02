"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdContainer } from "@/components/AdContainer";
import {
  Database,
  Layers,
  BookOpen,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  Settings,
  HelpCircle,
  FileCheck,
  Flame,
  CheckCircle2,
  Layers2,
  LogOut,
  CloudLightning,
  CloudUpload,
  CloudDownload,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { Tool, Review, BlogPost, CATEGORIES, CategorySlug } from "@/lib/data";
import {
  buildScheduledBlogPosts,
  formatBlogPublicationDate,
  getBlogPublicationTimestamp,
  getScheduledBlogPosts,
  getPublishedBlogPosts,
  slugifyBlogText,
  DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
  rescheduleBlogPosts,
} from "@/lib/blogSchedule";
import {
  staggerPublicationDates,
  rescheduleItems,
  filterScheduled,
  filterPublished,
  formatScheduleDate,
  hoursUntilPublish,
  slugify,
} from "@/lib/contentSchedule";

import AdminLogin from "@/components/AdminLogin";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase";
import {
  pushLocalToSupabase,
  pullSupabaseToLocal,
  pushToolsBatch,
  pushReviewsBatch,
  pushBlogsBatch,
  deleteSupabaseRow,
} from "@/lib/supabaseDb";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { logAdminAction } from "@/lib/auditLog";

type ToolFormState = Omit<
  Tool,
  "category" | "keyFeatures" | "limitations" | "publicationDate"
> & {
  category: CategorySlug;
  keyFeatures: string;
  limitations: string;
  publicationDate: string;
  iconUrl?: string;
};

const getDefaultLocalDateTime = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  return new Date(now.getTime() - offsetMinutes * 60_000)
    .toISOString()
    .slice(0, 16);
};

const multilineToItems = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const itemsToMultiline = (value?: string[]): string => (value || []).join("\n");

const toLocalDateTimeValue = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMinutes = date.getTimezoneOffset();
  return new Date(date.getTime() - offsetMinutes * 60_000)
    .toISOString()
    .slice(0, 16);
};

const formStateToTool = (tool: ToolFormState): Tool => {
  const publicationDate = tool.publicationDate.trim();
  const parsedPublicationDate = publicationDate
    ? new Date(publicationDate)
    : null;

  return {
    slug: tool.slug.trim(),
    name: tool.name.trim(),
    startingPrice: tool.startingPrice.trim() || `$${tool.numericPrice}/mo`,
    numericPrice: tool.numericPrice,
    category: tool.category,
    oneLineOpinion: tool.oneLineOpinion.trim(),
    parentSlug: tool.parentSlug?.trim() || undefined,
    tierName: tool.tierName?.trim() || undefined,
    pricingModel: tool.pricingModel?.trim() || undefined,
    keyFeatures: multilineToItems(tool.keyFeatures),
    limitations: multilineToItems(tool.limitations),
    aiIncluded: tool.aiIncluded,
    aiCost: tool.aiCost?.trim() || undefined,
    freeTrial: tool.freeTrial,
    freeForever: tool.freeForever,
    iconUrl: tool.iconUrl?.trim() || undefined,
    publicationDate:
      parsedPublicationDate && !Number.isNaN(parsedPublicationDate.getTime())
        ? parsedPublicationDate.toISOString()
        : undefined,
  };
};

const toolToFormState = (tool: Tool): ToolFormState => ({
  slug: tool.slug,
  name: tool.name,
  startingPrice: tool.startingPrice,
  numericPrice: tool.numericPrice,
  category: tool.category,
  oneLineOpinion: tool.oneLineOpinion,
  parentSlug: tool.parentSlug || "",
  tierName: tool.tierName || "",
  pricingModel: tool.pricingModel || "",
  keyFeatures: itemsToMultiline(tool.keyFeatures),
  limitations: itemsToMultiline(tool.limitations),
  aiIncluded: tool.aiIncluded ?? false,
  aiCost: tool.aiCost || "",
  freeTrial: tool.freeTrial ?? false,
  freeForever: tool.freeForever ?? false,
  iconUrl: tool.iconUrl || "",
  publicationDate: toLocalDateTimeValue(tool.publicationDate),
});

export default function AdminPage() {
  const TOOL_ICON_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_TOOL_ICON_BUCKET || "tool-icons";

  // Administrative state checking & lockouts
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Directly evaluate config parameter on-the-fly to prevent cascading state side-effects
  const supabaseActive = isSupabaseConfigured();

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tools" | "reviews" | "blog" | "backend" | "pipeline"
  >("dashboard");

  // Merged database lists loaded on-client on-mount
  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);

  // Success state banners
  const [isSavedBanner, setIsSavedBanner] = useState<string | null>(null);
  const [realtimeNotification, setRealtimeNotification] = useState<
    string | null
  >(null);

  // Form states: Tools
  const [toolForm, setToolForm] = useState<ToolFormState>({
    slug: "",
    name: "",
    startingPrice: "$15/mo",
    numericPrice: 15,
    category: "project-management",
    oneLineOpinion: "",
    parentSlug: "",
    tierName: "",
    pricingModel: "",
    keyFeatures: "",
    limitations: "",
    aiIncluded: false,
    aiCost: "",
    freeTrial: false,
    freeForever: false,
    iconUrl: "",
    publicationDate: getDefaultLocalDateTime(),
  });

  // Form states: Reviews
  const [reviewForm, setReviewForm] = useState<
    Omit<Review, "tableRows" | "category"> & { category: CategorySlug }
  >({
    slug: "",
    title: "",
    toolA: "",
    toolB: "",
    category: "project-management",
    excerpt: "",
    readTimeMinutes: 5,
    publicationDate: new Date().toISOString().split("T")[0],
    verdict: "editor-pick",
    winnerSlug: "",
    hotTakeQuote: "",
    finalVerdictParagraph: "",
    bestForA: "",
    bestForB: "",
  });

  // Review table rows builder sub-state
  const [customTableRows, setCustomTableRows] = useState<
    {
      feature: string;
      valueA: string;
      valueB: string;
      winner: string;
    }[]
  >([]);

  const [newRowDraft, setNewRowDraft] = useState({
    feature: "",
    valueA: "",
    valueB: "",
    winner: "",
  });

  // Form states: Blogs
  const [blogForm, setBlogForm] = useState<BlogPost>({
    slug: "",
    title: "",
    issueNumber: 43,
    excerpt: "",
    readTime: "6 min read",
    publicationDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    category: "Procurement Strategy",
    contentMarkdown: "",
  });

  const [bulkBlogDraftJson, setBulkBlogDraftJson] = useState<string>(`[
  {
    "title": "Why seat-based pricing is collapsing",
    "excerpt": "The weekly procurement memo on usage-based billing.",
    "category": "Procurement Strategy",
    "readTime": "5 min read",
    "contentMarkdown": "### What changed\n\nAdd your article copy here.",
    "slug": "why-seat-based-pricing-is-collapsing"
  }
]`);
  const [bulkBlogStartAt, setBulkBlogStartAt] = useState<string>(() => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    return new Date(now.getTime() - offsetMinutes * 60_000)
      .toISOString()
      .slice(0, 16);
  });
  const [bulkBlogIntervalHours, setBulkBlogIntervalHours] = useState<number>(
    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
  );

  // Pipeline management states
  const [pipelineStartAt, setPipelineStartAt] = useState<string>(() => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    return new Date(now.getTime() - offsetMinutes * 60_000)
      .toISOString()
      .slice(0, 16);
  });
  const [pipelineIntervalHours, setPipelineIntervalHours] = useState<number>(
    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
  );

  // Which content type is active inside the unified Content Pipeline tab
  const [pipelineSubTab, setPipelineSubTab] = useState<
    "blog" | "review" | "tool"
  >("blog");

  // Reviews bulk scheduler states
  const [bulkReviewJson, setBulkReviewJson] = useState<string>(`[
  {
    "title": "Asana vs ClickUp: which scales cheaper",
    "toolA": "asana",
    "toolB": "clickup",
    "category": "project-management",
    "excerpt": "A head-to-head on per-seat economics at 50+ users.",
    "verdict": "editor-pick",
    "winnerSlug": "clickup",
    "hotTakeQuote": "ClickUp wins on price, Asana on polish.",
    "finalVerdictParagraph": "For lean teams watching spend, ClickUp edges ahead.",
    "bestForA": "Design-led teams",
    "bestForB": "Budget-conscious ops",
    "readTimeMinutes": 6,
    "tableRows": [
      { "feature": "Starting price", "valueA": "$10.99/user", "valueB": "$7/user", "winner": "B" }
    ]
  }
]`);
  const [bulkReviewStartAt, setBulkReviewStartAt] = useState<string>(
    getDefaultLocalDateTime,
  );
  const [bulkReviewIntervalHours, setBulkReviewIntervalHours] =
    useState<number>(DEFAULT_BLOG_QUEUE_INTERVAL_HOURS);

  // Tools bulk scheduler states
  const [bulkToolJson, setBulkToolJson] = useState<string>(`[
  {
    "name": "Linear",
    "category": "project-management",
    "numericPrice": 8,
    "oneLineOpinion": "Keyboard-first issue tracking with buttery-fast sync and opinionated workflows.",
    "pricingModel": "per-seat",
    "keyFeatures": ["Fast keyboard navigation", "Opinionated workflows"],
    "limitations": ["Rigid for bespoke processes"],
    "aiIncluded": false,
    "freeTrial": true,
    "freeForever": false
  }
]`);
  const [bulkToolStartAt, setBulkToolStartAt] = useState<string>(
    getDefaultLocalDateTime,
  );
  const [bulkToolIntervalHours, setBulkToolIntervalHours] = useState<number>(
    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
  );

  // Blog markdown live preview mode
  const [blogPreviewMode, setBlogPreviewMode] = useState<boolean>(false);

  // Reload trigger to refresh the dataset asynchronously from index transactions
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  useEffect(() => {
    let active = true;
    import("@/lib/clientDb").then((db) => {
      if (!active) return;
      setToolsList(db.getMergedTools());
      setReviewsList(db.getMergedReviews());
      setBlogsList(db.getMergedBlogPosts());

      const mergedT = db.getMergedTools();
      if (mergedT.length >= 2) {
        setReviewForm((prev) => ({
          ...prev,
          toolA: mergedT[0].slug,
          toolB: mergedT[1].slug,
          winnerSlug: mergedT[0].slug,
        }));
      }
    });
    return () => {
      active = false;
    };
  }, [reloadTrigger]);

  // Method to trigger a dynamic data reload
  const loadDatabase = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  // Real-time Supabase active replication subscription
  useEffect(() => {
    if (!isAuthenticated || !supabaseActive) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    let active = true;
    let channel: any = null;

    import("@/lib/clientDb").then((db) => {
      if (!active) return;

      channel = supabase
        .channel("realtime_saaspebble_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "saas_tools" },
          (payload: any) => {
            if (payload.eventType === "DELETE") {
              if (payload.old?.slug) {
                db.deleteCustomTool(payload.old.slug);
                setRealtimeNotification(
                  `Real-time Cloud Event: Removed tool row "${payload.old.slug}"`,
                );
              }
            } else {
              const t = payload.new;
              if (t) {
                db.saveCustomTool({
                  slug: t.slug,
                  name: t.name,
                  startingPrice: t.starting_price || "",
                  numericPrice: Number(t.numeric_price || 0),
                  category: t.category,
                  oneLineOpinion: t.one_line_opinion || "",
                  parentSlug: t.parent_slug || undefined,
                  tierName: t.tier_name || undefined,
                  pricingModel: t.pricing_model || undefined,
                  keyFeatures: Array.isArray(t.key_features)
                    ? t.key_features
                    : [],
                  limitations: Array.isArray(t.limitations)
                    ? t.limitations
                    : [],
                  aiIncluded: Boolean(t.ai_included),
                  aiCost: t.ai_cost || undefined,
                  freeTrial: Boolean(t.free_trial),
                  freeForever: Boolean(t.free_forever),
                  iconUrl: t.icon_url || undefined,
                  publicationDate: t.publication_date || undefined,
                });
                setRealtimeNotification(
                  `Real-time Cloud Event: Synchronized tool "${t.name}"`,
                );
              }
            }
            loadDatabase();
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "saas_reviews" },
          (payload: any) => {
            if (payload.eventType === "DELETE") {
              if (payload.old?.slug) {
                db.deleteCustomReview(payload.old.slug);
                setRealtimeNotification(
                  `Real-time Cloud Event: Removed comparison matrix "${payload.old.slug}"`,
                );
              }
            } else {
              const r = payload.new;
              if (r) {
                db.saveCustomReview({
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
                });
                setRealtimeNotification(
                  `Real-time Cloud Event: Synchronized review "${r.title}"`,
                );
              }
            }
            loadDatabase();
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "saas_blog_posts" },
          (payload: any) => {
            if (payload.eventType === "DELETE") {
              if (payload.old?.slug) {
                db.deleteCustomBlogPost(payload.old.slug);
                setRealtimeNotification(
                  `Real-time Cloud Event: Removed blog issue "${payload.old.slug}"`,
                );
              }
            } else {
              const b = payload.new;
              if (b) {
                db.saveCustomBlogPost({
                  slug: b.slug,
                  title: b.title,
                  issueNumber: Number(b.issue_number || 43),
                  excerpt: b.excerpt || "",
                  readTime: b.read_time || "5 min read",
                  publicationDate: b.publication_date,
                  category: b.category,
                  contentMarkdown: b.content_markdown || "",
                });
                setRealtimeNotification(
                  `Real-time Cloud Event: Synchronized newsletter issue #${b.issue_number}`,
                );
              }
            }
            loadDatabase();
          },
        )
        .subscribe((status) => {
          console.log(
            "Supabase Postgres Realtime Subscription status:",
            status,
          );
        });
    });

    return () => {
      active = false;
      if (channel && supabase) {
        supabase.removeChannel(channel).catch((err) => {
          console.warn("Error clearing realtime channel:", err);
        });
      }
    };
  }, [isAuthenticated, supabaseActive]);

  useEffect(() => {
    if (!realtimeNotification) {
      return () => {};
    }
    const timer = setTimeout(() => {
      setRealtimeNotification(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [realtimeNotification]);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setIsAuthenticated(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    // Deferred to avoid synchronous state cycles during mounting
    Promise.resolve().then(checkSession);
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  // Auto sign-out after 30 minutes of inactivity — only active when authenticated
  useIdleTimeout(
    () => {
      if (isAuthenticated) handleSignOut();
    },
    30 * 60 * 1000,
  );

  const handlePushToSupabase = async () => {
    setSyncLoading(true);
    setSyncFeedback(null);
    try {
      const result = await pushLocalToSupabase();
      setSyncFeedback(result);
      if (result.success) {
        triggerSuccessAlert(
          "Successfully pushed local storage index elements to Supabase rows.",
        );
      }
    } catch (e: any) {
      setSyncFeedback({
        success: false,
        message: e.message || "Push sync sequence error.",
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const handlePullFromSupabase = async () => {
    setSyncLoading(true);
    setSyncFeedback(null);
    try {
      const result = await pullSupabaseToLocal();
      setSyncFeedback(result);
      if (result.success) {
        loadDatabase();
        triggerSuccessAlert(
          "Sync pulled successfully! Overlaid local browser nodes.",
        );
      }
    } catch (e: any) {
      setSyncFeedback({
        success: false,
        message: e.message || "Pull sync sequence error.",
      });
    } finally {
      setSyncLoading(false);
    }
  };

  // Handle saving banners
  const triggerSuccessAlert = (message: string) => {
    setIsSavedBanner(message);
    setTimeout(() => {
      setIsSavedBanner(null);
    }, 4000);
  };

  // Helper to slugify text titles dynamically for pristine index keys
  const autoSlugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove invalid chars
      .replace(/[\s_]+/g, "-") // Replace spaces with hyphen
      .replace(/^-+|-+$/g, ""); // Trim hyphens
  };

  const parseBulkBlogDrafts = (): {
    drafts: BlogPost[];
    error: string | null;
  } => {
    try {
      const parsed = JSON.parse(bulkBlogDraftJson);

      if (!Array.isArray(parsed)) {
        return {
          drafts: [],
          error: "Bulk input must be a JSON array of article objects.",
        };
      }

      const normalized = parsed.map((item: any, index: number) => {
        const title = String(item?.title || "").trim();
        const excerpt = String(item?.excerpt || "").trim();
        const category = String(item?.category || "").trim();
        const contentMarkdown = String(item?.contentMarkdown || "").trim();

        if (!title || !excerpt || !category || !contentMarkdown) {
          throw new Error(
            `Row ${index + 1} is missing title, excerpt, category, or contentMarkdown.`,
          );
        }

        return {
          title,
          slug: String(item?.slug || "").trim() || slugifyBlogText(title),
          excerpt,
          category,
          readTime: String(item?.readTime || "5 min read").trim(),
          contentMarkdown,
          issueNumber: Number(item?.issueNumber) || undefined,
        };
      });

      const startAt = new Date(bulkBlogStartAt);
      if (Number.isNaN(startAt.getTime())) {
        return { drafts: [], error: "Bulk start date is invalid." };
      }

      const startingIssueNumber =
        Math.max(
          42,
          ...blogsList.map((post) => Number(post.issueNumber) || 0),
        ) + 1;
      const scheduledDrafts = buildScheduledBlogPosts(
        normalized,
        startAt,
        bulkBlogIntervalHours || DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
        startingIssueNumber,
      );

      return { drafts: scheduledDrafts, error: null };
    } catch (error: any) {
      return {
        drafts: [],
        error: error?.message || "Unable to parse the bulk blog queue payload.",
      };
    }
  };

  const getBlogScheduleStatus = (post: BlogPost) => {
    const timestamp = getBlogPublicationTimestamp(post.publicationDate);
    const isFuture = timestamp !== null && timestamp > Date.now();

    return {
      isFuture,
      label: isFuture ? "Scheduled" : "Published",
      formattedDate: formatBlogPublicationDate(post.publicationDate),
    };
  };

  /* ==========================================
     MUTATIONS & HANDLERS
     ========================================== */

  // Save Tool Action
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.slug || !toolForm.name) return;
    const toolToSave = formStateToTool(toolForm);

    const db = await import("@/lib/clientDb");
    db.saveCustomTool(toolToSave);
    logAdminAction({
      action: "create",
      entity: "tool",
      entitySlug: toolForm.slug,
      details: { name: toolForm.name },
    });
    await pushBatchToCloud("tool", [toolToSave]);

    triggerSuccessAlert(
      `Tool "${toolForm.name}" compiled and saved into the index database!`,
    );

    // Clear Form
    setToolForm({
      slug: "",
      name: "",
      startingPrice: "$15/mo",
      numericPrice: 15,
      category: "project-management",
      oneLineOpinion: "",
      parentSlug: "",
      tierName: "",
      pricingModel: "",
      keyFeatures: "",
      limitations: "",
      aiIncluded: false,
      aiCost: "",
      freeTrial: false,
      freeForever: false,
      iconUrl: "",
      publicationDate: getDefaultLocalDateTime(),
    });

    loadDatabase();
  };

  const uploadToolIcon = async (file: File): Promise<string> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const uploadPath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(TOOL_ICON_BUCKET)
      .upload(uploadPath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from(TOOL_ICON_BUCKET)
      .getPublicUrl(uploadPath);
    return data.publicUrl;
  };

  // Delete Tool Action
  const handleDeleteTool = async (slug: string) => {
    const db = await import("@/lib/clientDb");
    db.deleteCustomTool(slug);
    logAdminAction({ action: "delete", entity: "tool", entitySlug: slug });
    if (supabaseActive) await deleteSupabaseRow("saas_tools", slug);
    triggerSuccessAlert("Tool removed successfully!");
    loadDatabase();
  };

  // Add Comparative Row to draft
  const handleAddTableRow = () => {
    if (
      !newRowDraft.feature ||
      !newRowDraft.valueA ||
      !newRowDraft.valueB ||
      !newRowDraft.winner
    )
      return;
    setCustomTableRows((prev) => [...prev, newRowDraft]);
    setNewRowDraft({ feature: "", valueA: "", valueB: "", winner: "" });
  };

  // Remove Comparative Row from draft
  const handleRemoveTableRow = (idx: number) => {
    setCustomTableRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save Review Action
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.slug || !reviewForm.title) return;

    const completeReview: Review = {
      ...reviewForm,
      tableRows: customTableRows,
    };

    const db = await import("@/lib/clientDb");
    db.saveCustomReview(completeReview);
    logAdminAction({
      action: "create",
      entity: "review",
      entitySlug: reviewForm.slug,
      details: { title: reviewForm.title },
    });
    await pushBatchToCloud("review", [completeReview]);

    triggerSuccessAlert(`Review matrix "${reviewForm.title}" synchronized!`);

    // Clear
    setReviewForm({
      slug: "",
      title: "",
      toolA: toolsList[0]?.slug || "",
      toolB: toolsList[1]?.slug || "",
      category: "project-management",
      excerpt: "",
      readTimeMinutes: 5,
      publicationDate: new Date().toISOString().split("T")[0],
      verdict: "editor-pick",
      winnerSlug: toolsList[0]?.slug || "",
      hotTakeQuote: "",
      finalVerdictParagraph: "",
      bestForA: "",
      bestForB: "",
    });
    setCustomTableRows([]);

    loadDatabase();
  };

  // Delete Review Action
  const handleDeleteReview = async (slug: string) => {
    const db = await import("@/lib/clientDb");
    db.deleteCustomReview(slug);
    logAdminAction({ action: "delete", entity: "review", entitySlug: slug });
    if (supabaseActive) await deleteSupabaseRow("saas_reviews", slug);
    triggerSuccessAlert("Comparison Review list entry wiped!");
    loadDatabase();
  };

  // Save Blog Action
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.slug || !blogForm.title) return;

    const db = await import("@/lib/clientDb");
    db.saveCustomBlogPost(blogForm);
    logAdminAction({
      action: "create",
      entity: "blog_post",
      entitySlug: blogForm.slug,
      details: { title: blogForm.title, issueNumber: blogForm.issueNumber },
    });
    await pushBatchToCloud("blog", [blogForm]);

    triggerSuccessAlert(
      `BlogPost essay Issue #${blogForm.issueNumber} successfully published!`,
    );

    // Clear
    setBlogForm({
      slug: "",
      title: "",
      issueNumber: blogsList.length + 43,
      excerpt: "",
      readTime: "6 min read",
      publicationDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: "Procurement Strategy",
      contentMarkdown: "",
    });

    loadDatabase();
  };

  const handleSaveBulkBlogQueue = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = parseBulkBlogDrafts();
    if (parsed.error) {
      triggerSuccessAlert(parsed.error);
      return;
    }

    if (parsed.drafts.length === 0) {
      triggerSuccessAlert(
        "Bulk queue is empty. Add at least one article draft.",
      );
      return;
    }

    const db = await import("@/lib/clientDb");
    db.saveCustomBlogPosts(parsed.drafts);
    await pushBatchToCloud("blog", parsed.drafts);

    triggerSuccessAlert(
      `Queued ${parsed.drafts.length} articles. Each post is spaced ${bulkBlogIntervalHours} hours apart starting ${formatBlogPublicationDate(parsed.drafts[0].publicationDate)}.`,
    );

    setBulkBlogDraftJson("[]");
    loadDatabase();
  };

  const handleReschedulePipeline = async (e: React.FormEvent) => {
    e.preventDefault();

    const startAt = new Date(pipelineStartAt);
    if (Number.isNaN(startAt.getTime())) {
      triggerSuccessAlert("Pipeline start date is invalid.");
      return;
    }

    const scheduled = getScheduledBlogPosts(blogsList);
    if (scheduled.length === 0) {
      triggerSuccessAlert(
        "No scheduled items found in the pipeline to reschedule.",
      );
      return;
    }

    const rescheduled = rescheduleBlogPosts(
      scheduled,
      startAt,
      pipelineIntervalHours,
    );

    const db = await import("@/lib/clientDb");
    db.saveCustomBlogPosts(rescheduled);

    triggerSuccessAlert(
      `Pipeline successfully rescheduled! Items will now dispatch every ${pipelineIntervalHours} hours.`,
    );
    await pushBatchToCloud("blog", rescheduled);
    loadDatabase();
  };

  /* ==========================================
     UNIFIED CONTENT PIPELINE (reviews + tools)
     ========================================== */

  // Push a freshly queued / rescheduled batch straight to Supabase so the
  // staggered drops go live for every visitor (not just this browser).
  const pushBatchToCloud = async (
    type: "blog" | "review" | "tool",
    items: any[],
  ) => {
    if (!supabaseActive || items.length === 0) return;
    try {
      if (type === "tool") await pushToolsBatch(items as Tool[]);
      else if (type === "review") await pushReviewsBatch(items as Review[]);
      else await pushBlogsBatch(items as BlogPost[]);
    } catch (err) {
      console.warn("Cloud batch push failed:", err);
    }
  };

  const parseBulkReviewDrafts = (): {
    drafts: Review[];
    error: string | null;
  } => {
    try {
      const parsed = JSON.parse(bulkReviewJson);
      if (!Array.isArray(parsed)) {
        return {
          drafts: [],
          error: "Bulk input must be a JSON array of review objects.",
        };
      }

      const normalized: Review[] = parsed.map((item: any, index: number) => {
        const title = String(item?.title || "").trim();
        const toolA = String(item?.toolA || "").trim();
        const toolB = String(item?.toolB || "").trim();
        const category = String(item?.category || "").trim();
        const excerpt = String(item?.excerpt || "").trim();

        if (!title || !toolA || !toolB || !category || !excerpt) {
          throw new Error(
            `Row ${index + 1} is missing title, toolA, toolB, category, or excerpt.`,
          );
        }

        return {
          slug: String(item?.slug || "").trim() || slugify(title),
          title,
          toolA,
          toolB,
          category: category as CategorySlug,
          excerpt,
          readTimeMinutes: Number(item?.readTimeMinutes) || 5,
          publicationDate: new Date().toISOString(),
          verdict: (item?.verdict || "editor-pick") as Review["verdict"],
          winnerSlug: String(item?.winnerSlug || toolA).trim(),
          hotTakeQuote: String(item?.hotTakeQuote || "").trim(),
          finalVerdictParagraph: String(
            item?.finalVerdictParagraph || "",
          ).trim(),
          bestForA: String(item?.bestForA || "").trim(),
          bestForB: String(item?.bestForB || "").trim(),
          tableRows: Array.isArray(item?.tableRows) ? item.tableRows : [],
        };
      });

      const startAt = new Date(bulkReviewStartAt);
      if (Number.isNaN(startAt.getTime())) {
        return { drafts: [], error: "Bulk start date is invalid." };
      }

      return {
        drafts: staggerPublicationDates(
          normalized,
          startAt,
          bulkReviewIntervalHours,
        ),
        error: null,
      };
    } catch (error: any) {
      return {
        drafts: [],
        error: error?.message || "Unable to parse the bulk review payload.",
      };
    }
  };

  const parseBulkToolDrafts = (): {
    drafts: Tool[];
    error: string | null;
  } => {
    try {
      const parsed = JSON.parse(bulkToolJson);
      if (!Array.isArray(parsed)) {
        return {
          drafts: [],
          error: "Bulk input must be a JSON array of tool objects.",
        };
      }

      const normalized: Tool[] = parsed.map((item: any, index: number) => {
        const name = String(item?.name || "").trim();
        const category = String(item?.category || "").trim();
        const oneLineOpinion = String(item?.oneLineOpinion || "").trim();

        if (!name || !category || !oneLineOpinion) {
          throw new Error(
            `Row ${index + 1} is missing name, category, or oneLineOpinion.`,
          );
        }

        const numericPrice = Number(item?.numericPrice) || 0;
        const keyFeatures = Array.isArray(item?.keyFeatures)
          ? item.keyFeatures
              .map((entry: any) => String(entry || "").trim())
              .filter(Boolean)
          : multilineToItems(String(item?.keyFeatures || ""));
        const limitations = Array.isArray(item?.limitations)
          ? item.limitations
              .map((entry: any) => String(entry || "").trim())
              .filter(Boolean)
          : multilineToItems(String(item?.limitations || ""));
        const publicationDateText = String(item?.publicationDate || "").trim();
        const parsedPublicationDate = publicationDateText
          ? new Date(publicationDateText)
          : new Date();

        return {
          slug: String(item?.slug || "").trim() || slugify(name),
          name,
          category: category as CategorySlug,
          numericPrice,
          startingPrice:
            String(item?.startingPrice || "").trim() || `$${numericPrice}/mo`,
          oneLineOpinion,
          parentSlug:
            String(item?.parentSlug || item?.parent_slug || "").trim() ||
            undefined,
          tierName:
            String(item?.tierName || item?.tier_name || "").trim() || undefined,
          pricingModel:
            String(item?.pricingModel || item?.pricing_model || "").trim() ||
            undefined,
          keyFeatures,
          limitations,
          aiIncluded: Boolean(item?.aiIncluded ?? item?.ai_included),
          aiCost:
            String(item?.aiCost || item?.ai_cost || "").trim() || undefined,
          freeTrial: Boolean(item?.freeTrial ?? item?.free_trial),
          freeForever: Boolean(item?.freeForever ?? item?.free_forever),
          iconUrl: String(item?.iconUrl || "").trim() || undefined,
          publicationDate:
            parsedPublicationDate &&
            !Number.isNaN(parsedPublicationDate.getTime())
              ? parsedPublicationDate.toISOString()
              : new Date().toISOString(),
        };
      });

      const startAt = new Date(bulkToolStartAt);
      if (Number.isNaN(startAt.getTime())) {
        return { drafts: [], error: "Bulk start date is invalid." };
      }

      return {
        drafts: staggerPublicationDates(
          normalized,
          startAt,
          bulkToolIntervalHours,
        ),
        error: null,
      };
    } catch (error: any) {
      return {
        drafts: [],
        error: error?.message || "Unable to parse the bulk tool payload.",
      };
    }
  };

  const handleSaveBulkReviewQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    const { drafts, error } = parseBulkReviewDrafts();
    if (error) {
      triggerSuccessAlert(error);
      return;
    }
    if (drafts.length === 0) {
      triggerSuccessAlert("Review batch is empty. Add at least one review.");
      return;
    }

    const db = await import("@/lib/clientDb");
    drafts.forEach((r) => db.saveCustomReview(r));
    drafts.forEach((r) =>
      logAdminAction({
        action: "create",
        entity: "review",
        entitySlug: r.slug,
        details: { title: r.title, scheduled: r.publicationDate },
      }),
    );

    await pushBatchToCloud("review", drafts);
    triggerSuccessAlert(
      `Queued ${drafts.length} reviews, spaced ${bulkReviewIntervalHours}h apart starting ${formatScheduleDate(drafts[0].publicationDate)}.`,
    );
    setBulkReviewJson("[]");
    loadDatabase();
  };

  const handleSaveBulkToolQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    const { drafts, error } = parseBulkToolDrafts();
    if (error) {
      triggerSuccessAlert(error);
      return;
    }
    if (drafts.length === 0) {
      triggerSuccessAlert("Tool batch is empty. Add at least one tool.");
      return;
    }

    const db = await import("@/lib/clientDb");
    drafts.forEach((t) => db.saveCustomTool(t));
    drafts.forEach((t) =>
      logAdminAction({
        action: "create",
        entity: "tool",
        entitySlug: t.slug,
        details: { name: t.name, scheduled: t.publicationDate },
      }),
    );

    await pushBatchToCloud("tool", drafts);
    triggerSuccessAlert(
      `Queued ${drafts.length} tools, spaced ${bulkToolIntervalHours}h apart starting ${formatScheduleDate(drafts[0].publicationDate)}.`,
    );
    setBulkToolJson("[]");
    loadDatabase();
  };

  const handleRescheduleReviewPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    const startAt = new Date(bulkReviewStartAt);
    if (Number.isNaN(startAt.getTime())) {
      triggerSuccessAlert("Pipeline start date is invalid.");
      return;
    }
    const scheduled = filterScheduled(reviewsList);
    if (scheduled.length === 0) {
      triggerSuccessAlert("No scheduled reviews to reschedule.");
      return;
    }
    const rescheduled = rescheduleItems(
      scheduled,
      startAt,
      bulkReviewIntervalHours,
    );
    const db = await import("@/lib/clientDb");
    rescheduled.forEach((r) => db.saveCustomReview(r));
    await pushBatchToCloud("review", rescheduled);
    triggerSuccessAlert(
      `Review pipeline rescheduled — one drop every ${bulkReviewIntervalHours}h.`,
    );
    loadDatabase();
  };

  const handleRescheduleToolPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    const startAt = new Date(bulkToolStartAt);
    if (Number.isNaN(startAt.getTime())) {
      triggerSuccessAlert("Pipeline start date is invalid.");
      return;
    }
    const scheduled = filterScheduled(toolsList);
    if (scheduled.length === 0) {
      triggerSuccessAlert("No scheduled tools to reschedule.");
      return;
    }
    const rescheduled = rescheduleItems(
      scheduled,
      startAt,
      bulkToolIntervalHours,
    );
    const db = await import("@/lib/clientDb");
    rescheduled.forEach((t) => db.saveCustomTool(t));
    await pushBatchToCloud("tool", rescheduled);
    triggerSuccessAlert(
      `Tool pipeline rescheduled — one drop every ${bulkToolIntervalHours}h.`,
    );
    loadDatabase();
  };

  // Delete Blog Action
  const handleDeleteBlog = async (slug: string) => {
    const db = await import("@/lib/clientDb");
    db.deleteCustomBlogPost(slug);
    if (supabaseActive) await deleteSupabaseRow("saas_blog_posts", slug);
    triggerSuccessAlert("Article post removed from dispatch listings!");
    loadDatabase();
  };

  // Compile full database JSON file downloadable link as raw seed
  const handleExportFullJSON = () => {
    const backup = {
      categories: CATEGORIES,
      tools: toolsList,
      reviews: reviewsList,
      blog_posts: blogsList,
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      "saaspebble_complete_database_backup.json",
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Dynamic values computation for overall stats
  const dashboardStats = useMemo(() => {
    const userCreatedToolsCount = toolsList.filter(
      (t) =>
        ![
          "quickbooks",
          "freshbooks",
          "asana",
          "clickup",
          "salesforce",
          "hubspot",
          "monday",
          "jira",
        ].includes(t.slug),
    ).length;
    const userCreatedReviewsCount = reviewsList.filter(
      (r) => !["quickbooks-vs-freshbooks", "asana-vs-clickup"].includes(r.slug),
    ).length;

    return {
      totalTools: toolsList.length,
      customTools: userCreatedToolsCount,
      totalReviews: reviewsList.length,
      customReviews: userCreatedReviewsCount,
      totalBlogs: blogsList.length,
      customBlogs: blogsList.filter(
        (b) =>
          ![
            "the-death-of-unlimited-seats",
            "demystifying-gaap-ledgers",
          ].includes(b.slug),
      ).length,
    };
  }, [toolsList, reviewsList, blogsList]);

  const sortedBlogsList = useMemo(() => {
    return [...blogsList].sort((left, right) => {
      const leftTimestamp =
        getBlogPublicationTimestamp(left.publicationDate) ?? 0;
      const rightTimestamp =
        getBlogPublicationTimestamp(right.publicationDate) ?? 0;
      return rightTimestamp - leftTimestamp;
    });
  }, [blogsList]);

  const scheduledBlogsCount = useMemo(() => {
    return getScheduledBlogPosts(blogsList).length;
  }, [blogsList]);

  const publishedBlogsCount = useMemo(() => {
    return getPublishedBlogPosts(blogsList).length;
  }, [blogsList]);

  // Auto-fill form values on click triggers to ease editing tasks
  const editToolInForm = (tool: Tool) => {
    setToolForm(toolToFormState(tool));
    setActiveTab("tools");
  };

  const editReviewInForm = (review: Review) => {
    setReviewForm({
      slug: review.slug,
      title: review.title,
      toolA: review.toolA,
      toolB: review.toolB,
      category: review.category,
      excerpt: review.excerpt,
      readTimeMinutes: review.readTimeMinutes,
      publicationDate: review.publicationDate,
      verdict: review.verdict || "editor-pick",
      winnerSlug: review.winnerSlug || "",
      hotTakeQuote: review.hotTakeQuote,
      finalVerdictParagraph: review.finalVerdictParagraph,
      bestForA: review.bestForA,
      bestForB: review.bestForB,
    });
    setCustomTableRows(review.tableRows || []);
    setActiveTab("reviews");
  };

  const editBlogInForm = (blog: BlogPost) => {
    setBlogForm(blog);
    setActiveTab("blog");
  };

  // 1. Loading token state hydration
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-center items-center font-sans text-xs text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-slate-900 mb-2" />
        <span>Authorizing security protocol stack...</span>
      </div>
    );
  }

  // 2. Render Login Gateway popup if unauthenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main id="admin-panel-root" className="flex-grow py-12 font-sans px-4">
        <div className="max-w-7xl mx-auto">
          {/* Headline and introduction badge */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase font-mono bg-blue-105 border border-blue-200 text-blue-700 rounded-full mb-3 shadow-xs">
                <Settings className="h-3.5 w-3.5 rotate-45" />
                Administrative Command Panel
              </span>
              <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-none">
                SaaSPebble Workspace
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xl">
                Add reviews, create tools, draft markdown blog dispatches, and
                manage memory overlays dynamically with zero compilation waiting
                pools.
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-trigger-full-backup"
                onClick={handleExportFullJSON}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 cursor-pointer shadow-xs transition-colors"
                title="Download local metadata as ready-to-import database seed"
              >
                <Download className="h-4 w-4 text-blue-600" />
                <span>Export Dataset JSON</span>
              </button>

              <button
                onClick={loadDatabase}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:border-slate-400 hover:text-blue-600 shadow-xs transition-colors cursor-pointer"
                title="Wipe state discrepancies & reload baseline"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <button
                id="btn-admin-sign-out"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
                title="Log out of the administrative console"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-650" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Success Banner triggers */}
          {isSavedBanner && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>{isSavedBanner}</span>
              </div>
              <button
                onClick={() => setIsSavedBanner(null)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Real-time Webhook & Subscription Banners */}
          {realtimeNotification && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 text-blue-900 rounded-xl flex items-center justify-between shadow-sm animate-bounce">
              <div className="flex items-center gap-2.5 text-xs font-bold">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <Zap className="h-4.5 w-4.5 text-blue-600 fill-blue-100" />
                <span>{realtimeNotification}</span>
              </div>
              <button
                onClick={() => setRealtimeNotification(null)}
                className="text-xs font-extrabold uppercase tracking-wide text-blue-600 hover:text-blue-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Divided Interface Side Navigation + Form body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left rail navigation: 3 / 12 width */}
            <aside className="lg:col-span-3 space-y-2">
              <button
                id="tab-dashboard-selector"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Metrics Overview</span>
              </button>

              <button
                id="tab-tools-selector"
                onClick={() => setActiveTab("tools")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "tools"
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                }`}
              >
                <Layers2 className="h-4 w-4" />
                <span>Manage Tools Index</span>
              </button>

              <button
                id="tab-reviews-selector"
                onClick={() => setActiveTab("reviews")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                }`}
              >
                <FileCheck className="h-4 w-4" />
                <span>Manage Review Matrices</span>
              </button>

              <button
                id="tab-blog-selector"
                onClick={() => setActiveTab("blog")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "blog"
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Dispatch Post Editor</span>
              </button>

              <button
                id="tab-pipeline-selector"
                onClick={() => setActiveTab("pipeline")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "pipeline"
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-605 hover:bg-slate-50"
                }`}
              >
                <CloudLightning className="h-4 w-4" />
                <span>Content Pipeline</span>
              </button>

              <button
                id="tab-backend-selector"
                onClick={() => setActiveTab("backend")}
                className={`w-full text-left font-sans text-xs font-bold p-3 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "backend"
                    ? "bg-rose-600 border-rose-600 text-white shadow-xs font-black animate-pulse"
                    : "bg-white border-rose-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Database Sync Setup</span>
              </button>

              {/* Informative Help Guide */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 mt-6 text-xs text-slate-500 space-y-2.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <HelpCircle className="h-4.5 w-4.5 text-rose-500" />
                  Workspace Mechanics
                </h4>
                <p className="leading-relaxed">
                  Baselines are pulled statically from <code>lib/data.ts</code>.
                  Editing existing entries or creating new items overlays
                  metadata inside <strong>localStorage</strong>.
                </p>
                <p className="leading-relaxed">
                  These changes override baseline parameters instantly on your
                  local web browser, matching Next.js router boundaries
                  perfectly.
                </p>
              </div>
            </aside>

            {/* Forms body container: 9 / 12 width */}
            <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 min-h-[500px] shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
              {/* ==================================================
                 TAB 1: OVERVIEW DASHBOARD
                 ================================================== */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      System Status Metrics
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live counts of aggregated database nodes currently
                      operational in the sandbox viewport loop.
                    </p>
                  </div>

                  {/* Quantitative Counters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Metrics 1 */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <span className="block text-2xl font-black text-slate-950 font-mono">
                        {dashboardStats.totalTools}
                      </span>
                      <span className="block text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider font-mono">
                        Total Tools Index
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {dashboardStats.customTools} Custom additions
                      </span>
                    </div>

                    {/* Metrics 2 */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <span className="block text-2xl font-black text-slate-950 font-mono">
                        {dashboardStats.totalReviews}
                      </span>
                      <span className="block text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider font-mono">
                        Aggregated Matrices
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {dashboardStats.customReviews} Custom reviews
                      </span>
                    </div>

                    {/* Metrics 3 */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <span className="block text-2xl font-black text-slate-950 font-mono">
                        {dashboardStats.totalBlogs}
                      </span>
                      <span className="block text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider font-mono">
                        Dispatch issues
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {dashboardStats.customBlogs} Custom articles
                      </span>
                    </div>
                  </div>

                  {/* Status checklist */}
                  <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 border-b border-slate-150 p-3.5 font-bold text-slate-800 uppercase tracking-wider">
                      Sandboxes Routing Integrations checks
                    </div>

                    <div className="divide-y divide-slate-100">
                      <div className="p-3.5 flex items-center justify-between gap-4">
                        <div>
                          <strong className="block text-slate-800">
                            Hompage State Integration
                          </strong>
                          <span className="text-[11px] text-slate-400 leading-normal">
                            Pulls review cards from local storage dynamic pools.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded font-mono">
                          ACTIVE
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between gap-4">
                        <div>
                          <strong className="block text-slate-800">
                            Dynamic Reviews Route (<code>/reviews/[slug]</code>)
                          </strong>
                          <span className="text-[11px] text-slate-400 leading-normal">
                            Client hydrations allow newly produced comparison
                            pages.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded font-mono">
                          ACTIVE
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between gap-4">
                        <div>
                          <strong className="block text-slate-800">
                            The Dispatch Route (<code>/blog/[slug]</code>)
                          </strong>
                          <span className="text-[11px] text-slate-400 leading-normal">
                            Reads custom articles with markdown split engines.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded font-mono">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Redirect indicators to sandbox success */}
                  <div className="border border-blue-100 bg-blue-50/20 p-4 rounded-xl text-xs space-y-2">
                    <h4 className="font-bold text-blue-900 flex items-center gap-1">
                      <Flame className="h-4 w-4 text-amber-500 animate-bounce" />
                      Active Checkout Simulation
                    </h4>
                    <p className="text-slate-650 leading-relaxed">
                      All CTAs on pricing lists dynamically map server-side
                      checkout redirect routes. Lacking active keys, checkouts
                      fall back automatically into the local sandbox
                      successfully, completely secure with zero SDK crashes!
                    </p>
                    <Link
                      href="/subscribe/sandbox-success"
                      className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-1 transition-all"
                    >
                      <span>View sandbox checkout viewport &rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* ==================================================
                 TAB 2: MANAGE TOOLS
                 ================================================= */}
              {activeTab === "tools" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Manage software index pool
                    </h2>
                    <p className="text-xs text-slate-500">
                      Edit starting price index points and character opinions.
                    </p>
                  </div>

                  {/* Addition Form */}
                  <form
                    onSubmit={handleSaveTool}
                    className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs"
                  >
                    <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-150 uppercase tracking-wide">
                      Add / Edit Tool Entry
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-name-input"
                          className="block font-bold text-slate-700"
                        >
                          Tool Name:
                        </label>
                        <input
                          id="tool-name-input"
                          type="text"
                          required
                          placeholder="e.g. Asana Premium"
                          value={toolForm.name}
                          onChange={(e) => {
                            const nameStr = e.target.value;
                            setToolForm((prev) => ({
                              ...prev,
                              name: nameStr,
                              slug: autoSlugify(nameStr),
                            }));
                          }}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800 placeholder-slate-400"
                        />
                      </div>

                      {/* Slug output (auto generated) */}
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-slug-input"
                          className="block font-bold text-slate-500"
                        >
                          Dynamic URL Slug (Auto):
                        </label>
                        <input
                          id="tool-slug-input"
                          type="text"
                          required
                          value={toolForm.slug}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              slug: autoSlugify(e.target.value),
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-slate-100 rounded-lg font-mono text-[11px]"
                        />
                      </div>

                      {/* Category select */}
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-category-select"
                          className="block font-bold text-slate-700"
                        >
                          Vertical Category:
                        </label>
                        <select
                          id="tool-category-select"
                          value={toolForm.category}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              category: e.target.value as CategorySlug,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Numeric Price */}
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-numeric-price-input"
                          className="block font-bold text-slate-750"
                        >
                          Starting Monthly price (numeric for TCO cost logic):
                        </label>
                        <input
                          id="tool-numeric-price-input"
                          type="number"
                          required
                          value={toolForm.numericPrice}
                          onChange={(e) => {
                            const num = Number.parseFloat(e.target.value) || 0;
                            setToolForm((prev) => ({
                              ...prev,
                              numericPrice: num,
                              startingPrice: `$${num}/mo`,
                            }));
                          }}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    {/* OneLine opinion text */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="tool-one-line-opinion-input"
                          className="block font-bold text-slate-700"
                        >
                          One Line Opinion:
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Limit target: {toolForm.oneLineOpinion.length} / 160
                          chars
                        </span>
                      </div>
                      <input
                        id="tool-one-line-opinion-input"
                        type="text"
                        required
                        maxLength={160}
                        placeholder="e.g. Intuitive sprint roadmap structures with fast layouts at the cost of occasional latency fatigue."
                        value={toolForm.oneLineOpinion}
                        onChange={(e) =>
                          setToolForm((prev) => ({
                            ...prev,
                            oneLineOpinion: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-starting-price-input"
                          className="block font-bold text-slate-700"
                        >
                          Starting Price:
                        </label>
                        <input
                          id="tool-starting-price-input"
                          type="text"
                          placeholder="$15/mo"
                          value={toolForm.startingPrice}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              startingPrice: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-parent-slug-input"
                          className="block font-bold text-slate-700"
                        >
                          Parent Slug:
                        </label>
                        <input
                          id="tool-parent-slug-input"
                          type="text"
                          placeholder="e.g. asana"
                          value={toolForm.parentSlug}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              parentSlug: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-tier-name-input"
                          className="block font-bold text-slate-700"
                        >
                          Tier Name:
                        </label>
                        <input
                          id="tool-tier-name-input"
                          type="text"
                          placeholder="e.g. Pro, Business, Enterprise"
                          value={toolForm.tierName}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              tierName: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-pricing-model-input"
                          className="block font-bold text-slate-700"
                        >
                          Pricing Model:
                        </label>
                        <input
                          id="tool-pricing-model-input"
                          type="text"
                          placeholder="e.g. per-seat, usage-based"
                          value={toolForm.pricingModel}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              pricingModel: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-ai-cost-input"
                          className="block font-bold text-slate-700"
                        >
                          AI Cost:
                        </label>
                        <input
                          id="tool-ai-cost-input"
                          type="text"
                          placeholder="e.g. Included, $20/mo, add-on"
                          value={toolForm.aiCost}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              aiCost: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-publication-date-input"
                          className="block font-bold text-slate-700"
                        >
                          Publication Date:
                        </label>
                        <input
                          id="tool-publication-date-input"
                          type="datetime-local"
                          value={toolForm.publicationDate}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              publicationDate: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="tool-key-features-input"
                          className="block font-bold text-slate-700"
                        >
                          Key Features:
                        </label>
                        <textarea
                          id="tool-key-features-input"
                          rows={5}
                          placeholder="One feature per line"
                          value={toolForm.keyFeatures}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              keyFeatures: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg font-mono text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="tool-limitations-input"
                          className="block font-bold text-slate-700"
                        >
                          Limitations:
                        </label>
                        <textarea
                          id="tool-limitations-input"
                          rows={5}
                          placeholder="One limitation per line"
                          value={toolForm.limitations}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              limitations: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={toolForm.aiIncluded}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              aiIncluded: e.target.checked,
                            }))
                          }
                        />
                        AI Included
                      </label>
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={toolForm.freeTrial}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              freeTrial: e.target.checked,
                            }))
                          }
                        />
                        Free Trial
                      </label>
                      <label className="flex items-center gap-2 font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={toolForm.freeForever}
                          onChange={(e) =>
                            setToolForm((prev) => ({
                              ...prev,
                              freeForever: e.target.checked,
                            }))
                          }
                        />
                        Free Forever
                      </label>
                    </div>

                    {/* Product Icon Selection */}
                    <div className="space-y-1">
                      <div className="block font-bold text-slate-700">
                        Product Brand Icon:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-3 border border-slate-200 rounded-xl items-center">
                        {/* File Uploader */}
                        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                          <span className="block text-[10px] text-slate-500 font-mono font-bold uppercase">
                            Upload Icon Asset:
                          </span>
                          <div className="border-2 border-dashed border-slate-200 rounded-lg p-2.5 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                              type="file"
                              id="toolIconUpload"
                              accept="image/png,image/jpeg,image/webp"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const ALLOWED_TYPES = [
                                  "image/png",
                                  "image/jpeg",
                                  "image/webp",
                                ];
                                const MAX_SIZE = 500 * 1024; // 500 KB
                                if (!ALLOWED_TYPES.includes(file.type)) {
                                  alert(
                                    "Only PNG, JPG, and WebP files are allowed.",
                                  );
                                  e.target.value = "";
                                  return;
                                }
                                if (file.size > MAX_SIZE) {
                                  alert("File size must be under 500 KB.");
                                  e.target.value = "";
                                  return;
                                }

                                try {
                                  const publicUrl = await uploadToolIcon(file);
                                  setToolForm((prev) => ({
                                    ...prev,
                                    iconUrl: publicUrl,
                                  }));
                                } catch (error: any) {
                                  alert(
                                    error?.message ||
                                      "Unable to upload the logo to Supabase Storage.",
                                  );
                                  e.target.value = "";
                                }
                              }}
                            />
                            <div className="text-[11px] text-slate-600 font-bold">
                              Click or Drop Brand Logo
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              PNG, JPG, WebP only — max 500 KB
                            </p>
                          </div>
                        </div>

                        {/* URL Paste & Preview */}
                        <div className="space-y-2">
                          <div>
                            <span className="block text-[10px] text-slate-500 font-mono font-bold uppercase">
                              Or Paste Remote URL:
                            </span>
                            <input
                              type="url"
                              placeholder="e.g. https://domain.com/logo.png"
                              value={toolForm.iconUrl || ""}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                // Only accept empty or valid HTTPS URLs
                                if (val && !val.startsWith("https://")) return;
                                setToolForm((prev) => ({
                                  ...prev,
                                  iconUrl: val,
                                }));
                              }}
                              className="w-full mt-1.5 p-2 border border-slate-250 bg-white rounded-lg text-[11px]"
                            />
                          </div>

                          {toolForm.iconUrl && (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                              <img
                                src={toolForm.iconUrl}
                                alt="Icon preview"
                                className="h-8 w-8 rounded-full object-contain border border-slate-200 bg-white"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display =
                                    "none";
                                }}
                              />
                              <div className="text-[9px] truncate text-slate-500">
                                <span className="font-bold text-rose-600 block">
                                  ✓ Logo Attached
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setToolForm((prev) => ({
                                      ...prev,
                                      iconUrl: "",
                                    }))
                                  }
                                  className="text-rose-500 hover:underline font-bold"
                                >
                                  Remove Icon
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Sync Tool Entry</span>
                    </button>
                  </form>

                  {/* List existing */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Active Tools List
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="p-3 font-bold">Tool Name</th>
                            <th className="p-3 font-bold">Category</th>
                            <th className="p-3 font-bold font-mono">
                              TCO Cost
                            </th>
                            <th className="p-3 font-bold">Opinion Spec</th>
                            <th className="p-3 font-bold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {toolsList.map((t) => {
                            const isBaseline = [
                              "quickbooks",
                              "freshbooks",
                              "asana",
                              "clickup",
                              "salesforce",
                              "hubspot",
                              "monday",
                              "jira",
                            ].includes(t.slug);
                            return (
                              <tr key={t.slug} className="hover:bg-slate-50/50">
                                <td className="p-3 font-bold flex items-center gap-2">
                                  {t.iconUrl ? (
                                    <img
                                      src={t.iconUrl}
                                      alt={t.name}
                                      className="h-6 w-6 rounded-full object-contain bg-white border border-slate-250 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-rose-500 text-white text-[10px] font-black shrink-0">
                                      {t.name.slice(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <span>{t.name}</span>
                                    <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                      /{t.slug}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 capitalize">
                                  {t.category.replace("-", " ")}
                                </td>
                                <td className="p-3 font-mono">
                                  {t.startingPrice}
                                </td>
                                <td className="p-3 text-slate-500 max-w-xs truncate">
                                  {t.oneLineOpinion}
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => editToolInForm(t)}
                                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  {!isBaseline ? (
                                    <button
                                      onClick={() => handleDeleteTool(t.slug)}
                                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-300 font-mono font-bold ml-1">
                                      Baseline
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                 TAB 3: MANAGE REVIEWS
                 ================================================== */}
              {activeTab === "reviews" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Manage dynamic rating matrices
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pick any two database tools to build or update detailed
                      specifications matrices comparing features side-by-side.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSaveReview}
                    className="space-y-6 bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs"
                  >
                    <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-150 uppercase tracking-widest leading-none">
                      Dynamic Reviews Matrix Builder
                    </h3>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-705">
                          Review Headline:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Asana Enterprise vs Monday.com: Collaborative Sprints"
                          value={reviewForm.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReviewForm((prev) => ({
                              ...prev,
                              title: val,
                              slug: autoSlugify(val),
                            }));
                          }}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800"
                        />
                      </div>

                      {/* Slug */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-450">
                          Review Dynamic Slug (Auto):
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewForm.slug}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              slug: autoSlugify(e.target.value),
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-slate-100 rounded-lg font-mono text-[11px]"
                        />
                      </div>

                      {/* Tool A */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Select Tool Name A:
                        </label>
                        <select
                          value={reviewForm.toolA}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              toolA: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800"
                        >
                          {toolsList.map((t) => (
                            <option key={t.slug} value={t.slug}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tool B */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Select Tool Name B:
                        </label>
                        <select
                          value={reviewForm.toolB}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              toolB: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800"
                        >
                          {toolsList.map((t) => (
                            <option key={t.slug} value={t.slug}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Niche Category Match:
                        </label>
                        <select
                          value={reviewForm.category}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              category: e.target.value as CategorySlug,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg focus:outline-slate-800"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Verdict Selection text */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Editor Award selection:
                        </label>
                        <select
                          value={reviewForm.verdict || "editor-pick"}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              verdict: e.target.value as any,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        >
                          <option value="editor-pick">Editor Pick</option>
                          <option value="hot-take">Hot Take Winner</option>
                          <option value="tie">Evaluative Tie</option>
                        </select>
                      </div>

                      {/* Winner Slug select */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Winner Pick candidate (Slug matches):
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. asana"
                          value={reviewForm.winnerSlug || ""}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              winnerSlug: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Date Issued:
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewForm.publicationDate}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              publicationDate: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Excerpt pulling */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Excerpt / Pitch Sentence:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="An expert software audit benchmarking task lifecycle planning..."
                        value={reviewForm.excerpt}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs"
                      />
                    </div>

                    {/* Hot take quote */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Editorial Hot-Take (Large graphic card citation):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asana rules user layouts but Monday is 10x cheaper."
                        value={reviewForm.hotTakeQuote}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            hotTakeQuote: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                      />
                    </div>

                    {/* Best for A, Best for B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Best For Tool A (Checklist 1):
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Best for enterprise-level compliance and charts."
                          value={reviewForm.bestForA}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              bestForA: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-255 bg-white rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Best For Tool B (Checklist 2):
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Best for small agile startups on tighter budgets."
                          value={reviewForm.bestForB}
                          onChange={(e) =>
                            setReviewForm((prev) => ({
                              ...prev,
                              bestForB: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-slate-255 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Final verdict block */}
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Final Verdict Statement:
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Enter the broad conclusion explaining which platform fits which archetype profile."
                        value={reviewForm.finalVerdictParagraph}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            finalVerdictParagraph: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                      />
                    </div>

                    {/* INTERACTIVE COMPARISON ROWS DESIGN BUILDER */}
                    <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                          Interactive Matrix Rows Builder
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 border rounded">
                          Rows Added: {customTableRows.length}
                        </span>
                      </div>

                      {/* Display rows designed currently */}
                      {customTableRows.length > 0 && (
                        <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px] mb-3">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2 font-bold">Feature</th>
                                <th className="p-2 font-bold">
                                  Tool A Specification
                                </th>
                                <th className="p-2 font-bold">
                                  Tool B Specification
                                </th>
                                <th className="p-2 font-bold">Winner</th>
                                <th className="p-2 font-bold text-right">
                                  Wipe
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {customTableRows.map((row, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-slate-100"
                                >
                                  <td className="p-2 font-semibold text-slate-800">
                                    {row.feature}
                                  </td>
                                  <td className="p-2">{row.valueA}</td>
                                  <td className="p-2">{row.valueB}</td>
                                  <td className="p-2 font-bold text-blue-600 font-mono">
                                    {row.winner}
                                  </td>
                                  <td className="p-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTableRow(idx)}
                                      className="text-rose-600 hover:text-rose-800 cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Dynamic creation line */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                        <div className="space-y-1">
                          <span className="block font-bold text-[10px] text-slate-500">
                            Feature evaluated:
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. API Rate Limits"
                            value={newRowDraft.feature}
                            onChange={(e) =>
                              setNewRowDraft((prev) => ({
                                ...prev,
                                feature: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-200 bg-white rounded"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="block font-bold text-[10px] text-slate-500">
                            Tool A value spec:
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 5,000 requests/hr"
                            value={newRowDraft.valueA}
                            onChange={(e) =>
                              setNewRowDraft((prev) => ({
                                ...prev,
                                valueA: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-200 bg-white rounded"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="block font-bold text-[10px] text-slate-500">
                            Tool B value spec:
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. Unlimited client hooks"
                            value={newRowDraft.valueB}
                            onChange={(e) =>
                              setNewRowDraft((prev) => ({
                                ...prev,
                                valueB: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-200 bg-white rounded"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="block font-bold text-[10px] text-slate-500">
                            Row Winner Name:
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. ClickUp Winner"
                            value={newRowDraft.winner}
                            onChange={(e) =>
                              setNewRowDraft((prev) => ({
                                ...prev,
                                winner: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-200 bg-white rounded"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTableRow}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded cursor-pointer mt-1"
                      >
                        <Plus className="h-3.5 w-3.5 text-blue-600" />
                        <span>Add spec row to draft</span>
                      </button>
                    </div>

                    {/* Submit Review Button */}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-5 rounded-lg cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Compile Complete Review Matrix</span>
                    </button>
                  </form>

                  {/* List active comparison sheets */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Active Comparison reviews on file
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-605">
                            <th className="p-3 font-bold">
                              Review Title Summary
                            </th>
                            <th className="p-3 font-bold">Tools Linked</th>
                            <th className="p-3 font-bold">Verdict Banner</th>
                            <th className="p-3 font-bold text-right font-mono">
                              Row Counts
                            </th>
                            <th className="p-3 font-bold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {reviewsList.map((r) => {
                            const isBaseline = [
                              "quickbooks-vs-freshbooks",
                              "asana-vs-clickup",
                            ].includes(r.slug);
                            return (
                              <tr key={r.slug} className="hover:bg-slate-50/50">
                                <td className="p-3">
                                  <Link
                                    href={`/reviews/${r.slug}`}
                                    target="_blank"
                                    className="font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                                  >
                                    <span>{r.title}</span>
                                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  </Link>
                                  <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                    /{r.slug}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-[10px] uppercase text-slate-500">
                                  {r.toolA} VS {r.toolB}
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-800 font-bold text-[9px] uppercase tracking-wider">
                                    {r.verdict}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-mono font-bold text-slate-700">
                                  {r.tableRows?.length || 0} specs
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => editReviewInForm(r)}
                                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  {!isBaseline ? (
                                    <button
                                      onClick={() => handleDeleteReview(r.slug)}
                                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-350 font-mono font-bold inline-block ml-1">
                                      Baseline
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                 TAB 4: MANAGE BLOGS
                 ================================================== */}
              {activeTab === "blog" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Draft Procurement Essays
                    </h2>
                    <p className="text-xs text-slate-500">
                      Review future licensing schemes and draft fully compliant
                      Markdown copy blocks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        Published now
                      </span>
                      <span className="block text-2xl font-black text-slate-950 mt-1">
                        {publishedBlogsCount}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        Queued for later
                      </span>
                      <span className="block text-2xl font-black text-slate-950 mt-1">
                        {scheduledBlogsCount}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        Cadence
                      </span>
                      <span className="block text-2xl font-black text-slate-950 mt-1">
                        {bulkBlogIntervalHours}h
                      </span>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSaveBulkBlogQueue}
                    className="space-y-4 bg-blue-50/40 p-4 border border-blue-100 rounded-xl text-xs"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                        Weekly Bulk Scheduler
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500">
                        Paste JSON drafts and the system spaces them every 10
                        hours.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <label className="block font-bold text-slate-700">
                          Batch start date/time
                        </label>
                        <input
                          type="datetime-local"
                          value={bulkBlogStartAt}
                          onChange={(e) => setBulkBlogStartAt(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-700">
                          Hours between posts
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={bulkBlogIntervalHours}
                          onChange={(e) =>
                            setBulkBlogIntervalHours(
                              Number(e.target.value) ||
                                DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
                            )
                          }
                          className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Bulk article payload
                      </label>
                      <textarea
                        rows={10}
                        value={bulkBlogDraftJson}
                        onChange={(e) => setBulkBlogDraftJson(e.target.value)}
                        className="w-full p-3 border border-slate-200 bg-white rounded-lg font-mono text-[11px] leading-relaxed"
                        placeholder='[{"title":"...","excerpt":"...","category":"...","readTime":"5 min read","contentMarkdown":"..."}]'
                      />
                      <p className="text-[10px] text-slate-500">
                        Each object needs `title`, `excerpt`, `category`, and
                        `contentMarkdown`. Optional `slug`, `readTime`, and
                        `issueNumber` are supported.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                    >
                      <CloudUpload className="h-3.5 w-3.5" />
                      <span>Queue Weekly Batch</span>
                    </button>
                  </form>

                  <form
                    onSubmit={handleSaveBlog}
                    className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                      <h3 className="font-bold text-slate-804 uppercase tracking-wider">
                        The Dispatch Markdown Editor
                      </h3>

                      <button
                        type="button"
                        onClick={() => setBlogPreviewMode(!blogPreviewMode)}
                        className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-400 px-3 py-1 rounded font-bold cursor-pointer transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-600" />
                        <span>
                          {blogPreviewMode ? "Write Mode" : "Preview Layout"}
                        </span>
                      </button>
                    </div>

                    {blogPreviewMode ? (
                      /* BLOG PREVIEW */
                      <div className="bg-white border rounded-xl p-6 min-h-[350px] space-y-4 prose prose-slate">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                            Issue #{blogForm.issueNumber}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {blogForm.readTime} &bull; {blogForm.category}
                          </span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-950">
                          {blogForm.title || "Untitled Essay"}
                        </h1>
                        <p className="italic font-sans text-slate-500 pl-3 border-l-2 border-slate-300">
                          {blogForm.excerpt || "Write an excerpt statement..."}
                        </p>

                        <div className="text-slate-700 leading-relaxed text-xs space-y-4 whitespace-pre-wrap font-sans mt-5">
                          {blogForm.contentMarkdown ||
                            "Compose interesting procurement guidelines... Supports standard line breaks."}
                        </div>
                      </div>
                    ) : (
                      /* WRITE INTERFACE FORM */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Title */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Article Title:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. The Crash of Per-seat pricing..."
                              value={blogForm.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBlogForm((prev) => ({
                                  ...prev,
                                  title: val,
                                  slug: autoSlugify(val),
                                }));
                              }}
                              className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                            />
                          </div>

                          {/* Slug */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-450">
                              Url slug (Auto):
                            </label>
                            <input
                              type="text"
                              required
                              value={blogForm.slug}
                              onChange={(e) =>
                                setBlogForm((prev) => ({
                                  ...prev,
                                  slug: autoSlugify(e.target.value),
                                }))
                              }
                              className="w-full p-2 border border-slate-250 bg-slate-100 rounded-lg font-mono text-[11px]"
                            />
                          </div>

                          {/* Issue Number */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Issue Count:
                            </label>
                            <input
                              type="number"
                              required
                              value={blogForm.issueNumber}
                              onChange={(e) =>
                                setBlogForm((prev) => ({
                                  ...prev,
                                  issueNumber: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-full p-2 border border-slate-250 bg-white rounded-lg font-mono"
                            />
                          </div>

                          {/* Category input */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Growth Category tag:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Finance Audits"
                              value={blogForm.category}
                              onChange={(e) =>
                                setBlogForm((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-250 bg-white rounded-lg font-sans"
                            />
                          </div>

                          {/* Read time */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Read Time stamp:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 5 min read"
                              value={blogForm.readTime}
                              onChange={(e) =>
                                setBlogForm((prev) => ({
                                  ...prev,
                                  readTime: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                            />
                          </div>

                          {/* Date of Publication */}
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-705">
                              Publication Date label:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="May 28, 2026"
                              value={blogForm.publicationDate}
                              onChange={(e) =>
                                setBlogForm((prev) => ({
                                  ...prev,
                                  publicationDate: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-730">
                            Excerpt Summary statement:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="A brief overview statement displaying on list summaries..."
                            value={blogForm.excerpt}
                            onChange={(e) =>
                              setBlogForm((prev) => ({
                                ...prev,
                                excerpt: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-250 bg-white rounded-lg"
                          />
                        </div>

                        {/* Content Markdown text area */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="block font-bold text-slate-700">
                              Essay Body Content (supports basic markdown block
                              divisions with double breaks):
                            </label>
                            <span className="text-[10px] text-slate-400">
                              Lines:{" "}
                              {blogForm.contentMarkdown.split("\n").length}
                            </span>
                          </div>
                          <textarea
                            required
                            rows={10}
                            placeholder="### Section Heading&#10;&#10;Use double returns to divide paragraphs. Use numbered lists like:&#10;1. **Item title** Description spec.&#10;2. **Next title** Other items."
                            value={blogForm.contentMarkdown}
                            onChange={(e) =>
                              setBlogForm((prev) => ({
                                ...prev,
                                contentMarkdown: e.target.value,
                              }))
                            }
                            className="w-full p-3 border border-slate-250 bg-white rounded-lg font-mono text-[11px] leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Blog post */}
                    {!blogPreviewMode && (
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Sync and Publish Dispatch Issue</span>
                      </button>
                    )}
                  </form>

                  {/* List Blog Archive */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm font-sans">
                      Active Articles & essays in the dispatcher
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-605">
                            <th className="p-3 font-bold">Issue Title</th>
                            <th className="p-3 font-bold">Niche Topic</th>
                            <th className="p-3 font-bold">Date Published</th>
                            <th className="p-3 font-bold">State</th>
                            <th className="p-3 font-bold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sortedBlogsList.map((b) => {
                            const isBaseline = [
                              "the-death-of-unlimited-seats",
                              "demystifying-gaap-ledgers",
                            ].includes(b.slug);
                            const blogStatus = getBlogScheduleStatus(b);
                            return (
                              <tr key={b.slug} className="hover:bg-slate-50/50">
                                <td className="p-3">
                                  <Link
                                    href={`/blog/${b.slug}`}
                                    target="_blank"
                                    className="font-bold text-amber-600 hover:underline flex items-center gap-1"
                                  >
                                    <span>
                                      Issue #{b.issueNumber} - {b.title}
                                    </span>
                                    <Eye className="h-4 w-4 text-slate-400" />
                                  </Link>
                                  <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                    /{b.slug}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-150 rounded text-blue-700 font-bold text-[9px] uppercase tracking-wider font-mono">
                                    {b.category}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-slate-600">
                                  {blogStatus.formattedDate}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider font-mono border ${
                                      blogStatus.isFuture
                                        ? "bg-amber-50 border-amber-100 text-amber-700"
                                        : "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    {blogStatus.label}
                                  </span>
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => editBlogInForm(b)}
                                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  {!isBaseline ? (
                                    <button
                                      onClick={() => handleDeleteBlog(b.slug)}
                                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-350 font-mono font-bold ml-1">
                                      Baseline
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                 TAB 5: MANAGE PIPELINE
                 ================================================== */}
              {activeTab === "pipeline" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <CloudLightning className="text-blue-600 h-6 w-6" />
                      <span>Content Pipeline</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Bulk-upload blogs, reviews, and tools, then let each batch
                      drip-publish itself on a fixed cadence — no manual posting
                      required. Items go live automatically as their scheduled
                      time arrives.
                    </p>
                  </div>

                  {/* Sub-tab selector: the three content sections */}
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["blog", "Blogs"],
                        ["review", "Reviews"],
                        ["tool", "Tools"],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPipelineSubTab(key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          pipelineSubTab === key
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {pipelineSubTab === "blog" && (
                    <>
                      {/* ---- BLOG bulk uploader ---- */}
                      <form
                        onSubmit={handleSaveBulkBlogQueue}
                        className="space-y-4 bg-emerald-50/40 p-4 border border-emerald-100 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                            Bulk-queue blog batch
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500">
                            Drip every {bulkBlogIntervalHours}h
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <label className="block font-bold text-slate-700">
                              Batch start date/time
                            </label>
                            <input
                              type="datetime-local"
                              value={bulkBlogStartAt}
                              onChange={(e) =>
                                setBulkBlogStartAt(e.target.value)
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Hours between drops
                            </label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={bulkBlogIntervalHours}
                              onChange={(e) =>
                                setBulkBlogIntervalHours(
                                  Number(e.target.value) ||
                                    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
                                )
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">
                            Bulk article payload (JSON array)
                          </label>
                          <textarea
                            rows={8}
                            value={bulkBlogDraftJson}
                            onChange={(e) =>
                              setBulkBlogDraftJson(e.target.value)
                            }
                            className="w-full p-3 border border-slate-200 bg-white rounded-lg font-mono text-[11px] leading-relaxed"
                          />
                          <p className="text-[10px] text-slate-500">
                            Each object needs `title`, `excerpt`, `category`,
                            and `contentMarkdown`. Optional `slug`, `readTime`,
                            `issueNumber`.
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                        >
                          <CloudUpload className="h-3.5 w-3.5" />
                          <span>Queue Blog Batch</span>
                        </button>
                      </form>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Queued for dispatch
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {scheduledBlogsCount} items
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Current Pipeline Status
                          </span>
                          {scheduledBlogsCount > 0 ? (
                            <span className="mt-1 flex items-center gap-2 text-emerald-700 font-bold">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              Flowing
                            </span>
                          ) : (
                            <span className="mt-1 flex items-center gap-2 text-rose-700 font-bold">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              Dry (Needs Content)
                            </span>
                          )}
                        </div>
                      </div>

                      <form
                        onSubmit={handleReschedulePipeline}
                        className="space-y-4 bg-blue-50/40 p-4 border border-blue-100 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                            Reschedule Active Pipeline
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              New baseline Start Date/Time
                            </label>
                            <input
                              type="datetime-local"
                              value={pipelineStartAt}
                              onChange={(e) =>
                                setPipelineStartAt(e.target.value)
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Hours gap between queued posts
                            </label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={pipelineIntervalHours}
                              onChange={(e) =>
                                setPipelineIntervalHours(
                                  Number(e.target.value) ||
                                    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
                                )
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={scheduledBlogsCount === 0}
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Reschedule Pipeline Now</span>
                        </button>
                      </form>

                      {/* List Pipeline Items */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm font-sans">
                          Upcoming Queued Drops
                        </h3>
                        {scheduledBlogsCount > 0 ? (
                          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-605">
                                  <th className="p-3 font-bold">Issue Title</th>
                                  <th className="p-3 font-bold">
                                    Drop Schedule
                                  </th>
                                  <th className="p-3 font-bold text-right">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {getScheduledBlogPosts(blogsList).map((b) => (
                                  <tr
                                    key={b.slug}
                                    className="hover:bg-slate-50/50"
                                  >
                                    <td className="p-3">
                                      <Link
                                        href={`/blog/${b.slug}`}
                                        target="_blank"
                                        className="font-bold text-amber-600 hover:underline flex items-center gap-1"
                                      >
                                        <span>
                                          Issue #{b.issueNumber} - {b.title}
                                        </span>
                                      </Link>
                                    </td>
                                    <td className="p-3 font-mono text-slate-600 font-bold text-[11px]">
                                      {formatBlogPublicationDate(
                                        b.publicationDate,
                                      )}
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => editBlogInForm(b)}
                                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                      >
                                        Edit Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 border border-slate-200 border-dashed rounded-xl text-center text-slate-500 font-bold bg-white">
                            The pipeline is empty. Queue items from the Blogs
                            editor first.
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ============================================
                     REVIEW PIPELINE SECTION
                     ============================================ */}
                  {pipelineSubTab === "review" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Published now
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {filterPublished(reviewsList).length}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Queued for later
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {filterScheduled(reviewsList).length}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Cadence
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {bulkReviewIntervalHours}h
                          </span>
                        </div>
                      </div>

                      <form
                        onSubmit={handleSaveBulkReviewQueue}
                        className="space-y-4 bg-blue-50/40 p-4 border border-blue-100 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                            Bulk-queue review batch
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <label className="block font-bold text-slate-700">
                              Batch start date/time
                            </label>
                            <input
                              type="datetime-local"
                              value={bulkReviewStartAt}
                              onChange={(e) =>
                                setBulkReviewStartAt(e.target.value)
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Hours between drops
                            </label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={bulkReviewIntervalHours}
                              onChange={(e) =>
                                setBulkReviewIntervalHours(
                                  Number(e.target.value) ||
                                    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
                                )
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">
                            Bulk review payload (JSON array)
                          </label>
                          <textarea
                            rows={10}
                            value={bulkReviewJson}
                            onChange={(e) => setBulkReviewJson(e.target.value)}
                            className="w-full p-3 border border-slate-200 bg-white rounded-lg font-mono text-[11px] leading-relaxed"
                          />
                          <p className="text-[10px] text-slate-500">
                            Each object needs `title`, `toolA`, `toolB`,
                            `category`, `excerpt`. Optional `slug`, `verdict`,
                            `winnerSlug`, `hotTakeQuote`,
                            `finalVerdictParagraph`, `bestForA`, `bestForB`,
                            `readTimeMinutes`, `tableRows`.
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                        >
                          <CloudUpload className="h-3.5 w-3.5" />
                          <span>Queue Review Batch</span>
                        </button>
                      </form>

                      <form
                        onSubmit={handleRescheduleReviewPipeline}
                        className="flex flex-wrap items-end gap-3 bg-white p-4 border border-slate-200 rounded-xl text-xs"
                      >
                        <span className="font-bold text-slate-700 w-full">
                          Reschedule the {filterScheduled(reviewsList).length}{" "}
                          queued reviews using the start/cadence above:
                        </span>
                        <button
                          type="submit"
                          disabled={filterScheduled(reviewsList).length === 0}
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Reschedule Review Pipeline</span>
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm font-sans">
                          Upcoming Queued Reviews
                        </h3>
                        {filterScheduled(reviewsList).length > 0 ? (
                          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-605">
                                  <th className="p-3 font-bold">Review</th>
                                  <th className="p-3 font-bold">
                                    Drop Schedule
                                  </th>
                                  <th className="p-3 font-bold text-right">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {filterScheduled(reviewsList).map((r) => (
                                  <tr
                                    key={r.slug}
                                    className="hover:bg-slate-50/50"
                                  >
                                    <td className="p-3 font-bold text-blue-700">
                                      {r.title}
                                      <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                        /{r.slug}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-600 font-bold text-[11px]">
                                      {formatScheduleDate(r.publicationDate)}
                                      <span className="block text-[9px] text-amber-600">
                                        in{" "}
                                        {hoursUntilPublish(r.publicationDate)}h
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => editReviewInForm(r)}
                                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                      >
                                        Edit Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 border border-slate-200 border-dashed rounded-xl text-center text-slate-500 font-bold bg-white">
                            No reviews queued. Paste a batch above to start the
                            drip.
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ============================================
                     TOOL PIPELINE SECTION
                     ============================================ */}
                  {pipelineSubTab === "tool" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Published now
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {filterPublished(toolsList).length}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Queued for later
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {filterScheduled(toolsList).length}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Cadence
                          </span>
                          <span className="block text-2xl font-black text-slate-950 mt-1">
                            {bulkToolIntervalHours}h
                          </span>
                        </div>
                      </div>

                      <form
                        onSubmit={handleSaveBulkToolQueue}
                        className="space-y-4 bg-blue-50/40 p-4 border border-blue-100 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                            Bulk-queue tool batch
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <label className="block font-bold text-slate-700">
                              Batch start date/time
                            </label>
                            <input
                              type="datetime-local"
                              value={bulkToolStartAt}
                              onChange={(e) =>
                                setBulkToolStartAt(e.target.value)
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block font-bold text-slate-700">
                              Hours between drops
                            </label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={bulkToolIntervalHours}
                              onChange={(e) =>
                                setBulkToolIntervalHours(
                                  Number(e.target.value) ||
                                    DEFAULT_BLOG_QUEUE_INTERVAL_HOURS,
                                )
                              }
                              className="w-full p-2 border border-slate-200 bg-white rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-slate-700">
                            Bulk tool payload (JSON array)
                          </label>
                          <textarea
                            rows={8}
                            value={bulkToolJson}
                            onChange={(e) => setBulkToolJson(e.target.value)}
                            className="w-full p-3 border border-slate-200 bg-white rounded-lg font-mono text-[11px] leading-relaxed"
                          />
                          <p className="text-[10px] text-slate-500">
                            Each object needs `name`, `category`,
                            `oneLineOpinion`. Optional `slug`, `numericPrice`,
                            `startingPrice`, `iconUrl`.
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                        >
                          <CloudUpload className="h-3.5 w-3.5" />
                          <span>Queue Tool Batch</span>
                        </button>
                      </form>

                      <form
                        onSubmit={handleRescheduleToolPipeline}
                        className="flex flex-wrap items-end gap-3 bg-white p-4 border border-slate-200 rounded-xl text-xs"
                      >
                        <span className="font-bold text-slate-700 w-full">
                          Reschedule the {filterScheduled(toolsList).length}{" "}
                          queued tools using the start/cadence above:
                        </span>
                        <button
                          type="submit"
                          disabled={filterScheduled(toolsList).length === 0}
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Reschedule Tool Pipeline</span>
                        </button>
                      </form>

                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm font-sans">
                          Upcoming Queued Tools
                        </h3>
                        {filterScheduled(toolsList).length > 0 ? (
                          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-605">
                                  <th className="p-3 font-bold">Tool</th>
                                  <th className="p-3 font-bold">
                                    Drop Schedule
                                  </th>
                                  <th className="p-3 font-bold text-right">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {filterScheduled(toolsList).map((t) => (
                                  <tr
                                    key={t.slug}
                                    className="hover:bg-slate-50/50"
                                  >
                                    <td className="p-3 font-bold text-blue-700">
                                      {t.name}
                                      <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                                        /{t.slug}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-600 font-bold text-[11px]">
                                      {formatScheduleDate(t.publicationDate)}
                                      <span className="block text-[9px] text-amber-600">
                                        in{" "}
                                        {hoursUntilPublish(t.publicationDate)}h
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => editToolInForm(t)}
                                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                      >
                                        Edit Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 border border-slate-200 border-dashed rounded-xl text-center text-slate-500 font-bold bg-white">
                            No tools queued. Paste a batch above to start the
                            drip.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ==================================================
                 TAB 6: DATABASE BACKEND COUPLING (SUPABASE CONTROL CENTER)
                 ================================================== */}
              {activeTab === "backend" && (
                <div className="space-y-8 animate-fade-in text-xs leading-relaxed text-slate-750 font-sans">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Database className="text-blue-600 h-6 w-6" />
                      <span>Production Supabase Sync Center</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage double-sync cloud capabilities. Securely push local
                      edits to Supabase tables, or pull remote states to update
                      client previews.
                    </p>
                  </div>

                  {/* Supabase connection diagnostic panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 col-span-2">
                      <h3 className="font-extrabold text-slate-950 text-sm">
                        Supabase Sync Architecture
                      </h3>
                      <p className="text-slate-600 leading-normal">
                        SaaSPebble utilizes local-first client database
                        optimizations (localStorage overlays) to support static
                        build exports (CLS = 0). This Sync Center serves as your
                        content gateway: publish articles and reviews locally in
                        your browser, then push them up to your cloud database
                        whenever you are ready!
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        Credential Status
                      </span>
                      <div className="py-2">
                        {supabaseActive ? (
                          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-bold text-xs">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Cloud Live (Active)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 p-2 rounded-lg font-bold text-xs">
                            <span className="h-2 w-2 rounded-full bg-amber-450 shrink-0" />
                            <span>Fallback Sandbox</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {supabaseActive
                          ? "Vars correctly reading from .env"
                          : "Setup environment variables to go live"}
                      </span>
                    </div>
                  </div>

                  {/* Operational Sync triggers */}
                  <div className="p-5 border-2 border-slate-200 bg-white rounded-2xl space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b">
                      <CloudLightning className="h-4.5 w-4.5 text-blue-605" />
                      Interactive Replication Controls
                    </h3>

                    {syncFeedback && (
                      <div
                        className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
                          syncFeedback.success
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-rose-50 border-rose-100 text-rose-800"
                        }`}
                      >
                        <AlertCircle
                          className={`h-4.5 w-4.5 ${syncFeedback.success ? "text-emerald-600" : "text-rose-600"} shrink-0 mt-0.5`}
                        />
                        <div>
                          <span className="block font-bold">
                            {syncFeedback.success
                              ? "Operational Success"
                              : "Sync Process Encountered Anomaly"}
                          </span>
                          <p className="text-[11px] font-normal mt-0.5 leading-relaxed">
                            {syncFeedback.message}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Push Button Box */}
                      <div className="border border-slate-150 p-4 rounded-xl space-y-3">
                        <h4 className="font-bold text-slate-800">
                          Push Local Storage up to Supabase
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Takes your locally created or edited tools, reviews,
                          and blog dispatches and uploads them to Supabase (uses
                          SQL upserts).
                        </p>
                        <button
                          type="button"
                          onClick={handlePushToSupabase}
                          disabled={syncLoading || !supabaseActive}
                          className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed p-3 rounded-lg transition-colors cursor-pointer"
                        >
                          {syncLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <CloudUpload className="h-4 w-4" />
                              <span>Push Local to Cloud Postgres</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Pull Button Box */}
                      <div className="border border-slate-150 p-4 rounded-xl space-y-3">
                        <h4 className="font-bold text-slate-800">
                          Pull Cloud database into Local Storage
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Retrieves live rows from Supabase, synchronizing them
                          directly within this browser window cache so they
                          render on previews.
                        </p>
                        <button
                          type="button"
                          onClick={handlePullFromSupabase}
                          disabled={syncLoading || !supabaseActive}
                          className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed p-3 rounded-lg transition-colors cursor-pointer"
                        >
                          {syncLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Pulling...</span>
                            </>
                          ) : (
                            <>
                              <CloudDownload className="h-4 w-4" />
                              <span>Pull Cloud rows into browser</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Copy Paste SQL Code Generator step */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Supabase Database Setup Guide
                    </h3>
                    <p className="text-slate-500 leading-normal">
                      To successfully communicate with Supabase, run this
                      precise SQL code inside your{" "}
                      <strong>Supabase SQL Editor</strong> to allocate correct
                      table targets:
                    </p>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        Recommended Supabase SQL Schema Bootstrap:
                      </span>
                      <pre className="bg-slate-950 text-slate-300 overflow-x-auto p-4 rounded-xl border-2 border-slate-900 font-mono text-[9px] max-h-72 leading-normal select-all">
                        {`-- 1. Create Tools table
CREATE TABLE saas_tools (
  slug VARCHAR(150) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  starting_price VARCHAR(100),
  numeric_price NUMERIC(10,2) NOT NULL,
  category VARCHAR(150) NOT NULL,
  one_line_opinion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Reviews table
CREATE TABLE saas_reviews (
  slug VARCHAR(150) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tool_a VARCHAR(150) REFERENCES saas_tools(slug),
  tool_b VARCHAR(150) REFERENCES saas_tools(slug),
  category VARCHAR(150) NOT NULL,
  excerpt TEXT,
  read_time_minutes INT DEFAULT 5,
  publication_date VARCHAR(100) NOT NULL,
  verdict VARCHAR(100),
  winner_slug VARCHAR(150),
  hot_take_quote TEXT,
  final_verdict_paragraph TEXT,
  best_for_a TEXT,
  best_for_b TEXT,
  table_rows JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Blog Posts table
CREATE TABLE saas_blog_posts (
  slug VARCHAR(150) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issue_number INT NOT NULL,
  excerpt TEXT,
  read_time VARCHAR(100),
  publication_date VARCHAR(100) NOT NULL,
  category VARCHAR(255) NOT NULL,
  content_markdown TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable client read-only queries with standard Select access 
-- (while keeping writes restricted to authenticated accounts if configured)
ALTER TABLE saas_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON saas_tools FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON saas_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON saas_blog_posts FOR SELECT USING (true);

-- Allow authenticated upserts for admins
CREATE POLICY "Allow admin all operations" ON saas_tools FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin all operations" ON saas_reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin all operations" ON saas_blog_posts FOR ALL TO authenticated USING (true);
`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inline advertisement placeholder for index auditing limits */}
          <div className="max-w-7xl mx-auto mt-8">
            <AdContainer layoutType="top-banner" slotId="admin-bottom-ad" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
