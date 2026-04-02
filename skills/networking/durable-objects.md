---
description: Implement Cloudflare Durable Objects for stateful edge computing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "wrangler"]
  network: true
  destructive: false
---

Implement Cloudflare Durable Objects for the requested stateful use case.

Steps:
1. Determine the use case:
   - Real-time collaboration (shared document state)
   - WebSocket chat rooms or multiplayer
   - Rate limiting with precise counters
   - User session management
   - Distributed locks and coordination
   - Shopping cart / booking systems
2. Generate Durable Object class:

   **Class implementation**
   - Constructor with `state` and `env` bindings
   - `fetch()` handler with routing logic
   - `alarm()` handler for scheduled tasks if needed
   - Transactional storage operations via `state.storage`

   **Storage patterns**
   - `get`/`put`/`delete` for key-value data
   - `list` with prefix/range for ordered data
   - `transaction()` for atomic multi-key operations
   - `deleteAll()` for cleanup

   **WebSocket support (if needed)**
   - `state.acceptWebSocket()` for Hibernation API
   - `webSocketMessage` / `webSocketClose` handlers
   - Broadcast patterns to connected clients

3. Configure bindings:
   - Durable Object namespace in `wrangler.toml`
   - Migrations for class changes
   - ID generation strategy (name-based vs random)
4. Best practices:
   - Single-threaded model (no concurrency within one object)
   - Keep objects small and focused
   - Use alarms for deferred work and TTL
   - Handle cold starts gracefully
5. Include Worker entry point that routes to the Durable Object

$ARGUMENTS
