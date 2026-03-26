---
description: Generate GitHub Actions workflows for CI, CD, auto-labeling, and automation
permissions:
  reads: ["**/*"]
  writes: [".github/workflows/**"]
  commands: []
  network: false
  destructive: false
---

Generate GitHub Actions workflow(s) for the project.

Steps:
1. Determine what workflows are needed:

   **CI Workflow** (on PR and push to main)
   - Checkout, setup language runtime
   - Install dependencies (with caching)
   - Lint check
   - Type check
   - Unit tests
   - Integration tests
   - Build
   - Upload coverage report

   **CD Workflow** (on tag or manual trigger)
   - Build production artifacts
   - Run E2E tests
   - Deploy to staging → production
   - Post-deploy health check
   - Rollback on failure

   **Automation Workflows**
   - Auto-label PRs by changed files
   - Dependabot auto-merge for patches
   - Release please / semantic release
   - Stale issue/PR cleanup
   - PR size labeling

2. Best practices:
   - Use specific action versions (v4, not @main)
   - Cache dependencies (actions/cache)
   - Use matrix builds for multi-version
   - Minimize secrets exposure
   - Use OIDC for cloud deployment (no long-lived keys)
   - Reusable workflows for DRY
3. Add status badges to README

Workflow type: $ARGUMENTS
