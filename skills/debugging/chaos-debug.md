---
description: Stress-test code with fault injection, edge cases, and chaos scenarios to find hidden bugs
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm test", "pytest", "go test", "cargo test", "node", "python", "timeout", "ulimit"]
  network: false
  destructive: false
---

Systematically break the specified code by injecting faults, extreme inputs, and chaos scenarios to uncover hidden bugs before production does.

Steps:
1. Read the target code and build an attack surface map:
   - All inputs: function parameters, API request bodies, environment variables, file reads
   - All external dependencies: databases, APIs, file system, network, clock, randomness
   - All state transitions: initialization, steady state, shutdown, error recovery
   - All resource limits: memory, file descriptors, disk space, connection pools, thread pools
2. Design chaos scenarios by category (escalating severity):

   **Level 1 — Boundary inputs**:
   - Null, undefined, empty string, empty array, empty object
   - Zero, negative numbers, MAX_SAFE_INTEGER, Infinity, NaN
   - Unicode edge cases: emoji, RTL text, null bytes, 4-byte characters, zalgo text
   - Extremely long strings (1MB+), deeply nested objects (1000+ levels)
   - SQL injection strings, XSS payloads, path traversal (`../../etc/passwd`)

   **Level 2 — Timing chaos**:
   - Inject artificial delays (simulate slow DB, slow network)
   - Call functions out of expected order (use before init, double init, use after close)
   - Concurrent access: call same function from multiple "threads" simultaneously
   - Clock skew: mock time jumping forward/backward

   **Level 3 — Dependency failures**:
   - Database connection refused, query timeout, deadlock
   - HTTP 500, 429, network timeout, DNS failure, SSL error
   - File system: permission denied, disk full, file locked by another process
   - Out of memory conditions (allocate until failure)

   **Level 4 — Partial failures**:
   - Kill process mid-transaction (data consistency check)
   - Network partition between services (split-brain)
   - Partial writes: file written halfway, response truncated
   - Queue message delivered twice (idempotency check)
   - Database constraint violation mid-batch

   **Level 5 — Adversarial combinations**:
   - Combine Level 1-4: slow network + large input + concurrent access
   - Rapid state transitions: create-delete-create in milliseconds
   - Resource exhaustion cascade: full disk + high memory + connection pool maxed
   - Poison pill: one bad record in a batch of 10,000
3. For each scenario, write a concrete test:
   - Use the project's existing test framework
   - Mock/stub external dependencies to simulate failures
   - Assert on: correct error handling, no data corruption, proper cleanup, graceful degradation
4. Run the chaos tests and categorize findings:
   - 🔴 **Critical**: Data corruption, security vulnerability, crash without recovery
   - 🟡 **High**: Silent failure, wrong result returned, resource leak
   - 🟠 **Medium**: Poor error message, missing retry, no timeout
   - 🔵 **Low**: Unhandled edge case with minimal impact
5. For each finding, provide:
   - The exact reproduction scenario
   - The root cause in the code
   - The fix with defensive coding patterns
   - The permanent test to prevent regression

Target code or module: $ARGUMENTS
