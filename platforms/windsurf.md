# Using Claude Skills with Windsurf

## Installation

Copy skill files into Windsurf's rules directory:

```bash
# Project-level
mkdir -p .windsurf/rules
for f in skills/**/*.md; do
  category=$(basename $(dirname "$f"))
  name=$(basename "$f" .md)
  cp "$f" ".windsurf/rules/${category}--${name}.md"
done
```

## Adaptation Notes

Windsurf uses markdown files in `.windsurf/rules/` as context rules. The skill format is compatible — just copy the files. Windsurf's Cascade agent can follow the same step-by-step instructions.

## Recommended Skills for Windsurf

- `code-quality/refactor.md` — Works well with Cascade flows
- `testing/test-gen.md` — Cascade can generate and run tests
- `devops/dockerfile.md` — Infrastructure generation
- `docs/diagram.md` — Architecture visualization
