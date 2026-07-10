---
description: Qualify and tier leads with BANT, MEDDIC, or CHAMP scoring plus next actions
permissions:
  reads: ["*.csv", "*.json", "*.md", "*.txt"]
  writes: ["qualified_*.csv", "qualified_*.md"]
  commands: []
  network: false
  destructive: false
---

Score and qualify leads or open opportunities against a structured sales framework (BANT, MEDDIC,
or CHAMP), tier them, and produce one concrete next action per lead. Works from a CSV/list of
leads, pasted call notes, or a single deal description — qualification uses only the evidence you
provide, nothing is fetched or guessed.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Accept a file path (CSV/JSON/markdown), a pasted list, or free-form notes about one or more leads/deals
   - If input is missing or thin, ask for: what you sell, your sales motion (self-serve, transactional, enterprise), and the lead data or notes to qualify — never assume the industry

2. **Pick the framework**
   - Recommend by motion: **BANT** (Budget, Authority, Need, Timeline) for transactional/high-velocity; **MEDDIC** (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion) for enterprise/complex; **CHAMP** (Challenges, Authority, Money, Prioritization) for consultative/inbound
   - Confirm the choice with the user, or use the one they named

3. **Build the scoring rubric**
   - For each framework dimension, define what 0 / 5 / 10 points look like, tailored to the user's product and motion; show the rubric as a markdown table and confirm
   - Apply hard caps for known deal-killers (e.g., no path to the economic buyer → cap at tier C), based on rules the user confirms

4. **Score each lead**
   - Score every dimension strictly from evidence present in the input; where evidence is absent mark the dimension `unknown` and score it 0 — an unknown is a gap to fill, never a guess
   - Compute a normalized total (0-100), then tier: **A** (≥70, pursue now), **B** (40-69, develop), **C** (<40, nurture or disqualify)

5. **Assign next actions**
   - Per lead: the single highest-leverage next step, targeting the weakest scored dimension (e.g., MEDDIC "no champion" → "identify and test a champion on the next call")
   - For every `unknown`, write the exact discovery question that would resolve it — these feed directly into `/sales--discovery-prep`

6. **Deliver results**
   - Write `qualified_leads_[YYYY-MM-DD].csv` preserving all original columns and appending: framework, per-dimension scores, total_score, tier, gaps, next_action
   - For a single deal, output a one-page markdown scorecard instead
   - Show a summary: tier distribution, top 5 A-tier leads with reasons, and leads recommended for disqualification and why

**Notes:**
- Evidence-only qualification: never infer budget, authority, or timeline that isn't stated in the input
- Disqualifying fast is a win — call out leads to drop; don't inflate scores to be polite
- Re-run after each significant call to track dimension movement over time
- For A/B deals already in pipeline, follow up with `/sales--deal-risk-analyzer`
- Adapt deliverable language to the user's market

$ARGUMENTS
