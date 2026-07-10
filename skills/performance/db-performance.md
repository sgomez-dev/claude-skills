---
description: Diagnose database performance: slow query logs, indexing, pooling, hot paths
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Find and fix the database bottlenecks that dominate response time — the slow queries, missing indexes, and
connection mismanagement — grounded in real query data, not guesses.

Steps:

1. **Detect the database and gather evidence** (`$ARGUMENTS`)
   - Identify the engine (Postgres, MySQL, SQLite, etc.) and ORM/query layer from the repo
   - Ask for or locate the slow-query log, ORM query logs, or APM traces. Without data, instrument first — never
     optimize on a hunch

2. **Find the worst offenders**
   Rank queries by total time (frequency × per-call cost), not just single slowest. The query run 10,000×/min at
   50ms often matters more than the 3s report nobody runs. Flag N+1 patterns from the ORM (`/performance--perf-audit`).

3. **Explain the hot queries**
   Run `EXPLAIN (ANALYZE)` on the top offenders. Identify sequential scans on large tables, bad join orders,
   sorts spilling to disk, and index-not-used cases. Interpret the plan for the user.

4. **Fix at the right layer**
   Apply the highest-leverage fix: add/adjust indexes (composite, covering, partial) matched to the query's
   filter+sort, rewrite the query or ORM call, denormalize a hot read, or add caching (`/performance--cache`).
   Verify each index actually gets used and note the write-cost trade-off.

5. **Check connections and configuration**
   Review connection pooling (size vs DB max connections, especially serverless), transaction scope (long
   transactions holding locks), and obvious config (work_mem, timeouts). Pool exhaustion masquerades as slow queries.

6. **Measure the improvement**
   Re-run EXPLAIN and timing before/after each change and report the delta. Add a regression guard for the hot query.

**Notes:**
- Optimize by total time, not anecdotes — the frequent medium query usually beats the rare slow one
- Every index speeds reads and slows writes and grows storage — justify each one
- Measure before and after; an "obvious" index sometimes goes unused due to the query shape

$ARGUMENTS
