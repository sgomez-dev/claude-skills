---
description: Hunt down memory leaks by analyzing allocation patterns and retention paths
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["node --inspect", "node --expose-gc", "python -m tracemalloc", "valgrind", "go tool pprof", "top", "ps aux"]
  network: false
  destructive: false
---

Hunt down memory leaks by analyzing code patterns, allocation paths, and object retention.

Steps:
1. Identify the memory leak symptoms from the description or by analyzing the code:
   - Steadily growing heap over time
   - OOM kills or process crashes
   - Increasing GC pauses or CPU usage
   - Swap usage growing
2. Read the suspect code and scan for common leak patterns by language:

   **JavaScript/Node.js**:
   - Global variable accumulation (maps, arrays, caches without eviction)
   - Event listeners added in loops or repeated calls without removeListener
   - Closures capturing large scopes unnecessarily
   - Unreleased Buffers or streams not destroyed
   - setInterval/setTimeout without clearInterval/clearTimeout
   - Detached DOM nodes still referenced in JS

   **Python**:
   - Circular references defeating reference counting
   - __del__ preventing garbage collection
   - Global lists/dicts used as unbounded caches
   - C extension objects not properly freed
   - Threads holding references after task completion

   **Go**:
   - Goroutine leaks (blocked on channel forever, no context cancellation)
   - Slice header retaining large underlying array
   - sync.Pool misuse, finalizer cycles
   - time.Ticker not stopped

   **Rust/C/C++**:
   - Rc/Arc cycles without Weak
   - malloc without free, missing drop implementations
   - Container growth without shrink_to_fit

   **General**:
   - Caches without TTL or size limits
   - Connection pools that grow but never shrink
   - Subscriber/observer patterns without unsubscribe
3. For each suspected leak:
   - Trace the allocation point and what holds the reference
   - Show the retention path preventing garbage collection
   - Provide the fix: cleanup code, weak references, bounded caches, proper disposal
4. Generate a profiling command to verify the leak before and after the fix:
   - Node: `--inspect` + Chrome DevTools heap snapshot
   - Python: `tracemalloc` + snapshot comparison
   - Go: `pprof` heap profile
   - C/C++: `valgrind --leak-check=full` or AddressSanitizer
5. Suggest preventive patterns: dispose/cleanup hooks, WeakRef/WeakMap, LRU caches

Leak symptom or suspect code: $ARGUMENTS
