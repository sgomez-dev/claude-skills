# Claude Skills Collection

This repository contains 325 custom slash commands (skills) for Claude Code organized in `skills/` by category.

## Project Structure

```
skills/                  # All 325 skills organized by category
├── ai/                  # 18 AI/LLM skills (agents, RAG, evals, guardrails, MCP)
├── api/                 # 5 API development skills
├── accessibility/       # 2 accessibility skills
├── automation/          # 8 automation & integration skills
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

## Installation

Skills are installed by copying `.md` files into `~/.claude/commands/` (global) or `.claude/commands/` (project-level). The installer renames files to `category--skill-name.md` format for flat directory compatibility.

## When working on this repo

- Keep skills focused: one task per skill, clear steps
- Every skill must have a `description` in frontmatter
- Use `$ARGUMENTS` for user input
- Skills should detect project context (language, framework) automatically
- Never hardcode tool-specific assumptions — skills should work across tech stacks
