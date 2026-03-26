---
description: Interactive git stash management - list, apply, drop, and organize stashes
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["git stash"]
  network: false
  destructive: false
---

Manage git stashes interactively.

Steps:
1. Run `git stash list` to show all stashes with details
2. For each stash, run `git stash show -p stash@{N}` to preview changes
3. Present a clear summary table of all stashes with:
   - Index, branch where created, date, description, files changed
4. Help the user:
   - **Apply**: Apply a specific stash (with or without dropping)
   - **Drop**: Remove stashes that are no longer needed
   - **Save**: Create a new named stash from current changes
   - **Branch**: Create a branch from a stash
5. Warn if applying a stash might cause conflicts

Action: $ARGUMENTS
