---
description: Monorepo git strategies - sparse checkout, CODEOWNERS, selective CI triggers
permissions:
  reads: [".git/**", "**/*"]
  writes: ["CODEOWNERS", ".github/**", ".gitattributes", ".gitignore", "docs/**"]
  commands: ["git sparse-checkout", "git config", "git log", "git diff"]
  network: false
  destructive: false
---

Optimize git workflows for a monorepo: sparse checkout for developers who only need a
slice of the repo, CODEOWNERS for per-package review routing, and path-filtered CI so
changes only build and test what they touch.

Steps:

1. **Map the monorepo structure**
   - Detect the tool and layout: `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, `go.work`, Bazel/`WORKSPACE`, or plain directory conventions (`packages/`, `apps/`, `services/`, `libs/`)
   - Identify package boundaries, shared/internal dependencies between them, and the CI system in use (`.github/workflows/`, `.gitlab-ci.yml`, etc.)
   - Check repo health signals: repo size (`git count-objects -vH`), large files, checkout pain points the user mentions

2. **Set up sparse checkout** (if the repo is large enough to benefit)
   - Use cone mode: `git sparse-checkout init --cone` then `git sparse-checkout set <dirs>`
   - Define per-team profiles: each app/service directory plus the shared packages it depends on (derive from the workspace dependency graph)
   - Document the commands in a `docs/sparse-checkout.md` or CONTRIBUTING section, including how to add dirs (`git sparse-checkout add`) and reset (`git sparse-checkout disable`)
   - Mention partial clone for very large repos: `git clone --filter=blob:none` pairs well with sparse checkout

3. **Create or improve CODEOWNERS**
   - Location by platform: `.github/CODEOWNERS` (GitHub), `CODEOWNERS` root (GitLab)
   - Derive ownership from evidence, not guesses: `git log --format='%an' -- <path>` per package to find primary contributors, then confirm the team mapping with the user
   - Structure: a catch-all default owner first, then per-package rules (later rules win on GitHub), special rules for sensitive paths (`/.github/`, infra, auth, payment code)
   - Keep rules directory-level, not file-level — file-level rules rot fast

4. **Configure selective CI (path filtering)**
   - GitHub Actions: `on.push.paths` / `on.pull_request.paths` per workflow, or a change-detection job (`dorny/paths-filter` or `git diff --name-only` against the merge base) feeding job-level `if:` conditions
   - GitLab: `rules: changes:`; other CI: equivalent path rules
   - Critical: a change to a shared package must trigger CI for all its dependents — use the monorepo tool's affected graph when available (`turbo run test --filter=...[origin/main]`, `nx affected`), fall back to explicitly listing shared paths in each dependent's triggers
   - Handle required checks that get skipped: add a no-op "pass" job or use the CI platform's skipped-check-counts-as-success setting so PRs aren't blocked

5. **Add supporting git hygiene**
   - `.gitattributes`: linguist overrides for generated code, LF normalization, merge strategies for lockfiles (`package-lock.json merge=binary` style conflicts guidance)
   - Commit scope conventions matching packages (e.g., `feat(api): ...`) so `git log -- packages/api` and changelog tooling work per package
   - Optional: branch naming and PR title conventions that encode the affected package

6. **Verify and summarize**
   - Test sparse checkout profiles in a scratch clone if feasible; validate CODEOWNERS syntax (GitHub shows errors in the file view; also lint bracket/team syntax manually)
   - Dry-run the path filters: pick 2-3 recent commits and trace which workflows would trigger — confirm shared-package changes fan out correctly
   - Deliver a summary table: package → owners → CI workflows triggered → sparse profile it belongs to

**Notes:**
- Never enable sparse checkout in the user's working clone without asking — it changes what files are visible on disk
- Selective CI's biggest bug is under-triggering: when in doubt, over-trigger; a wasted CI run is cheaper than a broken main
- CODEOWNERS teams must have repo access on GitHub or the rule silently does nothing — flag this for the user to verify
- If the repo uses Nx/Turborepo/Bazel, prefer their affected-graph commands over hand-maintained path lists

$ARGUMENTS
