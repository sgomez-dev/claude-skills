---
description: Add or fix TypeScript/Python type annotations for better type safety
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Add or improve type annotations in the specified code.

Steps:
1. Read the target file(s) and identify the language
2. For TypeScript/JavaScript:
   - Add explicit return types to functions
   - Replace `any` with proper types
   - Add interface/type definitions for object shapes
   - Use union types instead of overly broad types
   - Add generics where type relationships exist
   - Ensure strict null checks are handled
3. For Python:
   - Add type hints to function parameters and returns
   - Use `Optional[]` for nullable types
   - Add `TypedDict` for dictionary shapes
   - Use `Protocol` for structural typing
   - Add `@overload` for functions with multiple signatures
4. Verify types are correct by checking usage patterns
5. Do NOT change runtime behavior - only add type annotations

Target: $ARGUMENTS
