---
description: Build a product launch plan — phases, channels, assets, owners, checklist
permissions:
  reads: ["*.md", "*.txt", "docs/**", "README*", "CHANGELOG*"]
  writes: ["launch_plan_*.md", "docs/launch/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn "we're shipping X on [date]" into a complete launch plan: phased rollout, channel plan,
asset list with owners and deadlines, and a go/no-go checklist. Right-size the machinery to the
launch tier — a tier-3 feature announcement needs a changelog entry and a tweet, not a war room —
and make every asset have exactly one owner and one due date.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read what's launching from the input; if file paths are given (PRD, spec, changelog), read them
   - Detect product context from the repo (README, docs/, CHANGELOG) to infer the product, audience, and existing channels
   - Ask for anything missing: target launch date and its flexibility, primary audience (new prospects / existing users / a segment), the launch goal with a number (signups, activation of the feature, press mentions, revenue), available channels and team (who exists: marketing? support? sales?), and any embargo/compliance constraints

2. **Classify the launch tier** — this sizes everything downstream
   - **Tier 1** (new product / major repositioning): full machinery — press, coordinated content, sales enablement, event or livestream
   - **Tier 2** (major feature for a known audience): blog + email + in-app + social, support prepped
   - **Tier 3** (improvement/iteration): changelog, in-app note, maybe a social post
   - State the tier and reasoning; if the user's ambitions exceed the tier ("we want TechCrunch for a settings redesign"), push back with what tier-1 treatment actually costs

3. **Design the phased rollout**
   - Phases with entry/exit criteria: **Internal/dogfood** (team uses it; exit: no P1 bugs, docs draft ready) → **Beta/early access** (chosen segment; exit: activation and quality bars met, testimonials collected) → **GA** (everyone; exit: launch-day metrics healthy) → **Post-launch** (week 1-4: monitor, iterate, report)
   - For each phase: audience and % exposure, duration, success bar, and the rollback trigger + mechanism (feature flag, versioned release)
   - Define launch-day monitoring: the 3-5 metrics on the dashboard, who watches them, and the threshold that triggers the rollback conversation

4. **Build the channel and asset plan**
   - Channel plan matched to tier and audience: `| channel | audience | message angle | timing (T-x/T0/T+x) | owner |` — channels may include: blog post, changelog, email announcement, in-app message, social posts, demo video, docs/help articles, press/analyst outreach, community post, sales one-pager, support macros
   - Asset list as a tracker: `| asset | channel | owner | draft due | final due | status |` — work back from T0; content assets need review buffers (draft ≥ T-10, final ≥ T-3 for a tier-1/2 launch)
   - One core message, adapted per channel: write the launch's single-sentence value statement first, then note the angle variation per channel — never let channels invent their own positioning

5. **Write the go/no-go checklist and comms**
   - Go/no-go checklist grouped by function, each item with owner and status: Product (feature complete, flags configured, rollback tested), Quality (test pass, load/perf check, accessibility pass), Docs & Support (help articles live, support briefed, macros ready), Marketing (assets final, links/UTMs verified, scheduling confirmed), Legal/Compliance (claims reviewed, terms updated if needed), Analytics (events instrumented and verified end-to-end)
   - Set the go/no-go meeting at T-2 with a named decision-maker; define what a "no-go" postpones vs. cancels
   - Day-of run sheet: timeline of who does what at which hour, plus the incident path (who to ping, where to declare)

6. **Deliver the plan**
   - Write `launch_plan_[product-slug].md` with sections: Launch summary (what/when/tier/goal), Core message, Rollout phases, Channel plan, Asset tracker, Go/no-go checklist, Day-of run sheet, Post-launch (metric review at T+7 and T+30, retro scheduled)
   - Show the phase table, asset tracker, and go/no-go checklist in the conversation
   - Suggest next steps: `/product--ab-test-design` if launch variants should be tested, `/product--okr-builder` to tie the launch goal to team KRs

**Notes:**
- Every asset and checklist item gets exactly one owner — "marketing" is not an owner; use a role if names are unknown
- The launch is a moment; adoption is a campaign — the post-launch section is mandatory, not decorative
- Work backwards from T0 for all deadlines and flag any asset whose realistic draft date is already past
- Rollback plans must be tested before GA, not designed during the incident
- If the launch date is fixed and the asset math doesn't fit, present the cut list (which channels/assets to drop) rather than pretending it all fits
- Match the document language to the user's working language

$ARGUMENTS
