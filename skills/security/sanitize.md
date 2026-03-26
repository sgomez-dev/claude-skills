---
description: Find unsanitized inputs and add proper validation/sanitization
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Find all places where user input enters the system and verify proper sanitization.

Steps:
1. Identify all input sources:
   - HTTP request params, body, headers, cookies
   - URL parameters and query strings
   - File uploads
   - WebSocket messages
   - CLI arguments
   - Environment variables used as input
2. Trace each input to where it's used:
   - **SQL queries**: Check for parameterized queries (not string concatenation)
   - **HTML output**: Check for proper escaping/encoding (XSS prevention)
   - **Shell commands**: Check for proper escaping (command injection)
   - **File paths**: Check for path traversal prevention
   - **Regex**: Check for ReDoS-safe patterns
   - **URLs**: Check for SSRF prevention
   - **JSON/XML parsing**: Check for injection and billion laughs
3. For each unsanitized input:
   - Show the vulnerable code path
   - Demonstrate potential exploit
   - Provide the fix with proper sanitization
4. Suggest a centralized validation middleware/layer if none exists

Scope: $ARGUMENTS
