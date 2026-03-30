---
description: Trace a variable's lifecycle to find where it gets corrupted or goes wrong
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["grep -rn"]
  network: false
  destructive: false
---

Trace a variable's full lifecycle through the codebase to find where its value becomes incorrect, null, or corrupted.

Steps:
1. Search the entire codebase for all references to the target variable/field/property
2. Build a complete lifecycle map:
   - **Declaration**: Where and how is it defined? Type, initial value, scope
   - **Assignments**: Every point where it's written to (direct assignment, destructuring, spread, mutation)
   - **Reads**: Every point where it's consumed (conditions, function args, returns, renders)
   - **Mutations**: Indirect changes (array push, object property set, prototype modification)
   - **Shadowing**: Same-name variables in nested scopes that could cause confusion
3. Trace the data flow chronologically through execution:
   - Map the order of operations (initialization → transformation → usage)
   - Identify async gaps where the value could change between await points
   - Check for closures capturing stale references
   - Look for pass-by-reference vs pass-by-value confusion
4. Identify the corruption point — where expected value diverges from actual:
   - Unintended mutation by a side effect
   - Race condition between concurrent writers
   - Incorrect type coercion or casting
   - Missing null check before access
   - Stale closure or memoization cache
5. Present a timeline showing the variable's journey with exact file:line references
6. Suggest the fix at the precise point of corruption

Variable name and context: $ARGUMENTS
