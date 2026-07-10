---
description: Set up git hooks - pre-commit, husky, lint-staged, commit-msg validation
permissions:
  reads: [".git/**", "**/*"]
  writes: [".husky/**", ".pre-commit-config.yaml", ".lintstagedrc*", "package.json", "commitlint.config.*", ".git/hooks/**"]
  commands: ["git config", "npm install", "npx husky", "pre-commit install"]
  network: false
  destructive: false
---

Set up git hooks that enforce quality gates locally: format/lint staged files on commit,
validate commit messages, and optionally run fast tests before push. Pick the right hook
manager for the stack instead of assuming husky.

Steps:

1. **Detect the stack and existing hook setup**
   - Language/tooling: `package.json` (Node), `pyproject.toml` (Python), `go.mod`, `Cargo.toml`, etc.
   - Existing hooks: `.husky/`, `.pre-commit-config.yaml`, `.git/hooks/` custom scripts, `lefthook.yml`, `core.hooksPath` in git config
   - Existing quality tools to wire in: ESLint/Prettier/Biome, ruff/black, gofmt, rustfmt, typecheckers, test runners
   - If hooks already exist, audit and extend them — do not replace the manager

2. **Choose the hook manager**
   - Node projects → **husky + lint-staged** (or keep Biome/lefthook if present)
   - Python projects → **pre-commit** framework (`.pre-commit-config.yaml`)
   - Polyglot/other → **lefthook** or a plain `core.hooksPath` directory with shell scripts
   - Confirm the choice with the user if the repo is ambiguous

3. **Configure the pre-commit hook**
   - Run formatters and linters **only on staged files** (lint-staged patterns or pre-commit `files:` filters)
   - Typical mapping: `*.{ts,tsx,js}` → eslint --fix + prettier; `*.py` → ruff check --fix + ruff format; `*.md/json/yaml` → prettier
   - Add fast, high-value checks: no merge-conflict markers, no debug statements (`console.log`, `pdb`), secret detection if a tool is available
   - Keep it under ~10s — long-running checks (full test suite, builds) belong in pre-push or CI, not pre-commit

4. **Configure commit-msg validation**
   - Detect the convention from `git log --oneline -30`: conventional commits, ticket-prefix (`ABC-123:`), or free-form
   - Node → commitlint with `@commitlint/config-conventional` (or a custom rule for the detected pattern)
   - Otherwise → a small commit-msg script validating the pattern with a helpful error showing valid examples

5. **Optional pre-push hook** (ask the user)
   - Fast test subset or typecheck; block pushes to protected branches (`main`, `release/*`) with a clear message

6. **Install, verify, and document**
   - Install dependencies and register hooks (`npx husky init`, `pre-commit install`, or `git config core.hooksPath`)
   - Ensure teammates get hooks automatically: `prepare` script in package.json, or a documented one-time setup command
   - Verify end-to-end: stage a file with a lint error and attempt a commit with a bad message — both must fail with clear output; then show a passing commit
   - Add a short "Git hooks" section to CONTRIBUTING.md or README explaining what runs and how to bypass in emergencies (`--no-verify`, discouraged)

**Notes:**
- Hooks must be fast and deterministic — a slow pre-commit hook trains the team to use `--no-verify`
- Never auto-fix and silently re-stage in ways that surprise the user; lint-staged's default re-add behavior is fine, custom scripts should say what they changed
- Respect existing CI: hooks are a local fast-feedback layer, not a replacement — the same checks should still run in CI
- On Windows, ensure hook scripts use `sh`-compatible syntax and LF line endings (add to `.gitattributes` if needed)

$ARGUMENTS
