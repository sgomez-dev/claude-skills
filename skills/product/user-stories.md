---
description: Break an epic or feature into INVEST user stories with acceptance criteria
permissions:
  reads: ["*.md", "*.txt", "docs/**"]
  writes: ["stories_*.md"]
  commands: []
  network: false
  destructive: false
---

Slice an epic, feature, or PRD into user stories that satisfy INVEST (Independent, Negotiable,
Valuable, Estimable, Small, Testable), each with acceptance criteria a developer can implement
against. Good slicing is vertical — every story ships observable user value, never a bare layer
like "build the API".

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the epic/feature from the input; if it's a file path (PRD from `/product--prd`, spec from `/product--feature-spec`), read it and reuse its scope decisions
   - Identify the user roles/personas involved; if the input never says who the user is, ask before writing a single story
   - Ask if missing: what the smallest releasable version looks like, and any sequencing constraints (dependencies, migrations)

2. **Slice the epic**
   - Apply slicing patterns in this order of preference, choosing whichever yields the thinnest valuable slices:
     **workflow steps** (each step of the journey) → **operations** (create/view/edit/delete separately) → **business-rule variations** (simple rule first, complex rules later) → **data variations** (one input type first) → **happy path first, edge handling later**
   - Never slice horizontally (UI story + backend story for the same behavior); merge those into one vertical story
   - Target stories a team could finish in 1-3 days; if a slice is bigger, slice again and say which pattern you used

3. **Write each story**
   - Format per story:
     ```
     ### S3 — [short title]
     As a [role], I want [capability], so that [benefit].
     Acceptance criteria:
     - Given [context], when [action], then [outcome]
     - ...
     Notes: [constraints, out of scope for this story]
     Depends on: [story ids or —]
     ```
   - 2-5 acceptance criteria per story; each testable and free of implementation detail
   - The *so that* clause must state real user/business value — if you can't write one, the story is probably a task; fold it into the story it serves

4. **Run the INVEST check**
   - Audit every story against all six letters; fix violations by re-slicing, merging, or rewording
   - Flag unavoidable violations explicitly (e.g., "S4 depends on S2 — sequencing constraint from data model")

5. **Order and package**
   - Sequence stories into a build order: walking skeleton / smallest end-to-end slice first, then value-descending
   - Mark the **MVP cut line** — the minimal set that is releasable
   - Summary table: `| id | title | role | value | depends on | MVP? |`

6. **Deliver the document**
   - Write `stories_[epic-slug].md` with: Epic summary, Assumptions, Story map (summary table), full story blocks, Out of scope
   - Show the summary table in the conversation and call out the MVP cut line
   - Suggest `/product--rice-prioritization` if stories from multiple epics compete, or `/product--ab-test-design` if a story's value is a hypothesis worth testing

**Notes:**
- Acceptance criteria describe behavior, not UI pixels — "the user sees an error explaining X", not "a red toast appears top-right"
- Resist the setup story ("as a developer, I want a database schema…") — infrastructure rides inside the first story that needs it
- 5-12 stories per epic is the sweet spot; 30+ means the epic should be split before slicing
- Keep story ids stable (S1, S2…) so later documents can reference them
- Match the document language to the user's working language

$ARGUMENTS
