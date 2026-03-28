<p align="center">
  <img src="https://img.shields.io/badge/Skills-96-blue?style=for-the-badge" alt="95 Skills" />
  <img src="https://img.shields.io/badge/Tested-CI_Validated-brightgreen?style=for-the-badge" alt="CI Tested" />
  <img src="https://img.shields.io/badge/Permissions-100%25_Declared-brightgreen?style=for-the-badge" alt="Permissions" />
  <img src="https://img.shields.io/badge/Pipelines-5-purple?style=for-the-badge" alt="5 Pipelines" />
  <img src="https://img.shields.io/github/license/santiago-gomez/claude-skills?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-Compatible-blueviolet?style=flat-square&logo=anthropic" alt="Claude Code" />
  <img src="https://img.shields.io/badge/Cursor-Compatible-orange?style=flat-square" alt="Cursor" />
  <img src="https://img.shields.io/badge/Windsurf-Compatible-teal?style=flat-square" alt="Windsurf" />
  <img src="https://img.shields.io/badge/Codex-Compatible-green?style=flat-square" alt="Codex" />
</p>

<h1 align="center">Claude Skills</h1>

<p align="center">
  <strong>The only skills collection where every skill is tested, permission-scoped, and composable.</strong><br/>
  96 skills. 5 pipelines. Full CI validation. Zero trust assumptions.
</p>

<p align="center">
  <a href="#quick-install">Quick Install</a> &bull;
  <a href="#what-makes-this-different">Why This One</a> &bull;
  <a href="#all-96-skills">Browse Skills</a> &bull;
  <a href="#web--ui-6----landing-pages-spas-animations-design-systems">Web & UI</a> &bull;
  <a href="#pipelines">Pipelines</a> &bull;
  <a href="#plugin-marketplace">Marketplace</a> &bull;
  <a href="#cross-platform">Cross-Platform</a>
</p>

---

## What Makes This Different

> **The problem:** 36% of skills in public registries have security flaws. 76 were found to be [genuinely malicious](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/). Skills don't fire reliably. No repo tests their skills. You install and pray.

**We fix all of that.**

| Feature | Other Repos | This Repo |
|---------|------------|-----------|
| **Permission manifests** | None declare what skills can do | Every skill declares reads, writes, commands, network, destructive |
| **Test harness** | No testing, no validation | CI pipeline validates structure, safety, and trigger quality |
| **Safety linting** | No scanning for dangerous patterns | Automated detection of `rm -rf`, `curl\|bash`, `chmod 777`, credential leaks |
| **Pipelines** | Skills are isolated, one-shot | 5 pre-built pipelines chain skills into end-to-end workflows |
| **Smart Router** | Install 100 skills, all active always | `/meta--skills-init` detects your stack, activates only relevant skills |
| **Skill Forge** | Write skills from scratch | `/meta--skill-forge` generates tested, permissioned skills from description |
| **Project-aware** | Generic prompts for any project | Skills detect your language, framework, ORM, test runner automatically |

### Permission Manifest (every skill has one)

```yaml
---
description: Generate a smart conventional commit message
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git diff", "git log", "git commit"]
  network: false
  destructive: false
---
```

You know **exactly** what each skill can do before you install it. No other collection offers this.

---

## Quick Install

### Plugin Marketplace (Recommended)

```
/plugin marketplace add sgomez-dev/claude-skills
/plugin install git-skills@claude-skills-collection
/plugin install security-skills@claude-skills-collection
/plugin install testing-skills@claude-skills-collection
```

