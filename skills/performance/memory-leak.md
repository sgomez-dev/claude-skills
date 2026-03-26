---
description: Find and fix memory leaks in the application
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Identify and fix memory leaks in the codebase.

Steps:
1. Scan for common memory leak patterns:

   **Frontend (React/Vue/Angular)**
   - Event listeners not removed on unmount
   - setInterval/setTimeout not cleared
   - Subscriptions (WebSocket, Observable) not unsubscribed
   - Stale closures holding references
   - DOM references stored in variables
   - State updates on unmounted components

   **Backend (Node.js)**
   - Growing arrays/maps without bounds
   - Event emitter listeners accumulating
   - Unclosed database connections
   - Unclosed file handles
   - Global variable accumulation
   - Circular references preventing GC

   **General**
   - Cache without eviction policy (grows forever)
   - Large objects in closures
   - Retained references in error handlers

2. For each potential leak:
   - Show the problematic code
   - Explain why it leaks
   - Provide the fix (cleanup functions, WeakRef, proper disposal)
3. Suggest monitoring:
   - process.memoryUsage() tracking
   - Performance Observer API
   - Heap snapshot comparison technique

Target: $ARGUMENTS
