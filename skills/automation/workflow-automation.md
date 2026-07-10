---
description: Design automations for n8n, Zapier, or Make — triggers, steps, error paths, export
permissions:
  reads: ["*.json", "*.md", "*.yaml", "*.yml"]
  writes: ["workflows/**", "*_workflow.json", "*_workflow.md"]
  commands: []
  network: false
  destructive: false
---

Design a complete workflow automation for n8n, Zapier, or Make (Integromat): pick the right
platform, map trigger → steps → outputs, build in error handling from the start, and deliver an
importable export (n8n JSON) or a precise build sheet (Zapier/Make) the user can implement in
minutes. Good automations are boring: explicit, idempotent, and loud when they fail.

Steps:

1. **Capture the workflow in plain language** (`$ARGUMENTS`)
   - Restate as: **Trigger** (what event starts it) → **Steps** (each transformation/action) → **Destination** (where results land)
   - Ask what's missing: frequency/volume, what should happen on duplicates or re-runs, who gets notified on failure
   - Identify every external app involved and whether the user already has accounts/API access for each

2. **Pick the platform** (unless the user already chose)
   - **n8n**: self-hosted or cloud, code steps (JS), loops, complex branching, no per-task pricing — best for technical users and high volume
   - **Zapier**: largest connector catalog, simplest UX, per-task pricing — best for quick, linear, low-volume zaps
   - **Make**: visual branching/routers, good price/volume ratio, moderate learning curve — best for multi-branch flows without self-hosting
   - Recommend one with a one-line reason; if the logic is heavy (parsing, dedup, math), suggest a code step or an external script the platform calls

3. **Design the happy path**
   - **Trigger**: webhook (instant) vs polling (interval) — state which and why; for webhooks, note the payload fields the flow depends on
   - Each step gets: app/node name, operation, input mapping (which fields from which prior step), and output fields — written so the user can configure it without guessing
   - Insert a **filter/guard step early** to drop irrelevant events (saves tasks/ops and prevents noise downstream)
   - Make it **idempotent**: define a dedup key (record id, email + date, etc.) and a lookup-before-create step so re-delivered triggers don't duplicate work

4. **Design the error paths** (this is what separates toy automations from real ones)
   - For each step that can fail (API down, record missing, rate limit): decide **retry** (with backoff), **skip + log**, or **halt + alert**
   - Add a failure notification branch: Slack/email with the workflow name, failed step, and input payload — n8n: Error Workflow; Make: error handler routes; Zapier: built-in alerting + a "catch" path where possible
   - Note rate limits of the involved APIs and add batching/throttling steps if the trigger can burst

5. **Deliver the artifact**
   - **n8n**: write the full importable workflow JSON (`workflows/<name>_workflow.json`) — nodes, connections, and placeholder credentials named clearly (e.g., `{{HUBSPOT_CREDENTIAL}}`); never embed real secrets
   - **Zapier/Make**: write a numbered build sheet (`workflows/<name>_workflow.md`) — one section per step with exact app, event/module, field mappings, and filter formulas, in the order the user clicks through
   - Include a **test plan**: a sample trigger payload and the expected end state to verify after import

6. **Handoff checklist**
   - List credentials/connections the user must create (each app, which scopes), the dedup key chosen, and the failure-alert destination
   - Suggest a weekly "did it run?" check until trust is established — a heartbeat step or the platform's execution log
   - Point to siblings for pieces the platform does poorly: heavy parsing → `/automation--pdf-processing` or a code step; email logic → `/automation--email-automation`; pure time-based jobs with no app glue → `/automation--scheduled-tasks`

**Notes:**
- Fewer steps beat clever steps: every node is a failure point and (on Zapier/Make) a billable task
- Never put secrets in exported JSON or build sheets — always placeholder credential names
- Webhook triggers need a stable, secret URL; treat that URL as a credential
- If the workflow only moves data between two apps on a schedule, check whether a native integration already exists before building anything
- Volume matters: >1000 runs/day usually means n8n self-hosted or a real script, not per-task pricing

$ARGUMENTS
