---
description: Compute SaaS metrics from revenue data: MRR, ARR, churn, NRR, LTV, CAC
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["saas_metrics_*.md", "saas_metrics_*.csv"]
  commands: []
  network: false
  destructive: false
---

Compute the core SaaS metrics from the user's own revenue/subscription data, show every formula
used, and interpret the results in plain language. Works from raw subscription exports (customer ×
month), invoice lists, or already-aggregated numbers — detect which one applies from the input.

Steps:

1. **Establish context and locate the data** (`$ARGUMENTS`)
   - If not given, ask: currency, business model (B2B/B2C), billing mix (monthly/annual/multi-year), and sales motion (self-serve vs sales-led) — these change how metrics should be read
   - Identify the input: a file path (CSV/JSON), pasted data, or summary figures. If nothing usable is provided, describe the ideal input: one row per customer per month with `customer_id, month, mrr` (plus `start_date, end_date, plan` if available)

2. **Normalize into a customer-month MRR matrix**
   - Convert annual/multi-year contract values to MRR (contract value ÷ contract months); exclude one-time fees, setup charges, and usage overages unless recurring
   - Handle mid-month starts/cancellations consistently (state the convention chosen, e.g., full month recognized)
   - List every normalization decision made so the user can correct it

3. **Compute the movement metrics, showing formulas**
   For each month: `New MRR`, `Expansion MRR`, `Contraction MRR`, `Churned MRR`, `Ending MRR = Starting + New + Expansion − Contraction − Churned`, and:
   - `ARR = Ending MRR × 12`
   - `Gross revenue churn % = Churned MRR ÷ Starting MRR`
   - `NRR % = (Starting + Expansion − Contraction − Churned) ÷ Starting MRR` (existing customers only — exclude New MRR)
   - `Logo churn % = customers lost ÷ starting customers`, `ARPA = Ending MRR ÷ active customers`

4. **Compute customer economics (if cost data is available)**
   - Ask for gross margin % and monthly sales & marketing spend; if unknown, mark those metrics `data needed` — never estimate them silently
   - `LTV = ARPA × gross margin % ÷ monthly revenue churn %` (state this assumes constant churn — a strong simplification)
   - `CAC = S&M spend in period ÷ new customers acquired in period`, `CAC payback (months) = CAC ÷ (ARPA × gross margin %)`
   - For deeper analysis with sensitivity tables, point the user to `/finance--unit-economics`

5. **Interpret and flag issues**
   - Comment on trend direction (MRR growth rate, churn trajectory, NRR above/below 100%), not just point values
   - If the data allows, add a simple cohort retention view (MRR retained by signup month)
   - Flag data-quality problems found: gaps, duplicate customers, negative MRR, currency mixing

6. **Deliver results**
   - Show a markdown table: month × (Starting MRR, New, Expansion, Contraction, Churned, Ending MRR, ARR, Gross churn %, NRR %)
   - Write `saas_metrics_[YYYY-MM].csv` with the full monthly series and `saas_metrics_[YYYY-MM].md` with formulas used, assumptions, and interpretation
   - Suggest the natural next step (e.g., `/finance--revenue-forecast` to project forward, `/finance--burn-runway` if cash is the concern)

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent benchmark numbers. If the user asks "is this good?", give directional guidance and clearly label any cited ranges as approximate industry rules of thumb (e.g., "NRR above ~100% is commonly considered healthy for B2B SaaS — approximate, varies by segment and stage")
- If key inputs are missing, output `data needed` for the affected metric rather than guessing
- State every assumption (proration, currency, month convention) explicitly in the output
- Small datasets (<10 customers) make churn percentages noisy — say so and prefer absolute counts

$ARGUMENTS
