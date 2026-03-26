---
description: Find DRY violations - duplicated code patterns that should be abstracted
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Find duplicated code patterns across the codebase.

Steps:
1. Scan the specified scope (files, directory, or entire project)
2. Identify duplication types:
   - **Exact clones**: Identical code blocks (copy-paste)
   - **Near clones**: Similar code with minor variations (renamed variables, different literals)
   - **Structural clones**: Same logic pattern with different types/data
   - **Repeated patterns**: Similar API call patterns, error handling, validation logic
3. For each duplication found:
   - Show all locations where it appears
   - Calculate total duplicated lines
   - Suggest an abstraction (shared function, utility, base class, higher-order function, etc.)
   - Provide the refactored code
4. Prioritize by:
   - Number of occurrences
   - Lines duplicated
   - Likelihood of diverging (high-risk duplicates)

Scope: $ARGUMENTS
