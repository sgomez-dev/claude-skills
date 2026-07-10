---
description: Reliable structured output - schemas, native modes, validation, repair loops
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test runners"]
  network: false
  destructive: false
---

Make an LLM return machine-parseable output (JSON or typed objects) reliably enough to feed
downstream code. Covers schema design, provider-native structured-output modes vs tool-forcing vs
prompt-only, validation at the boundary, bounded repair loops, and a format-compliance eval that
must hit 100% before shipping.

Steps:

1. **Assess the call site** (`$ARGUMENTS`)
   - Find the LLM call whose output is parsed; note the current failure mode (invalid JSON, missing fields, wrong types, prose wrapping)
   - Detect provider/SDK from the repo and check which enforcement mechanisms it offers — modern SDKs expose native structured outputs (schema-constrained decoding or a `parse()` helper) and strict tool schemas; use the strongest one available

2. **Design the schema for the model, not just the parser**
   - Flat beats deeply nested; every field gets a description; enums for closed sets; explicit required list; `additionalProperties: false`
   - Mind provider schema limits (recursion, numeric ranges, string length constraints are often unsupported server-side — enforce those in code)
   - For classification/extraction, add an escape hatch (`"unknown"` enum value or nullable field) so the model isn't forced to fabricate
   - Derive the schema from the code's own types (Pydantic/Zod/dataclass) so validation and schema can't drift apart

3. **Pick the enforcement mechanism, strongest first**
   1. **Native structured output / schema-constrained mode** — guarantees syntactic validity (e.g. Claude's `output_config.format` json_schema on `claude-sonnet-5`/`claude-opus-4-8`; equivalent modes exist on other providers)
   2. **Forced tool call** — define one tool whose input schema is your output schema and force the model to call it; works broadly, gives strict typing where supported
   3. **Prompt-only** (local/older models): explicit format instructions + a compact example, then rely on step 4's parser hardening
   - Keep temperature low/default and outputs short; verbose "reasoning inside the JSON" fields invite drift

4. **Validate at the boundary — always, even with native modes**
   - Parse then validate against the typed schema; native modes guarantee syntax, not semantics (a well-formed but wrong-typed or out-of-range value still needs catching)
   - For prompt-only paths, harden the parser: strip code fences and pre/post-amble before parsing, but never "fix" JSON by regex beyond that
   - Semantic checks live here too: cross-field consistency, referenced IDs actually exist, dates in range

5. **Add a bounded repair loop**
   - On validation failure: re-prompt once or twice with the specific validation errors and the invalid output ("fix these errors, return only corrected JSON") — cap at 2 retries
   - After the cap: fail explicitly to a defined fallback (error to caller, queue for review) — never pass unvalidated output downstream
   - Log every repair with the error and attempt count; a rising repair rate is a schema or prompt bug

6. **Eval: format compliance is a hard gate**
   - Build 30+ diverse inputs (include adversarial ones: input text containing JSON, quotes, braces, prompt-injection attempts) and run the full pipeline
   - Metrics: parse rate, schema-valid rate, semantic-valid rate, repair-loop invocation rate, and field-level accuracy against expected values where known
   - Ship gate: 100% schema-valid after repairs on the eval set; track extraction accuracy separately via /ai--llm-eval
   - Re-run on every schema, prompt, or model change

**Notes:**
- Schema-valid ≠ correct: a model can emit perfectly valid wrong answers — always eval content, not just shape
- Changing field names or descriptions changes model behavior; treat schemas as prompts under version control
- Batch extractions per call cautiously — long output lists degrade tail accuracy; prefer chunking
- If a smaller/cheaper model can't hold the schema even with native modes, route those calls to a stronger one (see /ai--llm-cost-optimizer)

$ARGUMENTS
