---
description: Generate a CHANGELOG from git history using conventional commits
permissions:
  reads: [".git/**", "CHANGELOG.md"]
  writes: ["CHANGELOG.md"]
  commands: ["git log", "git describe"]
  network: false
  destructive: false
---

Generate a comprehensive CHANGELOG.md from the git commit history.

Steps:
1. Run `git log --oneline --decorate` to get all commits
2. Parse conventional commit messages to categorize changes
3. Group by version tags (if any) or by date ranges
4. Organize into sections:
   - **Added** (feat commits)
   - **Fixed** (fix commits)
   - **Changed** (refactor commits)
   - **Performance** (perf commits)
   - **Breaking Changes** (commits with BREAKING CHANGE)
   - **Documentation** (docs commits)
   - **Other** (chore, ci, build, style, test)
5. Format with proper markdown, dates, and links to commits if remote URL is available
6. If a CHANGELOG.md exists, only add entries since the last documented version

$ARGUMENTS
