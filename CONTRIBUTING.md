# Contributing to Claude Skills

Thanks for wanting to contribute! This project grows with community input.

## Adding a New Skill

### 1. Choose a Category

Place your skill in the appropriate `skills/<category>/` directory:

| Category | For |
|----------|-----|
| `git/` | Version control, commits, PRs, branches |
| `code-quality/` | Reviews, refactoring, linting, naming |
| `testing/` | Unit tests, e2e, coverage, mocks |
| `docs/` | Documentation, READMEs, diagrams, specs |
| `security/` | Audits, secrets, auth, CORS, CSP |
| `devops/` | Docker, CI/CD, K8s, Terraform, Nginx |
| `database/` | Migrations, queries, schemas, ORMs |
| `api/` | Endpoints, GraphQL, REST clients |
| `performance/` | Audits, bundle size, caching, memory |
| `scaffold/` | Project setup, components, models |
| `ai/` | LLM integration, prompts, embeddings |
| `accessibility/` | WCAG, ARIA, keyboard navigation |
| `i18n/` | Internationalization, translations |
| `utils/` | General utilities, conversions, configs |

If none fit, propose a new category in your PR.

### 2. Create the Skill File

Use this template:

```markdown
---
description: Brief description shown in the command palette (keep under 80 chars)
---

Clear instructions for Claude on what to do when this skill is invoked.

Steps:
1. First, analyze/detect the project context
2. Then do the actual work
3. Present results or ask for confirmation before making changes

Be specific about:
- What to check or analyze
- What output format to use
- When to ask for confirmation vs. proceed automatically
- Edge cases to handle

$ARGUMENTS
```

### 3. Quality Checklist

Before submitting:

- [ ] **Focused**: Skill does one thing well (not a Swiss Army knife)
- [ ] **Context-aware**: Detects language/framework from the project, doesn't assume
- [ ] **Actionable steps**: Numbered steps Claude can follow, not vague guidelines
- [ ] **Has `$ARGUMENTS`**: Accepts user input where appropriate
- [ ] **Safe**: Asks for confirmation before destructive actions (deletes, force-push)
- [ ] **Tested**: You've actually used it in Claude Code and it works
- [ ] **Description**: Frontmatter has a clear, concise description

### 4. Submit a PR

```bash
git checkout -b skill/your-skill-name
# Add your skill file
git add skills/<category>/your-skill.md
git commit -m "feat(skills): add your-skill-name"
git push origin skill/your-skill-name
# Open PR via GitHub
```

## Improving Existing Skills

Found a skill that could be better? PRs welcome for:

- Better instructions that produce more consistent results
- Missing edge cases or steps
- Framework/language support gaps
- Clearer descriptions

## Reporting Issues

If a skill doesn't work as expected:

1. Open an issue with the skill name
2. Describe what you expected vs. what happened
3. Include your project context (language, framework)

## Code of Conduct

Be respectful and constructive. We're all here to make Claude Code more useful.
