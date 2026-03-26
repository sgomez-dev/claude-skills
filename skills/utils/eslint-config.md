---
description: Generate or optimize ESLint configuration with sensible defaults
permissions:
  reads: ["**/*", "package.json"]
  writes: [".eslintrc.*", "eslint.config.*"]
  commands: []
  network: false
  destructive: false
---

Generate or optimize ESLint configuration.

Steps:
1. Detect project setup:
   - TypeScript or JavaScript
   - React, Vue, Svelte, Node.js
   - ESLint version (flat config for v9+, legacy for v8)
   - Existing plugins and rules
2. Generate configuration with:

   **Essential rules** (prevent bugs):
   - no-unused-vars (error)
   - no-undef (error)
   - eqeqeq (error)
   - no-implicit-coercion (warn)
   - prefer-const (error)

   **TypeScript rules** (if applicable):
   - @typescript-eslint/no-explicit-any (warn)
   - @typescript-eslint/no-floating-promises (error)
   - @typescript-eslint/strict-boolean-expressions (warn)

   **React rules** (if applicable):
   - react-hooks/rules-of-hooks (error)
   - react-hooks/exhaustive-deps (warn)

   **Import rules**:
   - import/order (with groups)
   - import/no-duplicates (error)
   - import/no-cycle (warn)

3. Configure ignored files and directories
4. Add lint scripts to package.json
5. Set up lint-staged for pre-commit

$ARGUMENTS
