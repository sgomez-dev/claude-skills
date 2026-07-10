---
description: Competitive intel report covering positioning, pricing, feature matrix, gaps
permissions:
  reads: ["*.md", "*.csv", "*.txt"]
  writes: ["competitor_intel_*.md", "competitor_matrix_*.csv"]
  commands: []
  network: true
  destructive: false
---

Produce a competitive intelligence report from public sources: how each competitor positions,
what they charge, how features compare, and where the exploitable gaps are. Every claim is cited;
what isn't public is marked as unknown rather than guessed.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: your product/service and market. If competitors aren't named, ask whether to identify them or work from a given list — never assume the industry
   - Ask what decisions this intel feeds (deal support, positioning, roadmap) to calibrate depth

2. **Define the competitor set**
   - Classify into direct competitors, indirect/adjacent alternatives, and the status quo (spreadsheets, in-house, do-nothing) — the status quo is usually the biggest rival
   - Confirm the final set (3-6 for a useful report) before deep research

3. **Research each competitor** (public sources, in parallel where possible)
   - Website and messaging: headline claims, target segment, differentiators they emphasize
   - Pricing pages: model, tiers, published prices; mark unpublished pricing as `not public`
   - Product surface: docs, changelogs, release notes — recent velocity and direction
   - Market perception: public review-site pages (G2, Capterra), user forum threads; note review volume and recency
   - Momentum: job postings, funding, partnership news
   - Record a source URL and date for every data point

4. **Build the comparison assets**
   - Feature matrix: rows = capabilities that matter to your buyers, columns = you + competitors; cells: yes / partial / no / `not public`
   - Pricing table: model, entry price, mid-tier, notable terms (minimums, contracts)
   - Positioning map: one line per competitor — who they target and the claim they lead with

5. **Analyze gaps and angles**
   - Where each competitor is weak, evidenced by reviews or missing capabilities — not wishful thinking
   - Where you genuinely lose, stated honestly
   - 3-5 exploitable angles: segment, capability, or business-model gaps you can attack

6. **Deliver the report**
   - Write `competitor_intel_[YYYY-MM-DD].md` (summary, per-competitor profiles, matrices, gap analysis, sources) and optionally `competitor_matrix_[YYYY-MM-DD].csv`
   - Show the feature matrix and top 3 angles in the conversation; suggest `/sales--sales-battlecard` to weaponize this per competitor

**Notes:**
- Public, free sources only — no fake trial signups, no scraping behind logins, no pretexting
- Pricing and features change often: timestamp everything and note the report's shelf life (~1 quarter)
- Reviews are anecdotes; weigh by volume and recency, and quote representative ones with links
- Never present a gap as fact without evidence — mark speculation clearly
- Adapt deliverable language to the user's market

$ARGUMENTS
