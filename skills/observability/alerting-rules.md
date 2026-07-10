---
description: Design symptom-based alerting with thresholds, severity, routing, and dedup
permissions:
  reads: ["**/*"]
  writes: ["config/**", "**/*.yml", "**/*.yaml", "**/*.json", "**/*.tf", "**/*.md"]
  commands: []
  network: false
  destructive: false
---

Design (or prune) the service's alerting so that every page means a user is hurting and every
alert links to an action. Audit what fires today, replace cause-based noise with a small set of
symptom-based rules, and write the actual rule definitions for the detected alerting stack —
Prometheus/Alertmanager, Grafana, Datadog monitors, or CloudWatch alarms.

Steps:

1. **Detect the alerting stack and current rules**
   - Find the monitoring backend and rule format in the repo: Prometheus rule files / PrometheusRule CRDs, Alertmanager config, Grafana alert provisioning, Datadog monitors (Terraform `datadog_monitor`, JSON exports), CloudWatch alarms in Terraform/CloudFormation/CDK, PagerDuty/Opsgenie/Slack integrations
   - Inventory existing rules: for each, note what it measures, threshold, severity, and destination. Flag the classic noise patterns: CPU/memory/disk alerts with no user impact, alerts on a single instance in a redundant pool, alerts with no runbook, thresholds nobody remembers choosing
   - Check what signals exist to alert on: metrics (`/observability--metrics-setup`), SLO definitions (`/observability--slo-sli`), health checks — if there is nothing measurable, stop and instrument first

2. **Choose symptoms, not causes**
   - Enumerate the service's user-facing symptoms: availability (error ratio), latency (slow requests above target), correctness (failed jobs, stuck queues, data freshness), and — only where users feel it — saturation about to become one of those (disk full on a database, certificate expiry)
   - For each symptom write the alert intent in one sentence: "page when users can't check out", not "page when pod restarts"
   - Cause-based signals (high CPU, GC pauses, connection pool exhaustion) become dashboard panels or non-paging tickets, not pages — they are for diagnosis after the symptom fires
   - If SLOs exist, prefer burn-rate alerts over static thresholds and coordinate with `/observability--slo-sli` instead of duplicating

3. **Set thresholds and durations that survive contact with reality**
   - Base thresholds on observed baselines where history exists (percentiles of the last weeks), not round numbers; state the assumption when no history exists and mark the threshold for review after two weeks
   - Every rule gets a `for`/evaluation window long enough to skip blips but short enough to matter — pair a fast window for paging with a slower one for warning where the stack supports it
   - Alert on ratios and rates, never raw counts (`errors/requests > 2%`, not `errors > 100`), so rules survive traffic growth
   - Make each rule scale-aware: aggregate across replicas; one dead instance behind a healthy load balancer is a ticket, not a page

4. **Assign severity and routing**
   - Two-tier model unless the org already has one: **page** (user-impacting now, wakes a human, must have a runbook) and **ticket/warn** (needs action this week, goes to a queue or channel) — resist a five-level matrix nobody applies consistently
   - Write the routing config for the detected stack: Alertmanager routes/receivers, Datadog notification handles, Grafana contact points — severity and team labels on the rule drive the route
   - Every paging rule carries annotations: summary (what the user experiences), dashboard link, and `runbook_url` — generate missing runbooks with `/observability--runbook-gen`

5. **Deduplicate and silence deliberately**
   - Group related firings into one notification: group by alertname + service (Alertmanager `group_by`, Datadog multi-alert aggregation) so a 20-pod incident is one page, not twenty
   - Add inhibition/dependency rules where the stack supports them: when the datacenter/dependency alert fires, suppress the downstream per-service ones
   - Configure repeat/renotify intervals so an acked incident doesn't re-page every minute, and document how to silence during planned maintenance

6. **Deliver and schedule the pruning**
   - Write the rule files/Terraform into the repo where such config already lives; keep thresholds in one reviewable place, not scattered
   - Write `docs/alerting.md`: table of every rule — name, symptom, threshold, severity, route, runbook link — plus the list of rules deleted or demoted and why
   - Recommend a monthly review ritual: any alert that fired without causing action gets tuned, demoted, or deleted; point to `/observability--incident-response` for what happens once a page fires

**Notes:**
- Every page must be actionable, urgent, and user-visible — if the responder's first thought is "so what?", the rule is a dashboard panel wearing a pager
- Deleting a noisy alert is a safety improvement: alert fatigue causes missed real pages; track pages/week per person as the health metric
- Never alert on the absence of instrumentation you just imagined — only rules whose query returns data today go live; the rest are listed as blocked on instrumentation
- Test the failure mode of the alerting itself: a dead-man's-switch/heartbeat alert catches the monitoring pipeline going dark
- Match the repo's config conventions (Terraform vs raw YAML vs provisioning dirs) — a rule nobody can find is a rule nobody maintains

$ARGUMENTS
