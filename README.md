<p align="center">
  <img src="https://img.shields.io/badge/Skills-327-blue?style=for-the-badge" alt="327 Skills" />
  <img src="https://img.shields.io/badge/Tested-CI_Validated-brightgreen?style=for-the-badge" alt="CI Tested" />
  <img src="https://img.shields.io/badge/Permissions-100%25_Declared-brightgreen?style=for-the-badge" alt="Permissions" />
  <img src="https://img.shields.io/badge/Pipelines-7-purple?style=for-the-badge" alt="7 Pipelines" />
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
  327 skills across 32 categories. 7 pipelines. Full CI validation. Zero trust assumptions.
</p>

<p align="center">
  <a href="#quick-install">Quick Install</a> &bull;
  <a href="#what-makes-this-different">Why This One</a> &bull;
  <a href="#all-327-skills">Browse Skills</a> &bull;
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
| **Pipelines** | Skills are isolated, one-shot | 7 pre-built pipelines chain skills into end-to-end workflows |
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

## All 327 Skills

327 skills across 32 categories. Click any group to expand its command table.

### Engineering & Data

<details>
<summary><strong>Web & UI (18)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `web--animated-components` | Pre-built animated React components — Magic UI (150+ shadcn/Tailwind) and React Bits (90+ effects) |
| `web--animations` | Build cinematic, world-class web animations — 3D models, horizontal scroll, WebGL, particles, shaders, and more |
| `web--awwwards-animations` | Awwwards-level React animations — GSAP, Motion, Anime.js, Lenis smooth scroll, ScrollTrigger, magnetic effects |
| `web--conversion-optimizer` | Audit and optimize a landing page or web app for conversions — copy, layout, UX, and trust |
| `web--design-engineering` | Design engineering — UI polish, animation decisions, and invisible details that make interfaces feel great (Emil Kowalski) |
| `web--design-system` | Create a complete, opinionated design system with tokens, typography, color, and components |
| `web--graphic-design` | AI Design Studio — generate production-quality mockups, social graphics, brand kits, pitch decks, infographics, and more from natural language prompts |
| `web--gsap-creative-gallery` | GSAP creative galleries — infinite scroll, masonry animations, lightbox transitions, FLIP layouts, and interactive image showcases |
| `web--gsap-hero-cinematic` | GSAP cinematic hero sections — layered reveals, 3D parallax, animated typography, video backgrounds, and immersive landing experiences |
| `web--gsap-micro-interactions` | Premium micro-interactions — GSAP custom cursors, magnetic buttons, tilt cards, spotlight effects, button animations, scroll indicators |
| `web--gsap-page-transitions` | GSAP page transitions — route animations, shared element transitions, overlay wipes, and seamless navigation effects |
| `web--gsap-preloader` | GSAP preloaders — progress bars, animated logos, skeleton screens, number counters, and cinematic loading sequences |
| `web--gsap-scroll-experience` | GSAP ScrollTrigger scroll-driven animations — parallax, pinning, horizontal scroll, scrub timelines, scroll velocity effects |
| `web--gsap-svg-morphing` | SVG morphing & shape animations — GSAP path drawing, shape morphing, animated icons, blob shapes, wave dividers, motion paths |
| `web--gsap-text-fx` | Advanced kinetic typography — GSAP text split, scramble, liquid, glitch, 3D rotation, gradient sweep, curved path text |
| `web--landing-page` | Generate a world-class landing page — unique, crafted, high-converting, never AI-looking |
| `web--spa-scaffold` | Scaffold a production-grade SPA with elite architecture, stunning UI, and real-world patterns |
| `web--ui-components-pro` | Build elite UI components with animations, compound patterns, and zero AI-looking aesthetics |

</details>

<details>
<summary><strong>Meta Skills (4)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `meta--health-check` | Run a health check on all installed skills - validate structure, permissions, and safety |
| `meta--pipeline-run` | Run a multi-skill pipeline - chain skills together for end-to-end workflows |
| `meta--skill-forge` | Generate a new tested skill with permission manifest from a natural language description |
| `meta--skills-init` | Scan your project and activate only the relevant skills with project-specific config |

</details>

