---
description: Intelligently refactor code while preserving behavior
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Refactor the specified code to improve quality while preserving exact behavior.

Steps:
1. Read the target file(s) completely
2. Identify refactoring opportunities:
   - Extract long functions into smaller, focused ones
   - Replace complex conditionals with early returns or strategy pattern
   - Eliminate code duplication (DRY)
   - Improve variable/function naming for clarity
   - Simplify nested callbacks/promises with async/await
   - Replace imperative loops with declarative alternatives where clearer
   - Remove dead code and unused imports
3. For each proposed change:
   - Explain what changes and why
   - Show before/after
   - Confirm it preserves existing behavior
4. Apply changes incrementally, testing between each if tests exist
5. NEVER change public API signatures without explicit approval

Target: $ARGUMENTS
