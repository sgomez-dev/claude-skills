---
description: Build an objection playbook with reframes, proof points, and next steps
permissions:
  reads: ["*.md", "*.txt", "*.csv"]
  writes: ["objection_playbook_*.md"]
  commands: []
  network: false
  destructive: false
---

Turn the objections you actually hear into a playbook: what each objection really means, the
clarifying question to ask, the reframe, the proof, and the step that moves the deal forward.
Built from your product context and real objections — from a list, call notes, or transcripts.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: what you sell and the objections encountered — as a list, or as call notes/transcripts to mine
   - Ask for available proof material (customer results, case studies, security docs) — responses can only cite proof the user provides. Never assume the industry

2. **Extract and categorize**
   - Pull every distinct objection and bucket it: price/budget, timing ("not now"), status quo ("what we have works"), competitor, authority ("need to ask my boss"), trust/risk (security, vendor size, lock-in), feature gap
   - Note frequency and deal stage where each appears — stage changes the meaning

3. **Diagnose each objection**
   - State the likely underlying concern (price objections are usually value or qualification problems; timing is usually priority)
   - Give a smokescreen test: the question that reveals whether it's the real blocker ("If price weren't a factor, would you move forward?")

4. **Build the response pattern**
   - For each objection, one row: **Acknowledge** (validate without agreeing) → **Clarify** (the diagnostic question) → **Reframe** (shift the frame: cost of inaction, risk of status quo, total value) → **Proof** (specific evidence from user-provided material, or `proof needed` if none exists) → **Advance** (the concrete next step to propose)
   - Responses are conversational lines a rep can say, not essays

5. **Harden with follow-ups**
   - Per objection, script the 2 toughest pushbacks a prospect gives after the first response, and the counter to each — playbooks die on the second exchange, not the first

6. **Deliver**
   - Write `objection_playbook_[YYYY-MM-DD].md`: summary of objection frequency by category, then the full response table, then the `proof needed` gap list
   - Show the top 3 most frequent objections with full responses in the conversation

**Notes:**
- Never argue or contradict head-on — every response runs through acknowledge-and-reframe
- A price objection that survives reframing is often a qualification problem: suggest `/sales--lead-qualifier`
- Competitor objections deserve their own depth: suggest `/sales--sales-battlecard` per named competitor
- Mark every proof point with its source; unproven claims are flagged, not asserted
- Adapt deliverable language and phrasing formality to the user's market

$ARGUMENTS
