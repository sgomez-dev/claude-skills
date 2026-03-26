---
description: Generate mocks, stubs, and fixtures for testing
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/__mocks__/**"]
  commands: []
  network: false
  destructive: false
---

Generate test doubles (mocks, stubs, spies, fixtures) for the specified dependencies.

Steps:
1. Identify what needs to be mocked from the target test file or module
2. Create appropriate test doubles:
   - **Mocks**: For verifying interactions (function was called with X args)
   - **Stubs**: For controlling return values (API returns specific data)
   - **Spies**: For observing without changing behavior
   - **Fakes**: Simplified working implementations (in-memory DB)
   - **Fixtures**: Static test data (JSON files, factory functions)
3. Follow framework conventions:
   - Jest: `jest.fn()`, `jest.mock()`, `jest.spyOn()`
   - Vitest: `vi.fn()`, `vi.mock()`, `vi.spyOn()`
   - Python: `unittest.mock`, `pytest-mock`
   - Go: Interface-based mocking
4. Generate realistic fixture data (not just `"test"` and `123`)
5. Create factory functions for complex objects: `createUser({overrides})`
6. Ensure mocks match the real interface (type-safe mocks)

Target: $ARGUMENTS
