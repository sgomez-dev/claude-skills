---
description: Build a now/next/later product roadmap from goals, backlog, and constraints
permissions:
  reads: ["*.md", "*.csv", "*.txt", "docs/**", "README*"]
  writes: ["roadmap_*.md", "docs/roadmap/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn a pile of goals and backlog items into a now/next/later roadmap that communicates strategy,
not just a list of features with dates. A roadmap is a statement of bets and their reasoning —
every item must trace to a goal, and everything that didn't make the cut must be visible too.

Steps:

1. **Gather inputs** (`$ARGUMENTS`)
   - Read goals and backlog from the input; if file paths are given (backlog CSV, strategy doc, PRDs), read them
   - Detect product context from the repo (README, docs/, existing roadmaps or PRDs) to infer the product, stage, and audience
   - Ask for anything missing: the 1-3 strategic goals for the period, planning horizon (quarter/half/year), team capacity (rough headcount or "small/medium/large" per item), and hard commitments (contracts, compliance deadlines, promised dates)

2. **Normalize the backlog**
   - Convert every item into one row: `| item | problem it solves | goal it serves | size (S/M/L/XL) | confidence (high/med/low) | source |`
   - Flag items that serve no stated goal — they go to a **parking lot**, not silently into the roadmap
   - Merge duplicates and split anything larger than XL into shippable slices
   - If items lack effort/impact data and there are more than ~10 contenders, suggest running `/product--rice-prioritization` first and use its output as input here

3. **Assign horizons with explicit rules**
   - **Now** (committed, in flight or next up): high confidence, validated problem, fits capacity — max 3-5 items; each gets an owner-role and a target outcome, not just a ship date
   - **Next** (planned, sequenced but not started): direction is decided, details aren't — 4-8 items with the open question each must answer before promotion to Now
   - **Later** (directional bets): themes rather than features — describe the problem area, not the solution
   - Apply capacity as a hard constraint: sum of Now sizes must fit the team; show the math

4. **Stress-test the draft**
   - Check goal coverage: every strategic goal has at least one Now or Next item; every item maps to exactly one primary goal
   - Check dependency order: no Now item depends on a Next/Later item; call out cross-team dependencies with the team named
   - List the top 3 items that were **cut or deferred and why** — this is the most-read section by stakeholders
   - Identify the riskiest assumption per Now item and how it will be validated (or state that it's a leap of faith)

5. **Deliver the roadmap**
   - Write `roadmap_[product-slug]_[period].md` with sections: Strategy summary (3 sentences), Goals, Now / Next / Later (each item: problem, goal served, outcome target, size, confidence, owner-role, key risk), Explicitly not doing, Parking lot, Assumptions & review cadence
   - Show the Now/Next/Later table in the conversation: `| horizon | item | goal | outcome target | size | confidence |`
   - Suggest next steps: `/product--prd` for the first Now item without one, `/product--okr-builder` if goals lack measurable targets

**Notes:**
- No dates on Next/Later — horizons communicate sequence and confidence, not commitments; only Now items may carry a target window, and only if the user insists
- Outcomes over outputs: "reduce onboarding drop-off" beats "build onboarding wizard" — rewrite feature-named items as the problem they solve where possible
- A roadmap with 15 Now items is a backlog wearing a costume — push back and force cuts
- State the review cadence (e.g., monthly re-triage) in the doc; a roadmap without a revisit date rots
- Match the document language to the user's working language

$ARGUMENTS
