---
description: Add strategic debug logging to trace a bug through the code
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Add strategic debug logging to the specified code to trace a bug's execution path and variable state.

Steps:
1. Read the target file(s) and understand the control flow relevant to the bug
2. Identify critical observation points:
   - **Entry/exit** of suspect functions (with arguments and return values)
   - **Branch decisions** (if/else, switch, ternary) — log which path was taken and why
   - **Loop iterations** — log iteration count, key variables, and early exit conditions
   - **Data transformations** — log before/after state of mutated data
   - **External boundaries** — log API calls, DB queries, file I/O with inputs and outputs
3. Add contextual log statements using the project's existing logging framework:
   - Detect: console.log, logger.debug, log.Printf, println!, logging.debug, etc.
   - Each log must include: `[DEBUG:<function_name>]` prefix, variable names AND values
   - For objects/arrays, log JSON.stringify or equivalent with truncation for large payloads
   - Add timestamps where relevant for timing analysis
4. Add a `// DEBUG: remove after investigation` comment on each added line for easy cleanup
5. Suggest how to run the code to trigger the bug and what to look for in the output
6. After the user confirms the bug is found, offer to remove all debug logging in one pass

Bug description or file to debug: $ARGUMENTS
