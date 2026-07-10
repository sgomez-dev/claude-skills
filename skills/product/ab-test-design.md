---
description: Design an A/B test — hypothesis, metrics, sample size, guardrails, analysis
permissions:
  reads: ["*.md", "*.txt", "*.csv", "docs/**", "README*"]
  writes: ["abtest_*.md", "docs/experiments/*.md"]
  commands: []
  network: false
  destructive: false
---

Design a rigorous A/B test that will produce a trustworthy decision, not a p-value to argue about.
Everything is committed before launch — hypothesis, primary metric, sample size, run length,
guardrails, and the exact decision rule — so the analysis can't be bent to fit the result. If the
test isn't worth running (effect too small to detect, traffic too thin), say so and propose an
alternative.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the proposed change from the input; if a file path is given (PRD, spec, mockup notes), read it
   - Detect product context from the repo (README, docs/, analytics config) to infer the product and available instrumentation
   - Ask for anything missing: current baseline of the metric to move (rate and weekly eligible traffic/users), the smallest effect worth acting on (MDE), the unit of randomization (user/session/account), and any constraints (seasonality, concurrent experiments, novelty-sensitive surface)

2. **Write the hypothesis and variants**
   - Hypothesis format: *Because we observed [evidence], we believe [change] for [segment] will cause [outcome], measured by [metric] moving from [baseline] to [target]. We'll know we're wrong if [disconfirming signal].*
   - Describe control and treatment(s) precisely — screenshots/copy where relevant; one conceptual change per test, or explicitly a multi-arm design
   - State the causal mechanism in one sentence; if the team can't articulate *why* the change should work, flag the test as a shot in the dark

3. **Define the metric plan**
   - **Primary metric** (exactly one): the decision metric, with its exact definition (numerator, denominator, attribution window)
   - **Secondary metrics** (2-4): mechanism checks that explain *how* the primary moved
   - **Guardrails** (2-4): must-not-degrade metrics (revenue, latency, churn, support contacts) each with a pre-set tolerable degradation threshold and the action if breached (stop vs. investigate)
   - Table: `| metric | role | definition | baseline | expected direction | threshold |`

4. **Compute sample size and run length**
   - Standard parameters unless told otherwise: α = 0.05 two-sided, power = 0.80
   - For a proportion metric use n per arm ≈ 16 × p(1−p) / MDE² (absolute MDE); show the arithmetic with the user's numbers, plus a sensitivity row for MDE ±50%
   - Convert to run time: n per arm ÷ weekly eligible traffic per arm, rounded up to whole weeks (minimum 1-2 full business cycles to absorb day-of-week effects)
   - If the required run exceeds ~6-8 weeks, say the test is impractical and offer options: larger MDE, more sensitive proxy metric, coarser randomization, or skip the test and ship behind a monitored rollout

5. **Write the analysis and decision plan**
   - Decision rule committed up front: *ship if primary improves with p < 0.05 and no guardrail breaches; don't ship if …; extend/iterate if …* — cover all three outcomes
   - Pre-registered segments only (2-3 max, e.g., new vs. returning); anything else is labeled exploratory and cannot ship a decision
   - Validity checks to run before reading results: sample-ratio mismatch (chi-square on assignment counts), pre-experiment A/A comparison of arms, novelty check (first-week vs. later-weeks effect)
   - Explicitly ban: peeking with intent to stop early (unless a sequential design is set up), switching the primary metric after launch, and slicing until significance appears

6. **Deliver the test plan**
   - Write `abtest_[change-slug].md` with sections: Hypothesis, Variants, Metric plan, Sample size & duration (with arithmetic), Randomization & exposure, Guardrails & stop conditions, Analysis plan & decision rule, Risks, Rollout plan after decision
   - Show the hypothesis, the metric table, and the sample-size math in the conversation
   - Suggest next steps: `/product--okr-builder` to link the metric to a KR, `/product--feature-spec` if the treatment needs detailed spec work

**Notes:**
- One primary metric, decided before launch — everything else is supporting evidence
- Statistical significance is not business significance: a detectable 0.1% lift may not be worth the engineering cost; state the break-even effect
- Randomize at the unit where interference is lowest (users who share accounts → randomize accounts)
- Log the experiment plan before launch (this doc is the pre-registration); post-hoc rationalization is the failure mode this skill exists to prevent
- If traffic is too low for any reasonable test, recommend alternatives honestly: painted-door, user interviews (`/product--user-interview-guide`), or a before/after with explicit caveats
- Match the document language to the user's working language

$ARGUMENTS
