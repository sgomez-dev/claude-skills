---
description: Score a backlog with RICE and return a ranked, tiered priority list
permissions:
  reads: ["*.csv", "*.md", "*.txt", "*.json"]
  writes: ["rice_*.md", "rice_*.csv"]
  commands: []
  network: false
  destructive: false
---

Score a list of features, ideas, or backlog items with the RICE framework (Reach × Impact ×
Confidence ÷ Effort) and deliver a ranked list with every score justified. The value is not the
arithmetic — it is forcing explicit, comparable assumptions that stakeholders can then argue about.

Steps:

1. **Gather the backlog and context** (`$ARGUMENTS`)
   - Read items from the input: a pasted list, a CSV/markdown file path, or free text; preserve any ids/links the source has
   - Ask if missing: the scoring period for Reach (default: per quarter), the goal Impact is measured against (revenue, retention, activation…), and team size for Effort calibration
   - If an item is too vague to score ("improve onboarding"), ask for one clarifying sentence or score it with Confidence capped at 50%

2. **Fix the scoring rubric** (state it in the output so scores are auditable)
   - **Reach**: users/events affected per period — a real number, not a feeling; note the estimation basis for each item
   - **Impact** per affected user: `3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal`
   - **Confidence**: `100% = data-backed, 80% = some evidence, 50% = educated guess` — nothing between or above; below 50% means "do discovery first, don't score"
   - **Effort**: person-months, minimum 0.25; total across all disciplines, not just engineering

3. **Score every item**
   - RICE = (Reach × Impact × Confidence) ÷ Effort
   - Each factor gets a one-line justification citing the evidence or assumption used
   - Keep estimation honest: when torn between two values, take the lower Impact/Confidence and the higher Effort

4. **Rank and tier**
   - Sort by RICE descending; tier the list: **Now** (top scores, fits next cycle's capacity), **Next**, **Later/Won't**
   - Flag interesting patterns: high-impact-low-confidence items (research candidates), low-effort quick wins, and any item whose rank contradicts known stakeholder expectations — call the contradiction out explicitly
   - Run a quick sensitivity check on the top 5: would a one-step change in Impact or Confidence reorder them? Mark unstable rankings

5. **Deliver results**
   - Write `rice_[context-slug]_[YYYY-MM-DD].md` containing the rubric, the full scored table, and per-item justifications
     - Table: `| rank | item | reach | impact | confidence | effort | RICE | tier | key assumption |`
   - If the input was a CSV, also write `rice_[context-slug].csv` preserving original columns and appending the scoring columns
   - Show the top 10 table in the conversation, plus the 2-3 items where discovery would most change the ranking
   - Suggest `/product--roadmap` to turn the tiers into a roadmap, or `/product--ab-test-design` for high-uncertainty top items

**Notes:**
- Never present RICE output as objective truth — it ranks assumptions; the justification column is the actual deliverable
- Compare like with like: don't mix "fix typo" tasks with "enter new market" bets in one scored list; split into separate lists if scales differ wildly
- Confidence punishes wishful thinking — if the only evidence is "the CEO wants it", that is 50%, and say so
- Re-scoring an existing list: keep previous scores in a `prev_RICE` column so movement is visible
- 25+ items: score in batches and confirm the rubric calibration after the first batch

$ARGUMENTS
