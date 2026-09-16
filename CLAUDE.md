# Claude Skills Collection

This repository contains 327 custom slash commands (skills) for Claude Code organized in `skills/` by category.

## Project Structure

```
skills/                  # All 327 skills organized by category
├── ai/                  # 18 AI/LLM skills (agents, RAG, evals, guardrails, MCP)
├── api/                 # 5 API development skills
├── accessibility/       # 2 accessibility skills
├── automation/          # 10 automation & integration skills
├── cloud/               # 10 cloud architecture skills (AWS, GCP, Azure)
├── code-quality/        # 10 code quality & review skills
├── content/             # 8 content & copywriting skills
├── data/                # 12 data & analytics skills
├── database/            # 6 database skills
├── debugging/           # 15 debugging & troubleshooting skills
├── devops/              # 12 devops & infrastructure skills
├── docs/                # 10 documentation skills
├── ecommerce/           # 8 e-commerce skills
├── finance/             # 10 finance & SaaS metrics skills
├── fullstack/           # 12 full-stack feature skills
├── git/                 # 12 git & version control skills
├── i18n/                # 1 internationalization skill
├── legal/               # 8 legal & compliance skills
├── marketing/           # 2 marketing skills
├── meta/                # 4 meta-skills (router, pipelines, forge, health)
├── ml/                  # 8 machine learning skills
├── mobile/              # 10 mobile development skills
├── networking/          # 19 networking & Cloudflare skills
├── observability/       # 8 observability & SRE skills
├── performance/         # 7 performance skills
├── product/             # 12 product management skills
├── sales/               # 21 sales & growth skills (lead gen, outreach, deals)
├── scaffold/            # 10 scaffolding skills
├── security/            # 11 security skills
├── testing/             # 13 testing skills
├── utils/               # 15 utility skills
└── web/                 # 18 web & UI skills
pipelines/               # Composable multi-skill workflows (*.yaml)
external/                # Third-party Agent Skills vendored from upstream repos
├── sources.txt          # Upstream manifest (name|repo|ref|subpath)
└── <skill>/             # Vendored copy: SKILL.md + references/ + workflows/
install.sh               # Interactive installer (macOS/Linux/Git Bash)
install.ps1              # Windows PowerShell installer
```

## Skill Format

Each skill is a markdown file with YAML frontmatter:

```markdown
---
description: One-line description shown in command palette
---

Prompt instructions for Claude.

$ARGUMENTS   ← replaced with user input
```

## External Skills (third-party)

`external/` holds skills authored in *other* repos, in the **Agent Skill** format — a
directory with `SKILL.md` plus optional `references/` and `workflows/`. Currently 107
skills from 13 upstream repos (~34 MB). They are a different thing from the slash
commands in `skills/`:

| | `skills/` | `external/` |
|---|---|---|
| Format | one `.md` per skill, `$ARGUMENTS` | directory with `SKILL.md` |
| Installs to | `~/.claude/commands/` | `~/.claude/skills/` |
| Invoked as | `/category--name` | `/name`, or auto-triggered by description |
| Authored | here | upstream |

Vendored copies are kept in sync with `scripts/sync-external.sh`:

```bash
./scripts/sync-external.sh --check    # which sources are behind upstream
./scripts/sync-external.sh            # pull all sources forward (both manifests)
./scripts/sync-external.sh <name>     # pull one source forward
./scripts/sync-external.sh --list     # manifest entries + vendored commits
```

Rules when touching `external/`:

- **Never hand-edit a vendored directory** — the next sync overwrites it. Fork upstream and repoint `external/sources.txt` instead.
- Add new sources as a line in `external/sources.txt`, then sync; don't copy files in by hand.
- Keep each vendored `LICENSE` and `UPSTREAM.md` (provenance + pinned commit).
- **Licensing decides which manifest an entry goes in**, not preference:
  - MIT / Apache-2.0 → `external/sources.txt`, vendored to `external/<name>/`, committed and published.
  - No LICENSE at all, or (A)GPL → `external/sources.local.txt`, vendored to `external/.local/<name>/`. Both are gitignored: usable locally, never republished. Private use is not distribution.
  - Moving an entry from the local manifest to the public one publishes it. Only do that if upstream's license changes to permit it.
  - `sync-external.sh` warns on a published entry with no license, and CI fails on it.
- Installed names match upstream. Rename only for cause (e.g. a directory named `skill`), and record why in the manifest comment.
- `scripts/test-runner.sh` deliberately ignores `external/` — those files follow upstream's conventions, not this repo's. `.github/workflows/external-skills.yml` validates it instead.

See [external/README.md](external/README.md) for the full workflow.

## Installation

Skills are installed by copying `.md` files into `~/.claude/commands/` (global) or `.claude/commands/` (project-level). The installer renames files to `category--skill-name.md` format for flat directory compatibility.

External skills are installed alongside them as directories under `~/.claude/skills/` (global) or `.claude/skills/` (project-level), keeping their upstream name.

## When working on this repo

- Keep skills focused: one task per skill, clear steps
- Every skill must have a `description` in frontmatter
- Use `$ARGUMENTS` for user input
- Skills should detect project context (language, framework) automatically
- Never hardcode tool-specific assumptions — skills should work across tech stacks
