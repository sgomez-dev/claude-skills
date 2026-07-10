---
description: Deep teardown of a competitor product — onboarding, features, pricing, UX
permissions:
  reads: ["*.md", "*.txt", "docs/**", "README*"]
  writes: ["teardown_*.md", "docs/competitive/*.md"]
  commands: []
  network: true
  destructive: false
---

Research a competitor product in depth using public sources — their site, docs, pricing page,
changelog, reviews, comparison posts — and produce a teardown that answers the only question that
matters: what should *we* do differently because of what they do? Every claim carries a source and
a date; competitive intel goes stale fast and unsourced claims poison decisions.

Steps:

1. **Frame the teardown** (`$ARGUMENTS`)
   - Read the competitor name/URL from the input; detect your own product context from the repo (README, docs/) to know what to compare against
   - Ask for anything missing: which competitor (if ambiguous), the decision this teardown feeds (pricing move? feature gap? positioning?), and the 2-4 dimensions that matter most (onboarding, a specific feature area, pricing, enterprise readiness…)
   - Confirm the comparison lens: "us vs. them for [segment]" — a teardown without a lens becomes a feature inventory nobody reads

2. **Research broadly via web search** (parallel angles; use subagents if available)
   - **First-party**: homepage and positioning copy, pricing page (capture tiers, limits, and what's gated), docs/help center (reveals real capabilities and rough edges), changelog/release notes (velocity and current focus), status page, careers page (what they're investing in)
   - **Third-party**: G2/Capterra/app-store reviews (sort themes in praise vs. complaints), comparison articles, Reddit/HN/community threads, recent news and funding
   - **Motion**: how do you buy it — self-serve trial, freemium, demo-gated? What does the signup flow promise?
   - Record every fact with `(source, accessed YYYY-MM-DD)`; mark anything inferred rather than observed as **inference**

3. **Tear down each dimension**
   - **Onboarding**: reconstruct the first-run journey from docs, product tours, and review comments — steps from signup to first value, where friction is reported, time-to-value; note what they gate before showing value
   - **Features**: capability map for the chosen areas — `| capability | them | us | gap (they lead / we lead / parity) | evidence |`; depth beats breadth — pick the 10-15 capabilities buyers actually compare
   - **Pricing & packaging**: tier table with prices, seat/usage model, feature gates per tier, free-tier limits, and the implied ideal customer of each tier; estimate the price a comparable customer pays with us vs. them
   - **UX & positioning**: their core message in one sentence, who they aim at, recurring UX praise/complaints from reviews (with counts, e.g., "12 of 40 recent reviews mention slow search")

4. **Synthesize strengths, weaknesses, and trajectory**
   - Top 3-5 strengths (what genuinely works and why customers choose them — steelman, don't strawman) and top 3-5 weaknesses (with review evidence, not wishful thinking)
   - Trajectory read from changelog + careers + news: what are they building toward in the next 6-12 months?
   - **Where we win / where we lose** table for the chosen segment, each row citing evidence

5. **Deliver the teardown**
   - Write `teardown_[competitor-slug]_[YYYY-MM-DD].md` with sections: TL;DR (5 lines), Company snapshot, Positioning & target customer, Onboarding teardown, Feature comparison table, Pricing & packaging table, UX & review themes, Strengths / Weaknesses, Trajectory, So-what: 3-5 recommended actions for us (each tied to the decision from step 1), Sources
   - Show the TL;DR, the feature-gap table, and the recommended actions in the conversation
   - Suggest next steps: `/product--rice-prioritization` if the gaps become backlog candidates, `/product--roadmap` to slot responses in

**Notes:**
- Public sources only — no logging into their product with fake accounts, no scraping behind logins, respect robots.txt; if hands-on trial data would materially change conclusions, say so and let the user do the trial
- Date everything: pricing and features change quarterly; a teardown older than one quarter is a hypothesis, not a fact base
- Review-mining discipline: weight recent reviews, count themes rather than cherry-picking quotes, and note the reviewer segment (SMB complaints may not apply to enterprise)
- Avoid feature-checklist envy: the "so what" section must recommend actions, including the valid option "ignore them here — it's not our segment"
- Match the document language to the user's working language

$ARGUMENTS
