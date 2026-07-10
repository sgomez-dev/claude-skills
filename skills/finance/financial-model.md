---
description: "Build a 3-year financial model skeleton (spreadsheet formulas) from inputs"
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["financial_model_*.csv", "financial_model_*.md"]
  commands: []
  network: false
  destructive: false
---

Build a 3-year (36-month) financial model skeleton from the user's business inputs: a linked set of
revenue, cost, headcount, and cash sheets expressed as spreadsheet formulas the user can paste into
Excel or Google Sheets. The deliverable is a working structure with the user's own assumptions wired
in — not a valuation and not a prediction.

Steps:

1. **Establish context and gather inputs** (`$ARGUMENTS`)
   - If not given, ask: currency, business model (SaaS, marketplace, e-commerce, services, hardware), current stage (pre-revenue vs revenue), and start month of the model
   - Collect the core drivers the user actually has: current revenue/MRR, pricing, customer counts, growth assumption, churn (if recurring), gross margin, headcount and salaries, other fixed opex, cash in bank
   - For anything missing, list it as an explicit **assumption to fill in** — put a clearly-labeled placeholder in the model, never a silently invented number

2. **Design the model structure**
   - Propose a tab layout and confirm it: `Assumptions` (every driver in one place, one cell each), `Revenue`, `Headcount & Payroll`, `Opex`, `P&L`, `Cash Flow`
   - Rule: sheets other than `Assumptions` contain only formulas referencing `Assumptions` — no hardcoded numbers, so scenarios change from one tab
   - Time axis: 36 monthly columns (Y1 monthly is essential; optionally roll Y2-Y3 up to quarters if the user prefers a smaller sheet)

3. **Build the revenue engine (model-specific)**
   - Recurring: `Customers[t] = Customers[t-1] × (1 − churn%) + New customers[t]`, `MRR[t] = Customers[t] × ARPA` (split by plan/segment if the user has more than one)
   - Transactional/e-commerce: `Revenue[t] = Orders[t] × AOV`, with orders driven by traffic × conversion or a growth rate
   - Services: `Revenue[t] = Billable people × utilization % × rate × hours`
   - Write each as a spreadsheet formula block with explicit cell references, e.g. `B5 = B4*(1-Assumptions!$B$7)+Assumptions!$B$8`, plus a one-line explanation per formula

4. **Build costs, headcount, and P&L**
   - COGS as % of revenue or per-unit cost → `Gross profit = Revenue − COGS`, `Gross margin %`
   - Headcount plan: role, start month, fully-loaded monthly cost (ask for the loading factor; suggest salary × a multiplier as a common convention, labeled approximate) → payroll ramps in the month each hire starts
   - Opex lines by category (tools, rent, marketing, legal/accounting), each either fixed, per-head, or % of revenue
   - `EBITDA = Gross profit − Payroll − Opex`; keep taxes/depreciation out unless the user asks (state that simplification)

5. **Build the cash view and sanity checks**
   - `Cash[t] = Cash[t-1] + EBITDA[t] ± working-capital timing` (if collections lag billing, ask for the lag and model it; otherwise state cash = P&L as a simplification)
   - Flag the month cash goes negative, if any — and point to `/finance--burn-runway` for scenario planning on it
   - Add 3-5 sanity checks as formulas: revenue per employee, payroll as % of revenue, growth rate consistency month over month

6. **Deliver the model**
   - Write `financial_model_[YYYY-MM].csv` — one file per sheet or a clearly sectioned single file with the 36-month grid and formulas as text
   - Write `financial_model_[YYYY-MM].md` documenting: every assumption and its source (user-provided vs placeholder), every formula with explanation, and instructions to paste into a spreadsheet
   - Show the Y1 monthly P&L summary as a markdown table in the conversation
   - Suggest next steps: `/finance--revenue-forecast` to pressure-test the revenue line, `/finance--unit-economics` if CAC/LTV drive the model

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent benchmark numbers; any cited range (e.g., payroll loading multipliers) must be labeled as an approximate rule of thumb for the user to verify
- Distinguish hard inputs (user data) from assumptions (user guesses) from placeholders (unknowns) — mark each in the Assumptions sheet
- Keep it a skeleton: resist adding complexity (deferred revenue, multi-entity, FX) unless the user's business actually needs it
- Formulas use A1-style references and note where syntax differs between Excel and Google Sheets

$ARGUMENTS
