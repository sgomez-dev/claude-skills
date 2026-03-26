---
description: Review and update test snapshots intelligently
permissions:
  reads: ["**/*"]
  writes: ["**/__snapshots__/**"]
  commands: ["npm test -- -u", "npx jest -u"]
  network: false
  destructive: false
---

Review snapshot test changes and update them safely.

Steps:
1. Run snapshot tests to identify outdated snapshots
2. For each failed snapshot:
   - Show the diff between current and expected
   - Analyze if the change is:
     a. **Intentional**: Code change correctly modified the output → update snapshot
     b. **Bug**: Unexpected change in output → fix the code
     c. **Flaky**: Non-deterministic values (dates, IDs) → fix the test to use deterministic values
3. For intentional changes:
   - Update snapshots with the appropriate command
   - Verify the new snapshot looks correct
4. For bugs, fix the underlying code
5. For flaky snapshots, suggest:
   - Freezing dates/times in tests
   - Using deterministic IDs
   - Serializing only stable fields
6. Consider if large snapshots should be broken into smaller, focused assertions

$ARGUMENTS
