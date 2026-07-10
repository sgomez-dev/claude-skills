---
description: Design pricing and packaging - tiers, anchoring, and willingness-to-pay logic
permissions:
  reads: ["*.md", "*.csv", "*.txt", "*.json"]
  writes: ["pricing_*.md"]
  commands: []
  network: false
  destructive: false
---

Design or stress-test a pricing and packaging strategy for a product or service: value metric,
tier structure, price anchoring, and willingness-to-pay reasoning. Works from whatever the user
has — a product description, current price list, competitor notes, or win/loss data — and produces
a defensible pricing proposal, not a number pulled from the air.

Steps:

1. **Understand what is being priced** (`$ARGUMENTS`)
   - Extract: the offering, target segments, current pricing (if any), unit economics hints (cost
     to serve, margins), and the trigger for this exercise (launch, repricing, packaging revamp,
     losing on price)
   - If the value the customer gets is unclear, ask: "What measurable outcome does a customer buy
     this for, and what does it cost them to not have it?" — pricing logic starts there

2. **Choose the value metric**
   - Identify 2-3 candidate value metrics (per seat, per usage unit, per outcome, flat) and score
     each: | Metric | Scales with customer value? | Predictable for buyer? | Easy to meter? |
     Gaming risk? |
   - Recommend one and state the trade-off you are accepting — the value metric matters more than
     the price points

3. **Estimate willingness to pay**
   - Build a WTP rationale from available evidence: economic value delivered (10x rule: price at
     roughly 1/10 of quantified customer value), reference alternatives (what the segment pays
     today for the nearest substitute, including "do nothing" cost), and any win/loss or discount
     data the user has
   - If the user can survey customers, provide the four **Van Westendorp** questions (too cheap /
     bargain / getting expensive / too expensive) ready to send, and explain how to read the
     acceptable price range from responses
   - Mark every number as evidence-backed or assumption — never present a guess as market data

4. **Design the tier structure**
   - Default to 3 tiers (**Good-Better-Best**); justify any deviation (single plan, 4 tiers,
     usage-only)
   - For each tier: | Tier | Target segment | Fence (what gates it) | Included value | Price |
     Expected mix % |
   - Apply packaging rules: fence tiers on features that segment naturally (leaders vs. fillers vs.
     killers — never gate a killer feature everyone needs), the top tier exists partly to **anchor**
     the middle one, and each upgrade path must map to a moment the customer feels the constraint
   - Add decoy/anchor logic explicitly: which tier is the profit engine, which is the anchor,
     which is the entry wedge

5. **Pressure-test the model**
   - Simulate 3 buyer personas walking the pricing page: which tier do they pick and why; where do
     they feel cheated or confused
   - Check failure modes: cannibalization (top-tier value leaking into lower tiers), penny-gap
     (free tier too generous), bill-shock (usage metric customers can't predict), discount erosion
     (no rules → every deal is bespoke)
   - Define a discount policy: max %, what approval each level needs, what must be traded for it
     (term length, case study, prepayment)

6. **Deliver the strategy**
   - Write `pricing_[product-slug]_[YYYY-MM-DD].md` containing: recommended value metric with
     rationale, tier table, anchoring logic, WTP evidence vs. assumptions ledger, discount policy,
     migration notes for existing customers (if repricing), and 3 experiments to validate the
     riskiest assumptions
   - Show the tier table and the top 3 risks in the conversation

**Notes:**
- Pricing is positioning: the number communicates category and quality before anyone evaluates ROI
- Never fabricate competitor prices or survey results — list them as "research needed" and suggest
  the user gather them (or run `/sales--competitor-intel` if available)
- Grandfathering: when repricing, always include an existing-customer plan; churn from a botched
  migration erases repricing gains
- Adapt currency, price-point psychology (99 vs. round numbers), and tax display conventions
  (VAT-inclusive vs. exclusive) to the user's market
- Feed the result into `/sales--proposal-generator` to turn tiers into deal-specific options

$ARGUMENTS
