---
description: "Make the app offline-first: local store, sync strategy, conflicts, mutation queue"
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "flutter", "pod", "adb", "xcrun"]
  network: false
  destructive: false
---

Turn a network-dependent app into an offline-first one: pick the right local store for the data
shape, define a sync strategy the backend can actually support, resolve conflicts deliberately
instead of by accident, and queue writes so nothing a user does on the subway is lost. Scope is
matched to the app — a read-mostly content app needs far less machinery than collaborative CRUD.

Steps:

1. **Detect the stack and audit the data layer** (`$ARGUMENTS`)
   - Framework: React Native/Expo, Flutter, or native — then the current data stack: TanStack
     Query/SWR/Apollo, Redux, raw fetch; Flutter: Riverpod/Bloc + dio; existing storage
     (AsyncStorage, MMKV, SQLite, Drift, Isar, Hive, Core Data, Room)
   - Inventory every remote data type the app touches and classify each: read-only vs
     user-editable, single-owner vs shared/collaborative, size, staleness tolerance
   - Extract from input: which flows must work offline, and what the backend offers today
     (delta endpoints? `updated_at` timestamps? nothing?) — the backend contract constrains
     everything downstream

2. **Choose the local store (per data class, not one-size-fits-all)**
   - Small key-value (session, prefs, feature flags): MMKV / `shared_preferences` /
     `NSUserDefaults` — tokens always in secure storage (see `/mobile--biometric-auth`)
   - Structured/queryable data: SQLite-backed — WatermelonDB or Drizzle+expo-sqlite (RN), Drift
     or Isar (Flutter), Room (Android), Core Data/GRDB (iOS)
   - Genuinely collaborative or heavy sync: evaluate a sync engine (PowerSync, Replicache,
     Realm/Atlas Device Sync, Couchbase Lite) before hand-rolling — state the build-vs-buy
     recommendation with a one-line reason
   - A cache layer (TanStack Query + persister) is enough for read-mostly apps — don't add a
     database the app doesn't need

3. **Design the read path**
   - Render from local first, always — the network updates the store, the UI subscribes to the
     store; no spinner if cached data exists, show a subtle "updated X ago" staleness indicator
     where freshness matters
   - Delta sync where the backend allows (`?since=<cursor>`), full refetch with ETags where it
     doesn't; document the requested backend changes if the contract is missing pieces
   - Define per-collection TTL/eviction so the local store doesn't grow unbounded

4. **Design the write path — the outbox queue**
   - Every mutation goes into a persistent outbox (survives app kill), applies optimistically to
     the local store, then drains to the server FIFO per-entity with exponential backoff
   - Idempotency keys on every queued mutation so retries after an ambiguous failure (timeout
     after server applied it) don't double-write — requires backend cooperation; flag it
   - Surface queue state honestly in the UI: pending badge, failed-item retry affordance —
     silent loss is the cardinal sin; permanent failures (validation, 403) need user-visible
     resolution, not infinite retry

5. **Choose conflict resolution deliberately**
   - Default: last-write-wins on a **server-assigned** version/timestamp (client clocks lie),
     applied per-field where the model allows — document which fields can clobber
   - Shared editable data: version numbers with a 409-and-merge flow, or CRDTs only if
     concurrent editing is a core feature (they're expensive to retrofit)
   - Deletes need tombstones — a hard-deleted row can't tell a syncing client it's gone
   - Write the chosen rule per entity into a short table in the code/PR description: entity →
     strategy → who wins → user-visible outcome

6. **Wire sync triggers and lifecycle**
   - Triggers: app foreground, connectivity regained (`@react-native-community/netinfo` /
     `connectivity_plus`), post-mutation, and a periodic timer while active
   - Background sync is best-effort only: iOS `BGTaskScheduler` runs when iOS feels like it,
     Android `WorkManager` is more reliable but Doze-constrained — never depend on background
     execution for correctness; a data push can nudge a sync (see
     `/mobile--push-notifications`) but is also not guaranteed
   - Plan schema migrations for the local store from day one — a failed local migration bricks
     the app for existing users

7. **Test the failure modes**
   - Scripted scenarios: airplane mode mid-mutation, kill the app with a non-empty queue,
     conflicting edit on two devices, server 500 during queue drain, clock skew
   - Toggle connectivity via `adb shell svc wifi disable`/`svc data disable` and the iOS
     simulator's network conditioner; assert queue drain order and final converged state
   - Deliver: the data-class table, chosen stores with rationale, conflict-rule table, backend
     contract asks, and the test checklist results

**Notes:**
- Offline-first is a product decision, not a library: confirm with the user which flows justify
  the complexity before scaffolding a sync engine
- Never queue auth-dependent mutations past token expiry without a refresh strategy — a drained
  queue full of 401s is data loss with extra steps
- Encrypt the local store if it holds personal data (SQLCipher, Isar encryption, iOS data
  protection classes); local ≠ safe on a stolen device
- Sync bugs are heisenbugs — add structured logging around queue transitions from the start,
  and see `/mobile--mobile-performance` if the sync loop starts eating startup time
- Keep the server the source of truth; the client store is a replica with pending intent, and
  a "reset local data" escape hatch will save support tickets

$ARGUMENTS
