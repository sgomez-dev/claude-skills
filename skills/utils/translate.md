---
description: Translate code between programming languages while preserving logic and idioms
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Translate code from one programming language to another.

Steps:
1. Read and fully understand the source code
2. Identify the source and target languages
3. Translate while:
   - Preserving exact business logic
   - Using target language **idioms** (don't write Python like JavaScript)
   - Using equivalent standard library functions
   - Adapting to target language conventions:
     - Naming: camelCase (JS) → snake_case (Python) → PascalCase (Go)
     - Error handling: try/catch → Result type → if err != nil
     - Async: Promises → asyncio → goroutines
     - Types: interfaces → protocols → traits
   - Using the target language's package ecosystem for dependencies
4. Handle language-specific concerns:
   - Memory management differences
   - Concurrency model differences
   - Type system differences
   - Module system differences
5. Add comments where translation decisions aren't obvious
6. Note any features that don't have a direct equivalent

Source code: $ARGUMENTS
