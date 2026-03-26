---
description: Generate integration tests that verify components work together correctly
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*"]
  commands: ["npm test", "pytest"]
  network: false
  destructive: false
---

Generate integration tests for the specified components or API.

Steps:
1. Identify the integration boundaries:
   - API endpoints ↔ Database
   - Service ↔ External API
   - Frontend ↔ Backend
   - Multiple services together
2. For each integration point:
   - Test the real interaction (no mocking the integration itself)
   - Set up test data with factories or fixtures
   - Test the full request/response cycle
   - Verify side effects (DB state, messages sent, etc.)
3. Cover scenarios:
   - Successful operations end-to-end
   - Partial failures (what happens when step 3 of 5 fails?)
   - Timeout handling
   - Retry behavior
   - Data consistency across services
4. Handle test isolation:
   - Use transactions or test databases
   - Clean up after each test
   - Don't depend on test execution order
5. Use appropriate test runner and assertion library for the project

Target: $ARGUMENTS
