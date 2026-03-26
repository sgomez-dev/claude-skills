---
description: Create a well-named git branch following team conventions
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git branch", "git checkout", "git switch"]
  network: false
  destructive: false
---

Create a new git branch with proper naming conventions.

Steps:
1. Check current branch naming patterns with `git branch -a` to detect conventions
2. Ask what type of work: feature, bugfix, hotfix, chore, docs, refactor
3. Generate branch name following the pattern: `type/short-description`
4. If the user provides a ticket number, include it: `type/TICKET-123-short-description`
5. Ensure the branch name uses kebab-case, is concise, and descriptive
6. Create and checkout the branch
7. Set up tracking if a remote exists

Input: $ARGUMENTS
