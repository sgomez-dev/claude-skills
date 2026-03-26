---
description: Analyze test coverage gaps and generate tests to fill them
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*"]
  commands: ["npm test --coverage", "pytest --cov"]
  network: false
  destructive: false
---

Analyze test coverage and fill gaps with meaningful tests.

Steps:
1. Run coverage report if possible (e.g., `npx jest --coverage`, `pytest --cov`)
2. If coverage tools not available, manually analyze:
   - For each source file, check if a corresponding test file exists
   - Read source files and identify untested code paths
3. Identify coverage gaps:
   - Untested files (no test file at all)
   - Untested functions within tested files
   - Untested branches (if/else, switch cases, error handlers)
   - Untested error paths
4. Prioritize by risk:
   - 🔴 Business logic with no tests
   - 🔴 Error handling paths untested
   - 🟡 Utility functions without tests
   - 🟡 Edge cases in tested functions
5. Generate tests for the highest-priority gaps
6. Focus on meaningful coverage, not just line count

Target: $ARGUMENTS
