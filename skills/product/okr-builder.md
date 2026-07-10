---
description: Draft objectives and measurable key results from strategy and goals
permissions:
  reads: ["*.md", "*.txt", "*.csv", "docs/**", "README*"]
  writes: ["okrs_*.md", "docs/okrs/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn strategy statements and fuzzy goals into OKRs that actually steer work: inspiring, qualitative
objectives paired with key results that are measurable, baseline-anchored, and outcome-shaped. The
enemy is the task list disguised as OKRs — "ship feature X" is a milestone, not a key result — so
rewrite outputs into outcomes relentlessly.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the strategy/goals from the input; if file paths are given (strategy doc, roadmap, last quarter's OKRs), read them
   - Detect product context from the repo (README, docs/) to infer the product and stage
   - Ask for anything missing: the OKR period (quarter/half), the level (company/product/team), current baselines for candidate metrics (or confirm they're unknown), last period's OKRs and their scores if any, and team capacity

2. **Distill objectives** (2-4, no more)
   - Each objective: qualitative, memorable, outcome-oriented, achievable in the period — *"Make onboarding so smooth new users reach value in their first session"*, not *"Improve onboarding"* and not *"Increase activation by 20%"* (that's a KR)
   - For each objective state the strategic goal it serves and the one-line **why now**
   - Reject or park goals that are business-as-usual operations ("keep the site up") — OKRs are for change, not maintenance; note parked items explicitly

3. **Draft key results** (2-4 per objective)
   - Format each as: *from [baseline] to [target] by [period end], measured by [source/instrument]*
   - Table per objective: `| KR | baseline | target | how measured | owner-role | confidence (0-1) |`
   - Mix leading and lagging indicators — at least one KR per objective should move within weeks, not only at period end
   - Where baselines are unknown, the first KR becomes *"establish baseline for X by [date]"* — never invent a target off an unknown baseline
   - Add 1-2 **guardrail metrics** per objective: things that must not degrade while chasing the targets (e.g., churn while pushing signups)

4. **Stress-test the set**
   - The output-smell check: for every KR ask "could we hit this by shipping nothing users notice?" and "could we ship everything planned and still miss it?" — a good outcome KR answers no/yes
   - Sandbagging/moonshot check: targets should land around 70% expected achievement; flag any KR that is either a sure thing or requires a miracle, and label committed vs. aspirational
   - Ownership and collision check: every KR has exactly one owner-role; no two teams' KRs pull the same metric in opposite directions
   - Count check: more than ~10 KRs total means nothing is a priority — force cuts

5. **Deliver the OKRs**
   - Write `okrs_[team-slug]_[period].md` with sections: Strategy context (3 sentences), Objectives with KR tables, Guardrails, Explicitly not a priority this period, Scoring & check-in cadence (weekly confidence updates, mid-period review, end-of-period scoring rubric: 0.0-0.3 missed / 0.4-0.6 progress / 0.7-1.0 hit)
   - Show the full objective + KR summary table in the conversation
   - Suggest next steps: `/product--roadmap` to sequence the work behind each objective, `/product--ab-test-design` for KRs that experiments will move

**Notes:**
- KRs measure outcomes; the roadmap lists outputs — keep initiatives in a separate "bets we think will move this KR" list under each objective, never inside the KR itself
- Baselines are non-negotiable: a target without a baseline is a vibe
- Health-of-business metrics (uptime, support SLA) belong in guardrails or dashboards, not KRs
- If the input goals are pure output ("launch v2"), reverse-engineer the outcome the launch is supposed to cause and confirm it with the user
- Match the document language to the user's working language

$ARGUMENTS
