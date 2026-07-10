---
description: Generate operational runbooks covering symptoms, diagnosis, and remediation
permissions:
  reads: ["**/*"]
  writes: ["docs/**", "**/*.md"]
  commands: []
  network: false
  destructive: false
---

Generate operational runbooks by reading the actual code, configuration, and infrastructure —
not generic advice. Each runbook takes a responder from a firing alert or observed symptom to
verified recovery: what the symptom looks like, exact diagnosis commands against this system's
real names and endpoints, remediation steps ordered by safety, and escalation when the runbook
runs out.

Steps:

1. **Detect the system and its operational surface**
   - Identify the stack: language/framework, deployment target (k8s manifests, Dockerfiles, docker-compose, Terraform, serverless config, systemd units), and dependencies (databases, caches, queues, external APIs) from config and connection code
   - Find the observability entry points a responder would use: dashboard provisioning, log platform hints, metrics endpoints, tracing (`/observability--tracing-setup`), health/readiness endpoints
   - Locate existing runbooks and alert `runbook_url` annotations — extend and fix rather than duplicate

2. **Choose which runbooks to write**
   - Priority order: (1) every paging alert that lacks a runbook (from `/observability--alerting-rules` rules found in the repo), (2) the failure modes visible in the code — retry/timeout/circuit-breaker paths, queue backlogs, migration failures, certificate/token expiry, disk/quota exhaustion for stateful pieces, (3) routine operations that go wrong under stress: deploy rollback, failover, cache flush, replaying dead-letter queues
   - List the proposed runbooks with one-line justifications and confirm scope with the user — 5 accurate runbooks beat 25 speculative ones

3. **Mine the code and infra for real diagnosis material**
   - For each runbook, extract from the repo the concrete facts a responder needs: actual service/container/deployment names, ports, health endpoint paths, log messages the code emits on that failure path (grep the actual strings), metric names, feature flags, relevant env vars and their config source
   - Trace the failure path in code to write an honest decision tree: what the error handling does (retries? falls back? crashes?), what state it can leave behind, which dependency failures produce this symptom
   - Never invent command output or dashboard names — where something can't be verified from the repo, mark it `VERIFY:` for a human rather than guessing

4. **Write each runbook in a fixed, scannable structure**
   - **Symptom**: the alert name(s) and what a user/responder observes; severity guidance per the team's matrix (`/observability--incident-response`)
   - **Impact**: which user journeys are affected and how badly
   - **Diagnosis**: ordered checks with exact copy-pasteable commands for the detected platform (kubectl/docker/cloud CLI/SQL), each with "if you see X → go to step N" branching — shortest path to distinguishing the 2-3 likely causes
   - **Remediation**: ordered safest-first (restart one replica before flushing a cache before touching data); each step states its blast radius, and destructive steps are explicitly marked with what to capture (logs, state) before running them
   - **Verification**: how to confirm recovery (the metric/endpoint returning to normal), not just "it seems fine"
   - **Escalation**: when to stop and page whom, with the code/config owners from CODEOWNERS where available

5. **Deliver and wire into alerting**
   - Write runbooks to `docs/runbooks/<symptom-slug>.md` (or the project's existing runbook location) plus an index `docs/runbooks/README.md` mapping alert → runbook
   - Update alert rule annotations in the repo to point their `runbook_url` at the new files where alerting config lives in-repo
   - Flag orphans both ways: alerts without runbooks, and runbooks for alerts that no longer exist

**Notes:**
- A runbook is written for a stressed responder at 3 a.m. who may not know this service: no unexplained jargon, exact commands over descriptions of commands, one action per step
- Runbooks decay: stamp each with the commit/date it was validated against and recommend re-verification when the deploy topology changes
- If diagnosis keeps requiring a specific expert's knowledge, that knowledge belongs in the runbook — the test of a good runbook is that the expert is not needed
- Remediation that appears in every incident (restart, rollback) is automation waiting to happen — note repeat offenders as candidates, but never auto-generate destructive automation from this skill
- Keep runbooks in the repo, reviewed like code — a wiki page nobody diffs is where accuracy goes to die

$ARGUMENTS
