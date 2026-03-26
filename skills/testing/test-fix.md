---
description: Diagnose and fix failing tests
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm test", "pytest", "go test"]
  network: false
  destructive: false
---

Diagnose and fix failing tests.

Steps:
1. Run the test suite to see current failures: detect the test runner from project config
2. For each failing test:
   - Read the test code and the source code it tests
   - Analyze the error message and stack trace
   - Determine if the bug is in:
     a. **The test itself**: Wrong assertions, outdated expectations, bad setup/teardown
     b. **The source code**: Actual bug that the test correctly caught
     c. **Test infrastructure**: Mocking issues, timing issues, environment problems
3. For test bugs: Fix the test to correctly verify behavior
4. For source bugs: Fix the source code and ensure the test passes
5. For infrastructure: Fix setup, add proper waits for async, fix mock configurations
6. Re-run tests to confirm all pass
7. Check that fixing one test didn't break others

Specific test or file: $ARGUMENTS