<details>
<summary><strong>Git & Version Control (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `git--blame-detective` | Deep investigation of who changed what and why using git blame and log |
| `git--branch` | Create a well-named git branch following team conventions |
| `git--changelog` | Generate a CHANGELOG from git history using conventional commits |
| `git--cherry-pick-pr` | Cherry-pick specific commits from a PR or branch into current branch |
| `git--commit` | Generate a smart conventional commit message analyzing staged changes |
| `git--git-hooks` | Set up git hooks - pre-commit, husky, lint-staged, commit-msg validation |
| `git--monorepo-git` | Monorepo git strategies - sparse checkout, CODEOWNERS, selective CI triggers |
| `git--pr-create` | Create a comprehensive pull request with smart title, description, and labels |
| `git--pr-review` | Perform a thorough code review on a pull request |
| `git--release` | Create a semantic version release with tag, changelog, and GitHub release |
| `git--stash-manager` | Interactive git stash management - list, apply, drop, and organize stashes |
| `git--undo` | Safely undo the last git operation with explanation |

</details>

<details>
<summary><strong>Code Quality (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `code-quality--code-smells` | Detect code smells and anti-patterns with actionable fixes |
| `code-quality--complexity` | Analyze code complexity and suggest simplifications |
| `code-quality--dead-code` | Find and remove dead code - unused functions, imports, variables, and files |
| `code-quality--dependency-audit` | Audit project dependencies for security, size, maintenance status, and alternatives |
| `code-quality--dry` | Find DRY violations - duplicated code patterns that should be abstracted |
| `code-quality--error-handling` | Audit and improve error handling patterns across the codebase |
| `code-quality--naming` | Improve variable, function, and class naming for clarity and consistency |
| `code-quality--refactor` | Intelligently refactor code while preserving behavior |
| `code-quality--review` | Comprehensive code review of changed or specified files |
| `code-quality--type-check` | Add or fix TypeScript/Python type annotations for better type safety |

</details>

<details>
<summary><strong>Testing (13)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `testing--contract-testing` | Add consumer-driven contract tests (Pact-style) between services |
| `testing--load-testing` | Load-test setup — choose k6/Locust/Artillery, scenarios, thresholds, CI gate |
| `testing--mutation-testing` | Set up mutation testing, interpret surviving mutants, and harden weak tests |
| `testing--playwright-mcp` | Playwright MCP browser automation — navigate, click, fill forms, debug, take screenshots |
| `testing--snapshot-update` | Review and update test snapshots intelligently |
| `testing--test-coverage` | Analyze test coverage gaps and generate tests to fill them |
| `testing--test-e2e` | Generate end-to-end tests for user workflows |
| `testing--test-edge-cases` | Generate edge case and boundary tests that catch the bugs others miss |
| `testing--test-fix` | Diagnose and fix failing tests |
| `testing--test-gen` | Generate comprehensive unit tests for the specified code |
| `testing--test-integration` | Generate integration tests that verify components work together correctly |
| `testing--test-mock` | Generate mocks, stubs, and fixtures for testing |
| `testing--visual-regression` | Set up visual regression tests with baselines, CI integration, and flake control |

</details>

<details>
<summary><strong>Debugging (15)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `debugging--async-debug` | Debug async/await, promise chains, and concurrency bugs |
| `debugging--breakpoint-guide` | Generate a strategic breakpoint plan for debugging a specific issue |
| `debugging--chaos-debug` | Stress-test code with fault injection, edge cases, and chaos scenarios to find hidden bugs |
| `debugging--console-debug` | Add strategic debug logging to trace a bug through the code |
| `debugging--core-dump` | Analyze crash dumps, segfaults, panics, and fatal process terminations |
| `debugging--distributed-trace` | Debug failures across microservices using distributed tracing and request correlation |
| `debugging--error-decode` | Decode cryptic error codes and messages into actionable explanations |
| `debugging--memory-leak` | Hunt down memory leaks by analyzing allocation patterns and retention paths |
| `debugging--network-debug` | Debug HTTP, WebSocket, gRPC, and network connectivity issues |
| `debugging--perf-flamegraph` | Profile and debug performance bottlenecks using flamegraph analysis and CPU/IO profiling |
| `debugging--production-debug` | Debug production-only issues using logs, metrics, and traces without direct access |
| `debugging--race-condition` | Detect and fix race conditions, data races, and TOCTOU bugs |
| `debugging--stack-trace` | Analyze a stack trace or error message and pinpoint the root cause |
| `debugging--state-debug` | Debug complex application state issues (Redux, databases, caches, sessions) |
| `debugging--variable-inspect` | Trace a variable's lifecycle to find where it gets corrupted or goes wrong |

</details>

<details>
<summary><strong>Documentation (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `docs--adr` | Create an Architecture Decision Record (ADR) for important technical decisions |
| `docs--api-changelog` | API changelog - detect breaking changes between versions with migration notes |
| `docs--api-doc` | Generate API documentation from route handlers and controllers |
| `docs--contributing` | Generate a CONTRIBUTING.md guide for open source projects |
| `docs--diagram` | Generate architecture diagrams using Mermaid from code analysis |
| `docs--doc-gen` | Generate comprehensive documentation for code, APIs, or entire modules |
| `docs--onboarding-guide` | Generate a developer onboarding guide from the actual repo setup |
| `docs--openapi-gen` | Generate or update OpenAPI/Swagger specification from code |
| `docs--readme-gen` | Generate a professional README.md for the project |
| `docs--video-spec` | Motion design video specs — scene breakdowns, timing, audio strategy, animation principles |

</details>

<details>
<summary><strong>Security (11)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `security--auth-review` | Review authentication and authorization implementation for vulnerabilities |
| `security--cors-review` | Review and fix CORS configuration for security |
| `security--csp-gen` | Generate and validate Content Security Policy headers |
| `security--dependency-vuln` | Check dependencies for known security vulnerabilities |
| `security--env-hardening` | Review and harden environment configuration and HTTP security headers |
| `security--pentest-prep` | Defensive pre-pentest hardening: scope doc, quick fixes, evidence collection |
| `security--rate-limiting` | Design rate limiting: algorithms, per-route budgets, headers, distributed state |
| `security--sanitize` | Find unsanitized inputs and add proper validation/sanitization |
| `security--secrets-scan` | Scan codebase for leaked secrets, API keys, tokens, and credentials |
| `security--security-audit` | Comprehensive security audit scanning for OWASP Top 10 and common vulnerabilities |
| `security--threat-model` | Threat model with STRIDE: assets, trust boundaries, attack surface, mitigations |

</details>

<details>
<summary><strong>DevOps & Infrastructure (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `devops--ansible` | Write Ansible playbooks with roles, idempotency, vault-encrypted secrets, inventories |
| `devops--ci` | Generate CI/CD pipeline configuration (GitHub Actions, GitLab CI, etc.) |
| `devops--deploy-check` | Pre-deployment checklist - verify everything before shipping |
| `devops--docker-compose` | Generate docker-compose.yml for local development or production |
| `devops--dockerfile` | Generate or optimize a production-ready Dockerfile |
| `devops--github-actions` | Generate GitHub Actions workflows for CI, CD, auto-labeling, and automation |
| `devops--gitops` | Set up GitOps with ArgoCD or Flux — repo structure, sync policies, safe rollbacks |
| `devops--helm-chart` | Build a Helm chart with clean templates, values, dependencies, lint, release strategy |
| `devops--k8s` | Generate Kubernetes manifests for deploying the application |
| `devops--nginx` | Generate optimized Nginx configuration |
| `devops--secrets-management` | Audit hardcoded secrets, migrate to a vault/secret manager, plan rotation |
| `devops--terraform` | Generate Terraform infrastructure-as-code configurations |

</details>

<details>
<summary><strong>Database (6)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `database--erd` | Generate Entity Relationship Diagram from database schema or ORM models |
| `database--migration` | Generate database migration files for schema changes |
| `database--prisma-gen` | Generate or update Prisma schema from requirements or existing database |
| `database--query-optimize` | Analyze and optimize slow SQL queries or ORM queries |
| `database--schema` | Design or review database schema with proper normalization and indexing |
| `database--seed` | Generate realistic seed data for development and testing |

</details>

<details>
<summary><strong>API Development (5)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `api--endpoint` | Scaffold a complete API endpoint with validation, auth, and error handling |
| `api--graphql-schema` | Generate GraphQL schema with types, queries, mutations, and resolvers |
| `api--messaging-bridge` | Genera un servicio puente entre plataformas de mensajería (Telegram, WhatsApp, Instagram, Messenger) y Claude API |
| `api--mock-api` | Create a mock API server for frontend development or testing |
| `api--rest-client` | Generate a type-safe API client SDK from endpoint definitions |

</details>

<details>
<summary><strong>Performance (7)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `performance--bundle-analyze` | Analyze JavaScript bundle size and suggest optimizations |
| `performance--cache` | Implement caching strategy for API responses, database queries, or computations |
| `performance--db-performance` | Diagnose database performance: slow query logs, indexing, pooling, hot paths |
| `performance--lazy-load` | Implement lazy loading for routes, components, images, and modules |
| `performance--memory-leak` | Find and fix memory leaks in the application |
| `performance--perf-audit` | Comprehensive performance audit - identify bottlenecks and optimize |
| `performance--web-vitals` | Core Web Vitals - measure LCP/INP/CLS, diagnose causes, fix with code changes |

</details>

<details>
<summary><strong>Networking & Cloudflare (19)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `networking--api-gateway` | Design API gateway configuration with rate limiting, auth, and routing |
| `networking--cdn-strategy` | Design CDN caching strategy and cache rules for web applications |
| `networking--cloudflare-d1` | Set up Cloudflare D1 serverless SQLite database |
| `networking--cloudflare-dns` | Configure and audit Cloudflare DNS records and settings |
| `networking--cloudflare-kv` | Implement Cloudflare Workers KV for edge key-value storage |
| `networking--cloudflare-pages` | Configure Cloudflare Pages for static site and JAMstack deployments |
| `networking--cloudflare-r2` | Set up Cloudflare R2 object storage with S3-compatible access |
| `networking--cloudflare-tunnel` | Configure Cloudflare Tunnel to expose local services securely |
| `networking--cloudflare-waf` | Configure Cloudflare WAF rules and firewall policies |
| `networking--cloudflare-workers` | Scaffold and deploy Cloudflare Workers for edge computing |
| `networking--dns-debug` | Diagnose and troubleshoot DNS resolution and propagation issues |
| `networking--durable-objects` | Implement Cloudflare Durable Objects for stateful edge computing |
| `networking--edge-functions` | Build edge functions for request/response manipulation and routing |
| `networking--load-balancer` | Configure load balancing with health checks and failover policies |
| `networking--network-debug` | Diagnose network connectivity, latency, and routing issues |
| `networking--reverse-proxy` | Configure reverse proxy setups with Cloudflare, Nginx, or Caddy |
| `networking--ssl-tls` | Audit and configure SSL/TLS certificates and HTTPS settings |
| `networking--webhook-endpoint` | Build secure webhook receivers with signature verification and retry handling |
| `networking--zero-trust` | Set up Cloudflare Zero Trust access policies and identity-aware proxy |

</details>

<details>
<summary><strong>Scaffolding (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `scaffold--component` | Generate a complete React/Vue/Svelte component with types, tests, and stories |
| `scaffold--component-3d` | Generate a 3D component (React Three Fiber, Three.js, Babylon.js) with types, animations, and controls |
| `scaffold--create-video` | Bootstrap a NEW video project from scratch with npx create-video — picks the right Remotion template, scaffolds, and customizes it ready to preview |
| `scaffold--fullstack` | Scaffold a complete full-stack feature across frontend, backend, and database |
| `scaffold--hook` | Generate a custom React hook with proper types and tests |
| `scaffold--middleware` | Generate middleware for authentication, logging, validation, etc. |
| `scaffold--model` | Generate a data model with validation, serialization, and database integration |
| `scaffold--remotion` | Remotion video creation in React — compositions, animations, audio, transitions, text effects |
| `scaffold--scaffold` | Scaffold a complete project structure from scratch |
| `scaffold--startup-generator` | Generador completo de startup/SaaS — 10 agentes especializados en paralelo + PowerPoint con plan de negocio |

</details>

<details>
<summary><strong>Full-Stack Features (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `fullstack--admin-panel` | Admin panel - CRUD for core models, impersonation, audit log, role gates |
| `fullstack--auth-flow` | Implement full auth - OAuth and email flows, sessions/JWT, RBAC, password reset |
| `fullstack--background-jobs` | Background job system - queue choice for the stack, workers, retries, cron, monitoring |
| `fullstack--feature-flags` | Feature flags - provider vs homegrown choice, targeting, kill switches, cleanup |
| `fullstack--file-upload` | File uploads - presigned direct-to-S3/R2 flow, validation, progress, thumbnails |
| `fullstack--multi-tenancy` | Add multi-tenancy: isolation model choice (row/schema/db), scoping, migrations |
| `fullstack--notification-system` | Multi-channel notifications - in-app, email, push with preferences and digests |
| `fullstack--onboarding-flow` | Build user onboarding: signup-to-activation flow, checklists, empty states, metrics |
| `fullstack--payments-integration` | Integrate payments - checkout, subscriptions, signed webhooks, customer portal |
| `fullstack--realtime-feature` | Add realtime - WebSocket/SSE choice, presence, optimistic UI, reconnection |
| `fullstack--saas-starter` | Scaffold a production SaaS starter - auth, orgs/teams, billing stubs, settings, emails |
| `fullstack--search-feature` | Add search: engine choice (Postgres FTS/Meilisearch/Elastic), indexing, ranking, UI |

</details>

<details>
<summary><strong>Cloud Architecture (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `cloud--autoscaling-strategy` | Design autoscaling: metrics, policies, warm pools, load-testing validation |
| `cloud--aws-architect` | Design an AWS architecture for this app — service choices, diagram, IaC starter |
| `cloud--azure-architect` | Design an Azure architecture for this app — service choices, diagram, IaC starter |
| `cloud--cloud-cost-audit` | Audit cloud costs from billing exports and IaC — find waste, rightsize, plan savings |
| `cloud--cloud-migration` | Plan a migration to the cloud — assessment, 6 Rs strategy, phased plan, rollback |
| `cloud--disaster-recovery` | Build a DR plan — RTO/RPO targets, backup strategy, failover runbook, test schedule |
| `cloud--gcp-architect` | Design a GCP architecture for this app — service choices, diagram, IaC starter |
| `cloud--iam-least-privilege` | Audit IAM policies and generate least-privilege replacements you review and apply |
| `cloud--infra-diagram` | Generate infrastructure diagrams (Mermaid) from IaC and config files |
| `cloud--serverless-api` | Build a serverless API — functions, routing, cold-start mitigation, local dev setup |

</details>

<details>
<summary><strong>Observability & SRE (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `observability--alerting-rules` | Design symptom-based alerting with thresholds, severity, routing, and dedup |
| `observability--incident-response` | Set up an incident response process with severity matrix, roles, and comms |
| `observability--logging-strategy` | Design structured logging: levels, correlation IDs, PII redaction, retention |
| `observability--metrics-setup` | Instrument app metrics with RED/USE method via Prometheus or OpenTelemetry |
| `observability--postmortem` | Write a blameless postmortem with timeline, contributing factors, and actions |
| `observability--runbook-gen` | Generate operational runbooks covering symptoms, diagnosis, and remediation |
| `observability--slo-sli` | Define SLIs/SLOs from user journeys with error budgets and burn-rate alerts |
| `observability--tracing-setup` | Instrument distributed tracing with OpenTelemetry spans and context propagation |

</details>

<details>
<summary><strong>AI & LLM (18)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `ai--agent-builder` | Build an AI agent - loop design, tool surface, memory, stop conditions, evals |
| `ai--ai-integration` | Integrate AI/LLM APIs (Claude, OpenAI) into the application with best practices |
| `ai--chatbot-scaffold` | Scaffold a production chatbot - streaming UI, history, RAG hookup, feedback loop |
| `ai--context-engineering` | Context engineering: what goes in the window, retrieval vs stuffing, compaction |
| `ai--embeddings` | Implement vector embeddings for semantic search, RAG, or similarity matching |
| `ai--fine-tuning` | Fine-tune an LLM - decide vs prompting, prep dataset, train, eval before/after |
| `ai--guardrails` | LLM guardrails - input/output filters, injection defense, PII, jailbreak tests |
| `ai--llm-cost-optimizer` | Cut LLM costs: model routing, caching, prompt compression, batching without quality loss |
| `ai--llm-eval` | LLM output evals - rubrics, LLM-as-judge with bias controls, CI integration |
| `ai--llm-observability` | Instrument LLM calls - tracing, token/cost tracking, quality dashboards, alerts |
| `ai--mcp-server` | Build an MCP server - tools, resources, prompts, transport, auth, testing |
| `ai--multi-agent` | Design multi-agent systems: orchestrator patterns, handoffs, shared state, failure modes |
| `ai--prompt-engineer` | Optimize AI/LLM prompts for better results - system prompts, user prompts, tool definitions |
| `ai--rag-eval` | Evaluate a RAG pipeline - retrieval metrics, groundedness, golden set, regression |
| `ai--semantic-cache` | Add semantic caching to LLM calls - embedding keys, thresholds, invalidation |
| `ai--structured-output` | Reliable structured output - schemas, native modes, validation, repair loops |
| `ai--tool-calling` | Robust LLM tool calling - schema design, parallel calls, errors, eval harness |
| `ai--voice-agent` | Build a voice agent: STT/TTS choice, latency budget, interruptions, conversation design |

</details>

<details>
<summary><strong>Machine Learning (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `ml--dataset-prep` | Prepare a dataset for ML — cleaning, splits, leakage checks, balance, versioning |
| `ml--feature-engineering` | Engineer features with leakage-safe pipelines — encodings, scaling, interactions |
| `ml--mlops-pipeline` | Set up MLOps — experiment tracking, model registry, CI for models, reproducibility |
| `ml--model-deployment` | Deploy an ML model: serving pattern (batch/online), API, monitoring, drift detection |
| `ml--model-evaluation` | Evaluate a model properly — right metrics, calibration, slices, error analysis |
| `ml--model-training` | Train a model — baseline first, framework choice, cross-validation, tuning |
| `ml--recommender-system` | Build a recommender: collaborative/content/hybrid choice, cold start, evaluation |
| `ml--time-series-forecast` | Forecast time series — naive baselines, seasonality, backtesting, intervals |

</details>

<details>
<summary><strong>Data & Analytics (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `data--analytics-sql` | Turn a plain-language question into optimized analytical SQL for your schema |
| `data--cohort-analysis` | Build a cohort retention analysis: runnable SQL plus an interpretation guide |
| `data--csv-wrangler` | Clean, transform, dedupe, and reshape CSV/Excel files with a repeatable script |
| `data--dashboard-spec` | Spec a dashboard: audience, key questions, metrics, chart types, and layout |
| `data--data-contracts` | Define data contracts between producers and consumers: schema, SLAs, versioning |
| `data--data-quality-audit` | Audit a dataset or pipeline for nulls, duplicates, drift, and broken references |
| `data--dbt-model` | Generate dbt models with staging/marts layers, tests, and documentation |
| `data--etl-pipeline` | Scaffold an idempotent ETL/ELT pipeline for your stack with error handling |
| `data--event-tracking-plan` | Design a product analytics tracking plan with events, properties, and naming rules |
| `data--funnel-analysis` | Build a conversion funnel: step definitions, drop-off SQL, insights template |
| `data--metric-definition` | Define a business metric precisely: formula, grain, filters, edge cases, owner |
| `data--warehouse-schema` | Design a star/snowflake warehouse schema with fact and dimension tables |

</details>

<details>
<summary><strong>Mobile Development (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `mobile--app-store-listing` | Craft App Store/Play listings: title, keywords/ASO, descriptions, screenshot plan |
| `mobile--biometric-auth` | Add biometric auth: Face/Touch ID, secure token storage, safe fallbacks |
| `mobile--deep-linking` | Set up universal/app links: config, in-app routing, deferred links, QA matrix |
| `mobile--flutter-scaffold` | Scaffold a production Flutter app: routing, state management, theming, flavors |
| `mobile--mobile-navigation` | Design mobile navigation: stacks/tabs/modals, auth gating, state restoration |
| `mobile--mobile-performance` | Audit mobile performance: startup time, jank, bundle/APK size, memory, images |
| `mobile--mobile-release` | Set up mobile releases: versioning, signing, beta tracks, staged rollout, submission |
| `mobile--offline-sync` | Make the app offline-first: local store, sync strategy, conflicts, mutation queue |
| `mobile--push-notifications` | Implement push notifications: FCM/APNs setup, token lifecycle, permission UX |
| `mobile--react-native-scaffold` | Scaffold a production React Native/Expo app: navigation, state, theming, CI |

</details>

<details>
<summary><strong>Automation & Integration (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `automation--browser-automation` | Automate a browser task — login flows, form filling, downloads, scheduled runs |
| `automation--email-automation` | Build email automations — parse inbound mail, templated sending, sequences, unsubscribe |
| `automation--pdf-processing` | Build PDF workflows — extract text/tables, fill forms, merge/split, OCR fallback |
| `automation--report-automation` | Automate a recurring report — data pull, template, schedule, delivery channel |
| `automation--scheduled-tasks` | Schedule tasks reliably: cron vs queues, retries, monitoring, timezone traps |
| `automation--scrape-it-now` | Run a site-wide markdown crawl with scrape-it-now — job config, local vs Azure, indexing |
| `automation--scrapegraph-scraper` | Build an LLM-powered scraper with scrapegraph-ai — graph choice, Pydantic schemas, token cost |
| `automation--spreadsheet-automation` | Automate spreadsheets: formulas, Apps Script/openpyxl, imports, validation |
| `automation--web-scraper` | Build a polite web scraper — robots.txt, rate limits, selectors, pagination, storage |
| `automation--workflow-automation` | Design automations for n8n, Zapier, or Make — triggers, steps, error paths, export |

</details>

<details>
<summary><strong>Accessibility (2)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `accessibility--a11y-audit` | Audit UI components for accessibility (WCAG 2.1 compliance) |
| `accessibility--a11y-fix` | Fix accessibility issues - add ARIA, keyboard nav, focus management, semantic HTML |

</details>

<details>
<summary><strong>Internationalization (1)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `i18n--i18n-setup` | Set up internationalization (i18n) with translation extraction and management |

</details>

<details>
<summary><strong>Utilities (15)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `utils--benchmark` | Benchmark code correctly: harness, warmup, statistics, regression gates |
| `utils--convert` | Convert between data formats - JSON, YAML, TOML, XML, CSV, ENV |
| `utils--cron-explain` | Generate and explain cron expressions with next run times |
| `utils--dep-update` | Safely update project dependencies with breaking change detection |
| `utils--env-setup` | Set up environment variables with .env files and validation |
| `utils--eslint-config` | Generate or optimize ESLint configuration with sensible defaults |
| `utils--explain` | Explain code in detail - what it does, how it works, and why |
| `utils--ffmpeg` | FFmpeg video/audio processing — convert, resize, compress, trim, concatenate, platform export |
| `utils--gitignore` | Generate a comprehensive .gitignore tailored to the project |
| `utils--json-tools` | JSON utilities: validate, diff, query with jq, flatten, infer schema |
| `utils--monorepo` | Set up or optimize monorepo with workspaces, shared configs, and build pipeline |
| `utils--package-json` | Optimize and clean up package.json - scripts, dependencies, metadata |
| `utils--regex` | Generate, explain, and test regular expressions |
| `utils--translate` | Translate code between programming languages while preserving logic and idioms |
| `utils--tsconfig` | Generate or optimize tsconfig.json for the project |

</details>

### Business & Operations

*Skills that go beyond code — the work of actually running a software business.*

<details>
<summary><strong>Sales & Growth (21)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `sales--account-plan` | Build a strategic account plan with org map, pains, initiatives, entry plays |
| `sales--call-notes-to-crm` | Turn messy sales call notes into structured CRM fields, tasks, and follow-ups |
| `sales--case-study-generator` | Turn project notes and metrics into a customer case study (problem-solution-results) |
| `sales--cold-outreach` | Write multi-touch cold email and LinkedIn sequences personalized per lead |
| `sales--competitor-intel` | Competitive intel report covering positioning, pricing, feature matrix, gaps |
| `sales--deal-risk-analyzer` | Analyze deal or pipeline notes for risk signals using MEDDIC gap analysis |
| `sales--discovery-prep` | Pre-call research brief with company intel, attendees, hypotheses, questions |
| `sales--email-assistant` | Draft or reply to sales emails matched to deal stage, tone, and intent |
| `sales--follow-up-sequencer` | Design follow-up cadences per deal stage with timing and exit triggers |
| `sales--icp-builder` | Build an ICP from your customers, product, or website, plus lead-finder queries |
| `sales--intent-radar` | Detect buying signals for target accounts - hiring, funding, tech changes, news |
| `sales--lead-enrichment` | Enrich a lead list with public data - tech stack, size, funding, hiring, news |
| `sales--lead-finder` | Find and score leads matching your ICP via web search, or prioritize an existing list |
| `sales--lead-qualifier` | Qualify and tier leads with BANT, MEDDIC, or CHAMP scoring plus next actions |
| `sales--objection-handler` | Build an objection playbook with reframes, proof points, and next steps |
| `sales--pricing-strategy` | Design pricing and packaging - tiers, anchoring, and willingness-to-pay logic |
| `sales--proposal-generator` | Generate a commercial proposal or SOW from discovery notes, with pricing options |
| `sales--rfp-responder` | Draft RFP/RFI responses from a requirements matrix with compliance tracking |
| `sales--sales-battlecard` | Build a battlecard vs a competitor with traps, counters, proofs, landmines |
| `sales--social-selling` | Audit a LinkedIn presence and build a social selling content plan for a niche |
| `sales--territory-planner` | Segment a market into territories and tiers with balanced coverage per rep |

</details>

<details>
<summary><strong>Product Management (12)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `product--ab-test-design` | Design an A/B test — hypothesis, metrics, sample size, guardrails, analysis |
| `product--competitive-teardown` | Deep teardown of a competitor product — onboarding, features, pricing, UX |
| `product--feature-spec` | Detailed feature spec — user flows, edge cases, acceptance criteria, open questions |
| `product--launch-plan` | Build a product launch plan — phases, channels, assets, owners, checklist |
| `product--okr-builder` | Draft objectives and measurable key results from strategy and goals |
| `product--prd` | Write a full PRD from a feature idea — problem, goals, scope, success metrics |
| `product--pr-faq` | Write an Amazon working-backwards PR/FAQ for a product idea |
| `product--rice-prioritization` | Score a backlog with RICE and return a ranked, tiered priority list |
| `product--roadmap` | Build a now/next/later product roadmap from goals, backlog, and constraints |
| `product--user-interview-guide` | Create a discovery interview script — screener, non-leading questions, probes |
| `product--user-research-synthesis` | Synthesize interview notes and feedback into themes, insights, opportunities |
| `product--user-stories` | Break an epic or feature into INVEST user stories with acceptance criteria |

</details>

<details>
<summary><strong>Finance & SaaS Metrics (10)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `finance--budget-planner` | Departmental/project budget with categories, assumptions, variance tracking |
| `finance--burn-runway` | Burn rate and runway from expenses/revenue, with best/base/worst scenarios |
| `finance--cap-table` | Model a cap table: rounds, dilution, option pools, exit waterfall scenarios |
| `finance--financial-model` | Build a 3-year financial model skeleton (spreadsheet formulas) from inputs |
| `finance--fundraising-deck` | Structure a fundraising deck: narrative, slide-by-slide content, data room |
| `finance--invoice-generator` | Generate professional HTML/PDF-ready invoices from line items and client data |
| `finance--pricing-model` | Design pricing models: tiers, value metrics, packaging, price localization |
| `finance--revenue-forecast` | Forecast revenue from pipeline and historicals: bottoms-up build with scenarios |
| `finance--saas-metrics` | Compute SaaS metrics from revenue data: MRR, ARR, churn, NRR, LTV, CAC |
| `finance--unit-economics` | Unit economics: contribution margin, CAC payback, LTV:CAC with sensitivity |

</details>

<details>
<summary><strong>Legal & Compliance (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `legal--contract-review` | Review a contract draft - flag risky clauses, missing terms, one-sided duties |
| `legal--cookie-policy` | Generate a cookie policy from the cookies and trackers actually set in code |
| `legal--dpa-gen` | Draft a DPA skeleton with a subprocessor list built from your actual stack |
| `legal--gdpr-audit` | Audit the codebase for GDPR gaps - consent, retention, data subject rights |
| `legal--oss-license-check` | Scan dependencies for license compatibility, obligations, and copyleft risk |
| `legal--privacy-policy` | Draft a privacy policy from the data practices actually found in your codebase |
| `legal--sla-gen` | Draft an SLA with uptime tiers, response times, service credits, exclusions |
| `legal--terms-of-service` | Draft Terms of Service tailored to the product's actual business model |

</details>

<details>
<summary><strong>Content & Copywriting (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `content--blog-post` | Write a technical or business blog post with a real angle and human prose |
| `content--content-calendar` | Build a content calendar — pillars, cadence, formats mapped to funnel stages |
| `content--docs-site` | Scaffold a documentation site — tool choice, information architecture, templates |
| `content--newsletter` | Newsletter issue: curation, structure, A/B subject lines, plain-text friendly |
| `content--seo-content` | SEO brief + article: keyword intent, SERP analysis, headings, internal links |
| `content--social-posts` | Repurpose one piece of content into native LinkedIn, X, and Instagram posts |
| `content--technical-writing` | Turn engineering work into a technical article with narrative, diagrams, and code |
| `content--video-script` | Video script: hook, retention structure, B-roll notes, CTA — short or long form |

</details>

<details>
<summary><strong>E-commerce (8)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `ecommerce--abandoned-cart` | Build abandoned cart recovery — detection, email sequence, incentive logic |
| `ecommerce--checkout-flow` | Build or audit an optimized checkout — guest flow, payment UX, error recovery |
| `ecommerce--inventory-management` | Implement inventory — stock tracking, reservations, low-stock alerts, multi-location |
| `ecommerce--payment-methods` | Add payment methods: cards, wallets, BNPL, and local methods per market |
| `ecommerce--product-catalog` | Model a product catalog — variants, options, categories, attributes, media |
| `ecommerce--product-descriptions` | Write conversion-focused product descriptions at scale from specs or a CSV |
| `ecommerce--shipping-setup` | Set up shipping — zones, rates, carrier integration, tracking notifications |
| `ecommerce--store-scaffold` | Scaffold an e-commerce store — platform choice, catalog, cart, and checkout shell |

</details>

<details>
<summary><strong>Marketing (2)</strong></summary>

| Command | What It Does |
|---------|-------------|
| `marketing--ads-campaign` | Gestión completa de campañas publicitarias con 8 agentes especializados en paralelo + PowerPoint |
| `marketing--marketing-audit` | Auditoría de marketing digital completa con 8 agentes especializados en paralelo + PowerPoint |

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

# Business & operations bundles
/plugin install sales-skills@claude-skills-collection
/plugin install product-skills@claude-skills-collection
/plugin install finance-skills@claude-skills-collection
/plugin install legal-skills@claude-skills-collection
/plugin install content-skills@claude-skills-collection
/plugin install ecommerce-skills@claude-skills-collection
/plugin install marketing-skills@claude-skills-collection

# Engineering & data bundles
/plugin install data-skills@claude-skills-collection
/plugin install ml-skills@claude-skills-collection
/plugin install fullstack-skills@claude-skills-collection
/plugin install mobile-skills@claude-skills-collection
/plugin install cloud-skills@claude-skills-collection
/plugin install observability-skills@claude-skills-collection
/plugin install automation-skills@claude-skills-collection
/plugin install debugging-skills@claude-skills-collection
/plugin install networking-skills@claude-skills-collection
/plugin install meta-skills@claude-skills-collection
```

---

## External Skills

Not everything worth using was written here. `external/` vendors third-party skills
from their upstream repos, kept current with a sync script.

These use the **Agent Skill** format — a directory with `SKILL.md` plus
`references/` and `workflows/` — rather than this repo's single-file slash-command
format, so they install to `~/.claude/skills/` and are invoked as `/skill-name`
(or trigger automatically from their description).

**107 skills from 13 upstream repos.** Grouped by source:

| Upstream | License | What you get |
|----------|---------|--------------|
| [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | MIT | Motion design in two modes — build with purposeful motion, or audit existing animations for AI-slop patterns and emit an HTML report with looping demos |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | 12 skills from the author of Sonner and Vaul — animation craft, Apple design, animation vocabulary, UI library selection, prototyping, Swift |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | 12 anti-slop frontend skills — taste, brutalist/minimalist/soft styles, redesigns, image-to-code, brand kits |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | 7 design skills — design systems, brand, banners, slides, UI styling |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | Design-critique loop with browser automation and antipattern detection |
| [AgriciDaniel/banana-claude](https://github.com/AgriciDaniel/banana-claude) | MIT | Gemini image generation — presets, batching, cost tracking |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Apache-2.0 | Driving a browser from an agent |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | MIT | Outreach and contact discovery |
| [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills) | MIT | 8 skills from Higgsfield — image and video generation, brand kits, product photoshoots, Soul ID characters, marketplace cards, sites, thumbnails |
| [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) | MIT | 34 paid-media skills — a conductor plus per-platform audits (Google, Meta, TikTok, LinkedIn, Amazon…), budget and attribution math, creative production, reporting |
| [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) | MIT | 13 Instagram skills — audits, planning, captions, carousels, reels, stories, DMs, replies |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | 15 programmatic-video skills — the hyperframes engine (core, animation, audio, keyframes, registry, CLI) plus captions, motion graphics, music videos, faceless explainers |
| [oso95/scroll-world](https://github.com/oso95/scroll-world) | MIT | Scroll-scrubbed "fly through the world" landing pages — one continuous camera flight, no cuts |

`./install.sh` installs these alongside the slash commands — nothing extra to run.

Some of them drive an external tool, and vendoring the prompt does not install
that tool: `impeccable` ships a packaged Node CLI, `agent-browser` needs its npm
CLI, `agent-reach` needs its Python package, `banana` needs a Gemini API key,
the `higgsfield-*` skills need a Higgsfield API key, the `ads-*` skills need
per-platform ad credentials, and `media-use` drives the `heygen` CLI. See
[external/README.md](external/README.md#skills-that-need-something-installed).

### Keeping them current

Upstream repos keep moving. The sync script pulls vendored copies forward:

```bash
./scripts/sync-external.sh --check    # which sources are behind upstream?
./scripts/sync-external.sh            # pull everything forward
./scripts/sync-external.sh <name>     # pull one source forward
./scripts/sync-external.sh --list     # manifest entries + pinned commits
```

Then review, commit, and reinstall:

```bash
git diff external/
git add external/ && git commit -m "chore(external): sync upstream skills"
./install.sh
```

Every vendored directory carries an `UPSTREAM.md` with the exact commit it came
from, plus the upstream `LICENSE`.

A scheduled workflow ([`external-skills.yml`](.github/workflows/external-skills.yml))
runs the same check every Monday and files a single tracking issue when something
has moved upstream, so stale copies surface without anyone remembering to look.
The same workflow validates on every PR that the manifest and the vendored
directories still agree.

### Private skills

Some third-party skills are worth using but not ours to republish — upstream
ships no LICENSE, or a copyleft one incompatible with this repo's MIT. Those go
in `external/sources.local.txt` and vendor into `external/.local/`, both
gitignored. Same sync command, same installer, same `~/.claude/skills/` result —
they just never enter the published repo. Private use is not distribution.

### Adding one

Append a line to `external/sources.txt` and sync it:

```
name|repo-url|ref|subpath
```

```bash
./scripts/sync-external.sh name
```

`subpath` points at the directory containing `SKILL.md` (`.` if it's at the repo
root). Read what you vendor before committing it — third-party prompt content runs
with your permissions. Full workflow in [external/README.md](external/README.md).

---

## Cross-Platform

These skills work across multiple AI coding assistants:

| Platform | Install Method | Guide |
|----------|---------------|-------|
| **Claude Code** | `./install.sh` or plugin marketplace | [This README](#quick-install) |
| **Cursor** | Copy to `.cursor/rules/` as `.mdc` (requires frontmatter conversion) | [Cursor Guide](platforms/cursor.md) |
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
1. **Global** — All 327 skills in every project
2. **Project** — All 327 skills in current project only
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
| `sales-outbound` | ICP builder → lead finder → lead qualifier → cold outreach | ICP to ready-to-send outreach sequences |
| `llm-app` | chatbot scaffold → embeddings → RAG eval → guardrails | Scaffold, ground, evaluate, and guard an LLM feature |

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

  [1/5] Structure Validation     327/327 PASS
  [2/5] Permission Manifests     327/327 declared
  [3/5] Safety Lint              327/327 safe
  [4/5] Trigger Quality          327/327 OK
  [5/5] Test File Coverage       11/327 (3%)
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

No. Skills are only loaded when you invoke them. Having 327 skills installed has zero impact on performance.

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
├── skills/                     # 327 skills across 32 categories
│   ├── meta/                   # 4  · router, pipelines, forge, health
│   ├── git/                    # 12 · version control
│   ├── code-quality/           # 10 · review & refactoring
│   ├── testing/                # 13 · test generation & QA
│   ├── debugging/              # 15 · troubleshooting
│   ├── security/               # 11 · audit & hardening
│   ├── devops/                 # 12 · infrastructure & deployment
│   ├── cloud/                  # 10 · AWS / GCP / Azure architecture
│   ├── observability/          # 8  · logging, metrics, tracing, SRE
│   ├── networking/             # 19 · networking & Cloudflare
│   ├── docs/                   # 10 · documentation
│   ├── database/               # 6  · database & ORM
│   ├── data/                   # 12 · analytics, dbt, warehousing
│   ├── api/                    # 5  · API development
│   ├── performance/            # 7  · performance optimization
│   ├── scaffold/               # 10 · project scaffolding
│   ├── fullstack/              # 12 · full-stack features
│   ├── mobile/                 # 10 · React Native / Flutter / native
│   ├── ai/                     # 18 · LLM apps, agents, RAG, evals
│   ├── ml/                     # 8  · classical machine learning
│   ├── automation/             # 9  · scraping & workflow automation
│   ├── web/                    # 18 · web & UI
│   ├── accessibility/          # 2  · WCAG compliance
│   ├── i18n/                   # 1  · internationalization
│   ├── utils/                  # 15 · general utilities
│   ├── sales/                  # 21 · lead gen, outreach, deals
│   ├── product/                # 12 · PRDs, roadmaps, research
│   ├── finance/                # 10 · SaaS metrics, pricing, modeling
│   ├── legal/                  # 8  · privacy, ToS, GDPR, contracts
│   ├── content/                # 8  · blog, SEO, scripts
│   ├── ecommerce/              # 8  · storefronts, checkout, catalog
│   ├── marketing/              # 2  · audits & ad campaigns
│   └── **/*.test.yaml          # Test files for skill validation
├── pipelines/                  # 7 composable multi-skill workflows
│   ├── feature-complete.yaml
│   ├── security-hardening.yaml
│   ├── new-project.yaml
│   ├── pre-deploy.yaml
│   ├── code-cleanup.yaml
│   ├── sales-outbound.yaml
│   └── llm-app.yaml
├── external/                   # Third-party Agent Skills (vendored from upstream)
│   ├── sources.txt             # Upstream manifest (name|repo|ref|subpath)
│   ├── README.md               # Vendoring & sync workflow
│   └── design-motion-principles/  # SKILL.md + references/ + workflows/
├── scripts/                    # Validation & tooling
│   ├── test-runner.sh          # CI test harness (structure, safety, triggers)
│   ├── lint-permissions.sh     # Permission manifest cross-reference linter
│   ├── sync-external.sh        # Pull external/ skills forward from upstream
│   └── detect-project.sh      # Tech stack detection for smart routing
├── .github/workflows/
│   ├── test-skills.yml         # GitHub Actions CI pipeline
│   └── external-skills.yml     # Validates external/, weekly upstream check
├── .claude-plugin/
│   └── marketplace.json        # Plugin marketplace (32 bundles)
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
