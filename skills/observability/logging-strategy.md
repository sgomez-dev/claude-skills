---
description: Design structured logging: levels, correlation IDs, PII redaction, retention
permissions:
  reads: ["**/*"]
  writes: ["src/**", "lib/**", "app/**", "config/**", "**/*.md"]
  commands: []
  network: false
  destructive: false
---

Audit the project's current logging and design (or retrofit) a structured logging strategy: JSON
output, consistent levels, correlation IDs on every request, PII redaction at the source, and a
retention policy. Deliver working logger configuration and migrated call sites, not just advice.

Steps:

1. **Detect the stack and current logging state**
   - Identify language/framework from manifests (package.json, pyproject.toml, go.mod, pom.xml, *.csproj, Gemfile)
   - Find existing logging: libraries in use (winston, pino, logrus, zap, structlog, logback, Serilog), raw `console.log`/`print`/`fmt.Println` call sites, and any log shipper config (Datadog agent, Fluentd/Fluent Bit, Vector, CloudWatch, Loki/Promtail)
   - Note existing observability tooling (Sentry, Datadog, Grafana stack, OpenTelemetry) — the strategy must feed into it, not fight it
   - Summarize findings: current library, % of unstructured call sites, whether logs are JSON, whether any request ID exists

2. **Define the logging contract**
   - **Format**: structured JSON (or the platform's native structured format), one event per line
   - **Levels** with concrete rules: ERROR = needs human action, WARN = degraded but self-healing, INFO = business-relevant state changes, DEBUG = development detail (off in production)
   - **Standard fields** on every entry: timestamp (UTC ISO-8601), level, message, service, environment, version, `trace_id`/`correlation_id`
   - **Event fields**: prefer key-value context (`user_id`, `order_id`, `duration_ms`) over string interpolation into the message

3. **Implement correlation IDs**
   - Add middleware/interceptor for the detected framework that: reads an incoming trace context (W3C `traceparent` or `X-Request-ID`), generates one if absent, stores it in request-scoped context (AsyncLocalStorage, contextvars, context.Context, MDC), and injects it into every log line automatically
   - Propagate the ID to outgoing HTTP calls, queue messages, and background jobs
   - If OpenTelemetry is already present, use its trace/span IDs instead of inventing a parallel ID scheme (see `/observability--tracing-setup`)

4. **Implement PII redaction at the source**
   - Build a redaction layer in the logger config (serializers/processors/filters) — never rely on downstream scrubbing alone
   - Default deny-list: passwords, tokens, API keys, cookies, authorization headers, emails, phone numbers, national IDs, card numbers; adapt to the domain found in the code (health, finance → stricter)
   - Grep the codebase for call sites currently logging request bodies, headers, or user objects wholesale, and fix them
   - Document what is intentionally logged (e.g., internal user ID is OK; email is not)

5. **Migrate call sites**
   - Replace unstructured calls (`console.log`, `print`, string-concatenation logging) with the structured logger, converting interpolated values into fields
   - Fix level misuse: errors logged at INFO, noisy DEBUG left at INFO, `catch` blocks that swallow errors silently — those should log ERROR with the stack and context
   - For large codebases, migrate the hot paths (request handlers, error handlers, jobs) first and list the remainder

6. **Define retention and sampling policy**
   - Recommend per-level retention based on the detected platform (e.g., DEBUG 3-7 days, INFO 30 days, WARN/ERROR 90+ days or per compliance needs) and write it into the shipper/platform config where possible
   - Add sampling only for genuinely high-volume, low-value events (health checks, per-item loops) — never sample ERROR
   - Estimate volume impact if switching everything to JSON increases size

7. **Deliver**
   - Working logger module/config committed into the codebase, middleware wired in, redaction tests if a test suite exists
   - `docs/logging.md` (or the project's docs dir): the contract, level rules, standard fields, redaction list, retention policy
   - Suggest next steps: `/observability--metrics-setup` for what should be a metric instead of a log, `/observability--alerting-rules` for alerting on ERROR patterns

**Notes:**
- Logs are for investigation, metrics are for detection — if someone wants to alert on a log pattern, it usually should become a metric or an SLO instead
- Never log secrets "temporarily for debugging"; redaction must be structural, not disciplinary
- Match the project's conventions: don't introduce a new logging library if a maintained one is already in use — configure it properly instead
- One event per action: avoid multi-line log stories ("starting X... done X") when a single completion event with `duration_ms` and `outcome` says more
- If the project has no log aggregation at all, flag it — structured logs into a local file are only half the value

$ARGUMENTS
