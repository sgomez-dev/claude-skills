---
description: Add consumer-driven contract tests (Pact-style) between services
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*", "**/*_test.*", "pacts/**", "contracts/**", "package.json", "requirements*.txt", ".github/workflows/**"]
  commands: ["npm", "npx", "pytest", "mvn", "gradle", "go test", "dotnet test"]
  network: false
  destructive: false
---

Set up consumer-driven contract testing so integration breakages between services are caught at
build time — without spinning up both services together. The consumer declares what it actually
uses; the provider proves it still honors that.

Steps:

1. **Map the service interactions**
   - Find outbound calls in this repo: HTTP clients (fetch/axios/requests/RestTemplate), generated SDKs, message publishers/consumers
   - Identify which role this repo plays per interaction: **consumer**, **provider**, or both
   - Note existing integration/E2E tests that contract tests could replace or thin out

2. **Choose tooling for the stack**
   - **Pact** is the default: pact-js, pact-python, pact-jvm, pact-go, pact-net — pick the binding matching each service's language
   - **Spring Cloud Contract** if the org is Spring-centric on the provider side
   - **Spec-based verification** (validate requests/responses against an OpenAPI spec) when a maintained spec is the source of truth and full Pact adoption is too heavy — say so explicitly if recommending this lighter path

3. **Write consumer tests first**
   - One contract per consumer→provider pair; each interaction = expected request + minimal expected response
   - Exercise the *real* client code against the Pact mock provider — never hand-construct requests the app doesn't actually send
   - Use matchers (type, regex, eachLike) instead of exact values; only include fields the consumer actually reads — extra provider fields must not break the contract
   - Cover error interactions too (404, 401, validation errors) since consumers must handle them

4. **Verify on the provider side**
   - Add a provider verification test that replays each contract against the running provider (test instance, in-process if possible)
   - Implement **provider states** ("given user 42 exists") as data-setup hooks per interaction, each independent and idempotent
   - Failures here mean a real incompatibility — fix the provider or renegotiate the contract, never loosen matchers to pass

5. **Share contracts and gate CI**
   - With a Pact Broker/PactFlow available: publish on consumer CI, verify on provider CI, gate deploys with `can-i-deploy` (broker access needs network — flag this to the user)
   - Without a broker: commit generated pacts to a `pacts/` or `contracts/` directory, or exchange them as CI artifacts between pipelines — fully local and a fine starting point
   - Document the breaking-change workflow: expand (provider adds new shape) → migrate consumers → contract (remove old shape)

**Notes:**
- Contract tests verify the *shape of the conversation*, not business logic — keep them thin; they complement, not replace, unit tests
- A contract asserting fields nobody reads creates false coupling; audit contracts when consumers change
- Message/queue interactions get the same treatment (Pact message pacts) — don't leave async paths uncovered
- Keep provider state names human-readable; they become the shared vocabulary between teams

$ARGUMENTS
