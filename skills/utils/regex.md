---
description: Generate, explain, and test regular expressions
permissions:
  reads: []
  writes: []
  commands: []
  network: false
  destructive: false
---

Help with regular expressions.

Based on the request:

**Generate regex from description:**
1. Create a regex matching the described pattern
2. Explain each part of the regex
3. Provide test cases (matching and non-matching)
4. Consider edge cases (unicode, multiline, special chars)
5. Optimize for readability (use named groups, comments where supported)
6. Provide the regex in the user's language syntax (JS, Python, Go, etc.)

**Explain existing regex:**
1. Break down each part of the regex
2. Explain what it matches with examples
3. Identify potential issues:
   - Catastrophic backtracking (ReDoS)
   - Unintended matches
   - Missing anchors
   - Greedy vs lazy quantifiers
4. Suggest improvements

**Test regex:**
1. Run against provided test strings
2. Show matches with captured groups
3. Highlight edge cases that don't match as expected

Always warn about:
- ReDoS-vulnerable patterns (nested quantifiers)
- Differences between regex flavors (JS vs Python vs PCRE)
- Unicode considerations

$ARGUMENTS
