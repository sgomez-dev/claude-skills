---
description: Benchmark code correctly: harness, warmup, statistics, regression gates
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Measure performance in a way you can actually trust — a proper harness with warmup, repetition, and statistics —
so a "speedup" is real and not noise, and regressions get caught in CI.

Steps:

1. **Define what and why** (`$ARGUMENTS`)
   - Detect the language and any existing benchmark tooling from the repo
   - Clarify what to measure (a function, endpoint, or workflow) and the question: absolute time, compare two
     implementations, or guard against regression
   - Establish the workload/input that represents real usage — a benchmark on toy data misleads

2. **Pick the right harness**
   Use the language's established tool rather than a hand-rolled timer: `pytest-benchmark`/`timeit` (Python),
   `Benchmark.js`/`tinybench` (JS), `go test -bench` (Go), Criterion (Rust), JMH (Java). They handle the hard parts.

3. **Get the methodology right**
   Ensure: warmup runs (discard JIT/cache cold starts), enough iterations for stable numbers, isolation from
   background load, and fixed inputs. Report distribution (median, p95, stdev) — not a single run, which is noise.

4. **Compare fairly**
   When comparing implementations, run them under identical conditions, interleave/repeat to cancel drift, and
   check the difference exceeds the noise (overlapping ranges = no real difference). State the % change with variance.

5. **Gate regressions (optional)**
   For CI, set a threshold and fail the build when a key benchmark regresses beyond it. Store a baseline and
   compare against it. Keep benchmarks off the critical CI path if they're slow (nightly/manual).

**Notes:**
- A single timing is noise — report medians and p95 across many runs, with variance
- Micro-benchmarks can lie (the optimizer may elide dead code); verify the work actually happens
- Benchmark realistic inputs and environments; results on a laptop rarely match production hardware

$ARGUMENTS
