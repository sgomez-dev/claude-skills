---
description: Review a contract draft - flag risky clauses, missing terms, one-sided duties
permissions:
  reads: ["**/*.md", "**/*.txt", "**/*.pdf", "**/*.docx", "**/*.rtf"]
  writes: ["legal/**"]
  commands: []
  network: false
  destructive: false
---

Review a contract draft from the user's side of the table: flag risky clauses, spot what is missing
entirely, and call out one-sided obligations — with a plain-language explanation of why each matters
and a concrete redline suggestion. This is a structured second pair of eyes before the document goes
to counsel or gets signed, not a rubber stamp.

Steps:

1. **Establish context** (`$ARGUMENTS` may contain the file path or pasted text — ask for the rest)
   - Which side is the user on (customer/vendor, licensor/licensee, employer/contractor)? Every risk assessment flips with the side
   - Contract type: SaaS agreement, MSA, NDA, employment, consulting, licensing, partnership — this sets the checklist of expected clauses
   - Jurisdiction and governing law (EU member state, US state, UK, other), deal size, and any dealbreakers the user already knows about

2. **Read the full contract and map its structure**
   - List every clause present with a one-line summary — this becomes the coverage map
   - Note defined terms and check they are used consistently; flag terms used but never defined
   - Identify cross-references that point nowhere and exhibits/schedules referenced but not attached

3. **Flag risky clauses**
   - For each risky clause: quote it, rate the risk (high/medium/low), explain the real-world consequence in one or two sentences, and propose alternative language
   - Standard hotspots: unlimited or uncapped liability, broad indemnities, IP assignment wider than the deal needs, auto-renewal with long notice windows, unilateral amendment rights, broad termination-for-convenience (theirs) vs. narrow (yours), non-competes/non-solicits, exclusivity, payment terms with no late-payment protection, warranty disclaimers, arbitration/venue far from the user

4. **Find what is missing**
   - Compare against the expected clause set for this contract type: limitation of liability, indemnification (both directions), confidentiality, data protection (GDPR processor terms if personal data flows — suggest `/legal--dpa-gen`), SLA or service levels for SaaS (suggest `/legal--sla-gen`), termination and exit/transition assistance, IP ownership, force majeure, dispute resolution, assignment, notices
   - For each gap: why its absence hurts the user's side specifically, and a one-line clause to request

5. **Assess balance of obligations**
   - Build a two-column table: obligations on the user vs. obligations on the counterparty — asymmetries jump out visually
   - Flag one-way streets: mutual-sounding clauses that only bind one party in practice (e.g., confidentiality defined so only their information is protected), remedies available to them but not to you

6. **Deliver the review**
   - Write `legal/CONTRACT_REVIEW_[name]_[YYYY-MM-DD].md`: executive summary (sign / negotiate first / walk away, with the 3 biggest issues), then findings ordered by severity, each with quote, risk, consequence, and suggested redline
   - Include the obligations-balance table and the missing-clauses list
   - End with a prioritized negotiation list: the 3-5 asks worth spending negotiation capital on, and what is acceptable to concede

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Never soften a finding to be polite; the user needs the uncomfortable reading before signing, not after
- Quote the contract verbatim in findings — paraphrases hide the problem
- If the jurisdiction makes a clause likely unenforceable (e.g., broad non-competes in some jurisdictions), say so but still flag it: unenforceable clauses get negotiated out, not relied on
- If the document is an early-stage term sheet rather than a full contract, review at that altitude and list what the long form must add

$ARGUMENTS
