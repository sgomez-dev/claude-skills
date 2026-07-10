---
description: "Unit economics: contribution margin, CAC payback, LTV:CAC with sensitivity"
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["unit_economics_*.md", "unit_economics_*.csv"]
  commands: []
  network: false
  destructive: false
---

Calculate per-unit economics from the user's own numbers — contribution margin, CAC, payback
period, and LTV:CAC — showing every formula, then stress-test the results with sensitivity tables
so the user sees which lever matters most. Works for any business with a definable "unit"
(customer, order, seat, transaction, project).

Steps:

1. **Establish context and define the unit** (`$ARGUMENTS`)
   - If not given, ask: currency, business model (subscription, transactional, services, marketplace), and what the natural unit is — one customer, one order, one active seat
   - Gather inputs: average revenue per unit (per month or per transaction), variable costs per unit (COGS, payment fees, support, hosting, delivery), sales & marketing spend, new units acquired in the same period, and retention/churn or repeat-purchase rate
   - Mark anything missing as `data needed` — compute what is computable and never fill gaps with invented figures

2. **Compute contribution margin, showing formulas**
   - `Contribution per unit = Revenue per unit − Variable costs per unit`, `Contribution margin % = Contribution ÷ Revenue`
   - Be strict about variable vs fixed: only costs that scale with the unit go in (state each classification decision so the user can correct it)
   - If margin differs by segment/plan/channel, compute per segment — a blended number can hide a money-losing segment

3. **Compute CAC and payback**
   - `CAC = Sales & marketing spend in period ÷ new units acquired in same period` (note the mismatch risk if spend and acquisitions have a lag; offer a shifted-period variant if the user has monthly data)
   - `CAC payback (months) = CAC ÷ monthly contribution per unit` — for transactional models, express payback in number of orders instead
   - Split fully-loaded CAC (including sales salaries) vs paid-media-only CAC if the data allows, and label which is which

4. **Compute LTV and the LTV:CAC ratio**
   - Subscription: `LTV = monthly contribution per unit ÷ monthly churn rate` — state clearly this assumes constant churn forever, which flatters early-stage numbers; offer a capped variant (e.g., contribution × 24 or 36 months) as a conservative cross-check
   - Transactional: `LTV = contribution per order × expected orders per customer` (derive expected orders from repeat-rate data, or mark `data needed`)
   - `LTV:CAC = LTV ÷ CAC` — report it alongside payback; a good-looking ratio with a multi-year payback is still a cash problem

5. **Build sensitivity tables**
   - Two-way tables (markdown grid) around the base case: LTV:CAC across churn × ARPA, and payback across CAC × contribution margin — use ±10-30% steps around the user's actual values
   - Identify the dominant lever: which single-variable 10% improvement moves LTV:CAC or payback most
   - Flag breakpoints: the churn or CAC value at which the unit stops paying back within the user's cash horizon

6. **Deliver results**
   - Show base-case metrics with formulas, then the sensitivity tables, then a plain-language reading of which lever to work on
   - Write `unit_economics_[YYYY-MM].md` (formulas, assumptions, tables, interpretation) and `unit_economics_[YYYY-MM].csv` with the sensitivity grids
   - Suggest next steps: `/finance--saas-metrics` for the full recurring-revenue picture, `/finance--pricing-model` if ARPA is the lever, `/finance--burn-runway` if payback is the concern

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent benchmarks. If asked "is 3:1 good?", explain that commonly cited thresholds (e.g., LTV:CAC above ~3, payback under ~12 months for SaaS) are approximate rules of thumb that vary widely by model, margin structure, and stage
- The constant-churn LTV formula is the most abused number in startup finance — always show the conservative capped variant next to it
- Small samples make churn and repeat rates noisy; below ~30 units, prefer cohort counts over ratios and say so
- State every assumption (period alignment, cost classifications, churn basis) explicitly in the output

$ARGUMENTS
