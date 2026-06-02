# 2. B2B Review Systems & Category Collections

## 2.1 Reviews Dynamic Comparison Route (`/reviews/[slug]`)
The dynamic review details page provides in-depth, side-by-side comparative diagnostics between two competitor tools (Tool A vs. Tool B) within a specific category. This acts as a high-authority landing page for targeted organic traffic (e.g., *"Asana vs ClickUp Comparison Review"*).

### Functional Features
* **Visual Matchup Header:** Features the comparison title, dynamic excerpt, and side-by-side logo containers for both platforms with a prominent "VS" indicator and editor score (out of 10).
* **Performance Benchmarks Grid:** Progress bars comparing the two competitors side-by-side across three key lab-tested performance metrics:
  1. *Ease of Use*
  2. *API Throughput*
  3. *Value for Money*
* **Side-by-Side Table Matrix:** A high-density specifications table that lists features, value specifications for both platforms, and a designated winner badge for each compared parameter.
* **Strengths Dual Cards:** Individual cards highlighting the specific pros/strengths of each tool to guide buyer fit.
* **Actionable Verdict Highlights:** A highlighted callout box rendering a summary quote, the final verdict paragraph, and clear recommendations (e.g., choose Tool A for scale, Tool B for smaller environments).
* **Sticky Sidebar Diagnostics:** An audit diagnostics panel displaying study details (e.g., double-blind testing, 98% efficiency index, verification period) alongside sticky skyscraper ads.

---

## 2.2 Category Collections Page (`/category/[slug]`)
To optimize SEO keyword clustering, products and reviews are organized under category directory landing pages (e.g., `/category/crm`, `/category/devops`).

### Functional Features
* **Category Hero Layout:** Displays the category emoji, title, description, and list counters.
* **Verified Tools Directory Index:** A clean, high-density table listing the platform name, starting price, and the editor's one-line opinion.
* **Comparison Matrices list:** Grid of `ReviewCard` components representing published side-by-side reviews matching the active category.
* **Related Verticals Tag Cloud:** A tag cloud at the bottom allowing visitors to navigate to sister category indices.

---

## 2.3 State Management & Client Hydration
These pages retrieve static baseline data and merge it dynamically with live Supabase datasets on mount:
* **Client-Side Data Resolution:** Checks the published content layer (`lib/contentSource.ts`) asynchronously to retrieve tools and reviews.
* **Dynamic Route Parameters:** Leverages standard Next.js dynamic routing parameter resolution to filter the correct entries.
* **Monetization Integration:** Embeds `AdContainer` banners dynamically at key scanning points to monetize traffic (e.g., above content, mid-content, and sticky sidebars).
