# 3. Dynamic B2B Analytical Sandbox Modals

This documentation details the interactive, data-dense utilities built to engage buy-side negotiators and business leaders.

---

## 3.1 Side-by-Side Comparison Matrix (`/compare`)
The compare page (`/app/compare/page.tsx`) lets users load multi-product metrics into horizontal, high-contrast tables. This helps buyers evaluate software alternatives side-by-side instead of clicking through isolated sheets.

### Functional Features Layout
* **Product Card Headers:** Dynamic head row featuring large app titles, pricing indicators, and removal tabs to quickly drop a candidate from active evaluations.
* **Granular Specification Comparison Blocks:** Lists technical details in aligned vertical rows:
  * *Base Subscription Costing*
  * *Security Standards Compliance* (e.g. SOC2, HIPAA, ISO27001)
  * *API & Webhook Provisioning Limits*
  * *Data Export Compatibility*
  * *Support SLA Response Times*
* **Dynamic Highlight Differences Switch:** A client-side toggle button. When enabled, it style-highlights cells containing mismatched parameters across products, drawing attention to differing features.

### Client-Side State Mechanism
The comparator reads checked product parameters primarily from search query strings (e.g., `/compare?ids=prod-1,prod-2`). This makes the selected comparison completely shareable, allowing procurement teams to bookmark and collaborate on selection sheets.

---

## 3.2 CFO ROI Cost Calculator (`/calculator`)
The B2B cost estimator (`/app/calculator/page.tsx`) is a conversion tool targeting financial decision-makers. It lets buyers calculate the actual total cost of ownership (TCO) across multiple software choices.

### Key Calculation Controls
1. **Target Team Seat Slider:** Scale from 1 to 500+ active enterprise seats.
2. **Integration Complexity Toggle:** Selects expected engineering integration hours (Simple, Complex, Enterprise Custom).
3. **Billing Cycle Frequency Switch:** Instantly updates monthly rates to yearly discounted levels.
4. **Custom Platform Overhead Modifier:** Input for internal training, migration, and maintenance fees during launch.

### Real-Time Math Pipeline (No Page Refresh)
The page evaluates math formulas instantaneously inside local React states on every slider or switch input event:

$$\text{Final Year Cost} = (\text{Monthly Rate} \times \text{Seats} \times 12) + \text{Overhead} + (\text{Migration Complexity Modifier} \times \text{Seats})$$

### CRO Monetization Intercept
When the custom calculator exports final reports, it displays a comparison of sponsored software alternatives. These recommendations map directly to AdSense target keywords, prompting high-bid context-specific ad loads right at the decision step.
