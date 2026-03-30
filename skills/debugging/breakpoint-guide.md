---
description: Generate a strategic breakpoint plan for debugging a specific issue
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Generate a strategic breakpoint plan with exact locations and conditions to efficiently debug the described issue.

Steps:
1. Analyze the bug description and identify the probable execution path
2. Read the relevant source files and map the control flow
3. Design a breakpoint strategy with 3 tiers:
   **Tier 1 — Boundary breakpoints** (set these first):
   - Entry point where user action or request arrives
   - Exit point where incorrect output or behavior is observed
   - Purpose: Confirm the bug is within this boundary

   **Tier 2 — Narrowing breakpoints** (binary search the bug):
   - Midpoint of the execution path between Tier 1 breakpoints
   - Key branch decisions and function calls
   - Purpose: Narrow down which half contains the bug

   **Tier 3 — Precision breakpoints** (once area is identified):
   - Exact lines where variables are assigned or mutated
   - Conditional breakpoints that only trigger on suspicious values
   - Purpose: Catch the exact moment of failure
4. For each breakpoint, specify:
   - **File and line number**: Exact location
   - **Condition** (if applicable): e.g., `x === null`, `arr.length > 100`, `status !== 200`
   - **Watch expressions**: Variables and expressions to monitor at this point
   - **What to check**: What a correct vs incorrect state looks like here
5. Provide debugger-specific setup instructions:
   - Detect project type and suggest: VS Code launch.json, Chrome DevTools, pdb, gdb/lldb, delve
   - Include the exact debugger configuration snippet
6. Describe the expected debugging session flow: "If X is correct here, skip to breakpoint N..."

Bug to investigate: $ARGUMENTS
