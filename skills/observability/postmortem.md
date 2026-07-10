---
description: Write a blameless postmortem with timeline, contributing factors, and actions
permissions:
  reads: ["**/*"]
  writes: ["docs/**", "**/*.md"]
  commands: []
  network: false
  destructive: false
---

Produce a blameless postmortem from whatever incident data exists — chat exports, alert history,
ticket threads, commit history, notes pasted as input — reconstructing an honest timeline,
digging past the trigger into contributing factors, and converting lessons into a small set of
owned, verifiable action items. The output is a document the team learns from, not a report that
assigns fault.

Steps:

1. **Gather the evidence**
   - Take the incident data from the input: pasted chat logs, an incident channel export, a ticket/issue reference, file paths to notes or alert timelines
   - Supplement from the repo where relevant: git log around the incident window (deploys, config changes, migrations), the alert rules that fired or should have, the runbooks used or missing, related code paths
   - List what is missing (e.g., no detection timestamp, unknown user impact numbers) and ask for it once — mark anything unresolvable as `UNKNOWN` in the document rather than papering over gaps

2. **Reconstruct the timeline**
   - Build a timestamped sequence in one timezone (state which): first user impact, detection (alert or human?), declaration, each hypothesis and action with outcome, mitigation, full recovery, and any recurrence
   - Distinguish **impact start** from **detection** from **declaration** — the gaps between them are findings in themselves
   - Compute the key durations: time to detect, time to mitigate, total user impact; quantify impact in user terms (failed requests, affected users, error budget burned against the SLO from `/observability--slo-sli`) wherever the data allows

3. **Analyze contributing factors, not a single root cause**
   - Separate the **trigger** (the deploy, the traffic spike, the expired cert) from the **contributing factors** that let the trigger become an outage: missing validation, absent alerts, timeout misconfiguration, single point of failure, stale runbook, unclear ownership
   - Ask "why" iteratively but stop at systems, never at people: "engineer skipped the check" becomes "the check was skippable and nothing enforced it" — human error is a symptom of a system that permitted it
   - Cover the response itself with the same honesty: what slowed detection, diagnosis, or mitigation (noisy alerts, missing dashboard, wrong escalation) — response friction recurs across incidents even when triggers don't
   - Record **what went well** (fast rollback, good handover) — reinforcing working defenses is half the learning

4. **Derive action items that will actually happen**
   - For each contributing factor, propose at most one action; then cut the list to the few (typically 3-7) with the best recurrence-prevention per effort — a 40-item list is a graveyard
   - Each action gets: a specific owner (from CODEOWNERS/participants), a priority, a verifiable done-condition ("burn-rate alert exists and fired in a test", not "improve monitoring"), and a tracker link placeholder
   - Prefer structural fixes over vigilance: automation, guardrails, alerts (`/observability--alerting-rules`), runbooks (`/observability--runbook-gen`) beat "be more careful" every time — reject any action whose mechanism is human memory

5. **Write and deliver the document**
   - Write `docs/postmortems/YYYY-MM-DD-<slug>.md` (or the project's existing location) with: summary (3 sentences: what broke, impact, why), impact numbers, timeline, trigger, contributing factors, what went well / what hurt, action items table, and lessons learned
   - Scrub for blame language before finishing: no names attached to mistakes (roles are fine: "the on-call"), no "should have", no counterfactual heroics — if a sentence's only function is fault, delete it
   - Suggest the follow-through: review the document in a team meeting, feed process gaps back into `/observability--incident-response`, and check action-item completion at the next review — an unread postmortem prevented nothing

**Notes:**
- Blameless is a hard requirement, not a tone preference: the moment postmortems assign fault, the next incident's timeline gets quietly edited by self-preservation
- Write for the engineer who joins next year: enough context to understand the system's failure without having been there
- Resist the single-root-cause narrative — complex systems fail through aligned holes, and fixing only the trigger leaves the other holes open
- If the same contributing factor appears in past postmortems in the repo, say so prominently: repetition converts a finding into an organizational priority
- Depth should match severity: a SEV3 gets a lightweight page, a SEV1 gets the full treatment — mandatory heavyweight process for trivia teaches people to avoid declaring incidents

$ARGUMENTS
