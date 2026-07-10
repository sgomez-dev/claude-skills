---
description: Set up mutation testing, interpret surviving mutants, and harden weak tests
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*", "**/*_test.*", "stryker.conf.*", "stryker.config.*", "infection.json*", "mutmut_config*", "setup.cfg", "pyproject.toml", "pom.xml", "build.gradle*", "package.json", ".github/workflows/**"]
  commands: ["npm", "npx", "yarn", "pnpm", "pytest", "mutmut", "cargo", "mvn", "gradle", "dotnet", "go test"]
  network: false
  destructive: false
---

Measure how good the test suite *actually* is by mutating the code and checking whether tests
notice. Line coverage says code was executed; mutation score says bugs would be caught. Set up the
right tool for the stack, run it on a meaningful scope, and turn surviving mutants into stronger
tests.

Steps:

1. **Detect the stack and test setup**
   - Identify language, test runner, and build tool from manifests (`package.json`, `pyproject.toml`/`setup.cfg`, `pom.xml`/`build.gradle`, `*.csproj`, `go.mod`, `Cargo.toml`)
   - Confirm the suite passes and note its runtime — mutation testing multiplies it, so a green, reasonably fast suite is a prerequisite
   - Check whether a mutation tool is already configured before adding one

2. **Choose and configure the mutation tool**
   - JS/TS → **StrykerJS**; Python → **mutmut** (or cosmic-ray); Java/Kotlin → **PIT (pitest)**; C# → **Stryker.NET**; PHP → **Infection**; Ruby → **mutant**; Go → **go-mutesting**/gremlins; Rust → **cargo-mutants**
   - Add the dev dependency and a config file scoped to source dirs, excluding generated code, migrations, and vendored files
   - Enable incremental/cached mode if the tool supports it (Stryker incremental, PIT history) so reruns only mutate changed code

3. **Run on a pilot scope first**
   - Pick 1-3 core modules with real business logic (not glue code) and run mutation testing there — a full-repo first run is often hours long
   - Record the baseline mutation score and the runtime; extrapolate before attempting the full suite
   - If runtime is prohibitive, restrict mutators to the high-value set (conditionals, boundaries, negations, return values) before widening scope

4. **Triage surviving mutants**
   Classify each survivor before writing any test:
   - **Missing assertion** — the code path is executed but its effect is never checked → strengthen the existing test
   - **Missing test case** — a branch/boundary is never exercised → add a targeted test (boundary mutants like `<` → `<=` almost always mean an off-by-one case is untested)
   - **Equivalent mutant** — the mutation doesn't change observable behavior → mark it ignored in config with a comment, don't chase it
   - **Dead or unreachable code** — consider deleting the code instead of testing it
   - Prioritize survivors in money/security/data-integrity paths over logging and formatting

5. **Harden the tests**
   - Write the minimal test that kills each prioritized mutant; rerun the tool to confirm the kill
   - Prefer precise assertions on outputs and state changes over snapshot or "does not throw" tests — those are exactly what mutants slip past
   - Avoid overfitting: if a test only restates the implementation to kill a mutant, the mutant was probably equivalent

6. **Wire into CI and report**
   - Add a CI job (nightly or on changed files via incremental mode — full runs on every PR are usually too slow) with a mutation-score threshold that fails the build; set it slightly below the current score and ratchet up
   - Deliver a summary: baseline score, survivors triaged by category, tests added, new score, and the modules still below threshold

**Notes:**
- Mutation score of 100% is not the goal — chasing equivalent mutants wastes time; 70-90% on core logic is a strong suite
- Never weaken a mutant filter or exclude a file just to raise the score; exclusions need a reason comment
- High line coverage with a low mutation score is the key finding to report — it means the suite executes code without verifying it
- Keep the tool's cache/history files out of version control unless the team decides otherwise (they speed up CI but churn on every run)

$ARGUMENTS
