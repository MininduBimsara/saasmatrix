export type CategorySlug =
  | "accounting"
  | "project-management"
  | "crm"
  | "hr-payroll"
  | "communications"
  | "developer-tools"
  | "marketing"
  | "design";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  emoji: string;
}

export interface Tool {
  slug: string;
  name: string;
  startingPrice: string;
  numericPrice: number;
  category: CategorySlug;
  oneLineOpinion: string;
  parentSlug?: string;
  tierName?: string;
  pricingModel?: string;
  keyFeatures?: string[];
  limitations?: string[];
  aiIncluded?: boolean;
  aiCost?: string;
  freeTrial?: boolean;
  freeForever?: boolean;
  iconUrl?: string;
  // Optional ISO timestamp. When set in the future the tool stays hidden
  // from the public directory until its moment arrives (drip-feed publishing).
  // Baseline tools omit it and are therefore always live.
  publicationDate?: string;
}

export interface Review {
  slug: string;
  title: string;
  toolA: string; // slug of Tool A
  toolB: string; // slug of Tool B
  category: CategorySlug;
  excerpt: string;
  readTimeMinutes: number;
  publicationDate: string; // 'YYYY-MM-DD' or typical
  verdict: "editor-pick" | "hot-take" | "skip" | "tie" | null;
  winnerSlug: string | null;
  hotTakeQuote: string;
  finalVerdictParagraph: string;
  bestForA: string;
  bestForB: string;
  tableRows: {
    feature: string;
    valueA: string;
    valueB: string;
    winner: string;
  }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  issueNumber: number;
  excerpt: string;
  readTime: string;
  publicationDate: string;
  category: string;
  contentMarkdown: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "accounting",
    name: "Accounting & Finance",
    blurb:
      "Double-entry ledger engines, payroll automation, tax estimation matrix arrays, and CPA reporting hubs.",
    emoji: "📈",
  },
  {
    slug: "project-management",
    name: "Project & Operations",
    blurb:
      "Agile sprints, Gantt chart dependencies, team resource allocation visualizers, and task lifecycles.",
    emoji: "⚡",
  },
  {
    slug: "crm",
    name: "CRM & Pipeline Suite",
    blurb:
      "Lead qualification triggers, email pipelines, interactive contact notes, and developer API hooks.",
    emoji: "🤝",
  },
  {
    slug: "hr-payroll",
    name: "HR & Payroll Systems",
    blurb:
      "Global compliance frameworks, contractor work statements, healthcare onboarding matrices, and direct deposit runs.",
    emoji: "👥",
  },
  {
    slug: "communications",
    name: "Communications & Chat",
    blurb:
      "Real-time corporate loops, asynchronous thread managers, external guest portals, and calendar sync hooks.",
    emoji: "💬",
  },
  {
    slug: "developer-tools",
    name: "Developer Platforms",
    blurb:
      "Static deployment CDNs, automated unit testing, API gateways, system performance metrics, and database backends.",
    emoji: "🛡️",
  },
  {
    slug: "marketing",
    name: "Growth & Marketing",
    blurb:
      "E-mail automation sequences, multi-channel attribution tables, landing layout optimizing arrays, and SEO metric benchmarks.",
    emoji: "📣",
  },
  {
    slug: "design",
    name: "Creative & Design",
    blurb:
      "Vector layout editing, interactive prototyping boards, real-time feedback loops, and assets version index structures.",
    emoji: "🎨",
  },
];

// Seed content was removed after export. The live site now reads rows from
// Supabase, with browser-local drafts as a fallback for admin workflows.
export const TOOLS: Tool[] = [];

export const REVIEWS: Review[] = [];

export const BLOG_POSTS: BlogPost[] = [];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getReview(slug: string): Review | undefined {
  return REVIEWS.find((r) => r.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getReviewsByCategory(categorySlug: CategorySlug): Review[] {
  return REVIEWS.filter((r) => r.category === categorySlug);
}
