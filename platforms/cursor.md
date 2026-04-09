# Using Claude Skills with Cursor

## Frontmatter Differences

Cursor `.mdc` files use a different frontmatter format than Claude Code skills:

| Field | Claude Code Skills | Cursor Rules (`.mdc`) |
|-------|-------------------|----------------------|
| `description` | Shown in command palette | Used to determine when to apply the rule |
| `globs` | Not used | File patterns to match (e.g., `"**/*.ts"`) — rule applies when matching files are open |
| `alwaysApply` | Not used | `true` = always included as context, `false` = applied only when relevant |
| `permissions` | Declares reads, writes, commands | **Not supported** — must be removed |

## Installation

Skill files need frontmatter conversion when copying to Cursor. The `permissions` block must be removed and `alwaysApply` must be added.

```bash
# Project-level (recommended)
mkdir -p .cursor/rules

# Install a single skill (manual conversion)
# 1. Copy the file
cp skills/security/security-audit.md .cursor/rules/security-audit.mdc
# 2. Edit the .mdc file: remove the `permissions:` block and add `alwaysApply: false`

# Or install all skills with automatic frontmatter conversion
for f in skills/**/*.md; do
  category=$(basename $(dirname "$f"))
  name=$(basename "$f" .md)
  dest=".cursor/rules/${category}--${name}.mdc"
  # Remove permissions block and add alwaysApply
  sed '/^permissions:$/,/^[^ ]/{ /^permissions:/d; /^  /d; }' "$f" \
    | sed 's/^---$/&/' \
    | awk '
      /^---$/ && !found { found=1; print; next }
      /^---$/ && found { print "alwaysApply: false"; print; found=0; next }
      { print }
    ' > "$dest"
done
```

After installing, the frontmatter in each `.mdc` file should look like:

```yaml
---
description: Comprehensive security audit scanning for OWASP Top 10 and common vulnerabilities
alwaysApply: false
---
```

> **Tip:** Set `alwaysApply: true` for skills you want active on every file (e.g., `code-quality--review.mdc`). Use `globs` to scope skills to specific file types (e.g., `globs: "**/*.test.ts"` for testing skills).

## Adaptation Notes

For skills that reference Claude Code-specific features (like `gh` CLI), the core instructions still apply — Cursor's agent mode can execute shell commands similarly.

## Recommended Skills for Cursor

These skills work particularly well in Cursor's agent mode:

- `code-quality/review.md` — Works great with Cursor's inline diff
- `testing/test-gen.md` — Generates tests alongside your code
- `scaffold/component.md` — Quick component scaffolding
- `utils/explain.md` — Code explanation in context
