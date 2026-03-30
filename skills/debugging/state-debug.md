---
description: Debug complex application state issues (Redux, databases, caches, sessions)
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["redis-cli", "psql", "mysql", "mongosh", "sqlite3"]
  network: false
  destructive: false
---

Debug complex state management issues across application layers — from UI state to databases.

Steps:
1. Identify the state layer where the bug manifests:
   **UI/Frontend state**:
   - React: useState, useReducer, Context, Redux, Zustand, Jotai, MobX
   - Vue: reactive, ref, Vuex, Pinia
   - Angular: services, NgRx, signals
   - Svelte: stores, runes

   **Backend/Server state**:
   - In-memory caches (Redis, Memcached, node-cache)
   - Session stores (express-session, Flask session)
   - Database state (SQL, NoSQL)
   - Queue state (message brokers, job queues)

   **Distributed state**:
   - Microservice state synchronization
   - Event sourcing / CQRS read models
   - Replicated databases, eventual consistency gaps
2. Read the relevant state management code and trace the state flow:
   - **State shape**: What does the state look like? Schema, types, initial values
   - **State transitions**: What actions/events/mutations change it? Map every write path
   - **State derivations**: Computed values, selectors, materialized views — are they stale?
   - **State persistence**: How is it serialized? Hydration mismatches?
3. Identify the state bug pattern:
   - **Stale state**: Component reads old value, selector not recomputing, cache not invalidated
   - **Inconsistent state**: Two sources of truth disagree (UI vs server, cache vs DB)
   - **State mutation**: Direct mutation bypassing immutability requirement (Redux, React state)
   - **Missing state update**: Action dispatched but reducer/handler doesn't cover the case
   - **State shape mismatch**: Migration left orphaned fields, schema drift between services
   - **Hydration mismatch**: Server-rendered state differs from client-side hydration
   - **Phantom state**: Leftover state from previous navigation/session bleeding through
4. For each issue:
   - Show the exact state before and after the problematic transition
   - Identify the root cause (missed dispatch, wrong reducer, stale selector, cache TTL)
   - Provide the fix with proper state management patterns
5. Recommend state debugging tools:
   - React DevTools (component state), Redux DevTools (action replay)
   - Vue DevTools, Angular DevTools
   - Redis MONITOR, database query logging
6. Suggest guards to prevent recurrence: state validation, invariant checks, state machine patterns

State bug description: $ARGUMENTS
