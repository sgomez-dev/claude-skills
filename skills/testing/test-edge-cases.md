---
description: Generate edge case and boundary tests that catch the bugs others miss
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*"]
  commands: []
  network: false
  destructive: false
---

Generate edge case tests that catch bugs normal testing misses.

For the specified code, think adversarially and test:

**Boundaries**
- Min/max integer values, MAX_SAFE_INTEGER, -0, NaN, Infinity
- Empty strings, strings with only whitespace, very long strings
- Empty arrays/objects, single-element collections, very large collections
- Date boundaries (DST transitions, leap years, epoch, year 2038)

**Null/Undefined**
- null vs undefined vs empty string vs 0 vs false
- Optional chaining failure points
- Default parameter edge cases

**Concurrency**
- Race conditions in async code
- Multiple rapid calls (debounce/throttle)
- Stale closure values

**Unicode & i18n**
- Emoji in strings (multi-byte chars), RTL text
- Unicode normalization (NFC vs NFD)
- Zero-width characters, combining characters

**State**
- Calling functions out of expected order
- Calling same function twice
- State not cleaned up between operations

For each test, explain WHAT bug it would catch.

Target: $ARGUMENTS
