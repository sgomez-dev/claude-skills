---
description: Generate CI/CD pipeline configuration (GitHub Actions, GitLab CI, etc.)
permissions:
  reads: ["**/*"]
  writes: [".github/workflows/**", ".gitlab-ci.yml"]
  commands: []
  network: false
  destructive: false
---

Generate a CI/CD pipeline configuration for the project.

Steps:
1. Detect or ask about CI platform: GitHub Actions, GitLab CI, CircleCI, Jenkins
2. Analyze project to determine pipeline stages:

**GitHub Actions workflow:**
```yaml
name: CI/CD
on:
  push: [main]
  pull_request: [main]

jobs:
  lint:       # Code quality checks
  test:       # Unit + integration tests
  security:   # Dependency audit, secret scan
  build:      # Build artifacts
  deploy:     # Deploy (only on main)
```

3. Include:
   - Proper caching (node_modules, pip cache, go modules)
   - Matrix builds if multi-version support needed
   - Parallel jobs where possible
   - Conditional deployment (only on main branch, after tests pass)
   - Environment secrets (never hardcoded)
   - Artifact uploads for build outputs
   - Status badges
   - Notification on failure (Slack/email)
4. Optimize for speed:
   - Cache dependencies aggressively
   - Run independent jobs in parallel
   - Use shallow clone for large repos
   - Skip CI for docs-only changes

Platform preference: $ARGUMENTS
