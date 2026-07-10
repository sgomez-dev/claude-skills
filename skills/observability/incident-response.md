---
description: Set up an incident response process with severity matrix, roles, and comms
permissions:
  reads: ["**/*"]
  writes: ["docs/**", ".github/**", "**/*.md"]
  commands: []
  network: false
  destructive: false
---

Design a right-sized incident response process for this team: a severity matrix tied to user
impact, clear roles that work even with two people on call, communication templates that remove
composition under stress, and a timeline discipline that makes the postmortem cheap. Deliver it
as committed documentation and templates, sized to the org that actually exists — not a copy of
a 500-engineer company's process.

Steps:

1. **Detect current state and team scale**
   - Search the repo for existing process artifacts: `docs/` incident/runbook/on-call pages, PagerDuty/Opsgenie/incident.io/Statuspage config or integrations, issue templates, CODEOWNERS and team structure hints, existing severity labels in the tracker
   - Detect the observability reality the process will lean on: alerting (`/observability--alerting-rules`), SLOs (`/observability--slo-sli`), dashboards, runbooks — an incident process without detection is theater; flag gaps
   - Estimate team scale from contributors/CODEOWNERS and ask the user to confirm: on-call rotation size, whether there is a support/comms function, and where incidents are coordinated (Slack, Teams, a tool)

2. **Define the severity matrix by user impact**
   - Three to four levels, each defined by what users experience plus response expectations. A workable default:
     - **SEV1** — critical journey down or data loss for many users → page immediately, all-hands response, status page update, exec notification
     - **SEV2** — critical journey degraded, or down for a subset → page on-call, dedicated responder, status page if user-visible
     - **SEV3** — minor feature broken, workaround exists → business-hours ticket, no page
     - (**SEV4/notable** — cosmetic or internal-only, normal backlog)
   - Anchor each level to this system's actual journeys and SLOs where they exist ("checkout error rate > X%" is SEV1) — vague levels get argued about mid-incident
   - Add the two rules that prevent paralysis: **when unsure, pick the higher severity**, and **anyone can declare an incident** — severity can be lowered later without blame

3. **Define roles that scale down**
   - **Incident Commander (IC)**: owns coordination and decisions, explicitly does not debug; **Responder(s)**: hands on keyboard; **Comms lead**: updates stakeholders/status page (folded into IC below SEV1 or in small teams); **Scribe**: keeps the timeline (may be a bot/channel history in small teams)
   - State the one non-negotiable: the IC role always exists, even solo — a solo responder wearing the IC hat still does the IC duties (declare, communicate on cadence, escalate)
   - Define handover: incidents outlasting a few hours rotate the IC with an explicit written handover message

4. **Write the communication templates**
   - Ready-to-fill templates so nobody composes under adrenaline: **declaration** (severity, impact in user terms, IC, channel/bridge link), **periodic update** (current impact, what's been tried, next step, next update time — cadence: SEV1 every 30 min, SEV2 hourly), **status page draft** in plain user language (no internal service names), **resolution notice** (impact summary, duration, postmortem promise)
   - Include the escalation ladder: who is paged when the on-call is stuck, with the rule that escalating early is free and escalating late is expensive
   - Put templates where the team will actually grab them: `docs/incident-response/templates.md` plus an issue template in `.github/ISSUE_TEMPLATE/` if the repo uses GitHub issues for tracking

5. **Define timeline and evidence discipline**
   - The scribe/IC timestamps in the incident channel as events happen: detection, declaration, hypotheses, actions taken (with who), mitigations, recovery — the channel is the raw timeline, no separate doc during the fire
   - Actions before analysis: the process states explicitly that **mitigate first** (rollback, feature-flag off, failover) **beats diagnose** during impact; diagnosis resumes after users are safe
   - Preserve evidence when mitigating destructively: capture logs/dashboards/pod state before restarting things, so the postmortem isn't archaeology

6. **Deliver and close the loop**
   - Write `docs/incident-response/README.md` (process, matrix, roles, escalation) and `templates.md`; keep the whole thing short enough to read while paged — one page of process, templates behind it
   - Wire the exits: every SEV1/SEV2 gets `/observability--postmortem` within a week; recurring diagnosis steps get captured via `/observability--runbook-gen`
   - Recommend a game day / tabletop exercise on one realistic scenario to validate the process before a real SEV1 does

**Notes:**
- The process must be blameless from declaration onward — people who fear declaring incidents create longer outages; measure time-to-declare, not who caused it
- Severity measures user impact, never effort or embarrassment — a one-line config fix that took checkout down is still SEV1
- Fewer, clearer rules beat exhaustive flowcharts: if the on-call can't recall the process at 3 a.m., it's too long
- Communication is half the incident: a stakeholder update on a reliable cadence prevents the "any news?" pings that destroy responder focus
- Keep the process document versioned in the repo and update it in every postmortem that reveals a process gap — a static process document is a decaying one

$ARGUMENTS
