---
description: Write multi-touch cold email and LinkedIn sequences personalized per lead
permissions:
  reads: ["*.csv", "*.md", "*.txt", "*.json"]
  writes: ["outreach_*.md", "outreach_*.csv"]
  commands: []
  network: false
  destructive: false
---

Design a multi-touch cold outreach sequence (email + LinkedIn) and write every message,
personalized from the signals in your lead data. Works from a lead list (ideally the output of
`/sales--lead-finder` or `/sales--lead-enrichment`) or a single lead description — personalization
comes only from data you provide, never invented.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: lead list (CSV/paste) or one lead, what you sell, and the goal of the sequence (book a meeting, start a conversation, event invite)
   - If leads lack signals/context to personalize with, say so and suggest `/sales--lead-enrichment` or `/sales--intent-radar` first — generic blasts are not worth sending

2. **Segment and position**
   - Group leads by shared pain/context (role, industry, signal type); one sequence per segment
   - Per segment, confirm: the problem you solve for them, the proof you can offer, and the lowest-friction CTA

3. **Design the cadence**
   - Table: touch #, day offset, channel, goal. Default 5-touch/15-day pattern to adapt: D1 email (signal-based opener), D3 LinkedIn profile view + connection note, D6 email bump (short, adds one proof), D10 value email (relevant asset or insight), D15 breakup email
   - Adjust channel mix to where the segment actually lives; define exit triggers (reply, meeting booked, opt-out)

4. **Write every touch with AIDA**
   - **Attention**: opener anchored to the lead's specific signal (from their row), never flattery filler
   - **Interest**: the problem in their terms, one sentence
   - **Desire**: one proof point (real customer/result from user-provided material only)
   - **Action**: one low-friction CTA; interest-based ("worth a look?") beats calendar demands in touch 1
   - Constraints: first email <90 words, plain text, one CTA, no spam-trigger phrasing, 2 subject-line variants per email for A/B testing

5. **Personalize per lead**
   - Merge each lead's signal into the opener; output a per-lead table or CSV with columns: lead, touch_1_subject_a, touch_1_subject_b, touch_1_body, ..., personalization_source
   - Leads with no usable signal go to a `needs research` list — do not send them generic copy

6. **Deliver**
   - Write `outreach_[segment-slug]_[YYYY-MM-DD].md` (cadence + templates) and optionally `outreach_[segment-slug]_[YYYY-MM-DD].csv` (per-lead merge)
   - Show touch 1 for the top 3 leads in the conversation; suggest `/sales--follow-up-sequencer` for post-reply cadences

**Notes:**
- Never fabricate personalization: "loved your post about X" only if that post is in the provided data
- Compliance: include an opt-out path, respect CAN-SPAM/GDPR/local law, never suggest purchased lists
- Every touch must add something new; a bare "just following up" touch is cut
- Write in the language of the lead's market (e.g., Spanish leads → Spanish sequences)

$ARGUMENTS
