---
description: Comprehensive code review of changed or specified files
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["git diff"]
  network: false
  destructive: false
---

Perform a thorough code review on the specified files or all recently changed files.

Steps:
1. If no files specified, check `git diff --name-only` and `git diff --cached --name-only`
2. Read each file and analyze for:

**Correctness**
- Logic errors and edge cases
- Null/undefined handling
- Race conditions in async code
- Off-by-one errors
- Error handling completeness

**Security**
- SQL injection, XSS, command injection
- Hardcoded secrets or credentials
- Insecure deserialization
- Missing input validation at boundaries

**Performance**
- Unnecessary re-renders (React)
- N+1 query patterns
- Missing indexes for DB queries
- Unbounded data fetching
- Memory leaks (event listeners, subscriptions)

**Maintainability**
- Functions doing too many things
- Deep nesting (> 3 levels)
- Magic numbers/strings
- Poor naming
- Missing error context in logs

3. Rate each issue: 🔴 Critical | 🟡 Warning | 🔵 Suggestion | ⚪ Nit
4. Provide specific fix suggestions with code snippets

Files to review: $ARGUMENTS
