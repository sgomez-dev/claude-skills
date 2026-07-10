---
description: Add realtime - WebSocket/SSE choice, presence, optimistic UI, reconnection
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Add a realtime capability (live updates, chat, collaborative state, notifications feed) to the
current stack: pick the right transport for the app and its hosting, authorize every subscription
server-side, and ship a client that survives flaky networks with optimistic UI and clean
reconnection. Builds on whatever realtime plumbing the framework already ships.

Steps:

1. **Detect the stack and constraints**
   - Identify framework, ORM, and any realtime already present (Action Cable, Django Channels, Laravel Echo/Reverb, Socket.IO, Phoenix Channels, a Pusher/Ably key in `.env`)
   - Check hosting constraints: serverless/edge platforms can't hold long-lived sockets — that alone may decide SSE or a managed provider
   - Read `$ARGUMENTS` for the concrete feature (live comments, presence, dashboard updates...) — the feature drives the fan-out shape

2. **Propose transport and topology, confirm trade-offs**
   - **SSE**: server→client only, plain HTTP, works behind most proxies — right default for feeds/dashboards; client sends via normal requests
   - **WebSocket**: bidirectional, needed for chat/collab cursors; use the framework-native layer before a generic library
   - **Managed (Pusher/Ably/Supabase Realtime)**: when infra can't hold connections — keep the publish call behind your own interface so it's swappable
   - **Backplane**: more than one server process → pub/sub via Redis (or the framework's adapter); single process can start in-memory with the seam ready

3. **Server side: channels with authorization**
   - Define named channels/topics per resource (e.g. `project:{id}`); every subscription passes a **server-side authorization check** against the session — never trust a channel name from the client
   - Publish domain events from the code path that already mutates data (model callback, service layer, or transactional outbox for strict delivery) — one publish helper, not scattered socket calls
   - Include a monotonic event id or timestamp in every message so clients can detect gaps

4. **Client side: connection lifecycle**
   - One connection manager for the whole app (not per component): connect on auth, multiplex channel subscriptions over it
   - Reconnection with exponential backoff + jitter, capped; on reconnect, re-subscribe and **catch up** — refetch state or replay from last seen event id, don't assume nothing was missed
   - Surface connection state in the UI (subtle "reconnecting…" indicator); heartbeat/ping to detect dead connections behind proxies

5. **Optimistic UI**
   - Mutations apply locally with a client-generated id, send to the server, then reconcile on ack (swap temp id) or roll back on rejection with a visible error
   - Dedupe the echo: when the user's own event arrives on the channel, match by client id instead of double-applying
   - Keep server state authoritative — optimistic state is a rendering layer, never the source of truth

6. **Presence** (if the feature needs it)
   - Track join/leave per channel with heartbeat expiry (a crashed tab must time out, not linger); store in the pub/sub layer or the provider's presence API
   - Broadcast presence diffs, not full lists, once the room is joined; expose only fields the viewer is allowed to see (name/avatar, not email)

7. **Tests, env vars, and summary**
   - Tests: subscription denied for unauthorized user, event delivered to subscriber, optimistic rollback on server rejection, reconnect resubscribes; use the framework's channel test helpers where they exist
   - Run the suite; summarize new env vars (`REDIS_URL`, provider keys as `REALTIME_*`), any migration, and how to run the socket server locally if it's a separate process

**Notes:**
- Authorization on subscribe *and* on publish-side filtering — a user removed from a project must stop receiving its events (revoke subscriptions on membership change)
- Validate and size-limit every client→server message; rate-limit per connection
- Prefer the framework's native realtime stack over bolting on Socket.IO — a Rails app gets Action Cable idioms, Laravel gets Echo/Reverb
- Pairs with `/fullstack--notification-system` (in-app feed transport) and `/fullstack--background-jobs` (publishing from async work)
- Don't send secrets or other users' private data through shared channels; scope channels as narrowly as the UI needs

$ARGUMENTS
