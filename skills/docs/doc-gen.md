---
description: Generate comprehensive documentation for code, APIs, or entire modules
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate thorough documentation for the specified code.

Steps:
1. Read the target file(s) or module completely
2. Determine documentation type needed:
   - **API docs**: For public APIs, libraries, SDKs
   - **Module docs**: For internal code modules
   - **Architecture docs**: For system design
3. Generate documentation including:
   - **Overview**: What this code does and why it exists
   - **Usage examples**: Real-world code examples showing common use cases
   - **API reference**: Every public function/method/class with:
     - Description
     - Parameters with types and descriptions
     - Return type and description
     - Exceptions/errors thrown
     - Example usage
   - **Configuration**: Available options and defaults
   - **Common patterns**: How to use this code for typical scenarios
4. Use the project's existing doc format (JSDoc, docstrings, GoDoc, etc.)
5. Add inline comments only where logic is non-obvious

Target: $ARGUMENTS
