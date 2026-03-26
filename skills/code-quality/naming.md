---
description: Improve variable, function, and class naming for clarity and consistency
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Review and improve naming throughout the specified code.

Steps:
1. Read the target file(s) and identify the naming conventions in use
2. Check each name for:
   - **Clarity**: Does the name reveal intent? (`d` → `elapsedDays`)
   - **Consistency**: Same concept, same name throughout (`user`/`account`/`profile` for same thing)
   - **Convention**: Follows language conventions (camelCase JS, snake_case Python, PascalCase classes)
   - **Length**: Not too short (single letter outside loops) or too long (> 40 chars)
   - **Accuracy**: Name matches what it actually does/contains
   - **Avoid**: Hungarian notation, type prefixes, abbreviations, generic names (data, info, temp, handler)
3. For boolean variables: should read as a question (`isActive`, `hasPermission`, `canEdit`)
4. For functions: should be verb phrases describing the action (`fetchUser`, `validateInput`)
5. For classes: should be noun phrases (`UserRepository`, `PaymentProcessor`)
6. Present a table: current name → suggested name → reason

Target: $ARGUMENTS
