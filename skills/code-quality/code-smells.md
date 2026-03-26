---
description: Detect code smells and anti-patterns with actionable fixes
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Scan code for common code smells and anti-patterns.

Detect these categories:

**Bloaters**
- Long Method (> 30 lines)
- Large Class (> 300 lines)
- Long Parameter List (> 4 params)
- Primitive Obsession (using primitives instead of small objects)

**Object-Orientation Abusers**
- Switch/if-else chains on type
- Refused Bequest (subclass ignoring parent methods)
- Temporary Field (fields only set in certain cases)

**Change Preventers**
- Divergent Change (class changed for many different reasons)
- Shotgun Surgery (one change requires editing many classes)

**Dispensables**
- Dead Code
- Speculative Generality (unused abstractions "for the future")
- Data Class (class with only getters/setters, no behavior)

**Couplers**
- Feature Envy (method uses another class more than its own)
- Inappropriate Intimacy (classes too coupled)
- God Object (one class that does everything)

For each smell: location, explanation, severity, and concrete refactoring suggestion.

Target: $ARGUMENTS
