---
description: Comprehensive performance audit - identify bottlenecks and optimize
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Perform a comprehensive performance audit of the codebase.

Steps:
1. Identify performance-critical paths (API endpoints, render paths, data processing)
2. Analyze for:

   **Backend Performance**
   - N+1 database queries
   - Missing database indexes
   - Unbounded queries (no LIMIT)
   - Synchronous blocking operations
   - Missing caching for expensive computations
   - Inefficient algorithms (O(n²) when O(n) possible)
   - Memory leaks (event listeners, closures, growing collections)
   - Large payload sizes (no pagination, over-fetching)

   **Frontend Performance**
   - Unnecessary re-renders (React: missing memo, unstable references)
   - Large bundle size (no code splitting, tree shaking)
   - Unoptimized images (no lazy loading, wrong formats)
   - Layout thrashing (forced reflows)
   - Expensive event handlers without debounce/throttle
   - Missing virtual scrolling for long lists

   **General**
   - Missing compression (gzip/brotli)
   - No CDN for static assets
   - Missing HTTP caching headers
   - Chatty APIs (many small requests instead of batched)

3. For each finding: location, impact estimate, specific fix with code

Target: $ARGUMENTS
