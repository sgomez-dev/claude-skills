# Using Claude Skills with Cursor

## Installation

Copy any skill file into your Cursor rules directory:

```bash
# Project-level (recommended)
mkdir -p .cursor/rules
cp skills/security/security-audit.md .cursor/rules/security-audit.mdc

# Or install all skills
for f in skills/**/*.md; do
  category=$(basename $(dirname "$f"))
  name=$(basename "$f" .md)
  cp "$f" ".cursor/rules/${category}--${name}.mdc"
done
```

## Adaptation Notes

Cursor uses `.mdc` files in `.cursor/rules/`. The content format is the same markdown — just rename the extension. Skills will be available as context rules that Cursor loads automatically.

For skills that reference Claude Code-specific features (like `gh` CLI), the core instructions still apply — Cursor's agent mode can execute shell commands similarly.

## Recommended Skills for Cursor

These skills work particularly well in Cursor's agent mode:

- `code-quality/review.md` — Works great with Cursor's inline diff
- `testing/test-gen.md` — Generates tests alongside your code
- `scaffold/component.md` — Quick component scaffolding
- `utils/explain.md` — Code explanation in context
