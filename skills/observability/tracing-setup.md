---
description: Instrument distributed tracing with OpenTelemetry spans and context propagation
permissions:
  reads: ["**/*"]
  writes: ["src/**", "lib/**", "app/**", "config/**", "**/*.md", "**/*.yml", "**/*.yaml"]
  commands: []
  network: false
  destructive: false
---

Instrument the service (or services) with distributed tracing so a single request can be followed
across process boundaries: OpenTelemetry SDK setup, auto-instrumentation where it exists, manual
spans where it matters, and W3C context propagation across HTTP, gRPC, queues, and jobs. Write
working instrumentation code for the detected stack — this skill is about instrumenting; for
debugging an existing failure with traces use `/debugging--distributed-trace`.

Steps:

1. **Detect stack and existing tracing state**
   - Identify language/framework from manifests and entry points (package.json, pyproject.toml, go.mod, pom.xml, *.csproj, Gemfile)
   - Search for existing tracing: OTel SDK/API packages, `otel-collector` config, dd-trace/Datadog APM, New Relic, Sentry performance, Jaeger/Zipkin clients, `traceparent`/`X-B3-*` header handling in middleware
   - Check for a backend to send traces to: collector endpoints in config/env, vendor agents in Docker/k8s manifests, docker-compose services (Jaeger, Tempo, Zipkin)
   - Decide the path: extend existing instrumentation; if none, use the OpenTelemetry SDK with OTLP export (vendor-neutral) — vendor SDKs only if the repo is clearly committed to one. Report findings and confirm before writing code

2. **Bootstrap the SDK and auto-instrumentation**
   - Create one tracing module that initializes the tracer provider at process start (before other imports where the language requires it, e.g. Node) with: service name, version, environment as resource attributes, OTLP exporter endpoint from config/env, and a batch span processor
   - Enable the ecosystem's auto-instrumentation for what the service actually uses: HTTP server/client, gRPC, DB drivers, Redis, message clients — these give the skeleton of every trace for free
   - Configure sampling honestly: parent-based + ratio head sampling as default; note that tail sampling (keep all errors/slow traces) needs a collector and recommend it if one exists

3. **Add manual spans where auto-instrumentation is blind**
   - Find the gaps: business operations inside a request (e.g. `calculate_pricing`, `render_invoice`), queue consumers, scheduled jobs, batch loops — wrap each meaningful unit in a span with a low-cardinality name (operation, not IDs in the name)
   - Set span attributes following OTel semantic conventions where one exists (`http.*`, `db.*`, `messaging.*`); put IDs and domain context in attributes (`order.id`, `tenant.id`), never in span names
   - Record errors properly: set span status to error and record the exception on the span in catch blocks — a trace that hides the failure is worthless
   - Don't over-span: one span per meaningful unit of work; a span around every function call is noise and overhead

4. **Wire context propagation across every boundary**
   - HTTP/gRPC: verify auto-instrumentation injects and extracts W3C `traceparent` (and `baggage` if used); add B3 propagators only if an existing service in the chain requires them
   - Queues and events: inject trace context into message headers/attributes on publish, extract on consume, and start the consumer span as a child (or link) of the producer context — this is the most commonly missed hop
   - Background jobs spawned by a request: capture the context at enqueue time, restore it in the worker
   - Cross-service: if other services in the repo/org lack instrumentation, list them in dependency order — a trace is only as complete as its least-instrumented hop

5. **Connect traces to logs and metrics**
   - Inject `trace_id` and `span_id` into every log line via the logging integration (see `/observability--logging-strategy`) so an alert can jump from metric → trace → logs
   - If metrics exist, note exemplar support so latency histograms can link to sample traces (`/observability--metrics-setup`)

6. **Validate and document**
   - Describe (or add) a local check: run the service with a local collector or console exporter, make one request that crosses at least two boundaries, and confirm a single trace with parented spans appears
   - Write `docs/tracing.md`: how the SDK is initialized, sampling config, propagation formats in use, span naming/attribute conventions, and how to add a span to new code
   - Point to next steps: `/observability--slo-sli` for latency SLIs from span data, `/observability--alerting-rules` for alerting on the resulting signals

**Notes:**
- Metrics detect, traces localize, logs explain — traces exist to answer "where in the chain did the time or error go", not to replace logs
- Cardinality discipline applies to span names exactly like metric labels: `GET /users/{id}`, never `GET /users/42`
- Prefer OTel semantic conventions over invented attribute names — dashboards and vendors understand the standard ones
- Never double-instrument: if a vendor agent (dd-trace, New Relic) is already tracing, configure it rather than layering the OTel SDK on top, and note the trade-off
- Sampling keeps costs sane but 100% of errors should survive it — if head sampling can't guarantee that, say so and recommend collector-side tail sampling

$ARGUMENTS
