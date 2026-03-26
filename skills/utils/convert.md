---
description: Convert between data formats - JSON, YAML, TOML, XML, CSV, ENV
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Convert data between formats.

Supported conversions:
- JSON ↔ YAML
- JSON ↔ TOML
- JSON ↔ XML
- JSON ↔ CSV
- ENV ↔ JSON
- YAML ↔ TOML
- Any format → TypeScript interface
- Any format → JSON Schema
- Any format → Zod schema

Steps:
1. Read the input data (from file or clipboard)
2. Parse and validate the source format
3. Convert to the target format with:
   - Proper indentation and formatting
   - Comments preserved where possible (YAML, TOML)
   - Special type handling (dates, nulls, nested objects)
   - Array handling across formats
4. Validate the output is correct and roundtrip-safe
5. Handle edge cases:
   - Nested objects in CSV (flatten or JSON-encode)
   - XML attributes vs elements
   - TOML's inline table vs table limitations
   - YAML anchors and aliases

Input: $ARGUMENTS
