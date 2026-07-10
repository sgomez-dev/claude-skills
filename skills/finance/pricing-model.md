---
description: "Design pricing models: tiers, value metrics, packaging, price localization"
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["pricing_*.md", "pricing_*.csv"]
  commands: []
  network: true
  destructive: false
---

Design a pricing model for a product: choose the value metric, structure tiers and packaging, set
candidate price points, and plan localization. Optionally research competitor pricing via web
search to ground the design. Output is a concrete pricing structure, not abstract theory.

Steps:

1. **Establish context** (`$ARGUMENTS`)
   - If not given, ask: currency and primary markets, business model (B2B/B2C, subscription/usage/services), target segment and typical deal size, current pricing (if any) and what problem prompted the redesign (low conversion, low expansion, mispriced value, new product)
   - Ask for whatever value evidence exists: willingness-to-pay signals, win/loss notes, usage data of the most-used features

2. **Choose the value metric**
   - Propose 2-3 candidate value metrics (e.g., seats, usage units, records, revenue processed) and score each on: correlates with customer value, easy to understand, predictable for the buyer, grows with the customer
   - Recommend one primary metric and, if appropriate, one secondary fencing metric; justify the choice against the scoring

3. **Research competitor pricing (optional, web search)**
   - If the user names competitors or wants a market scan, look up their public pricing pages: model type, tiers, price points, value metric, what fences the tiers
   - Present findings in a comparison table with the source URL and retrieval date for every price; mark anything not publicly listed as `not public` — never estimate a competitor's price
   - Skip this step entirely if the user prefers no external research

4. **Design tiers and packaging**
   - Build a good-better-best structure (2-4 tiers + optional enterprise "contact us"): for each tier define the target persona, the fenced features/limits, and the upgrade trigger (the moment a customer outgrows the tier)
   - Deliver a markdown packaging matrix: feature/limit rows × tier columns, marking which fence drives each upgrade
   - Flag anti-patterns found in the current pricing if one exists (value metric misaligned, too many tiers, best features hidden in the wrong tier)

5. **Set candidate price points and localization plan**
   - Derive price-point candidates from the evidence gathered (competitor anchors, current ARPA, stated willingness to pay) — present them as ranges to test, not as validated answers
   - Localization: propose currency-specific price presentation (local currency, charm-price rounding conventions per market), and whether to use uniform pricing or regional price bands; if regional bands are wanted, explain the purchasing-power-parity approach and ask which markets to band together rather than inventing multipliers
   - Note tax display conventions differ by market (tax-inclusive vs exclusive) — flag it, don't assume

6. **Deliver the pricing proposal**
   - Write `pricing_[product-slug]_[YYYY-MM-DD].md` containing: recommended value metric with rationale, the packaging matrix, price-point candidates per market, competitor table (if researched), migration notes for existing customers, and a validation plan (what to test with the next 10 sales conversations or an A/B test)
   - If pricing feeds a revenue plan, suggest `/finance--revenue-forecast`; for margin implications, `/finance--unit-economics`

**Notes:**
- This is financial modeling assistance, not financial/investment advice
- Never invent benchmark numbers or competitor prices — every external figure needs a source URL and date; label all rules of thumb as approximate
- Price points from this exercise are hypotheses to validate with real buyers, and say so in the deliverable
- Grandfathering/migration of existing customers is usually the riskiest part — always include migration notes when current pricing exists
- Keep the tier count low: every extra tier must earn its place with a distinct persona

$ARGUMENTS
