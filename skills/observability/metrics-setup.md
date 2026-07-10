---
description: Instrument app metrics with RED/USE method via Prometheus or OpenTelemetry
permissions:
  reads: ["**/*"]
  writes: ["src/**", "lib/**", "app/**", "config/**", "**/*.md", "**/*.yml", "**/*.yaml"]
  commands: []
  network: false
  destructive: false
---

Instrument the application with a small, high-signal set of metrics using the RED method for
request-driven services (Rate, Errors, Duration) and the USE method for resources (Utilization,
Saturation, Errors). Write real instrumentation code for the detected stack — not a generic
metrics lecture — and keep cardinality under control.

Steps:

1. **Detect stack and existing metrics tooling**
   - Identify language/framework from manifests and entry points
   - Search for existing instrumentation: Prometheus client libraries, OpenTelemetry SDK/collector config, StatsD, Micrometer, Datadog (`datadog.yaml`, dd-trace), Grafana/Prometheus config in the repo, `/metrics` endpoints, ServiceMonitor/PodMonitor manifests
   - Decide the export path: extend what exists; if nothing exists, prefer OpenTelemetry SDK with a Prometheus exporter (vendor-neutral) unless the repo clearly commits to one vendor
   - Report what was found and confirm the approach before writing code

2. **Map what to measure**
   - Enumerate the service's request surfaces: HTTP routes, gRPC methods, message consumers, scheduled jobs
   - Enumerate its resources/dependencies: DB pools, caches, queues, thread pools, external APIs
   - For each surface pick **RED**: request rate, error rate (by status class, not raw status code), duration histogram
   - For each resource pick **USE**: utilization (e.g., pool in-use/size), saturation (queue depth, wait time), errors (connection failures, timeouts)
   - Add 2-5 **business metrics** only if they map to a user journey (orders placed, signups completed) — coordinate with `/observability--slo-sli`

3. **Implement instrumentation**
   - Use framework middleware/auto-instrumentation first (one middleware covers all routes) — add manual instrumentation only for consumers, jobs, and dependency clients that middleware misses
   - Follow naming conventions of the chosen ecosystem: Prometheus style `http_server_request_duration_seconds` with `unit` suffix, or OTel semantic conventions (`http.server.request.duration`)
   - Histograms for durations (with buckets fitting the service's actual latency range), counters for events, gauges only for current-state values
   - **Cardinality guard**: labels only from bounded sets (route template not raw URL, status class, method). Never label by user ID, request ID, or unbounded input

4. **Wire the export path**
   - Expose `/metrics` (Prometheus) or configure the OTLP exporter/collector endpoint; add scrape config or ServiceMonitor if k8s manifests exist in the repo
   - Ensure runtime/system metrics are on (GC, heap, event loop lag, goroutines — whatever the runtime offers via its standard instrumentation package)
   - Keep endpoint and exporter settings in config/env, not hardcoded

5. **Validate and document**
   - If the project can run locally, describe (or add) a quick check: hit the service, then confirm counters and histogram buckets move on the metrics endpoint
   - Write `docs/metrics.md`: table of every metric — name, type, labels, what question it answers, which dashboard/alert should use it
   - Point to next steps: `/observability--alerting-rules` to alert on these metrics symptomatically, `/observability--slo-sli` to pick the 1-3 that become SLIs

**Notes:**
- Fewer metrics, well-labeled, beat hundreds of unused ones — every metric should answer a question someone will actually ask during an incident
- Cardinality is the silent killer of metrics bills and query speed; when in doubt, drop the label
- Don't duplicate what auto-instrumentation already emits — check before adding manual counters for HTTP requests
- Metrics detect, traces localize, logs explain: if a metric needs per-request detail, that detail belongs in a trace (`/observability--tracing-setup`)
- If both Prometheus and a vendor agent are present, pick one export path and note the migration, don't double-emit

$ARGUMENTS
