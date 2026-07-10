---
description: Detailed feature spec — user flows, edge cases, acceptance criteria, open questions
permissions:
  reads: ["*.md", "*.txt", "docs/**", "src/**"]
  writes: ["spec_*.md", "docs/specs/*.md"]
  commands: []
  network: false
  destructive: false
---

Expand a feature idea or PRD into an implementation-ready specification: complete user flows,
exhaustive edge cases, and testable acceptance criteria. The spec's job is to remove ambiguity —
every question an engineer would ask mid-build should already be answered or listed as open.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the feature description or PRD from the input (file path or pasted text); if a PRD exists from `/product--prd`, build on it instead of re-deriving goals
   - Scan the repo (routes, models, existing features) to ground the spec in the real system where possible
   - Ask if missing: who triggers the feature, from where (entry points), what platforms/clients, and any permission/role differences

2. **Map the user flows**
   - **Happy path**: numbered steps in the form *actor → action → system response*, from entry point to success state
   - **Alternate paths**: each meaningful branch (different role, different entry point, partial data) as its own short flow
   - For every screen/state touched, note: what the user sees, what actions are available, and where each action leads
   - Cover the non-happy states explicitly: empty, loading, error, permission-denied, and offline/timeout where relevant

3. **Hunt edge cases systematically**
   - Walk these categories and record every case that applies: boundary values (0, 1, max, overflow), concurrency (two users/tabs editing), state transitions (mid-flow cancel, back button, refresh), data quality (missing, malformed, huge, unicode), permissions (role changes mid-session), lifecycle (deleted/archived referenced objects), and idempotency (double-submit, retry)
   - Edge cases table: `| # | scenario | expected behavior | severity if wrong |`
   - If the expected behavior is a product decision no one has made, do not invent it — move it to open questions

4. **Write acceptance criteria**
   - Given/When/Then format, grouped by flow; each criterion independently verifiable by QA without reading the spec author's mind
   - Cover happy path, each alternate path, and every high-severity edge case
   - Add a short **non-functional** block only where the feature demands it: performance targets, accessibility requirements, analytics events to fire (event name + properties)

5. **Surface open questions and decisions**
   - Open questions table: `| # | question | blocks | proposed answer | decider |` — always include your proposed answer so the decision meeting starts from a default
   - Decisions-made log: choices taken while writing the spec and their rationale, so reviewers can veto instead of re-litigate

6. **Deliver the document**
   - Write `spec_[feature-slug].md` with sections: Summary, Context & Assumptions, User Flows, States, Edge Cases, Acceptance Criteria, Non-functional Requirements, Analytics, Open Questions, Decision Log
   - Show the flow summary and open-questions table in the conversation
   - Suggest `/product--user-stories` to slice the spec into sprint-sized stories

**Notes:**
- Specify behavior, not implementation — say what happens, let engineering decide how
- The edge-case hunt is the core value of this skill: aim for completeness over elegance; a boring exhaustive table beats clever prose
- Never leave "TBD" without routing it to the open-questions table with an owner
- If the feature touches existing behavior, spell out what changes for current users and what stays identical (regression contract)
- Keep flows in text/tables — they must be diffable in review; suggest a diagram only as an optional extra

$ARGUMENTS
