# Return-On-Spend (ROI) Calculator 
**SaaSRooms Evaluation Document**

## Purpose
The ROI Calculator serves as a lead generation utility and an educational tool for our users to measure the actual efficiency yields against premium license costs for SaaS tools. It helps buyers convert abstract time savings into solid financial justification (business cases).

## Core Formulas

### 1. Monthly Value Creation
The theoretical value derived from hours saved by the software.
```math
Weekly Value = Hours Saved * Average Hourly Rate * Team Size
Monthly Value = Weekly Value * 4.33
```
*(4.33 represents the average number of weeks in a month)*

### 2. Monthly Tool Cost
The overhead added by purchasing the software.
```math
Monthly Cost = Seat Cost * Team Size
```

### 3. Net Monthly Profit
The true benefit subtracted by the cost of the tool.
```math
Net Benefit = Monthly Value - Monthly Cost
```

### 4. Estimated ROI Yield
The percentage of return over the software's initial cost.
```math
ROI (%) = (Net Benefit / Monthly Cost) * 100
```

### 5. Break-Even Velocity (Payback Period)
How many days it takes for the tool to pay for itself.
```math
Daily Value Rate = Monthly Value / 30
Payback Days = Monthly Cost / Daily Value Rate
```

## Outcome Verdicts

The calculator dynamically assigns a "Decision Verdict" based on the Net Monthly Profit to easily guide the buyer:

- **Skip it (Net Benefit <= $0):** The software cost exceeds estimated human timezone efficiency gains.
- **Marginal (Net Benefit < $250):** Minor operational agility improvements, but margins remain tight.
- **Worth it (Net Benefit < $1,000):** Substantial efficiency yield. Easily justifies license invoice fees.
- **No-brainer (Net Benefit >= $1,000):** Phenomenal productivity yield. Highly recommended scaling accelerator.
