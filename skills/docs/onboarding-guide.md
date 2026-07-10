---
description: Generate a developer onboarding guide from the actual repo setup
permissions:
  reads: ["**/*"]
  writes: ["docs/ONBOARDING.md", "ONBOARDING.md"]
  commands: []
  network: false
  destructive: false
---

Generate a developer onboarding guide derived from what the repository actually contains —
real setup scripts, real env vars, real commands — not generic boilerplate. The goal:
a new developer goes from clone to first successful local run and first PR without asking anyone.

Steps:

1. **Inventory the real setup surface**
   - Language/runtime and version pins: `.nvmrc`, `.node-version`, `.python-version`, `.tool-versions`, `go.mod`, engine fields in `package.json`
   - Dependency and task tooling: package manager (lockfile type), Makefile, Taskfile, `scripts` in package.json, `justfile`
   - Services and infra: `docker-compose.yml`, database migrations dir, `.env.example`, seed scripts
   - Quality gates: test command, lint/format, git hooks, CI workflows (what must pass on a PR)
   - Existing docs to link rather than duplicate: README, CONTRIBUTING, ADRs, wiki references

2. **Reconstruct the environment variables story**
   - Cross-reference `.env.example` (or equivalent) against actual env reads in code (`process.env.X`, `os.environ`, config loaders)
   - For each variable: what it's for, a safe local default if one exists, and where to obtain secrets (mark as `ask your team lead` / secret manager — never invent values)
   - Flag variables read in code but missing from `.env.example` as gaps to fix

3. **Write the guide** to `docs/ONBOARDING.md` (or `ONBOARDING.md` if no docs dir) with these sections:
   - **Prerequisites**: exact tools + versions, with install hints per OS
   - **First-time setup**: numbered, copy-pasteable commands in order — clone, install, env file, start services, migrate/seed, run
   - **Verify it works**: the concrete success signal (URL to open, expected output, health endpoint)
   - **Daily workflow**: start/stop, run tests, lint, common scripts with one-line explanations
   - **Codebase tour**: top-level directories with one sentence each on purpose; where the entry points are
   - **Making your first change**: branch convention, commit convention, what CI checks, how review works (derive from git history and CI config)
   - **Troubleshooting**: known footguns found during analysis (port conflicts, missing native deps, OS-specific issues visible in scripts or CI)

4. **Validate every command against the repo**
   - Each command in the guide must exist: scripts referenced must be in package.json/Makefile, files referenced must exist, service names must match compose files
   - If a step cannot be verified from the repo (e.g., VPN access, credentials), mark it explicitly as `[requires: team access]` rather than guessing

5. **Report gaps found**
   - Summarize onboarding friction discovered while writing: missing `.env.example` entries, undocumented required tools, scripts that only work on one OS, magic manual steps — as a short punch list the team can fix

**Notes:**
- Every command must come from the repo itself — if you didn't find it in a script, config, or CI file, don't include it
- Prefer linking to existing docs over duplicating them; the guide is a spine, not an encyclopedia
- Estimate time-to-first-run honestly and put it at the top ("~20 minutes if Docker is installed")
- Keep it maintainable: reference script names (`npm run dev`) rather than their internals so the guide survives refactors

$ARGUMENTS
