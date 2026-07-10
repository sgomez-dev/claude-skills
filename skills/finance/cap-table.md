---
description: "Model a cap table: rounds, dilution, option pools, exit waterfall scenarios"
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["cap_table_*.csv", "cap_table_*.md"]
  commands: []
  network: false
  destructive: false
---

Model a capitalization table from the user's actual ownership data: current holdings, the effect of
new funding rounds (priced rounds, SAFEs/convertibles, option pool changes), dilution per
stakeholder, and exit waterfall scenarios showing who receives what at different sale prices. All
math is shown so the user can verify every share count.

Steps:

1. **Establish context and collect the current table** (`$ARGUMENTS`)
   - If not given, ask: currency, company stage, and the current ownership: each holder, share class (common/preferred series), share count, and the option pool (granted vs unallocated)
   - Collect any outstanding convertible instruments: SAFEs/notes with their amount, valuation cap, discount, and whether pre- or post-money
   - Accept a CSV/pasted table or build from scratch. Never guess share counts or terms — every figure comes from the user's documents

2. **Normalize and verify the current cap table**
   - Build fully-diluted view: issued shares + granted options + unallocated pool + shares reserved for convertibles (noted as not-yet-converted)
   - `Ownership % = holder shares ÷ fully-diluted total` — present both issued-only and fully-diluted percentages and explain the difference
   - Check totals: percentages sum to 100%, share counts match any totals the user provided; flag discrepancies instead of forcing them to fit

3. **Model the new round (if one is being considered)**
   - Ask for: amount raised, pre- or post-money valuation, and any option pool top-up (and whether the pool is created pre-money — the standard investor ask — or post-money)
   - Compute, showing each step: `price per share = pre-money ÷ pre-round fully-diluted shares`, `new shares = investment ÷ price per share`, pool shuffle effect, and each holder's before/after ownership
   - Convert outstanding SAFEs/notes at this round: apply cap vs discount (whichever gives the holder more shares), show the conversion price and resulting shares per instrument

4. **Show dilution clearly**
   - Per stakeholder: ownership % before → after, and the dilution driver split (new investor shares vs pool increase vs SAFE conversions)
   - Founder-focused view: combined founder % across the modeled round and, if the user wants, across a projected future round with user-supplied terms
   - If the user is choosing between term variants (e.g., pool pre vs post, cap sizes), present the variants side by side

5. **Build exit waterfall scenarios**
   - Ask for each preferred series' terms: liquidation preference multiple, participating vs non-participating, seniority stacking — mark `terms needed` where unknown
   - For 3-5 exit values the user chooses: compute per class whether preference or conversion pays more, then allocate proceeds down the stack to common and options (options net of strike where strike data is given)
   - Output a table: exit value × stakeholder → proceeds and effective % — including the crossover points where preferences stop mattering

6. **Deliver results**
   - Write `cap_table_[YYYY-MM].csv` (current, post-round, and fully-diluted views plus the waterfall grid) and `cap_table_[YYYY-MM].md` (every formula, conversion computation, and assumption)
   - Show before/after ownership and the waterfall summary as markdown tables in the conversation
   - Suggest `/finance--fundraising-deck` if the round is upcoming, and recommend the user's lawyer verify against the actual legal documents before relying on any number

**Notes:**
- This is financial modeling assistance, not financial, investment, legal, or tax advice — cap table outcomes depend on legal documents; the signed agreements govern, not this model
- Never invent valuations, preference terms, or pool sizes; anything unknown is marked `terms needed`, and any cited market convention (e.g., typical pool sizes) is labeled approximate
- Pre-money vs post-money framing changes who absorbs pool dilution — always state which was used and show both if the user is negotiating
- SAFE stacking is where cap tables silently break: convert every instrument explicitly and show the math per SAFE
- Rounding share counts can shift percentages; keep full precision internally and round only for display, stating the convention

$ARGUMENTS
