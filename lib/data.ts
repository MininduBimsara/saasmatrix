export type CategorySlug =
  | 'accounting'
  | 'project-management'
  | 'crm'
  | 'hr-payroll'
  | 'communications'
  | 'developer-tools'
  | 'marketing'
  | 'design';

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
  iconUrl?: string;
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
  verdict: 'editor-pick' | 'hot-take' | 'skip' | 'tie' | null;
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
    slug: 'accounting',
    name: 'Accounting & Finance',
    blurb: 'Double-entry ledger engines, payroll automation, tax estimation matrix arrays, and CPA reporting hubs.',
    emoji: '📈',
  },
  {
    slug: 'project-management',
    name: 'Project & Operations',
    blurb: 'Agile sprints, Gantt chart dependencies, team resource allocation visualizers, and task lifecycles.',
    emoji: '⚡',
  },
  {
    slug: 'crm',
    name: 'CRM & Pipeline Suite',
    blurb: 'Lead qualification triggers, email pipelines, interactive contact notes, and developer API hooks.',
    emoji: '🤝',
  },
  {
    slug: 'hr-payroll',
    name: 'HR & Payroll Systems',
    blurb: 'Global compliance frameworks, contractor work statements, healthcare onboarding matrices, and direct deposit runs.',
    emoji: '👥',
  },
  {
    slug: 'communications',
    name: 'Communications & Chat',
    blurb: 'Real-time corporate loops, asynchronous thread managers, external guest portals, and calendar sync hooks.',
    emoji: '💬',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Platforms',
    blurb: 'Static deployment CDNs, automated unit testing, API gateways, system performance metrics, and database backends.',
    emoji: '🛡️',
  },
  {
    slug: 'marketing',
    name: 'Growth & Marketing',
    blurb: 'E-mail automation sequences, multi-channel attribution tables, landing layout optimizing arrays, and SEO metric benchmarks.',
    emoji: '📣',
  },
  {
    slug: 'design',
    name: 'Creative & Design',
    blurb: 'Vector layout editing, interactive prototyping boards, real-time feedback loops, and assets version index structures.',
    emoji: '🎨',
  },
];

export const TOOLS: Tool[] = [
  {
    slug: 'quickbooks',
    name: 'QuickBooks Online',
    startingPrice: '$30/mo',
    numericPrice: 30,
    category: 'accounting',
    oneLineOpinion: 'The industry-standard double-entry bookkeeping engine with flawless accountant compatibility but steep learning curves.',
  },
  {
    slug: 'freshbooks',
    name: 'FreshBooks Premium',
    startingPrice: '$19/mo',
    numericPrice: 19,
    category: 'accounting',
    oneLineOpinion: 'Exceptional client-centric invoicing flow and time tracking ideal for small freelance agencies.',
  },
  {
    slug: 'asana',
    name: 'Asana Enterprise',
    startingPrice: '$10.99/mo',
    numericPrice: 10.99,
    category: 'project-management',
    oneLineOpinion: 'Smooth, beautiful task view transitions and portfolios optimized for corporate adoption and clarity.',
  },
  {
    slug: 'clickup',
    name: 'ClickUp Workspace',
    startingPrice: '$7/mo',
    numericPrice: 7,
    category: 'project-management',
    oneLineOpinion: 'Extreme modularity and multi-view flexibility at a fraction of the cost, at the price of occasional interface density fatigue.',
  },
  {
    slug: 'salesforce',
    name: 'Salesforce Sales Cloud',
    startingPrice: '$25/mo',
    numericPrice: 25,
    category: 'crm',
    oneLineOpinion: 'Extremely scalable workflow automation and ecosystem integrations built for midmarket to enterprise corporations.',
  },
  {
    slug: 'hubspot',
    name: 'HubSpot CRM Suite',
    startingPrice: '$0/mo',
    numericPrice: 0,
    category: 'crm',
    oneLineOpinion: 'Intuitive pipeline management and lead generation with exceptionally powerful inbound content plugins.',
  },
  {
    slug: 'monday',
    name: 'Monday.com Work OS',
    startingPrice: '$8/mo',
    numericPrice: 8,
    category: 'project-management',
    oneLineOpinion: 'Robust, colorful rows and automation sequences that are incredibly easy for non-technical users to master.',
  },
  {
    slug: 'jira',
    name: 'Atlassian Jira',
    startingPrice: '$8.15/mo',
    numericPrice: 8.15,
    category: 'project-management',
    oneLineOpinion: 'The canonical agile platform for developers and software engineering sprint pipelines.',
  },
];

