---
description: Departmental/project budget with categories, assumptions, variance tracking
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["budget_*.csv", "budget_*.md"]
  commands: []
  network: false
  destructive: false
---

Build a departmental or project budget plan from the user's inputs: a category structure, monthly
phased amounts driven by explicit assumptions, and a variance-tracking sheet with formulas so
actuals can be compared against plan every month. Works for a company department, a project, or a
whole small company.

Steps:

1. **Establish context and scope** (`$ARGUMENTS`)
   - If not given, ask: currency, what is being budgeted (department, project, whole company), the period (fiscal year, quarter, project duration), the total envelope if one is imposed top-down, and who approves changes
   - Gather what exists: last period's actuals (CSV/pasted), known commitments (contracts, salaries, subscriptions), and planned changes (hires, campaigns, purchases)
   - If prior actuals exist, use them as the baseline; if not, build zero-based from the user's stated needs — say which approach is being used

2. **Design the category structure**
   - Propose a two-level structure fitted to the scope (e.g., People → salaries, contractors, benefits; Tools & software; Marketing → paid, events, content; Facilities; Professional services; Travel; Contingency) and confirm it with the user
   - Classify each category as **committed** (contractual, hard to change), **planned** (intended, adjustable), or **discretionary** (cuttable) — this drives later variance conversations
   - Include a contingency line as an explicit percentage the user chooses (do not pick one silently)

3. **Attach an assumption to every line**
   - Each budget line gets a driver, not a bare number: headcount × cost per head, price × seats, cost per campaign × count, prior actual × growth factor
   - Write assumptions as formulas referencing an assumptions block, e.g. `Salaries[month] = heads[month] × avg fully-loaded cost` — so changing a driver reprices the budget
   - Mark unknowns as `estimate needed` with the question to answer, rather than inserting a made-up figure

4. **Phase the budget across months**
   - Spread each line over the period per its real timing: salaries ramp on hire dates, annual subscriptions hit their renewal month, campaigns hit their launch months — avoid flat twelfths unless the cost truly is flat
   - Produce the plan grid: category × month, with subtotals per group and a grand total per month and for the period
   - If the total exceeds a given envelope, present ranked options from the discretionary pool rather than shaving everything evenly

5. **Build the variance-tracking sheet**
   - Columns per category per month: `Budget`, `Actual`, `Variance = Actual − Budget`, `Variance % = Variance ÷ Budget`, plus year-to-date versions of each
   - Add a spreadsheet-formula block for the sheet (e.g., `D5 = C5-B5`, `E5 = IF(B5=0,"n/a",D5/B5)`) and a conditional rule of the user's choosing for flagging (e.g., flag lines beyond ±10% and a minimum absolute amount — thresholds are the user's call)
   - Include a short monthly review ritual: which flags to explain, when to reforecast vs hold plan

6. **Deliver results**
   - Write `budget_[scope]_[period].csv` (plan grid plus empty actuals/variance columns with formulas as text) and `budget_[scope]_[period].md` (assumptions, category classifications, review process)
   - Show the category × month summary and the biggest 5 lines as markdown tables in the conversation
   - Suggest next steps: `/finance--burn-runway` to see the budget's cash impact, `/finance--financial-model` to place it inside a full company model

**Notes:**
- This is financial planning assistance, not financial/investment advice
- Never invent cost figures or benchmark ratios; where a placeholder is unavoidable it is clearly labeled `estimate needed` with the question to resolve it
- A budget without assumptions is just a wish list — every line must trace to a driver someone can challenge
- Committed vs discretionary labeling is what makes mid-year cuts fast; keep it honest
- Variance thresholds and contingency levels are policy choices for the user, not defaults to assume

$ARGUMENTS
