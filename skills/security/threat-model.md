---
description: Threat model with STRIDE: assets, trust boundaries, attack surface, mitigations
permissions:
  reads: ["**/*"]
  writes: ["threat-model*.md"]
  commands: []
  network: false
  destructive: false
---

Produce a practical threat model for the system using STRIDE — grounded in the actual architecture, not a
generic checklist — so the team knows what can go wrong and what to fix first.

Steps:

1. **Scope the system** (`$ARGUMENTS`)
   - Detect the architecture from the repo: entry points, services, data stores, third-party integrations, auth
   - If scope is unclear, ask what to model (a feature, a service, or the whole system)
   - List the assets worth protecting (user data, credentials, money, availability) and who the adversaries are

2. **Draw trust boundaries and data flow**
   Produce a Mermaid data-flow diagram: external actors, processes, data stores, and the trust boundaries
   between them (internet↔app, app↔db, app↔third-party). Every boundary crossing is where threats live.

3. **Enumerate threats with STRIDE**
   For each element/boundary, walk STRIDE: Spoofing, Tampering, Repudiation, Information disclosure,
   Denial of service, Elevation of privilege. Record concrete, system-specific threats — not "SQL injection is bad"
   but "the /report endpoint interpolates `region` into raw SQL".

4. **Rate and prioritize**
   Score each threat by likelihood × impact (or DREAD if the user prefers) into High/Medium/Low.
   Note existing mitigations already present in the code.

5. **Recommend mitigations**
   For each High/Medium threat: the specific fix, where in the code, and effort. Link to sibling skills for the
   actual work (`/security--auth-review`, `/security--rate-limiting`, `/security--sanitize`, `/security--secrets-scan`).

6. **Deliver**
   Write `threat-model.md` with the diagram, the threat table (element, STRIDE category, threat, rating,
   mitigation), and a prioritized top-5 action list.

**Notes:**
- Keep it concrete and code-anchored — a generic threat model gets ignored
- Revisit when the architecture changes; a threat model is a living document
- Pairs with `/security--pentest-prep` before an external assessment

$ARGUMENTS
