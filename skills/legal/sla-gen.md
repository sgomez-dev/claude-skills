---
description: Draft an SLA with uptime tiers, response times, service credits, exclusions
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "SLA*.md"]
  commands: []
  network: false
  destructive: false
---

Draft a Service Level Agreement the product can actually honor: uptime commitments, support
response times, service credits, and exclusions — sanity-checked against the real architecture.
An SLA promising 99.99% on a single-region, single-instance deployment is a liability, not a sales
asset; this skill grounds the numbers before writing the clauses.

Steps:

1. **Establish the commercial frame** (`$ARGUMENTS` may contain some — ask for the rest)
   - Company name, product/service the SLA covers, and whether it attaches to an MSA/ToS or a specific customer contract
   - Jurisdiction/governing law (mainly affects credit-remedy language and consumer vs. B2B framing) and customer profile: self-serve plans, enterprise negotiated, or both
   - Existing commitments to not contradict: current marketing claims ("99.9% uptime"), plan tiers, support hours already promised anywhere

2. **Reality-check against the architecture**
   - Inspect deployment and infra config (Dockerfiles, Terraform, k8s manifests, CI/CD, hosting config): single vs. multi-instance, multi-AZ/region redundancy, database failover, health checks
   - Inspect observability: is there monitoring/alerting (and ideally a status page) that could even *measure* the uptime being promised? An unmeasurable SLA is unenforceable in both directions
   - Note upstream dependencies (cloud provider, critical third-party APIs) whose own SLAs cap what can honestly be promised downstream
   - Summarize: the uptime level the architecture plausibly supports — flag if the user's desired number exceeds it

3. **Define service tiers and uptime commitments**
   - Propose tiers matched to plans (e.g., Standard 99.5%, Business 99.9%, Enterprise 99.95%) with the monthly downtime each allows spelled out in minutes — customers reason in minutes, not nines
   - Define the measurement precisely: measurement window (monthly), what counts as "downtime" (error-rate threshold or full unavailability), measurement source (status page / monitoring), and how customers claim
   - Define maintenance windows: scheduled maintenance notice period and whether it counts against uptime

4. **Define support response and resolution targets**
   - Severity matrix: P1 (service down) → P4 (question), with per-tier first-response times (e.g., Enterprise P1: 1h, 24/7; Standard P1: 8 business hours) and update cadence during incidents
   - Commit to response times, not resolution times — guarantee only what is controllable; state target resolution as objectives, not commitments
   - Match support hours to reality: do not write "24/7" unless someone is actually on call around the clock

5. **Define credits and exclusions**
   - Credit schedule per tier: uptime band → credit as % of monthly fee (e.g., <99.9%: 10%, <99%: 25%, <95%: 50%), claim procedure and deadline, credits as sole remedy, annual cap, and no cash refunds
   - Standard exclusions: scheduled maintenance, customer-caused issues (misuse, exceeding limits, customer's own network), force majeure, third-party/upstream failures outside reasonable control, beta/free features, suspension for non-payment or abuse
   - Keep exclusions honest — an exclusion list that swallows the commitment reads as bad faith in enterprise procurement

6. **Draft and deliver**
   - Write `legal/SLA_DRAFT.md`: definitions, service commitment per tier, measurement and reporting, maintenance, support severity/response matrix, service credits and claim process, exclusions, term/changes, relation to the main agreement (credits as sole remedy, liability cap reference)
   - Use `[PLACEHOLDER: ...]` for unverified facts and `[CONFIRM]` where a business decision is needed (tier pricing linkage, support staffing)
   - List the operational gaps found in step 2 that must close before the SLA is signed (e.g., "no status page — measurement clause has nothing to point at")
   - Suggest follow-ups: `/legal--contract-review` before sending to an enterprise customer, `/legal--terms-of-service` if the SLA needs a parent agreement

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Never let the promised nines exceed what the architecture and upstream SLAs support — flag the mismatch loudly instead of drafting around it
- Response-time commitments are staffing commitments in disguise; confirm the team can honor them before they ship
- Self-serve products usually want one public SLA page; enterprise deals want a negotiable schedule — if both apply, draft the public one and note enterprise deltas
- Revisit the SLA whenever the architecture changes materially (new region, new critical dependency) — the numbers are only as durable as the infra behind them

$ARGUMENTS
