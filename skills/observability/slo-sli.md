---
description: Define SLIs/SLOs from user journeys with error budgets and burn-rate alerts
permissions:
  reads: ["**/*"]
  writes: ["docs/**", "config/**", "**/*.md", "**/*.yml", "**/*.yaml"]
  commands: []
  network: false
  destructive: false
---

Define Service Level Indicators and Objectives grounded in what users actually do: identify the
critical user journeys, express each as a measurable SLI from telemetry the service already emits,
set achievable SLO targets with explicit error budgets, and write multi-window burn-rate alert
rules so the SLOs actually protect users instead of decorating a slide.

Steps:

1. **Detect the stack and available signals**
   - Identify the service type (user-facing API, web app, pipeline, batch) from the code and manifests
   - Inventory measurable telemetry: metrics endpoints and instrumentation (`/observability--metrics-setup`), traces (`/observability--tracing-setup`), load balancer / gateway logs, existing dashboards (Grafana, Datadog), any existing SLO tooling (Sloth, Pyrra, Datadog SLOs, Nobl9 configs)
   - An SLI must come from data that exists today — list journeys that cannot yet be measured as instrumentation gaps rather than inventing numbers

2. **Identify critical user journeys**
   - From routes, handlers, and docs, enumerate what users do with the service; rank by user impact and pick the **top 3-5 journeys** (e.g., "log in", "search products", "complete checkout", "ingest an event end-to-end")
   - For each journey note the entry point that best represents it (route/endpoint/queue) and who the "user" is — a human, or a downstream service with its own SLO
   - Confirm the list with the user before writing definitions: journeys are a product decision, not a grep result

3. **Define SLIs as good/total ratios**
   - For each journey pick 1-2 SLI types: **availability** (non-5xx responses / total), **latency** (responses faster than threshold / total — pick the threshold from observed user-tolerance, typically near current p90-p99), **quality/freshness** for pipelines (records processed within N minutes / total)
   - Write each SLI as an exact measurable expression against the detected telemetry (PromQL, Datadog query, log filter), specifying the exclusions honestly: health checks, bots, client-caused 4xx
   - Measure as close to the user as possible (load balancer over app server over unit test) and state where the measurement point is

4. **Set SLO targets and error budgets**
   - Base targets on observed history where available: a target the service already misses monthly is fiction, a target far above what users need is wasted engineering — start slightly above current performance and tighten deliberately
   - Choose the window (28/30-day rolling is the sane default) and compute the error budget explicitly: 99.9% over 30 days = 43.2 minutes of full downtime or the equivalent partial failure
   - Document the budget policy: what the team does when the budget is exhausted (freeze risky launches, prioritize reliability work) — an SLO with no consequence is a dashboard, not an objective

5. **Write burn-rate alerts**
   - Generate multi-window multi-burn-rate rules for the detected alerting stack (or via Sloth/Pyrra if present): fast burn (e.g., 14.4x over 1h + 5m windows → page) and slow burn (e.g., 3x over 6h/30m, 1x over 3d → ticket)
   - These replace static error-rate alerts for the covered journeys — coordinate with `/observability--alerting-rules` for routing, dedup, and runbook links rather than duplicating that logic
   - Add a recording rule / precomputed SLI where the query is expensive

6. **Deliver the SLO document and review cadence**
   - Write `docs/slo.md`: per journey — SLI definition (exact query), target, window, current measured value if obtainable from repo config, error budget in minutes, budget policy, owning team
   - Commit the SLO/alert rule files where the repo keeps monitoring config
   - Recommend a quarterly SLO review (targets vs. reality vs. user complaints) and point to `/observability--incident-response` for budget-burning incidents and `/observability--postmortem` for learning from them

**Notes:**
- 3-5 SLOs that the team actually defends beat 30 that nobody reads — every added SLO dilutes attention on the rest
- 100% is never the target: the error budget is the license to ship; a service that never burns budget is over-invested in reliability or under-measured
- SLIs measure user experience, not infrastructure health — CPU has no SLO, "checkout works fast" does
- Beware averages: latency SLIs use threshold ratios or percentiles, never mean latency
- If dependencies have no SLOs, your target is capped by theirs — note the composite math instead of promising what upstream can't deliver

$ARGUMENTS
