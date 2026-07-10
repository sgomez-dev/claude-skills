---
description: Instrument LLM calls - tracing, token/cost tracking, quality dashboards, alerts
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Instrument an LLM application so every call is traced, costed, and quality-monitored — turning
"users say it feels worse" into inspectable data. Covers trace structure, token/cost accounting,
quality signals, dashboards, and alerting. This is the production counterpart to /ai--llm-eval
(offline evals) and feeds /ai--rag-eval and /ai--llm-cost-optimizer with real data.

Steps:

1. **Map what needs instrumenting** (`$ARGUMENTS`)
   - Find every LLM call site, plus the surrounding pipeline: retrieval steps, tool executions, agent loops, cache lookups — a "request" is usually a tree of spans, not one call
   - Detect what already exists: OpenTelemetry setup, a logging framework, an LLM-observability tool (Langfuse, LangSmith, Braintrust, Phoenix, provider dashboards…) — extend what's there rather than adding a parallel system

2. **Structure traces around one request = one trace**
   - Each trace carries: request ID, user/tenant ID (or hash), feature/route, prompt version, model ID
   - Each LLM span records: model, full input/output (or a redacted form — decide the PII policy now, not later), input/output/cached token counts, latency (with time-to-first-token if streaming), finish reason, error if any
   - Non-LLM spans (retrieval, tool calls, cache hits) get the same treatment so slow or wrong steps are attributable; propagate the trace ID through queues and background jobs

3. **Track tokens and cost per call, then aggregate**
   - Compute cost at the span level from the provider's per-model prices; account for cache-read and cache-write token rates separately where the provider bills them differently (e.g. Anthropic prompt caching)
   - Keep the price table in config with the model IDs (e.g. `claude-sonnet-5`, `claude-haiku-4-5`; other providers analogous) so a price or model change is one edit
   - Aggregate by feature, user/tenant, model, and prompt version — "cost per successful task" is the number that matters, not raw spend

4. **Add quality signals to production traffic**
   - Explicit: thumbs up/down, user edits/regenerations, escalations to a human — attach them to the trace ID
   - Implicit: retries, abandoned sessions, refusal/finish-reason anomalies, guardrail triggers (/ai--guardrails), tool-call error rates
   - Sampled LLM-judge scoring: run a rubric-based judge (a strong model such as `claude-opus-4-8`, or an equivalent on other providers) over a small percentage of traces asynchronously — never in the request path; reuse the rubric from /ai--llm-eval so offline and online scores are comparable

5. **Build the dashboards and alerts**
   - Operational: request volume, error rate, p50/p95/p99 latency and time-to-first-token, by model and feature
   - Cost: daily spend, cost per request and per successful task, cache hit rate, top spenders by feature/tenant
   - Quality: judge-score trend, feedback rate, refusal rate, per prompt version — every prompt or model rollout must be visible as an annotated line on these charts
   - Alert on deltas, not absolutes: error-rate spikes, cost per request jumping after a deploy, judge scores dropping vs the trailing baseline

6. **Verify the instrumentation itself**
   - Trace one known request end-to-end and confirm every span, token count, and cost figure matches the provider's usage report within rounding
   - Reconcile a day of computed cost against the provider invoice/dashboard — silent under-counting (missing call sites) is the most common failure; grep the repo for uninstrumented client usage
   - Feed the loop: flagged and thumbs-down traces become new cases for /ai--llm-eval and /ai--rag-eval golden sets

**Notes:**
- Log prompts/outputs with an explicit retention window and redaction policy — traces are the easiest place to accidentally hoard PII
- Instrument before optimizing: /ai--llm-cost-optimizer and /ai--semantic-cache both need this data to prove their savings
- Sampling is fine for judge scoring; it is not fine for cost and error accounting — count every call
- One trace ID from user click to final token; if you can't follow a single bad answer through the whole pipeline, the instrumentation isn't done

$ARGUMENTS
