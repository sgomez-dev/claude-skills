---
description: Generate a custom React hook with proper types and tests
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a custom React hook.

Steps:
1. Understand the hook's purpose from the description
2. Generate the hook with:
   - Clear TypeScript types for parameters and return value
   - Proper use of React hooks (useState, useEffect, useCallback, useMemo, useRef)
   - Cleanup in useEffect (return cleanup function)
   - Error handling
   - Loading states where appropriate
   - AbortController for fetch operations
3. Follow hook rules:
   - Name starts with `use`
   - Only call hooks at the top level
   - Only call hooks from React functions
4. Generate tests:
   - Use `@testing-library/react-hooks` or `renderHook` from `@testing-library/react`
   - Test initial state
   - Test state updates
   - Test cleanup
   - Test error scenarios
5. Include JSDoc with usage example

Hook: $ARGUMENTS
