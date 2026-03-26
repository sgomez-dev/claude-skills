---
description: Deep investigation of who changed what and why using git blame and log
permissions:
  reads: [".git/**", "**/*"]
  writes: []
  commands: ["git blame", "git show", "git log"]
  network: false
  destructive: false
---

Investigate the history of a specific file or code section to understand who changed what and why.

Steps:
1. Run `git blame <file>` on the specified file or section
2. For each significant change, run `git show <commit>` to understand the full context
3. Identify patterns: who are the main contributors, when were major changes made
4. Look for related commits with `git log --all --oneline -- <file>`
5. Trace renames with `git log --follow -- <file>`
6. Present a timeline of significant changes with:
   - Who made the change
   - When it was made
   - Why (from commit message)
   - What PR it was part of (if detectable)

Target: $ARGUMENTS
