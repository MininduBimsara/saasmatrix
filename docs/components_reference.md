# SaaSMatrix Component Reference Directory

This master reference guide covers all UI and functional components inside the `/components` folder, describing their properties, styling details, state hook lifecycles, and target route integrations.

---

## 1. Global Navigation & Layout Components

### 1.1 Header Component (`/components/Header.tsx`)
* **Target Pages:** Mounted globally in the root layout (`/app/layout.tsx`), appearing on every route across the platform.
* **Component Type:** Client Component (`'use client'`).
* **Functional Scope:** Renders the main navigation header and mobile menu drawer, managing responsive toggles.
* **Technical Details:**
  * **State Hooks:** Uses `isMobileMenuOpen` (`boolean`) to toggle mobile navigation visibility.
  * **Interactive Links:** Dynamic nav elements supporting hover transitions. The primary "Subscribe" CTA button switches destinations dynamically, mapping to `/newsletter` during the free launch phase.
  * **Lucide Icon Integrations:** Uses `Menu` (for mobile disclosure indicators), `X` (to close sliders), `ShieldAlert` (alerts), and custom SVG logos.
  * **Styling Classes:** Highly customized wrapper using Tailwind background blurs (`backdrop-blur-md bg-white/90 border-b border-slate-100 sticky top-0 z-50 px-4 py-3`).

### 1.2 Footer Component (`/components/Footer.tsx`)
* **Target Pages:** Mounted globally inside `/app/layout.tsx`.
* **Component Type:** Server Component (Statically rendered).
* **Functional Scope:** Contains categorical maps, legal policy links, social media routes, and newsletter gateways.
* **Styling Classes:** Clean dark layout using soft secondary text colors (`bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 font-sans mt-auto`).

---

## 2. Monetization & Ad Insertion

### 2.1 AdContainer Component (`/components/AdContainer.tsx`)
* **Target Pages:** Interspersed inside directory home grid rolls, detail review sidebars, and pricing matrices.
* **Component Type:** Client Component (`'use client'`).
* **Props Interface:**
  ```typescript
  interface AdContainerProps {
    slotId: string;                     // Specific unique AdSense slot ID
    layoutType: 'top-banner' | 'in-feed' | 'sidebar'; // Layout rendering container
    className?: string;                 // Custom parent CSS elements list
  }
  ```
* **Hook Lifecycles:**
  * Uses dependency-guarded `useEffect()` hook to push initialization trackers to the client-side Google AdSense array (`(window.adsbygoogle || []).push({})`) safely.
* **Responsive Layout Types:**
  * `top-banner`: Constrained to heights like `h-[90px]` targeting wide layouts.
  * `in-feed`: Formatted for mobile and feed scrolling lists (`h-[280px] max-w-[336px]`).
  * `sidebar`: Structured for vertical side panels (`h-[600px] max-w-[300px]`).

---

## 3. Product Directory & Listings

### 3.1 ReviewCard Component (`/components/ReviewCard.tsx`)
* **Target Pages:** Mounted primarily on the home directory matrix and category lists under `/category/[slug]`.
* **Component Type:** Client Component due to comparison trackers and outbound link intercepts.
* **Props Interface:**
  ```typescript
  interface ReviewCardProps {
    id: string;                         // Unique database index identification
    name: string;                       // SaaS product name
    tagline: string;                    // Short pitch text
    category: string;                   // Category vertical title
    monthlyPrice: number;               // Starting pricing index indicator
    overallRating: number;              // Numeric decimal score (e.g. 4.8)
    scores: {                           // Granular specification indices
      usability: number;
      features: number;
      apis: number;
      support: number;
      pricing: number;
    };
    pros: string[];                     // Key advantages array list
    cons: string[];                     // Technical drawbacks list
    slug: string;                       // Address redirection slug parameter
    isCompareChecked: boolean;          // Sync status with parent checkbox states
    onCompareToggle: () => void;        // Toggle handler callback
  }
  ```
* **Key Features:**
  * Includes an interactive checkbox that links directly to the parent listing's state comparison array.
  * Displays pros/cons lists and rating scores alongside outbound CTAs, encouraging clicks.

### 3.2 CategoryPageClient Component (`/components/CategoryPageClient.tsx`)
* **Target Pages:** Mounted dynamically under `/app/category/[slug]/page.tsx` routes.
* **Component Type:** Client Component (`'use client'`).
* **Props Interface:**
  ```typescript
  interface CategoryPageClientProps {
    categorySlug: string;
    categoryTitle: string;
    description: string;
    allProducts: SaaSProductMapping[];
  }
  ```
* **Internal State Hooks:**
  * `searchFilter` (`string`): Filters list nodes in-memory on the client container.
  * `maxPriceFilter` (`number`): Filters products based on base starting cost.
  * `sortBy` (`'rating' | 'price-low' | 'price-high'`): Sorts products based on client-side controls.
* **Technical Details:**
  * Integrates search input filters, price range sliders, and sorting options inside responsive accordion menus.

---

## 4. UI Utilities & Feedback Indicators

### 4.1 SectionHeading Component (`/components/SectionHeading.tsx`)
* **Target Pages:** Mounted across informational pages, blogs, and legal modules.
* **Component Type:** Server Component.
* **Props Interface:**
  ```typescript
  interface SectionHeadingProps {
    title: string;                      // Display Title (e.g. "Security Integrity Reports")
    subtitle?: string;                  // Optional description text displayed below
    badge?: string;                     // Optional custom pills
  }
  ```
* **Styling Classes:** Uses space-conscious margins and elegant display fonts (`font-sans font-extrabold text-2xl tracking-tight text-slate-900 border-l-4 border-amber-500 pl-3`).

### 4.2 Skeletons Component (`/components/Skeletons.tsx`)
* **Target Pages:** Imported to provide visual loading indicators while dynamic assets load.
* **Component Type:** Server Component.
* **Included Loaders:**
  * `CardSkeleton`: Mimics a standard `/components/ReviewCard.tsx` layout. Includes pulse animations and grey color blocks to represent rows, preventing shift layout jumps during client hydration.
  * `ListSkeleton`: Displays standard gray loading rules, providing visual feedback for scrolling grids or tables.
