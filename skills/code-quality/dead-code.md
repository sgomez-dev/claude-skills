---
description: Find and remove dead code - unused functions, imports, variables, and files
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Scan the codebase to find and remove dead code.

Steps:
1. Identify the project language(s) and structure
2. Search for:
   - **Unused imports**: Imports that are never referenced
   - **Unused variables**: Declared but never read
   - **Unused functions/methods**: Defined but never called
   - **Unused exports**: Exported but never imported elsewhere
   - **Unreachable code**: Code after return/throw/break
   - **Commented-out code**: Old code left in comments
   - **Unused files**: Files not imported by anything
   - **Unused dependencies**: packages in package.json/requirements.txt not imported
3. For each finding, verify it's truly unused by searching for references across the entire codebase
4. Present findings grouped by type and confidence level
5. Only remove code after confirmation - some "dead" code may be used dynamically

Scope: $ARGUMENTS
