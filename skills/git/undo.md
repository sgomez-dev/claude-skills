---
description: Safely undo the last git operation with explanation
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git reflog", "git log", "git status", "git reset", "git restore"]
  network: false
  destructive: true
---

Help safely undo the last git operation.

Steps:
1. Run `git reflog -10` and `git log --oneline -5` to understand recent history
2. Run `git status` to see current state
3. Determine what the user wants to undo (last commit, last merge, staged changes, etc.)
4. Propose the safest undo method:
   - Last commit (keep changes): `git reset --soft HEAD~1`
   - Last commit (discard changes): `git reset --hard HEAD~1` (CONFIRM FIRST)
   - Staged files: `git restore --staged <files>`
   - Working directory changes: `git restore <files>` (CONFIRM FIRST)
   - Last merge: `git merge --abort` or `git reset --merge ORIG_HEAD`
   - Last rebase: `git rebase --abort` or reflog-based recovery
5. ALWAYS explain what will happen before executing
6. NEVER force-push without explicit confirmation

$ARGUMENTS
