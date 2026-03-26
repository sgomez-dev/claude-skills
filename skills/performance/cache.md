---
description: Implement caching strategy for API responses, database queries, or computations
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design and implement a caching strategy.

Steps:
1. Identify what needs caching:
   - API responses (HTTP caching, CDN)
   - Database query results (application-level cache)
   - Expensive computations (memoization)
   - Session data
   - Static assets
2. Choose caching strategy:
   - **Cache-Aside**: App checks cache first, loads from DB on miss
   - **Write-Through**: Write to cache and DB simultaneously
   - **Write-Behind**: Write to cache, async write to DB
   - **Read-Through**: Cache loads from DB on miss transparently
3. Implementation:
   - HTTP: `Cache-Control`, `ETag`, `Last-Modified` headers
   - Redis/Memcached: Key design, TTL, eviction policy
   - In-memory: LRU cache, memoization
   - CDN: Static assets, API edge caching
4. Handle cache invalidation:
   - TTL-based expiration
   - Event-driven invalidation (on write)
   - Cache keys that include relevant parameters
   - Versioned cache keys for deployments
5. Prevent common issues:
   - Cache stampede (use locking or stale-while-revalidate)
   - Inconsistent data (proper invalidation)
   - Memory pressure (set max size, use LRU)

Target: $ARGUMENTS
