---
description: Design rate limiting: algorithms, per-route budgets, headers, distributed state
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Add rate limiting that protects the system from abuse and runaway cost without punishing legitimate users —
with the right algorithm, sane per-route budgets, and correct behavior behind a load balancer.

Steps:

1. **Detect the stack and threats** (`$ARGUMENTS`)
   - Identify the framework, existing middleware, and any current limiting from the repo
   - Clarify what you're protecting against: brute-force auth, scraping, expensive endpoints, cost control on an LLM/API
   - Note whether the app runs single-instance or multi-instance (this decides the state store)

2. **Choose the algorithm**
   Pick and justify: token bucket (bursty, most common), sliding window (smooth), fixed window (simplest, has
   edge bursts), or leaky bucket. Explain the trade-off for this use case.

3. **Set per-route budgets**
   Don't apply one global limit. Define tiers: strict on auth/write/expensive endpoints, generous on cheap reads.
   Choose the key (IP, user ID, API key, or a combination) and handle shared IPs/proxies (trust `X-Forwarded-For` only from known proxies).

4. **Handle distributed state**
   For multi-instance deployments, use a shared store (Redis) so limits are global, not per-pod.
   Design for the store being down: fail-open or fail-closed — decide deliberately per route.

5. **Implement with good UX**
   Return `429` with `Retry-After` and `RateLimit-*` headers. Never leak the limit to attackers on auth endpoints
   beyond what's needed. Add allowlists for internal/trusted callers.

6. **Test**
   Add tests that exceed the limit and assert `429` + headers, and that legitimate burst traffic passes.
   Load-test the limiter itself so it doesn't become the bottleneck (`/testing--load-testing`).

**Notes:**
- Rate limiting is defense in depth, not a substitute for auth or input validation
- Watch for shared NAT/corporate IPs — IP-only keying can lock out whole offices
- Pairs with `/security--threat-model` (where limits are needed) and `/networking--api-gateway`

$ARGUMENTS
