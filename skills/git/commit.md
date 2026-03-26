---
description: Generate a smart conventional commit message analyzing staged changes
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git diff", "git log", "git commit"]
  network: false
  destructive: false
---

Analyze all staged changes (git diff --cached) and generate a commit message following the Conventional Commits specification.

Rules:
1. Run `git diff --cached --stat` and `git diff --cached` to understand what changed
2. Determine the commit type: feat, fix, refactor, docs, test, chore, perf, ci, build, style
3. Identify the scope from the files changed (e.g., auth, api, ui)
4. Write a concise subject line (max 72 chars) in imperative mood
5. Add a body explaining WHY the change was made, not what changed (the diff shows that)
6. If there are breaking changes, add a BREAKING CHANGE footer
7. Present the message to me for approval before committing
8. After approval, create the commit

Format:
```
type(scope): subject

body

footer (if needed)
```

$ARGUMENTS
