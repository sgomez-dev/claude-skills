---
description: Draft or reply to sales emails matched to deal stage, tone, and intent
permissions:
  reads: ["*.md", "*.txt"]
  writes: ["email_draft_*.md"]
  commands: []
  network: false
  destructive: false
---

Draft a sales email or a reply to one, matched to the deal stage, the recipient's intent, and the
right tone. Works from the thread you paste plus deal context — output is ready to send, with a
variant to choose from.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Determine the task: new email or reply. For a reply, get the thread/email text; for a new email, get the goal
   - Ask for missing context: deal stage, relationship history, what you sell, desired outcome of this email, and tone constraints (formal market? existing rapport?) — never assume the industry

2. **Classify intent** (replies)
   - Read the incoming email for what it actually is: genuine interest, information request, objection, stall/soft no, delegation ("talk to my colleague"), ghosting bump, procurement step, or breakup
   - State the classification and the strategic read in one line before drafting — the reply strategy depends on it

3. **Pick the strategy for the stage**
   - Match message pattern to stage: post-discovery → recap + confirm pains + propose next step; proposal sent → reinforce value, create momentum, never beg; negotiation → trade, don't concede; gone dark → new value or graceful breakup, no guilt-tripping
   - For objection replies, apply Acknowledge → Clarify → Reframe → Proof → Advance (full playbook: `/sales--objection-handler`)

4. **Draft the email**
   - Subject line (new threads): specific and short, no clickbait
   - Body: <150 words, one clear CTA, mirror the recipient's formality and language, lead with what matters to them not to you
   - Produce 2 variants: direct and softer; note when to use which

5. **Quality pass**
   - Strip filler ("I hope this finds you well"), needy phrasing ("just checking in", "any update?"), and jargon
   - Verify every claim, price, and commitment appears in the provided context — never invent terms, discounts, or promises
   - Check the CTA is answerable in one line by the recipient

6. **Deliver**
   - Show both variants in the conversation with a one-line rationale each; offer to save as `email_draft_[YYYY-MM-DD].md`
   - If this email opens a cadence, suggest `/sales--follow-up-sequencer` for the touches after it

**Notes:**
- The email's job is to advance the deal one step, not close it — one CTA, sized to the relationship
- Write in the recipient's language and business-culture norms (formality varies by market)
- Never fabricate urgency, fake deadlines, or references to conversations that didn't happen
- Long threads: quote only the line you're responding to, don't recap everything

$ARGUMENTS
