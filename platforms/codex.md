# Using Claude Skills with OpenAI Codex

## Installation

Copy skill files into Codex's instructions directory:

```bash
# Project-level
mkdir -p .codex
# Concatenate relevant skills into instructions
cat skills/code-quality/review.md skills/testing/test-gen.md > .codex/instructions.md
```

## Adaptation Notes

Codex CLI uses `AGENTS.md` or `.codex/instructions.md` for context. You can concatenate multiple skills into a single instructions file, or reference them individually.

The skill format (markdown with steps) works well with Codex's sandbox execution model. Skills that involve git operations and shell commands translate directly.

## Recommended Skills for Codex

- `git/commit.md` — Smart commits
- `code-quality/review.md` — Code review
- `testing/test-gen.md` — Test generation
- `security/security-audit.md` — Security scanning
