---
description: Robust LLM tool calling - schema design, parallel calls, errors, eval harness
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Implement or harden tool/function calling for an LLM app: schemas the model actually uses
correctly, parallel execution done right, error handling that lets the model recover, and an eval
that measures tool-selection accuracy. This is the tool-layer deep dive under /ai--agent-builder
(the loop around it) and /ai--mcp-server (exposing tools over MCP).

Steps:

1. **Audit the current tool surface** (`$ARGUMENTS`)
   - Find tool definitions and the dispatch code; detect the SDK (Anthropic, OpenAI, others — the shape differs but the principles don't) and reuse it
   - Red flags to fix: vague descriptions ("manages data"), overlapping tools the model confuses, one mega-tool with a `mode` parameter, parameters that duplicate context the app already has, tools never called in practice

2. **Design schemas the model can't misuse**
   - Description says *when* to use the tool and when not to, not just what it does; include one inline example call for anything non-obvious
   - Parameters: enums over free strings wherever the value set is closed; required vs optional explicit; formats spelled out ("ISO 8601 date", "user ID like usr_abc123"); no parameter the server can infer itself
   - Return values are model food: structured, compact, self-describing — return "no results for query X, try broadening" instead of `[]`; truncate huge payloads with a note saying so and how to page
   - Name tools by intent (`search_orders`, `refund_order`), keep the count lean — every unused tool is context-window tax and a misfire risk

3. **Implement the dispatch loop correctly**
   - Validate arguments against the schema before executing; on validation failure, return the specific error to the model as a tool result so it can correct — don't crash the turn
   - Append the assistant message containing the tool-call blocks to history first, then one result per call ID; a missing or mismatched result ID corrupts the conversation on every provider
   - Log every call: tool, arguments, latency, outcome — wire into /ai--llm-observability

4. **Handle parallel calls**
   - Modern models (e.g. `claude-sonnet-5`, `claude-opus-4-8`; other providers likewise) emit multiple tool calls in one turn — execute read-only calls concurrently, and return *all* results in the same following turn, ordered by call ID
   - Mark tools as parallel-safe vs not; serialize writes and anything with ordering constraints even when requested in parallel; one call failing must not swallow its siblings' results

5. **Handle errors so the model can recover**
   - Distinguish in the result: invalid arguments (model should fix and retry), execution failure (model may retry or route around), and permission/not-found (model should tell the user, not retry)
   - Timeouts per tool; retries with backoff for transient failures live in the executor, not the model; after N consecutive failures of the same tool, stop the loop and surface it
   - Gate destructive tools (send, delete, pay) behind explicit user confirmation — the model asking nicely is not authorization

6. **Evaluate tool selection and use**
   - Build a suite of 30+ cases: prompts with a known correct tool + arguments, prompts where *no* tool should be called (the most commonly failed case), ambiguous prompts, and multi-tool sequences
   - Score: correct-tool rate, argument validity rate, unnecessary-call rate, recovery rate after injected tool errors; run on every schema or description change — description edits move these numbers more than anything else
   - Track per-tool call and error rates in production; a tool with high misfire rate needs a better description or a merge/split

**Notes:**
- The model reads only names, descriptions, and schemas — the implementation is invisible to it; write descriptions like docs for a sharp new hire
- When two tools are routinely confused, merge them or sharpen the "when NOT to use" line in each description
- Idempotency keys on any tool with side effects: models retry, networks duplicate
- Keep the tool list byte-stable across turns of a conversation to preserve provider prompt caching

$ARGUMENTS
