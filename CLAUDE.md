# Claude Skills Collection

This repository contains 95 custom slash commands (skills) for Claude Code organized in `skills/` by category.

## Project Structure

```
skills/                  # All 95 skills organized by category
├── git/                 # 10 git & version control skills
├── code-quality/        # 10 code quality & review skills
├── testing/             # 8 testing skills
├── docs/                # 7 documentation skills
├── security/            # 8 security skills
├── devops/              # 8 devops & infrastructure skills
├── database/            # 6 database skills
├── api/                 # 5 API development skills
├── performance/         # 5 performance skills
├── scaffold/            # 8 scaffolding skills
├── ai/                  # 3 AI/LLM skills
├── accessibility/       # 2 accessibility skills
├── i18n/                # 1 internationalization skill
├── marketing/           # 1 marketing skill
└── utils/               # 12 utility skills
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
