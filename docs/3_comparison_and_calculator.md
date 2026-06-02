# 3. Dynamic B2B Analytical Sandbox Modals

This documentation details the interactive, data-dense utilities built to engage buy-side negotiators and business leaders.

---

## 3.1 Side-by-Side Comparison Matrix (`/compare`)
The compare page (`/app/(website)/compare/page.tsx`) lets users construct custom side-by-side matrices comparing any two products in the catalog.

### Functional Features Layout
* **Category Filter Dropdown:** Limits available comparison selections to tools within the same category vertical.
* **Competitor Alpha & Beta Selectors:** Standard dropdown selectors to select and compare two platforms side-by-side.
* **Product Detail Cards:** Displays each tool's name, one-line opinion summary, category, and starting price.
* **Synthetic Metrics Comparison Grid:** High-contrast specs table comparing:
  * *Starting Monthly Subscription:* Calculates and highlights the cheaper option dynamically with a `(Cheaper)` badge.
  * *Vertical Integration Segment:* The categories of the tools.
  * *Performance Core Advantage:* Shows a verified performance stamp (`Tested Real Yield`).
* **Dynamic Review Link Intercept:** Checks the database for a published head-to-head editorial review matching this exact pairing. If found, it displays a direct link to the review page. If not found, it shows an email capture form allowing users to subscribe for notifications.

---

## 3.2 CFO ROI Cost Calculator (`/calculator`)
The Return-On-Spend Calculator (`/app/(website)/calculator/page.tsx`) is a conversion tool targeting financial decision-makers. It lets buyers calculate if software license fees translate to measurable productivity value.

### Key Calculation Controls
1. **Hours Saved Per Week (Team Avg):** Slider controller (1 to 40 hours).
2. **Average Blended Hourly Rate:** Slider controller ($15 to $150/hr).
3. **Tool Monthly Cost Per Seat:** Slider controller ($5 to $120/mo).
4. **Active Team Seats Count:** Slider controller (1 to 100 seats).

### Real-Time Math Pipeline (No Page Refresh)
The page evaluates the following math formulas on every slider input event:

* **Weekly Value Created:**  
  $$\text{Weekly Value} = \text{Hours Saved} \times \text{Hourly Rate} \times \text{Team Size}$$
* **Monthly Value Created:**  
  $$\text{Monthly Value} = \text{Weekly Value} \times 4.33$$  
  *(where 4.33 represents the average number of weeks in a month)*
* **Monthly Licensing Cost:**  
  $$\text{Monthly Cost} = \text{Seat Cost} \times \text{Team Size}$$
* **Net Monthly Profit:**  
  $$\text{Net Benefit} = \text{Monthly Value} - \text{Monthly Cost}$$
* **ROI Yield (%):**  
  $$\text{ROI (\%)} = \left(\frac{\text{Net Benefit}}{\text{Monthly Cost}}\right) \times 100$$
* **Break-Even Velocity (Days):**  
  $$\text{Payback Days} = \frac{\text{Monthly Cost}}{\text{Monthly Value} / 30}$$

### Outcome Decision Verdicts
The page displays a color-coded decision recommendation based on the net monthly profit:
* **Skip it (Net Benefit <= $0):** Red alert wrapper. The software cost exceeds estimated human timezone efficiency gains.
* **Marginal (Net Benefit < $250):** Yellow alert wrapper. Minor operational agility improvements, but margins remain tight.
* **Worth it (Net Benefit < $1,000):** Blue alert wrapper. Substantial efficiency yield. Easily justifies license invoice fees.
* **No-brainer (Net Benefit >= $1,000):** Emerald alert wrapper. Phenomenal productivity yield. Highly recommended scaling accelerator.
