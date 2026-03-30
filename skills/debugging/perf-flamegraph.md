---
description: Profile and debug performance bottlenecks using flamegraph analysis and CPU/IO profiling
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["perf", "py-spy", "node --prof", "node --cpu-prof", "go tool pprof", "cargo flamegraph", "ab", "wrk", "hyperfine", "time", "strace", "ltrace", "iostat", "vmstat"]
  network: false
  destructive: false
---

Profile and debug performance bottlenecks by generating flamegraphs, analyzing CPU/IO profiles, and identifying hot paths.

Steps:
1. Characterize the performance problem:
   - **CPU-bound**: High CPU usage, slow computation, hot loops
   - **IO-bound**: Slow disk, network latency, blocking syscalls
   - **Memory-bound**: Cache misses, excessive allocation, GC pressure
   - **Lock contention**: Threads waiting on mutexes, low CPU but slow throughput
   - **Algorithmic**: O(n²) or worse complexity hidden in the code path
2. Read the suspect code and perform static analysis:
   - Identify nested loops, recursive calls, expensive operations in hot paths
   - Check for: N+1 queries, unbatched operations, synchronous IO in async context
   - Look for missing caching, redundant computation, unnecessary serialization/deserialization
   - Check algorithm complexity: are data structures appropriate for the access pattern?
3. Generate profiling commands for the project's language:
   **Node.js**:
   - `node --cpu-prof app.js` → generates .cpuprofile for Chrome DevTools
   - `node --prof app.js` → V8 log, process with `node --prof-process`
   - `clinic flame -- node app.js` for automated flamegraph

   **Python**:
   - `py-spy record -o profile.svg -- python app.py` (sampling profiler, no code changes)
   - `python -m cProfile -o profile.prof app.py` + `snakeviz profile.prof`
   - `scalene` for CPU + memory + GPU profiling

   **Go**:
   - `import _ "net/http/pprof"` + `go tool pprof http://localhost:6060/debug/pprof/profile`
   - `go test -bench . -cpuprofile cpu.prof` + `go tool pprof -http=:8080 cpu.prof`

   **Rust**:
   - `cargo flamegraph` (requires perf on Linux)
   - `cargo bench` with criterion for micro-benchmarks

   **System-level**:
   - `perf record -g -p <PID>` + `perf script | flamegraph.pl > flame.svg`
   - `strace -c -p <PID>` for syscall summary
   - `iostat -x 1` for disk IO bottlenecks
4. Analyze the profile results:
   - Identify the top 5 functions by cumulative time
   - For each hot function:
     a. Read the source code
     b. Classify: Is the function itself slow, or is it called too many times?
     c. Determine the optimization: algorithm change, caching, batching, parallelization
5. Implement optimizations with before/after benchmarks:
   - Write a benchmark that isolates the slow path
   - Apply the optimization
   - Measure improvement with `hyperfine`, `go test -bench`, or framework-specific benchmarks
6. Provide a performance regression test to prevent future degradation

Performance issue description: $ARGUMENTS
