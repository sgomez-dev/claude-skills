---
description: Draft a DPA skeleton with a subprocessor list built from your actual stack
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "DPA*.md"]
  commands: []
  network: false
  destructive: false
---

Draft a Data Processing Agreement skeleton grounded in the product's real stack: the subprocessor
list, data categories, and processing descriptions come from what the code actually uses — not a
blank Annex the user has to fill in later (and usually never does). The DPA's annexes are where
generic templates fail; this skill builds them from evidence.

Steps:

1. **Establish the parties and regime** (`$ARGUMENTS` may contain some — ask for the rest)
   - Direction: is the user the **processor** (typical SaaS vendor signing with customers) or the **controller** (engaging a vendor)? The skeleton's obligations flip accordingly
   - Applicable regime: GDPR (EU/EEA), UK GDPR, or both — plus whether US state laws (CCPA/CPRA service-provider terms) should be layered in
   - Company legal name, address, and privacy/DPO contact; whether the DPA attaches to an existing MSA/ToS (reference it) or stands alone

2. **Scan the stack for subprocessors**
   - From dependencies, SDK imports, env vars, config, and infrastructure files (Terraform, docker-compose, CI configs): cloud hosting, databases-as-a-service, CDNs, email/SMS providers, payment processors, analytics, error tracking, support/CRM tools, AI/LLM APIs
   - Keep only services that actually touch personal data on the user's behalf — a build-time linter is not a subprocessor; an email API receiving customer addresses is
   - For each subprocessor: what personal data reaches it (trace from the code that calls it) and its known processing region — mark region `[CONFIRM]` where the code doesn't reveal it

3. **Describe the processing from the code**
   - Build Annex I content from evidence: categories of data subjects (end users, customer employees...), categories of personal data (from models/schemas — flag any special categories), nature and purpose of processing, duration/retention (from TTLs and cleanup jobs found, or `[CONFIRM]` if none)
   - Note international transfers implied by subprocessor regions — these drive the transfer-mechanism clause (SCCs, adequacy, UK Addendum)

4. **Inventory security measures actually in place**
   - Annex II should describe reality, not aspiration: encryption at rest/in transit (from config), access controls and SSO, logging/monitoring, backup setup, secrets management, MFA hints in auth code
   - List standard measures that were *not* found in code as `[CONFIRM: in place organizationally?]` — the user may have them outside the repo
   - Anything promised in the DPA but contradicted by the code goes on a fix list, not silently into the annex

5. **Draft the DPA skeleton**
   - Write `legal/DPA_DRAFT.md`: parties and roles, subject matter, controller instructions, confidentiality, security measures (Annex II from step 4), subprocessor authorization (general with notice period — list from step 2 as Annex III), assistance with data subject rights, breach notification (specify the hour window as `[CONFIRM]`, commonly 24-72h to the controller), audits, international transfers and mechanism, deletion/return on termination, liability linkage to the main agreement
   - Use `[PLACEHOLDER: ...]` for every unverifiable fact; keep clause language standard (GDPR Art. 28 structure) so counsel can review fast

6. **Deliver and flag gaps**
   - Show the subprocessor table and the processing description in the conversation for correction before relying on them
   - List code-level gaps that would make the DPA false as written (e.g., no deletion-on-termination path, a subprocessor with no DPA of its own)
   - Suggest follow-ups: `/legal--gdpr-audit` for the full compliance pass, `/legal--privacy-policy` to keep the public-facing story consistent with the DPA

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- The subprocessor list is only as current as the code scanned — recommend a process for updating it (and notifying customers) when new services are added
- Never list a subprocessor speculatively; if a dependency exists but no personal data flows to it, leave it out and say why
- If the user is the controller reviewing a vendor's DPA instead, offer to flip modes and use `/legal--contract-review` on the vendor document
- Chained subprocessors (your subprocessor's subprocessors) are the customer's likely follow-up question — point to each vendor's own subprocessor page in the annex

$ARGUMENTS
