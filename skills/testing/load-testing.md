---
description: Load-test setup — choose k6/Locust/Artillery, scenarios, thresholds, CI gate
permissions:
  reads: ["**/*"]
  writes: ["load/**", "loadtest/**", "*.js", "*.py", "*.yml", "*.yaml", ".github/workflows/**", "package.json", "Makefile"]
  commands: ["k6", "locust", "artillery", "npx", "npm", "pip", "docker compose"]
  network: false
  destructive: false
---

Set up realistic load testing for this project: pick the right tool for the stack, model real
traffic as scenarios, define explicit pass/fail thresholds, and add a lightweight smoke gate to CI
so performance regressions are caught before deploy.

Steps:

1. **Detect the stack and the target**
   - Identify language/framework (package.json, requirements.txt, go.mod, pom.xml, etc.) and how the app runs locally (dev server, docker-compose)
   - Enumerate the endpoints or user flows worth loading: from route definitions, an OpenAPI spec, or `$ARGUMENTS`
   - Check for existing load tests or perf budgets before introducing new tooling

2. **Choose the tool — and justify the choice**
   - **k6**: JS scripting, first-class thresholds and CI story — the default for HTTP/API load regardless of the app's language
   - **Locust**: when the team is Python-native or needs complex user behavior / custom protocol clients
   - **Artillery**: when the team prefers config-first YAML scenarios or needs the built-in Playwright engine for browser-level load
   - Prefer whatever is already installed or used in the org; never introduce a second load tool alongside an existing one

3. **Design scenarios, not just requests**
   - Model 2-4 realistic user journeys (e.g., login → browse → checkout) with think time and varied data (CSV feeds, generated payloads) — not one hammered endpoint
   - Define distinct profiles: **smoke** (1-5 VUs, ~1 min), **load** (expected peak, 10-15 min), **stress** (ramp past peak until degradation), **soak** (expected load, 1-2 h). Implement smoke + load first
   - Parameterize target URL, VUs, and duration via env vars so the same script runs locally and in CI

4. **Set thresholds that fail the run**
   - p95/p99 latency per flow (e.g., k6 `http_req_duration: ['p(95)<500']`), error rate (< 1%), and a throughput floor
   - Derive numbers from an SLO if one exists; otherwise run a baseline and set thresholds at baseline +20-30%, tightening over time
   - Tag requests per endpoint/flow so failures are attributable to a specific journey

5. **Run a baseline locally and interpret**
   - Start the app locally, run the smoke profile, then the load profile
   - Report: p50/p95/p99 per flow, error breakdown, achieved throughput, and the first resource to saturate (CPU, DB pool, memory) if observable
   - Distinguish server bottlenecks from load-generator bottlenecks (client CPU maxed = results invalid)

6. **Wire into CI**
   - Add a CI job (matching the repo's CI system) that runs the **smoke** profile on PRs and the **load** profile nightly or pre-release, failing on threshold breach
   - Upload the results summary as a build artifact
   - Document how to run each profile (README section in the load directory or script header comments)

**Notes:**
- Never point load tests at production or third-party services; targets must be local or ephemeral. Pointing at a remote staging URL is the user's explicit call and requires network access beyond this skill's scope
- Keep the CI smoke run under ~2 minutes; heavy profiles belong in scheduled jobs
- One tool, one directory (`load/` or `loadtest/`), consistent naming — resist scattering scripts
- Warm up the app before measuring; the first requests after boot are not representative

$ARGUMENTS
