---
description: Design follow-up cadences per deal stage with timing and exit triggers
permissions:
  reads: ["*.md", "*.txt", "*.csv"]
  writes: ["followup_cadence_*.md"]
  commands: []
  network: false
  destructive: false
---

Design follow-up cadences for deals already in motion: what to send after a demo, after a
proposal, when a deal goes dark — with timing scaled to your sales cycle, a message per touch that
adds value, and explicit exit triggers so sequences end instead of pestering forever.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: which stage(s) to build cadences for, what you sell, and your typical sales cycle length
   - Ask for context on live deals if this is for a specific one: last interaction, what was promised, who's involved — never assume the industry

2. **Map stage to cadence intent**
   - Each stage gets a distinct goal: post-discovery → confirm pains and secure next meeting; post-demo → maintain momentum, expand stakeholders; proposal sent → drive a decision, not "thoughts?"; verbal yes → get to signature, de-risk procurement; gone dark → re-engage or release; closed-lost → recycle on a trigger date
   - Confirm which apply before writing

3. **Design each cadence**
   - Table per stage: touch #, day offset, channel (email/call/LinkedIn), goal, message angle
   - Scale timing to cycle length: a 2-week transactional cycle follows up in days; a 9-month enterprise cycle in weeks — state the scaling used
   - 3-5 touches per cadence; more touches with less value is worse than fewer with more

4. **Define exit triggers**
   - Positive: reply, meeting booked, doc opened + question asked → exit to next stage
   - Negative: explicit no → closed-lost with recycle date; sequence exhausted with silence → breakup touch, then nurture pool
   - Write the breakup message: gracious, door open, zero guilt

5. **Write the message templates**
   - Every touch earns its send by adding something: a recap with a decision framing, a relevant asset, a new insight about their situation, a different stakeholder angle — never a bare "just following up" or "bumping this"
   - Keep each under 100 words with one CTA; mark merge fields for personalization

6. **Deliver**
   - Write `followup_cadence_[stage-slug]_[YYYY-MM-DD].md` per stage (or one combined file): cadence table, exit triggers, all templates
   - Show one full cadence in the conversation; suggest `/sales--email-assistant` to tailor an individual send, and `/sales--deal-risk-analyzer` if deals keep hitting the gone-dark cadence

**Notes:**
- Persistence with value is professional; persistence without it is spam — the value-add rule is non-negotiable
- Proposal-stage follow-ups propose decisions and deadlines, they don't ask for "any updates"
- Cadences are defaults: a real signal from the buyer always overrides the schedule
- Never fabricate urgency or fake expiration dates
- Adapt message language to the buyer's market

$ARGUMENTS
