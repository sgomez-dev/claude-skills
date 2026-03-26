---
description: Audit and improve error handling patterns across the codebase
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Audit error handling in the specified code and suggest improvements.

Steps:
1. Read target files and identify all error handling patterns
2. Find problems:
   - **Swallowed errors**: Empty catch blocks, catch with only `console.log`
   - **Generic catches**: Catching all errors without discrimination
   - **Missing error handling**: Async calls without try/catch, unchecked promises
   - **Poor error messages**: Errors without context (who, what, why)
   - **Error type confusion**: Using strings instead of Error objects
   - **Missing cleanup**: No finally blocks for resource cleanup
   - **Inconsistent patterns**: Different error handling styles across codebase
3. For each issue, suggest:
   - Custom error classes for domain errors
   - Proper error wrapping with context
   - Centralized error handling where appropriate
   - User-friendly messages vs. developer logs
   - Retry logic for transient failures
   - Graceful degradation patterns
4. Ensure errors propagate correctly and don't crash the process unexpectedly

Target: $ARGUMENTS
