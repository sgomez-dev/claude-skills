---
description: Forecast revenue from pipeline and historicals: bottoms-up build with scenarios
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["revenue_forecast_*.csv", "revenue_forecast_*.md"]
  commands: []
  network: false
  destructive: false
---

Build a revenue forecast from the user's own pipeline and/or historical data using a bottoms-up
method (deals × probability × timing, or cohorts × retention — never a bare growth-rate guess),
then wrap it in base/best/worst scenarios with every driver exposed so the forecast can be
challenged line by line.

Steps:

1. **Establish context and locate the data** (`$ARGUMENTS`)
   - If not given, ask: currency, business model (recurring vs transactional vs services), sales motion (sales-led pipeline vs self-serve funnel), forecast horizon (quarter, year), and what the forecast is for (board, budget, fundraise — the required conservatism differs)
   - Identify inputs: a pipeline export (deal, stage, amount, expected close date), historical revenue by month, funnel metrics (traffic → signup → paid), or a mix
   - Compute forward from what exists; mark what is missing as `data needed` rather than assuming it

2. **Build the existing-revenue baseline (recurring models)**
   - Project current MRR forward with the user's observed churn and expansion rates (from `/finance--saas-metrics` if they have run it): `Existing MRR[t] = MRR[t-1] × (1 − churn% + expansion%)`
   - This baseline is the floor of the forecast — separate it visually from new business, which carries all the uncertainty
   - For transactional models, use repeat-purchase cohorts as the baseline instead

3. **Build the new-business layer, bottoms-up**
   - **Pipeline-driven**: per deal, `weighted value = amount × stage probability` — derive stage probabilities from the user's historical win rates by stage if available; if not, ask the user for their estimates and label them as such. Respect close dates; apply a slip factor only if historical slippage data supports one
   - **Funnel-driven**: `new customers[t] = traffic[t] × conversion% × activation%`, each rate taken from the user's recent actuals, with the traffic plan stated as an explicit assumption
   - **Historical-only fallback**: fit a simple trend (recent monthly growth, seasonality if visible) and be explicit that this is extrapolation, weaker than a driver-based build

4. **Cross-check top-down**
   - Compare the bottoms-up total against a naive extrapolation of the historical trend; if they diverge by more than ~20%, identify which driver causes it and present the tension to the user instead of silently averaging
   - Sanity-check capacity: does the forecast imply more deals closed per rep, or more onboarding, than the team has ever done? Flag it if so

5. **Build scenarios**
   - **Base**: drivers as derived from data
   - **Best / Worst**: move only the genuinely uncertain drivers (win rate, new pipeline creation, churn) by amounts the user chooses — not a flat ±X% on the total
   - Present month × scenario as a table, plus the cumulative gap between scenarios at the horizon
   - State each scenario's key assumption in one line so a reader can dispute it

6. **Deliver results**
   - Show the forecast table (month × existing / new / total per scenario) in the conversation
   - Write `revenue_forecast_[YYYY-MM].csv` (full monthly grid, driver columns included) and `revenue_forecast_[YYYY-MM].md` (method, drivers, assumptions, cross-check result, scenario logic)
   - Suggest next steps: `/finance--burn-runway` to convert the forecast into cash impact, `/finance--financial-model` to embed it in the full model, and a monthly re-forecast ritual comparing actuals to the base case

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent conversion rates, win rates, or growth rates — every driver comes from the user's data or is explicitly labeled a user-provided estimate; any cited range is approximate
- A forecast's value is its exposed drivers: someone must be able to say "I don't believe row 3" — bare growth percentages hide the argument
- Weighted pipeline systematically overstates near-term revenue when stage probabilities are optimistic; historical win rates beat gut-feel probabilities
- Short histories (<6 months) make trend fitting unreliable — say so and lean on the driver-based build

$ARGUMENTS
