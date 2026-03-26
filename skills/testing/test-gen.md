---
description: Generate comprehensive unit tests for the specified code
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*"]
  commands: ["npm test", "pytest", "go test"]
  network: false
  destructive: false
---

Generate thorough unit tests for the specified code.

Steps:
1. Read the target file and understand every function/method/class
2. Detect the testing framework in use (Jest, Vitest, pytest, Go testing, etc.) from existing tests or config
3. For each function, generate tests covering:
   - **Happy path**: Normal expected inputs and outputs
   - **Edge cases**: Empty inputs, zero, null/undefined, boundary values
   - **Error cases**: Invalid inputs, expected exceptions
   - **Type coercion**: Unexpected types if dynamically typed
4. Follow the AAA pattern: Arrange, Act, Assert
5. Use descriptive test names that explain the scenario: `should return empty array when input is null`
6. Mock external dependencies (DB, API, filesystem) - never network calls in unit tests
7. Aim for high coverage but prioritize meaningful assertions over line coverage
8. Place test file next to source file or in the project's test directory following existing conventions
9. Run the tests to verify they pass

Target: $ARGUMENTS
