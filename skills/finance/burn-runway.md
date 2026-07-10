---
description: Burn rate and runway from expenses/revenue, with best/base/worst scenarios
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["burn_runway_*.md", "burn_runway_*.csv"]
  commands: []
  network: false
  destructive: false
---

Compute burn rate and cash runway from the user's actual expense and revenue data, then run
scenario planning (base / best / worst, plus cost-cut and fundraise variants) so the user knows
the real date on the wall and which decisions move it. Works from bank/accounting exports, monthly
summaries, or a handful of headline numbers.

Steps:

1. **Establish context and locate the data** (`$ARGUMENTS`)
   - If not given, ask: currency, business model, current cash balance (and as-of date), and whether any committed inflows exist (signed contracts, approved grants, closed-but-unwired funding)
   - Identify the input: a file path (CSV/JSON of transactions or monthly P&L), pasted figures, or summary numbers. Ideal input: monthly cash in / cash out for the last 6-12 months
   - Distinguish cash accounting from accrual — runway is about cash; if the user gives accrual P&L, ask about collection timing and note the difference

2. **Compute historical burn, showing formulas**
   - Per month: `Gross burn = total cash out`, `Net burn = cash out − cash in`
   - Report last month, 3-month average, and 6-month average net burn — and say which is most representative given trend and one-off items
   - Strip or flag one-offs (annual prepayments, tax bills, one-time legal) so the recurring burn is visible; list every adjustment made

3. **Compute base-case runway**
   - `Runway (months) = current cash ÷ average net burn` — state which burn figure was used and why
   - If burn is trending (growing revenue or growing costs), project month-by-month instead of dividing by a flat average: roll cash forward with the recent revenue growth rate and known cost steps (planned hires, rent changes — ask for these)
   - Output the projected **zero-cash date**, not just a month count

4. **Build scenarios**
   - **Base**: current trajectory as computed
   - **Best**: user's optimistic revenue assumption (ask for it — do not invent one) and/or committed inflows landing
   - **Worst**: revenue flat or minus a haircut the user chooses, plus any known cost increases
   - **Lever scenarios**: cost-cut variant (ask which categories are cuttable and by how much) and a fundraise variant (amount + expected close month)
   - Present a month × scenario cash-balance table and each scenario's zero-cash date

5. **Flag decision points**
   - Fundraising lead time: with the user's estimate of how long a raise takes (commonly cited as roughly 3-6 months — approximate, varies by market and stage), mark the **last responsible month to start raising** under each scenario
   - Identify the 2-3 largest controllable expense categories and the runway gained per month if each were cut by the user's chosen amount
   - If runway under the worst case is shorter than the raise lead time, say so bluntly and first

6. **Deliver results**
   - Show the burn summary and scenario table as markdown in the conversation
   - Write `burn_runway_[YYYY-MM].csv` (monthly projection per scenario) and `burn_runway_[YYYY-MM].md` (formulas, adjustments, assumptions, decision points)
   - Suggest next steps: `/finance--budget-planner` to plan the cuts, `/finance--fundraising-deck` if raising is the path, `/finance--revenue-forecast` to firm up the revenue line

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent growth rates, haircuts, or benchmarks — every scenario input comes from the user, and any cited range (like raise lead time) is labeled approximate
- Runway math is only as good as the cash number: confirm whether the balance includes credit lines, deposits held, or restricted cash
- Seasonality breaks flat averages — if the data shows it, project with seasonal months, not a mean
- Refuse false precision: report runway to the month, not the day

$ARGUMENTS
