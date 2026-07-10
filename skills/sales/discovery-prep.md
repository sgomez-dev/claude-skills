---
description: Pre-call research brief with company intel, attendees, hypotheses, questions
permissions:
  reads: ["*.md", "*.txt", "*.csv"]
  writes: ["discovery_brief_*.md"]
  commands: []
  network: true
  destructive: false
---

Prepare a discovery or first-meeting brief you can scan in five minutes before the call: company
research, attendee context, pain hypotheses with the questions to test them, and a clear desired
outcome. Built from public web research plus any context you already have on the deal.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: company name or URL, and what you sell
   - Ask for what's known: attendee names/titles, how the meeting came about (inbound, outbound, referral), deal stage, and prior interactions — never assume the industry or the meeting's origin

2. **Research the company** (public sources)
   - What they do, who they serve, size, geography, business model
   - Recent triggers: news, funding, leadership changes, product launches, expansion, relevant job postings
   - Cite a source URL per finding; anything not verifiable is labeled `unconfirmed`

3. **Research the attendees**
   - Public info only: role and tenure, public talks, articles, or posts that reveal priorities
   - Note what each attendee likely cares about given their role (economic, technical, user lens)
   - Never fabricate personal details; if nothing public exists, say so and prep role-based assumptions labeled as such

4. **Build pain hypotheses**
   - 3-5 hypotheses of problems this company likely has that your product addresses, each with: the evidence behind it, which attendee owns that pain, and the open question that tests it
   - Include one disconfirming question per hypothesis — discovery is testing, not pitching

5. **Prepare the question bank**
   - 8-12 layered questions ordered situation → problem → implication → payoff (SPIN-style), mapped to the user's qualification framework if they use one (MEDDIC/BANT — see `/sales--lead-qualifier`)
   - Add 2-3 questions that surface decision process, timeline, and other stakeholders

6. **Deliver the brief**
   - Write `discovery_brief_[company-slug]_[YYYY-MM-DD].md`, one page max: company snapshot, trigger events, attendee table, hypotheses table, top 10 questions, traps to avoid (topics likely to derail), and the desired next step to propose
   - Show the hypotheses and top 5 questions in the conversation

**Notes:**
- Optimize for scan speed: tables and bullets, no prose walls — the rep reads this in the elevator
- Hypotheses are for testing on the call, not asserting; label everything unverified
- Public, free sources only; respect robots.txt, nothing behind logins
- After the call, run `/sales--call-notes-to-crm` on your notes and `/sales--lead-qualifier` to score what you learned
- Adapt deliverable language to the user's market

$ARGUMENTS
