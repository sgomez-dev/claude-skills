---
description: Analyze deal or pipeline notes for risk signals using MEDDIC gap analysis
permissions:
  reads: ["*.md", "*.txt", "*.csv", "*.json"]
  writes: ["deal_risk_*.md", "deal_risk_*.csv"]
  commands: []
  network: false
  destructive: false
---

Audit a single deal or a whole pipeline from the user's notes, CRM export, or verbal recap, and
surface the risks a seller's optimism hides: MEDDIC gaps, stalled momentum, single-threading, and
happy-ears signals. The output is a risk-scored assessment with one concrete de-risking action per
gap — judged only on evidence in the notes, not on hope.

Steps:

1. **Ingest and detect scope** (`$ARGUMENTS`)
   - **Single-deal mode**: notes/transcripts about one opportunity → deep assessment
   - **Pipeline mode**: CSV export or a list of deals → score all, rank by risk-weighted value
   - Normalize what's known per deal: amount, stage, age in stage, close date, contacts touched,
     last activity, next step, competitor mentions
   - Only analyze what's in the notes — if a field is absent, that absence is itself a data point

2. **Run the MEDDIC gap analysis** (per deal)
   Score each element 0-2 (0 = absent, 1 = asserted but unverified, 2 = evidenced in notes):
   - **M**etrics — quantified business impact the customer agreed to
   - **E**conomic buyer — identified AND engaged (a name someone mentioned scores 1, a meeting
     scores 2)
   - **D**ecision criteria — do we know what they'll judge on, and did we shape it?
   - **D**ecision process — steps, dates, and who signs; includes paper process (legal,
     procurement, security review)
   - **I**dentify pain — a problem with a cost, owned by someone, urgent enough to fund
   - **C**hampion — someone selling internally when we're not in the room, with power and a
     personal win
   - MEDDIC score = sum /12; anything scored 0-1 becomes a named gap with a verification question
     the rep should ask next

3. **Detect momentum and threading risks**
   - **Stall signals**: age in stage vs. typical cycle, close date pushed more than once, "no
     next step" after a meeting, ghosting after proposal (pairs with `/sales--follow-up-sequencer`)
   - **Single-threading**: fewer than 2-3 engaged contacts on a deal of this size → flag with
     suggested roles to multithread toward (economic buyer, user champion, technical evaluator)
   - **Happy ears**: enthusiasm without commitment — "they loved the demo" with no scheduled next
     step, verbal "yes" without process confirmation, urgency on our side only
   - **Competitive/status-quo risk**: competitor named without a counter-plan, or no compelling
     event ("do nothing" is the default winner)

4. **Score and classify each deal**
   - Risk score 0-100 from: MEDDIC gaps (50%), momentum signals (30%), threading (20%)
   - Classify: **Healthy** / **At Risk** / **Critical** / **Zombie** (no activity + no next step +
     pushed dates → candidate for closing out honestly)
   - Every classification cites the 2-3 pieces of evidence that drove it — no vibes

5. **Prescribe de-risking actions**
   - For each gap, one specific next action phrased as something the rep can do this week,
     e.g., "Ask the champion: 'Walk me through what happens after you say yes — who signs, and
     what will legal need?'" (fills Decision process)
   - For pipeline mode: the 3 deals where one action changes the forecast most, and which zombie
     deals to disqualify to clean the forecast

6. **Deliver**
   - Single deal: `deal_risk_[deal-slug]_[YYYY-MM-DD].md` — MEDDIC scorecard table, risk flags
     with evidence, action plan
   - Pipeline: `deal_risk_pipeline_[YYYY-MM-DD].csv` with columns: deal, amount, stage,
     meddic_score, risk_score, classification, top_gap, evidence, next_action — plus a markdown
     summary of the top 5 riskiest weighted by value
   - Show the scorecard/summary table in the conversation

**Notes:**
- Score only what the notes evidence — the goal is to kill happy ears, so "probably fine" always
  scores as a gap; a deal can't be penalized for missing data the user simply didn't paste, so
  state assumptions explicitly
- A champion is proven by action (intel shared, meetings arranged, internal selling), not by
  friendliness
- Disqualifying a zombie deal is a win: forecast accuracy beats pipeline vanity
- Adapt questions and terminology to the user's sales motion (SMB deals may not warrant full
  MEDDIC rigor — say so rather than over-processing a 2-call deal)
- Upstream fit issues → `/sales--lead-qualifier`; strategic account depth → `/sales--account-plan`

$ARGUMENTS
