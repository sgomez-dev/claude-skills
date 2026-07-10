---
description: JSON utilities: validate, diff, query with jq, flatten, infer schema
permissions:
  reads: ["*.json", "*.jsonl", "*.ndjson"]
  writes: ["*.json", "*.schema.json"]
  commands: ["jq"]
  network: false
  destructive: false
---

Work with JSON quickly and correctly — validate it, diff two payloads, query deeply nested structures, flatten
it, or infer a schema — without hand-parsing braces or eyeballing giant blobs.

Steps:

1. **Identify the operation and input** (`$ARGUMENTS`)
   - Accept a file path, pasted JSON, or two inputs (for diff)
   - Determine the goal: validate, pretty-print, diff, query/filter, flatten/unflatten, convert, or infer schema
   - Detect JSON vs JSONL/NDJSON (line-delimited) and handle accordingly

2. **Validate first**
   Check well-formedness and report the exact line/column of any syntax error. If a JSON Schema is available,
   validate against it and list violations with paths. Flag common issues: trailing commas, duplicate keys, wrong types.

3. **Perform the operation**
   - **Query/filter**: build and run a `jq` expression (show it so the user learns it)
   - **Diff**: structural diff of two payloads — added/removed/changed keys with paths, not a line diff
   - **Flatten**: dotted-path key/value pairs (and the reverse)
   - **Schema inference**: derive a JSON Schema from sample data, marking optional vs required fields

4. **Deliver**
   Output the result to stdout or a file as appropriate. For queries, show the `jq` expression used so it's
   repeatable. For schema inference, write `*.schema.json`.

**Notes:**
- Show the `jq` expression rather than just the answer — a repeatable query beats a one-off result
- For very large files, stream (jq is streaming-friendly) rather than loading everything into memory
- To convert between JSON/YAML/TOML/CSV, use `/utils--convert`; for API payloads, pair with `/api--rest-client`

$ARGUMENTS
