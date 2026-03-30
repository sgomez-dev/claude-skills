---
description: Analyze a stack trace or error message and pinpoint the root cause
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Analyze the provided stack trace or error message and pinpoint the exact root cause.

Steps:
1. Parse the stack trace from bottom to top, identifying:
   - The originating error type and message
   - The exact file, function, and line where the error was thrown
   - The full call chain that led to the failure
2. Read the source file at the crash point and surrounding context (±30 lines)
3. Identify the root cause category:
   - **TypeError**: Null/undefined access, wrong argument types, missing properties
   - **ReferenceError**: Undefined variables, scope issues, import failures
   - **Runtime crash**: Division by zero, stack overflow, out of memory
   - **Assertion failure**: Failed precondition, invariant violation
   - **Framework error**: Misconfiguration, lifecycle issue, version mismatch
4. Trace the data flow backward from the crash point to find WHERE the bad state originated
5. Explain:
   - **What happened**: The immediate cause of the crash
   - **Why it happened**: The upstream reason the bad state exists
   - **How to fix it**: Concrete code change with a snippet
6. If the stack trace is truncated or unclear, suggest how to reproduce with more detail

Stack trace or error: $ARGUMENTS
