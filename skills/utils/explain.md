---
description: Explain code in detail - what it does, how it works, and why
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Explain the specified code in thorough detail.

Steps:
1. Read the target code completely
2. Provide a layered explanation:

   **TL;DR** (1-2 sentences)
   What this code does at the highest level.

   **Purpose**
   Why this code exists. What problem it solves. What would break without it.

   **How it works**
   Walk through the code step by step:
   - Entry point and flow
   - Key data transformations
   - Decision points and why each branch exists
   - Side effects (DB writes, API calls, state mutations)

   **Key concepts**
   Explain any patterns, algorithms, or techniques used:
   - Design patterns (Observer, Strategy, etc.)
   - Algorithms (with Big-O complexity)
   - Framework-specific concepts
   - Domain-specific logic

   **Dependencies**
   What this code depends on and what depends on it.

   **Gotchas**
   Non-obvious behavior, edge cases, or things that could confuse a newcomer.

3. Adjust depth based on complexity - simple code gets a brief explanation
4. Use analogies for complex concepts

Target: $ARGUMENTS