export const REVIEWS: Review[] = [
  {
    slug: 'quickbooks-vs-freshbooks',
    title: 'QuickBooks Online vs FreshBooks: The General Ledger Battle',
    toolA: 'quickbooks',
    toolB: 'freshbooks',
    category: 'accounting',
    excerpt: 'An expert side-by-side performance review benchmarking general ledger flexibility, multi-entity support, client billing, and tax regulation compliance.',
    readTimeMinutes: 7,
    publicationDate: '2026-05-15',
    verdict: 'editor-pick',
    winnerSlug: 'quickbooks',
    hotTakeQuote: 'FreshBooks rules for smooth client billing and beautiful invoice templates, but lacks QuickBooks Online deep GAAP-compliant dual-entry safeguards.',
    finalVerdictParagraph: 'For companies requiring absolute financial integrity, QuickBooks Online is the undisputed industry standard. It protects cash ledger trails perfectly to guarantee smooth tax audits. However, if you are a freelance agency, graphic consultant, or small service boutique seeking to reduce client billing frictions, FreshBooks provides double the billing automation at nearly half the price.',
    bestForA: 'Growing businesses needing strict GAAP-compliant ledgers & CPA sync.',
    bestForB: 'Freelance service providers and consultants prioritizing invoice speeds.',
    tableRows: [
      {
        feature: 'General Ledger System',
        valueA: 'Full double-entry (GAAP standard)',
        valueB: 'Simplified ledger with retrofitted double-entry',
        winner: 'QuickBooks (Superior Audit Trail)',
      },
      {
        feature: 'Client Portal & Invoicing',
        valueA: 'Standard layout options. Pay-links added.',
        valueB: 'Highly customized, client-centric portals with automated reminders.',
        winner: 'FreshBooks (Higher Conversion Design)',
      },
      {
        feature: 'Tax Categorizations',
        valueA: 'Advanced visual multi-schedule tax mapping.',
        valueB: 'Simple taxonomy classifications.',
        winner: 'QuickBooks (Superior CPA Compliance)',
      },
      {
        feature: 'Bank Reconciliations',
        valueA: 'Highly automated rule sets. AI learning matching.',
        valueB: 'Manual transaction confirmations with simple triggers.',
        winner: 'QuickBooks (Automation Rate)',
      },
      {
        feature: 'Starting Pricing Suite',
        valueA: 'From $30/mo (Requires add-ons for full scale)',
        valueB: 'From $19/mo (Frequent promo structures available)',
        winner: 'FreshBooks (Small Business Value)',
      },
    ],
  },
  {
    slug: 'asana-vs-clickup',
    title: 'Asana Enterprise vs ClickUp Workspace: Project Management Audited',
    toolA: 'asana',
    toolB: 'clickup',
    category: 'project-management',
    excerpt: 'An exhaustive software audit measuring task lifecycle planning, roadmap scalability, custom columns, and collaboration velocity across team sizes.',
    readTimeMinutes: 8,
    publicationDate: '2026-05-24',
    verdict: 'hot-take',
    winnerSlug: 'clickup',
    hotTakeQuote: 'Asana is a masterpiece of micro-interactions and negative space, but ClickUp offers five times the custom fields and internal documentation limits for nearly half the price.',
    finalVerdictParagraph: 'Asana stands out for its elegant, distraction-free corporate layout, leading to rapid onboarding metrics and flawless adoption among marketing and product design departments. Conversely, ClickUp is a modular workstation powerhouse. While it has a slightly higher initial learning rate, its ability to act as an all-in-one workspace makes it highly cost-efficient.',
    bestForA: 'Enterprise cross-functional divisions prioritizing load speeds and layout simplicity.',
    bestForB: 'Modular team leaders seeking all-one-one systems (Docs, Sprints, Whiteboards) on tight budgets.',
    tableRows: [
      {
        feature: 'UI Responsiveness',
        valueA: 'Highly optimized, instant SPA rendering',
        valueB: 'Vast visual options, slight layout load latency',
        winner: 'Asana (Snappy Operational Speeds)',
      },
      {
        feature: 'Automations & Triggers',
        valueA: 'Robust visual graph rule-builder. Fast sync.',
        valueB: 'Formula-heavy, extremely custom conditional systems.',
        winner: 'ClickUp (Flexibility limits)',
      },
      {
        feature: 'Views Offered',
        valueA: 'Boards, Lists, Timelines, Workload, Calendars.',
        valueB: '15+ views including Mind Maps, Whiteboards, Docs.',
        winner: 'ClickUp (Visual Variety)',
      },
      {
        feature: 'Document Storage',
        valueA: 'Simple attachments, external cloud-drive shortcuts.',
        valueB: 'Fully embedded collaborative click-docs with sub-pages.',
        winner: 'ClickUp (Knowledge Base Wiki)',
      },
      {
        feature: 'Team Member Cost',
        valueA: 'From $10.99/user/month (Escalates for Portfolio tiers)',
        valueB: 'From $7/user/month (Unmatched feature density)',
        winner: 'ClickUp (Maximize ROI)',
      },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'the-death-of-unlimited-seats',
    title: 'The Death of Unlimited Seats: Why Per-User SaaS fees are Crumbling Product Velocity',
    issueNumber: 42,
    excerpt: 'Productivity suites are shifting away from user-seat models as AI agent execution begins to dominate enterprise workflow throughput.',
    readTime: '5 min read',
    publicationDate: 'May 28, 2026',
    category: 'Procurement Strategy',
    contentMarkdown: `Per-user seat models are of a bygone era. For over twenty years, the subscription model pioneered by Salesforce Sales Cloud leveraged a simple variable: **Human Headcount equals License Multiplier**. This made sense when humans did one hundred percent of the clicking inside the interface.

But in the age of automated background API pipelines and LLM workflows, user headcounts no longer tell the true story of service consumption. When a single developer deploys an autonomous script which triggers over fifty thousand system actions inside a night, are they still just 'one seat'?

### Why the per-seat model is breaking down

Here are three primary reasons why user seat fees degrade collaborative agility in scaleups:

1. **Information Hoarding:** Teams intentionally restrict log-ins to minimize monthly budget bills, creating critical operational knowledge silos.
2. **Bot-user Proliferation:** Engineers share top-level admin credentials or deploy generic webhook relays to avoid adding secondary seats.
3. **Friction at the Edge:** Cross-functional collaborators are locked out of viewing simple roadmap updates or general ledgers because the seat limit is reached.

### What lies ahead: Usage-based API metrics

SaaS platforms that align pricing directly with processing volume or system outputs are growing at double the rate of strict headcount competitors. Rather than locking down screens, premium providers are keeping the workspace entire layout free and billing purely on **Active System Workhours** or pipeline records generated. Expect an industry-wide pivot towards usage-driven CPM frameworks by 2027.`,
  },
  {
    slug: 'demystifying-gaap-ledgers',
    title: 'Demystifying dual-entry ledger loops for non-accountant software buyers',
    issueNumber: 41,
    excerpt: 'An engineer-focused explanation of why CPAs reject single-entry spreadsheets and demand double-entry verification models.',
    readTime: '4 min read',
    publicationDate: 'May 12, 2026',
    category: 'Finance Audits',
    contentMarkdown: `Too many startup founders treat accounting systems like dynamic spreadsheets. They expect to write flat credit columns and assume their balances reconcile.

Under GAAP (Generally Accepted Accounting Principles) regulations, every financial transaction must touch exactly two corresponding accounts: a debit and a credit. This dual-verification matrix ensures that the basic accounting formula always balances:

$$\\text{Assets} = \\text{Liabilities} + \\text{Equity}$$

### The single-entry friction state

When you use basic invoicing tools with single-entry databases, transactions exist as separate record objects. When cash arrives, your sales record updates, but your cash account remains unverified. If an invoice gets modified after payment, standard database inconsistencies appear immediately:

- **Orphan payments** with no source client ID.
- **Double sales reporting** caused by page reloads.
- **Balance statements** that do not resemble real bank accounts.

### Choosing your accounting safety level

While FreshBooks provides exceptional client invoice templates and automated reminders, QuickBooks Online represents the gold standard database engine that CPA networks prefer. It enforces a strict, unalterable ledger trail where no record is simply deleted; everything must be offset by counter-reversing entries. Understand these safeguards before delegating accounting tooling decisions to non-financial departments.`,
  },
];

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
