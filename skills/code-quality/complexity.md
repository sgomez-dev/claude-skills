---
description: Analyze code complexity and suggest simplifications
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Analyze cyclomatic and cognitive complexity of the specified code.

Steps:
1. Read the target file(s)
2. For each function/method, calculate:
   - **Cyclomatic complexity**: Count decision points (if, else, switch, for, while, &&, ||, ?:, catch)
   - **Cognitive complexity**: Account for nesting depth, breaks in linear flow
   - **Lines of code**: Function length
   - **Parameter count**: Number of parameters
3. Flag functions that exceed thresholds:
   - Cyclomatic complexity > 10: Warning
   - Cyclomatic complexity > 20: Critical
   - Cognitive complexity > 15: Warning
   - Function length > 50 lines: Warning
   - Parameters > 4: Warning
4. For each flagged function, suggest specific simplification:
   - Extract helper functions
   - Use early returns to reduce nesting
   - Replace switch with lookup table/map
   - Use polymorphism instead of type checking
   - Decompose into smaller functions

Target: $ARGUMENTS
