---
description: Create a comprehensive pull request with smart title, description, and labels
permissions:
  reads: [".git/**", ".github/**"]
  writes: []
  commands: ["git log", "git diff", "git push", "gh pr create"]
  network: true
  destructive: false
---

Create a well-structured pull request.

Steps:
1. Run `git log main..HEAD --oneline` (or appropriate base branch) to see all commits
2. Run `git diff main..HEAD --stat` to understand scope of changes
3. Analyze the changes to generate:
   - **Title**: Concise, under 72 chars, following repo conventions
   - **Summary**: 2-3 bullet points of what changed and why
   - **Test plan**: How to verify the changes work
   - **Screenshots**: Note if UI changes need screenshots
4. Detect appropriate labels from change types (bug, feature, docs, etc.)
5. Check if there's a PR template in `.github/PULL_REQUEST_TEMPLATE.md` and follow it
6. Push the branch if not already pushed
7. Create the PR with `gh pr create`
8. Return the PR URL

Additional context: $ARGUMENTS
