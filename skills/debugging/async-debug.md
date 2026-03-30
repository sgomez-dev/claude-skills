---
description: Debug async/await, promise chains, and concurrency bugs
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Debug asynchronous code issues including unresolved promises, callback hell bugs, deadlocks, and concurrency problems.

Steps:
1. Read the target code and map the async execution flow:
   - Identify all async boundaries: await, .then(), callbacks, event listeners, channels, goroutines
   - Draw the dependency graph: which async operations depend on others completing first
   - Mark fire-and-forget calls (missing await, unhandled promises)
2. Classify the async bug type:
   **Unhandled/swallowed errors**:
   - Missing .catch() or try/catch around await
   - Error callbacks not wired up
   - Promise rejections that vanish silently

   **Ordering/timing issues**:
   - Operations executing out of expected order
   - Missing await causing premature reads of unresolved data
   - Race between parallel operations that should be sequential

   **Deadlocks and starvation**:
   - Circular await dependencies (A waits for B waits for A)
   - Thread/worker pool exhaustion
   - Mutex/lock ordering violations
   - Channel/queue full with no consumer

   **Resource leaks**:
   - Unclosed connections, file handles, or streams in async paths
   - Event listeners registered but never removed
   - Timers/intervals not cleared on teardown

   **Stale state**:
   - Closure capturing variable that changes before callback fires
   - React state updates batching unexpectedly
   - Cache reads between async gaps returning outdated data
3. For each issue found:
   - Show the exact execution timeline (what actually happens vs what was intended)
   - Provide the fix with proper async patterns for the language/framework
4. Add defensive patterns: timeout wrappers, cancellation tokens, AbortController usage
5. Verify the fix doesn't introduce new ordering issues

Async bug or file: $ARGUMENTS
