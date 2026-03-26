---
description: Generate end-to-end tests for user workflows
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*"]
  commands: ["npx playwright", "npx cypress"]
  network: false
  destructive: false
---

Generate end-to-end tests that verify complete user workflows.

Steps:
1. Identify the E2E framework in use (Playwright, Cypress, Selenium, Puppeteer) or suggest one
2. Understand the user workflow to test from the description
3. Generate tests that:
   - Navigate through the real UI
   - Fill forms with realistic data
   - Click buttons and links
   - Wait for network requests to complete
   - Assert on visible text, not implementation details
   - Use accessible selectors (role, label) over CSS classes
4. Include:
   - Setup: Login, seed data if needed
   - Happy path: Complete workflow successfully
   - Error path: Invalid inputs, server errors
   - Teardown: Clean up test data
5. Best practices:
   - Use Page Object Model for complex pages
   - Avoid arbitrary waits (use `waitFor` with conditions)
   - Make tests independent (don't rely on other test state)
   - Use test fixtures for common setup

Workflow to test: $ARGUMENTS
