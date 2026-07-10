---
description: Write a full PRD from a feature idea — problem, goals, scope, success metrics
permissions:
  reads: ["*.md", "*.txt", "docs/**", "README*"]
  writes: ["prd_*.md", "docs/prd/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn a raw feature idea into a complete, review-ready Product Requirements Document. The PRD must
be specific enough that a designer and an engineer could start work from it, and honest about what
is unknown. Push back on vague inputs — a PRD built on an unvalidated problem is worse than none.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the feature idea from the input; if a file path is given, read it
   - Detect product context from the repo (README, docs/, package manifest) to infer the product, users, and domain
   - Ask for anything missing before writing: target user/segment, evidence the problem exists (support tickets, research, data), the business goal it serves, and any hard constraints (deadline, platform, compliance)

2. **Frame the problem, not the solution**
   - Write the problem statement as: *[user] struggles to [job] because [obstacle], causing [consequence]*
   - List the evidence provided; label each item as **validated** (data/research) or **assumed** — never silently upgrade an assumption
   - State why now: what changed that makes this worth building this cycle

3. **Define goals, non-goals, and success metrics**
   - 2-4 goals tied to user or business outcomes, each with a matching non-goal to fence scope
   - Success metrics table: `| metric | baseline | target | how measured | when reviewed |` — include one primary metric and 1-2 guardrail metrics (things that must not get worse)
   - If baselines are unknown, mark them `TBD — measure before build` rather than guessing

4. **Scope the solution**
   - Requirements grouped as **Must / Should / Won't (this release)** — each requirement one testable sentence, numbered (R1, R2…)
   - Describe the core user flow in 5-8 steps (entry point → outcome); note key states (empty, error, loading) at a high level — deep flows belong in `/product--feature-spec`
   - Call out dependencies (teams, systems, third parties) and explicit trade-offs made

5. **Risks and open questions**
   - Risks table: `| risk | likelihood | impact | mitigation |` — cover adoption, technical, and business risks
   - Open questions with a named owner-role and the decision each one blocks
   - Rough milestone sketch: discovery → design → build → beta → GA, with what "done" means at each gate

6. **Deliver the document**
   - Write `prd_[feature-slug].md` with sections: TL;DR (3 sentences), Problem, Evidence, Goals & Non-goals, Success Metrics, Users, Requirements, User Flow, Dependencies & Risks, Milestones, Open Questions
   - Show the TL;DR and success-metrics table in the conversation
   - Suggest next steps: `/product--user-stories` to break it down, `/product--feature-spec` for detailed flows, `/product--rice-prioritization` if it competes with other backlog items

**Notes:**
- One page of sharp thinking beats ten pages of boilerplate — cut any section that adds no decision-relevant information
- Every requirement must be testable; rewrite "the feature should be fast" as a measurable statement or move it to open questions
- If the input is a solution ("build a dashboard"), reverse-engineer and confirm the underlying problem first
- Keep the assumed-vs-validated labels in the final doc — reviewers need to see the confidence level
- Match the document language to the user's working language

$ARGUMENTS
