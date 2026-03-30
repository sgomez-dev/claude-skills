---
description: Detect and fix race conditions, data races, and TOCTOU bugs
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["go test -race", "cargo test", "tsan", "helgrind"]
  network: false
  destructive: false
---

Detect and fix race conditions, data races, and time-of-check-to-time-of-use (TOCTOU) vulnerabilities.

Steps:
1. Read the suspect code and identify all shared mutable state:
   - Global/module-level variables accessed from multiple threads/goroutines/tasks
   - Shared objects passed between concurrent execution contexts
   - File system state read then written without locking
   - Database rows read then updated without transactions or optimistic locking
2. Map the concurrency model:
   - Threads with shared memory (Java, C++, Python with threading)
   - Goroutines with channels and mutexes (Go)
   - Async tasks on event loop (Node.js, Python asyncio)
   - Actor model (Erlang, Akka)
   - Web workers / child processes with message passing
3. Identify race condition patterns:
   **Data races** (simultaneous unsynchronized access):
   - Two goroutines/threads writing to same variable
   - Read-modify-write without atomicity (counter++, balance += amount)
   - Map/dict concurrent read+write (Go map crash, ConcurrentModificationException)

   **TOCTOU** (check-then-act gap):
   - `if file.exists() then file.open()` — file could be deleted between check and open
   - `if user.balance >= amount then user.balance -= amount` — balance could change
   - `if !map.has(key) then map.set(key, compute())` — another thread could set it

   **Ordering races**:
   - Initialization race: using resource before setup completes
   - Publish before ready: making object visible before fully constructed
   - Signal race: handler fires before registration completes

   **Deadlocks** (circular wait):
   - Lock A then Lock B in one path, Lock B then Lock A in another
   - Dining philosophers scenarios
4. For each race found:
   - Describe the exact interleaving that causes the bug
   - Show a concrete timeline: Thread1 does X, Thread2 does Y, result is Z
   - Provide the fix using the appropriate synchronization primitive:
     - Mutex/lock, RWLock, atomic operations
     - Channels, select statements
     - Database transactions, row-level locks, optimistic concurrency
     - CAS (compare-and-swap) loops
     - File locking (flock, advisory locks)
5. Suggest race detection tooling:
   - Go: `go test -race`, `go vet`
   - C/C++: ThreadSanitizer (`-fsanitize=thread`), Helgrind
   - Rust: compiler enforces at build time (explain ownership model)
   - Java: FindBugs, SpotBugs concurrency detectors
6. Verify the fix doesn't introduce deadlocks or performance bottlenecks

Suspect code or race description: $ARGUMENTS
