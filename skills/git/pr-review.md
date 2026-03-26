---
description: Perform a thorough code review on a pull request
permissions:
  reads: [".git/**"]
  writes: []
  commands: ["gh pr view", "gh pr diff"]
  network: true
  destructive: false
---

Perform a comprehensive code review on the specified PR.

Steps:
1. Get PR details with `gh pr view <number> --json title,body,files,commits,additions,deletions`
2. Get the full diff with `gh pr diff <number>`
3. Review for:
   - **Correctness**: Logic errors, edge cases, off-by-one errors
   - **Security**: Injection, XSS, auth issues, hardcoded secrets
   - **Performance**: N+1 queries, unnecessary loops, memory leaks
   - **Maintainability**: Naming, complexity, DRY violations
   - **Testing**: Are changes adequately tested?
   - **Breaking changes**: API compatibility, migration needs
4. For each issue found, specify:
   - File and line number
   - Severity (critical/warning/suggestion/nit)
   - Clear explanation of the problem
   - Suggested fix with code
5. End with an overall assessment: approve, request changes, or comment

PR number: $ARGUMENTS
