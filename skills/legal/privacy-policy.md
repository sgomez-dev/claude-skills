---
description: Draft a privacy policy from the data practices actually found in your codebase
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "PRIVACY_POLICY*.md"]
  commands: []
  network: false
  destructive: false
---

Draft a privacy policy grounded in what the product actually does — scan the codebase for data
collected, third-party services used, and storage/retention behavior, then write a policy that
describes real practices instead of boilerplate. The differentiator: every clause maps to evidence
found in the code, and anything the code does that a generic template would miss gets covered.

Steps:

1. **Gather context** (`$ARGUMENTS` may contain some of this — ask for the rest)
   - Jurisdiction and applicable regimes: EU/EEA (GDPR), US (state laws like CCPA/CPRA), UK, other — this changes required sections, lawful bases, and rights language
   - Company legal name, registered address, contact email, DPO or privacy contact if one exists
   - Product type and audience: B2B SaaS, consumer app, marketplace, etc.; whether children under 16 could plausibly be users

2. **Scan the codebase for personal data collection**
   - Forms, API request schemas, database models/migrations: which fields are personal data (name, email, phone, address, IP, device IDs, location, payment data, health or other special categories)
   - Authentication flows: what identity data is stored, OAuth providers used, session/token handling
   - Logging and monitoring: check whether logs capture IPs, user IDs, request bodies, or emails
   - Analytics, tracking, and error-reporting SDKs (Google Analytics, Segment, Sentry, PostHog, Mixpanel, pixels) — note exactly what each is configured to send

3. **Map third-party recipients and data flows**
   - From dependencies, env vars, and config: payment processors, email/SMS providers, cloud hosting, CDNs, CRMs, support tools, AI/LLM APIs
   - For each: what data is shared, and where it is processed (note anything implying non-EU transfer if GDPR applies)
   - Identify storage locations and any retention/deletion logic already in the code (TTLs, cron cleanup jobs, soft deletes) — or the absence of it

4. **Determine legal framing per data category**
   - Build a table: data category → purpose → lawful basis (if GDPR: contract, legitimate interest, consent, legal obligation) → retention period → recipients
   - Where the code gives no retention answer, propose a sensible default and mark it `[CONFIRM]` for the user
   - Flag anything found in code that is legally awkward (e.g., analytics firing before consent, sensitive data in logs) — these belong in a fix list, not hidden in the policy

5. **Draft the policy**
   - Write `legal/PRIVACY_POLICY.md` in clear plain language: who we are, data collected (from the scan), purposes and lawful bases, recipients/subprocessors, international transfers, retention, security measures, data subject rights and how to exercise them, cookies (summary — link to the cookie policy), children, changes, contact
   - Use `[PLACEHOLDER: ...]` for every fact you could not verify — never invent company details, addresses, or certifications
   - Match the tone to the audience (consumer policies simpler than B2B)

6. **Deliver and flag gaps**
   - Show the data-mapping table and the policy in the conversation
   - List discrepancies to fix in the product itself (e.g., "no deletion path exists for user accounts — the policy promises one")
   - Suggest follow-ups: `/legal--cookie-policy` for the cookie annex, `/legal--gdpr-audit` for a full compliance pass, `/legal--dpa-gen` if the product processes data on behalf of business customers

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Describe only what the code actually does; a policy claiming less than reality is worse than no policy
- If the codebase is a library or has no data collection at all, say so and produce a minimal policy rather than padding
- Keep every `[PLACEHOLDER]` and `[CONFIRM]` marker visible in the draft so nothing unverified ships silently
- If multiple regimes apply (e.g., EU + California), write one policy with regime-specific subsections rather than two documents

$ARGUMENTS
