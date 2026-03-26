---
description: Cherry-pick specific commits from a PR or branch into current branch
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git cherry-pick", "git log", "gh pr view"]
  network: true
  destructive: false
---

Cherry-pick commits from a PR or another branch into the current branch.

Steps:
1. If a PR number is provided, use `gh pr view <number> --json commits` to get commits
2. If a branch is provided, use `git log <branch> --oneline` to list its commits
3. Present the commits and let the user choose which to cherry-pick
4. For each selected commit:
   - Run `git cherry-pick <sha>`
   - If conflicts arise, show the conflicts and help resolve them
5. After all picks, show `git log --oneline -N` to confirm the result

Target PR or branch: $ARGUMENTS
