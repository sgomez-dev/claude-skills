---
description: Audit the codebase for GDPR gaps - consent, retention, data subject rights
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "GDPR_AUDIT*.md"]
  commands: []
  network: false
  destructive: false
---

Audit the codebase and observable practices for GDPR compliance gaps — not a questionnaire, an
inspection. Trace personal data through the actual code (collection points, storage, third parties,
deletion paths) and test each GDPR obligation against what the code really does. The output is a
prioritized gap list with evidence: file, line, what the regulation expects, what the code does
instead.

Steps:

1. **Scope the audit** (`$ARGUMENTS` may narrow it — ask for the rest)
   - Confirm GDPR applies: does the product target or monitor people in the EU/EEA/UK? If purely US-only, say so and offer to audit against the closest US regime instead
   - Company role: controller, processor, or both — obligations differ substantially
   - Any prior artifacts to check against: existing privacy policy, DPA, records of processing, consent tooling

2. **Build the personal data inventory from code**
   - Database models, migrations, and API schemas: every field that is personal data, flagging special categories (health, biometrics, beliefs) and children's data
   - Collection points: forms, signup flows, imports, webhooks, mobile SDKs
   - Logging/monitoring: IPs, user IDs, emails, or request bodies landing in logs, error trackers, or analytics
   - Third-party flows: from dependencies, env vars, and config, list every service receiving personal data and where it processes (non-EU transfer implications)

3. **Test consent and lawful basis**
   - Where consent is the claimed basis, verify the code actually implements it: is anything (analytics, pixels, marketing SDKs) firing before consent is given? Is consent stored, timestamped, and revocable in code?
   - Check for pre-ticked boxes, bundled consent, or consent walls in UI code
   - For non-consent bases (contract, legitimate interest), check the processing found in step 2 plausibly fits — flag anything that looks like it needs consent but has none

4. **Test data subject rights against the code**
   - **Access/portability**: does an export path exist (endpoint, admin tool, or documented process)?
   - **Erasure**: trace the deletion flow — does deleting an account actually remove or anonymize data everywhere (main DB, backups policy, logs, third parties, caches)? Soft deletes that never hard-delete are a finding
   - **Rectification and objection**: can users correct data and opt out of profiling/marketing?
   - Note the response-time reality: could the team fulfill a request within one month with current tooling?

5. **Test retention and security basics**
   - Look for retention logic: TTLs, cleanup crons, archival jobs — or their absence (indefinite retention is a finding)
   - Spot-check security signals in code: secrets in the repo, unencrypted personal data at rest where the stack supports encryption, personal data in URLs, missing access controls on data-exposing endpoints
   - Check breach readiness: is there any logging/alerting that would even detect unauthorized access?

6. **Deliver the gap report**
   - Write `legal/GDPR_AUDIT_[YYYY-MM-DD].md`: for each finding — severity (critical/high/medium/low), the GDPR obligation (article reference), the evidence (file:line or config), and a concrete remediation
   - Lead with a summary table and the top 5 risks; separate quick wins from structural work
   - Suggest follow-ups: `/legal--privacy-policy` if the policy contradicts findings, `/legal--dpa-gen` for processor relationships, `/legal--cookie-policy` if consent gaps involve trackers

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Every finding needs code-level evidence; no finding without a file, config, or observed behavior to point at
- Absence of evidence is itself a finding (e.g., "no deletion path found") — but label it "not found in code" rather than asserting it doesn't exist anywhere
- Do not drown the report in theoretical risks; prioritize what a regulator or a user complaint would actually surface
- If the codebase is a processor-only backend (B2B), reframe rights findings as "capabilities the controller will demand via DPA"

$ARGUMENTS