Install individual bundles or all at once. See [all available plugins](#plugin-marketplace).

### One-liner — no clone needed (macOS / Linux / Git Bash)

```bash
curl -fsSL https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.sh | bash
```

### One-liner — no clone needed (Windows PowerShell)

```powershell
irm https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.ps1 | iex
```

### Install a single skill (no clone, no installer)

```bash
# Example: just the animations skill
curl -fsSL https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/skills/web/animations.md \
  -o ~/.claude/commands/web--animations.md
```

### Clone + install (if you want to customize)

```bash
git clone https://github.com/sgomez-dev/claude-skills.git
cd claude-skills && ./install.sh
```

### Windows PowerShell (clone)

```powershell
git clone https://github.com/sgomez-dev/claude-skills.git
cd claude-skills; .\install.ps1
```

### Manual (single skill)

```bash
cp skills/git/commit.md ~/.claude/commands/git--commit.md
```

---

## All 96 Skills

### Web & UI (7) — *Landing pages, SPAs, animations, design systems, UI polish*

| Command | What It Does |
|---------|-------------|
| `web--landing-page` | Generates a world-class landing page — unique layout strategy, crafted copy, Framer Motion animations, never AI-looking |
| `web--spa-scaffold` | Production-grade SPA with elite architecture, design system, state management, skeleton states, accessibility |
| `web--animations` | Full animation catalog: scroll-driven, 3D models (R3F), horizontal scroll, WebGL shaders, particles, custom cursor, text effects |
| `web--design-engineering` | UI polish and animation decisions — easing, springs, component patterns, performance, accessibility (Emil Kowalski) |
| `web--design-system` | Complete design system with semantic tokens, typography scale, dark mode, component library, Storybook |
| `web--ui-components-pro` | Elite UI components with physics-based animations, compound patterns, magnetic hover, 3D tilt, every edge case handled |
| `web--conversion-optimizer` | CRO audit: clarity, friction, trust, copy — diagnoses with exact code fixes and A/B test roadmap |

### Meta Skills (4) — *No other repo has these*

| Command | What It Does |
|---------|-------------|
| `meta--skills-init` | Scans project, detects stack, activates only relevant skills, generates config |
| `meta--pipeline-run` | Runs multi-skill pipelines with quality gates and shared context |
| `meta--skill-forge` | Generates new tested, permissioned skills from natural language description |
| `meta--health-check` | Validates all installed skills for structure, permissions, and safety |

### Git & Version Control (10)

| Command | What It Does |
|---------|-------------|
| `git--commit` | Analyzes staged diff, generates conventional commit with type/scope/body |
| `git--pr-create` | Creates PR with smart title, description from all commits, labels |
| `git--pr-review` | Reviews PR for correctness, security, performance, testing gaps |
| `git--changelog` | Generates CHANGELOG from conventional commits grouped by version |
| `git--release` | Determines semver bump from commits, tags, creates GitHub release |
| `git--branch` | Creates branch with proper naming conventions and ticket numbers |
| `git--undo` | Safely reverses last git operation with explanation before executing |
| `git--blame-detective` | Deep history investigation — who, when, why, which PR |
| `git--stash-manager` | Lists stashes with previews, apply/drop/branch operations |
| `git--cherry-pick-pr` | Cherry-picks specific commits from PRs with conflict resolution |

<details>
<summary><strong>Code Quality (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `code-quality--review` | Full code review: correctness, security, performance, maintainability |
| `code-quality--refactor` | Refactors code preserving behavior — extract, simplify, rename |
| `code-quality--dead-code` | Finds unused imports, functions, files, dependencies across project |
| `code-quality--complexity` | Calculates cyclomatic/cognitive complexity, flags high-risk functions |
| `code-quality--dry` | Detects duplicated code patterns, suggests abstractions |
| `code-quality--code-smells` | Finds bloaters, couplers, dispensables with fix suggestions |
| `code-quality--naming` | Reviews naming clarity, consistency, conventions — table of suggestions |
| `code-quality--type-check` | Adds TypeScript/Python type annotations, replaces `any` |
| `code-quality--error-handling` | Audits try/catch, finds swallowed errors, missing handlers |
| `code-quality--dependency-audit` | Checks deps for CVEs, maintenance status, bundle size, alternatives |

</details>

<details>
<summary><strong>Testing (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `testing--test-gen` | Generates unit tests with happy path, edge cases, error cases |
| `testing--test-edge-cases` | Adversarial tests: boundaries, unicode, concurrency, state |
| `testing--test-integration` | Integration tests for real service interactions |
| `testing--test-e2e` | End-to-end tests for complete user workflows |
| `testing--test-fix` | Diagnoses failing tests — is it the test or the code? |
| `testing--test-coverage` | Finds coverage gaps, generates tests for highest-risk areas |
| `testing--test-mock` | Generates mocks, stubs, spies, fakes, fixture factories |
| `testing--snapshot-update` | Reviews snapshot changes — intentional, bug, or flaky? |

</details>

<details>
<summary><strong>Security (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `security--security-audit` | Full OWASP Top 10 scan with severity ratings and fix code |
| `security--secrets-scan` | Finds API keys, tokens, passwords, private keys in code + history |
| `security--auth-review` | Reviews entire auth flow: hashing, sessions, JWT, CSRF, IDOR |
| `security--sanitize` | Traces user inputs to usage — finds injection, XSS, SSRF paths |
| `security--cors-review` | Reviews CORS config per environment, fixes overly permissive rules |
| `security--csp-gen` | Generates Content Security Policy from actual resource usage |
| `security--dependency-vuln` | Checks all deps for known CVEs with remediation plan |
| `security--env-hardening` | Audits env config, HTTP security headers, server exposure |

</details>

<details>
<summary><strong>DevOps & Infrastructure (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `devops--dockerfile` | Generates multi-stage Dockerfile optimized for caching, security, size |
| `devops--docker-compose` | Full compose setup with health checks, volumes, networks, depends |
| `devops--ci` | Generates CI/CD pipeline: lint, test, build, deploy with caching |
| `devops--github-actions` | GitHub Actions workflows: CI, CD, auto-label, dependabot merge |
| `devops--k8s` | Kubernetes manifests: Deployment, Service, Ingress, HPA, PVC |
| `devops--terraform` | Terraform configs with modules, remote state, proper IAM |
| `devops--nginx` | Nginx config: reverse proxy, SSL, gzip, rate limit, security headers |
| `devops--deploy-check` | Pre-deployment checklist verified against actual code state |

</details>

<details>
<summary><strong>Documentation (7)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `docs--doc-gen` | Generates documentation: overview, usage examples, API reference |
| `docs--readme-gen` | Professional README with badges, quick start, API, FAQ |
| `docs--diagram` | Generates Mermaid diagrams from code analysis (flow, sequence, ER, C4) |
| `docs--adr` | Creates Architecture Decision Records with context and alternatives |
| `docs--api-doc` | API documentation from route handlers with examples and status codes |
| `docs--openapi-gen` | Generates OpenAPI 3.0 YAML from codebase endpoints |
| `docs--contributing` | CONTRIBUTING.md tailored to actual project tooling |

</details>

<details>
<summary><strong>Database (6)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `database--migration` | Generates reversible migration for any ORM with safety checks |
| `database--query-optimize` | Finds N+1, missing indexes, full scans, suggests EXPLAIN analysis |
| `database--schema` | Designs normalized schema with proper types, constraints, indexes |
| `database--seed` | Generates realistic seed data respecting all constraints |
| `database--erd` | Generates Mermaid ER diagram from models/migrations |
| `database--prisma-gen` | Generates or updates Prisma schema with best practices |

</details>

<details>
<summary><strong>API Development (5)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `api--endpoint` | Scaffolds endpoint: route, validation, auth, handler, types, tests |
| `api--graphql-schema` | GraphQL types, queries, mutations, resolvers with DataLoader |
| `api--rest-client` | Type-safe API client with retry, timeout, cancellation |
| `api--mock-api` | Mock API server with realistic data, latency, stateful CRUD |
| `api--messaging-bridge` | Multi-platform messaging bridge (Telegram, WhatsApp, Instagram, Messenger) to Claude API with session management |

</details>

<details>
<summary><strong>Performance (5)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `performance--perf-audit` | Finds N+1 queries, re-renders, bundle bloat, memory leaks |
| `performance--bundle-analyze` | Identifies heavy deps, missing code splitting, tree shaking issues |
| `performance--cache` | Designs caching strategy: HTTP, Redis, in-memory, CDN |
| `performance--lazy-load` | Implements route/component/image lazy loading with loading states |
| `performance--memory-leak` | Finds leaked listeners, unclosed connections, growing collections |

</details>

<details>
<summary><strong>Scaffolding (6)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `scaffold--scaffold` | Scaffolds complete project: structure, config, tooling, CI |
| `scaffold--fullstack` | Full-stack feature: migration + API + frontend + tests |
| `scaffold--component` | UI component with types, styles, tests, stories |
| `scaffold--hook` | Custom React hook with types, cleanup, tests |
| `scaffold--middleware` | Auth, validation, logging, rate limiting middleware |
| `scaffold--model` | Data model with validation, relations, methods, factory |

</details>

<details>
<summary><strong>AI & LLM (3)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `ai--prompt-engineer` | Optimizes system prompts, user prompts, tool definitions |
| `ai--ai-integration` | Integrates Claude/OpenAI APIs with streaming, retry, caching |
| `ai--embeddings` | Implements RAG pipeline: chunk, embed, store, search, rank |

</details>

<details>
<summary><strong>Accessibility (2)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `accessibility--a11y-audit` | WCAG 2.1 audit: perceivable, operable, understandable, robust |
| `accessibility--a11y-fix` | Fixes semantic HTML, keyboard nav, ARIA, focus management |

</details>

<details>
<summary><strong>Internationalization (1)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `i18n--i18n-setup` | Full i18n setup: library, locale detection, string extraction, RTL |

</details>

<details>
<summary><strong>Utilities (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `utils--explain` | Layered code explanation: TL;DR, purpose, flow, concepts, gotchas |
| `utils--translate` | Translates code between languages preserving idioms |
| `utils--regex` | Generates, explains, tests regex with ReDoS warnings |
| `utils--gitignore` | Generates .gitignore from detected technologies |
| `utils--convert` | Converts JSON/YAML/TOML/XML/CSV/ENV + generates Zod schemas |
| `utils--dep-update` | Updates deps safely: patches first, then minors, majors one-by-one |
| `utils--env-setup` | Finds all env vars in code, generates .env.example + validation |
| `utils--cron-explain` | Generates/explains cron expressions with next 5 run times |
| `utils--tsconfig` | Optimized tsconfig for project type (Node, React, library, monorepo) |
| `utils--eslint-config` | ESLint config with framework-specific rules, import ordering |
| `utils--package-json` | Cleans up package.json: scripts, deps, metadata, security |
| `utils--monorepo` | Sets up monorepo: workspaces, shared configs, build pipeline |

</details>

---

## Plugin Marketplace

Install skill bundles directly in Claude Code:

```bash
# Add the repository
/plugin marketplace add sgomez-dev/claude-skills

# Install specific bundles
/plugin install web-skills@claude-skills-collection
/plugin install git-skills@claude-skills-collection
/plugin install code-quality-skills@claude-skills-collection
/plugin install testing-skills@claude-skills-collection
/plugin install docs-skills@claude-skills-collection
/plugin install security-skills@claude-skills-collection
/plugin install devops-skills@claude-skills-collection
/plugin install database-skills@claude-skills-collection
/plugin install api-skills@claude-skills-collection
/plugin install performance-skills@claude-skills-collection
/plugin install scaffold-skills@claude-skills-collection
/plugin install ai-skills@claude-skills-collection
/plugin install utility-skills@claude-skills-collection
```

---

## Cross-Platform

These skills work across multiple AI coding assistants:

| Platform | Install Method | Guide |
|----------|---------------|-------|
| **Claude Code** | `./install.sh` or plugin marketplace | [This README](#quick-install) |
| **Cursor** | Copy to `.cursor/rules/` as `.mdc` files | [Cursor Guide](platforms/cursor.md) |
| **Windsurf** | Copy to `.windsurf/rules/` | [Windsurf Guide](platforms/windsurf.md) |
| **Codex** | Concatenate into `AGENTS.md` | [Codex Guide](platforms/codex.md) |

The skill format (markdown with numbered steps) is intentionally portable. No vendor lock-in.

---

## Installation Details

### Global vs Project

| | Global | Project |
|-|--------|---------|
| **Location** | `~/.claude/commands/` | `.claude/commands/` |
| **Scope** | All projects | This project only |
| **Share with team** | No | Yes (commit to git) |
| **Best for** | Personal productivity | Team standards |

### Interactive Installer

```bash
./install.sh
```

Options:
1. **Global** — All 96 skills in every project
2. **Project** — All 96 skills in current project only
3. **Selective** — Pick categories to install
4. **Uninstall** — Remove all installed skills

### Cherry-Pick

```bash
# Install just the skills you need
cp skills/security/security-audit.md ~/.claude/commands/security--audit.md
cp skills/git/commit.md ~/.claude/commands/git--commit.md
```

---

## How Skills Work

Each skill is a markdown file with:

```markdown
---
description: Shown in the command palette when you type /
---

Step-by-step instructions that Claude follows.
Skills detect your project context (language, framework, patterns)
automatically — no configuration needed.

$ARGUMENTS   <-- your input when invoking the command
```

### What Makes These Different

| Most Skill Repos | This Repo |
|-------------------|-----------|
| "Review this code for issues" | Specific checklist: correctness, security (OWASP), performance (N+1), maintainability, with severity ratings |
| "Write tests" | Detects test framework, generates happy path + edge cases + error cases + AAA pattern + mocks |
| "Generate Dockerfile" | Multi-stage build, layer caching optimization, non-root user, .dockerignore, health checks |
| Generic prompts | Context-aware steps that adapt to your project |

---

## Pipelines

Pipelines chain multiple skills together into end-to-end workflows with quality gates. Run them with `/meta--pipeline-run`.

| Pipeline | Skills Chained | What It Does |
|----------|---------------|-------------|
| `feature-complete` | review → security audit → test gen → commit → PR | Full quality gate from code to merged PR |
| `security-hardening` | secrets → deps → OWASP → auth → sanitize → headers → CORS → CSP | Complete security review and hardening |
| `new-project` | detect stack → gitignore → tsconfig → eslint → env → docker → CI → README | Bootstrap a project with all configs |
| `pre-deploy` | checklist → secrets → deps → performance → coverage | Everything that should pass before production |
| `code-cleanup` | dead code → DRY → complexity → smells → naming → errors | Comprehensive code quality pass |

### How Pipelines Work

```yaml
# pipelines/feature-complete.yaml
steps:
  - name: Code Review
    skill: code-quality--review
    gate:
      max_severity: critical    # Abort if critical issues
    on_failure: abort

  - name: Security Audit
    skill: security--security-audit
    gate:
      max_severity: critical
    on_failure: abort

  - name: Generate Tests
    skill: testing--test-gen
    on_failure: warn            # Continue even if this step has issues

  - name: Create PR
    skill: git--pr-create
```

Each step passes context to the next. Quality gates prevent bad code from progressing. Create your own pipelines in `pipelines/`.

---

## Test Harness & Safety

Every skill is validated by CI on every push:

```bash
./scripts/test-runner.sh
```

```
  ╔═════════════════════════════════════════╗
  ║       CLAUDE SKILLS TEST RUNNER         ║
  ╚═════════════════════════════════════════╝

  [1/5] Structure Validation     96/96 PASS
  [2/5] Permission Manifests     96/96 declared
  [3/5] Safety Lint              96/96 safe
  [4/5] Trigger Quality          96/96 OK
  [5/5] Test File Coverage       10/96 (11%)
```

### What Gets Checked

| Check | What It Catches |
|-------|----------------|
| **Structure** | Missing frontmatter, empty descriptions, no content |
| **Permissions** | Undeclared destructive operations, missing manifests |
| **Safety** | `rm -rf /`, `curl\|bash`, `chmod 777`, `--no-verify`, credential patterns |
| **Triggers** | Descriptions too short (won't fire) or too long (diluted matching) |
| **Tests** | Missing .test.yaml companion files |

### Permission Linter

```bash
./scripts/lint-permissions.sh
```

Cross-references what a skill **declares** it can do vs what its instructions **actually do**. Catches mismatches like a skill that says `destructive: false` but contains `git reset --hard`.

---

## FAQ

<details>
<summary><strong>Do these work with Claude.ai (not just Claude Code)?</strong></summary>

These skills are designed for Claude Code's slash command system. For Claude.ai, you can paste the skill content as a system prompt or use it as a custom instruction.

</details>

<details>
<summary><strong>Can I use these with other AI assistants?</strong></summary>

Yes. The skills are just markdown with instructions. They work with any AI coding assistant that supports custom prompts — Cursor, Windsurf, Codex, Continue, etc. See [Cross-Platform](#cross-platform).

</details>

<details>
<summary><strong>How do I create my own skill?</strong></summary>

Use the [template](template/SKILL.md) and follow the [contributing guide](CONTRIBUTING.md). The key is specific, numbered steps — not vague instructions.

</details>

<details>
<summary><strong>Do skills slow down Claude Code?</strong></summary>

No. Skills are only loaded when you invoke them. Having 96 skills installed has zero impact on performance.

</details>

<details>
<summary><strong>What if a skill doesn't work well for my project?</strong></summary>

Fork and customize. Each skill is a self-contained markdown file. Edit the instructions to match your stack, conventions, or preferences.

</details>

<details>
<summary><strong>Global or project install?</strong></summary>

Start with global. If you want to share specific skills with your team (e.g., enforce commit conventions), install those at the project level and commit to git.

</details>

---

## Project Structure

```
claude-skills/
├── skills/                     # 96 skills organized by category
│   ├── meta/                   # 4 meta-skills (router, pipelines, forge, health)
│   ├── git/                    # 10 git & version control skills
│   ├── code-quality/           # 10 code review & refactoring skills
│   ├── testing/                # 8 test generation & management skills
│   ├── security/               # 8 security audit & hardening skills
│   ├── devops/                 # 8 infrastructure & deployment skills
│   ├── docs/                   # 7 documentation generation skills
│   ├── database/               # 6 database & ORM skills
│   ├── scaffold/               # 6 project scaffolding skills
│   ├── performance/            # 5 performance optimization skills
│   ├── api/                    # 5 API development skills
│   ├── ai/                     # 3 AI/LLM integration skills
│   ├── web/                    # 7 web & UI skills (landing pages, SPA, animations, design systems)
│   ├── accessibility/          # 2 WCAG compliance skills
│   ├── i18n/                   # 1 internationalization skill
│   ├── utils/                  # 12 utility skills
│   └── **/*.test.yaml          # Test files for skill validation
├── pipelines/                  # 5 composable multi-skill workflows
│   ├── feature-complete.yaml
│   ├── security-hardening.yaml
│   ├── new-project.yaml
│   ├── pre-deploy.yaml
│   └── code-cleanup.yaml
├── scripts/                    # Validation & tooling
│   ├── test-runner.sh          # CI test harness (structure, safety, triggers)
│   ├── lint-permissions.sh     # Permission manifest cross-reference linter
│   └── detect-project.sh      # Tech stack detection for smart routing
├── .github/workflows/
│   └── test-skills.yml         # GitHub Actions CI pipeline
├── .claude-plugin/
│   └── marketplace.json        # Plugin marketplace (12 bundles)
├── platforms/                  # Cross-platform guides (Cursor, Windsurf, Codex)
├── template/SKILL.md           # Template for creating new skills
├── install.sh                  # Interactive installer (macOS/Linux/Git Bash)
├── install.ps1                 # Interactive installer (Windows PowerShell)
├── CLAUDE.md                   # Project instructions for Claude Code
├── CONTRIBUTING.md             # Contribution guide with quality checklist
└── LICENSE                     # MIT
```

---

## Contributing

We want more skills. See [CONTRIBUTING.md](CONTRIBUTING.md) for the format and process.

Good skill ideas:
- Language-specific skills (Go error handling, Rust borrow checker help)
- Framework-specific skills (Next.js App Router, Django REST, Rails)
- Domain-specific skills (payment processing, email templates, PDF generation)
- Workflow skills (monorepo management, feature flags, A/B testing)

---

## License

MIT — use these however you want.
