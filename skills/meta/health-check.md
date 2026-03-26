---
description: Run a health check on all installed skills - validate structure, permissions, and safety
permissions:
  reads: ["skills/**", "~/.claude/commands/**", ".claude/commands/**"]
  writes: []
  commands: ["bash scripts/test-runner.sh", "bash scripts/lint-permissions.sh"]
  network: false
  destructive: false
---

Run a comprehensive health check on all installed skills.

Steps:
1. Find all installed skills:
   - Global: `~/.claude/commands/*.md`
   - Project: `.claude/commands/*.md`
   - Source: `skills/**/*.md`

2. For each skill, validate:

   **Structure (must pass)**
   - Has YAML frontmatter with `---` delimiters
   - Has `description:` field (non-empty, 10-100 chars)
   - Has actual prompt content (> 3 lines)
   - Has `$ARGUMENTS` placeholder

   **Permissions (should have)**
   - Has `permissions:` block in frontmatter
   - Declares reads, writes, commands, network, destructive
   - Permission declarations match actual content (no undeclared destructive ops)

   **Safety (must pass)**
   - No destructive filesystem operations (recursive forced deletes)
   - No piped remote code execution (fetching scripts and piping to shell)
   - No hardcoded credentials or API keys
   - No dynamic code evaluation with user input
   - No overly permissive file permissions
   - No bypassing of git hooks or safety checks

   **Quality (nice to have)**
   - Numbered steps (not vague paragraphs)
   - Context detection (adapts to project)
   - Confirmation before destructive actions
   - Has companion .test.yaml file

3. Generate a health report:
   ```
   SKILL HEALTH REPORT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Total skills:       90
   Structure:          90/90 PASS
   Permissions:        90/90 declared
   Safety:             90/90 PASS
   Test coverage:      24/90 (27%)

   Overall: HEALTHY
   ```

4. Flag any skills that need attention

$ARGUMENTS
