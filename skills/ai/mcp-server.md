---
description: Build an MCP server - tools, resources, prompts, transport, auth, testing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test runners", "MCP inspector/dev tooling"]
  network: false
  destructive: false
---

Build a Model Context Protocol (MCP) server that exposes this project's capabilities (APIs,
database, domain logic) to any MCP-compatible client (Claude Code, Claude Desktop, IDEs, custom
agents). Covers primitives (tools/resources/prompts), transport choice, auth, and a test suite —
the server isn't done until a client has exercised every tool.

Steps:

1. **Scope the server** (`$ARGUMENTS`)
   - Identify what to expose: which existing functions, endpoints, or data sources become MCP capabilities; list them with a one-line purpose each
   - Detect the language and pick the official MCP SDK for it (TypeScript, Python, etc.); follow the repo's existing project layout and package manager
   - Decide the primitive per capability: **tool** (model-invoked action), **resource** (client-loaded data, addressed by URI), **prompt** (user-invoked template). Don't model read-only reference data as tools

2. **Define tools properly**
   - Clear names (`verb_noun`), descriptions that state *when* to call the tool, typed input schemas with per-field descriptions, enums for closed sets, required vs optional made explicit
   - Return structured, concise results; truncate or paginate large payloads and say so in the result rather than dumping megabytes into the model's context
   - Return execution failures as in-band tool errors with actionable messages — not protocol errors

3. **Choose transport**
   - **stdio** for local, single-user servers (CLI/IDE integration) — simplest, no auth needed beyond process trust
   - **Streamable HTTP** for remote or multi-client servers; make host/port configurable
   - Keep transport wiring separate from capability logic so both can be offered

4. **Handle auth and secrets**
   - Server-held credentials (API keys for downstream services) come from environment variables — never hardcoded, never accepted as tool parameters, never echoed in results
   - Remote HTTP servers need caller authentication (bearer token or OAuth per the MCP auth spec); stdio servers inherit the invoking user's trust
   - Validate and bound every tool input — path traversal, injection into downstream queries, and oversized inputs are the common holes; treat all tool arguments as untrusted model output

5. **Test at three levels**
   - Unit tests for each tool handler: happy path, invalid input, downstream failure
   - Protocol tests: launch the server and drive it with the MCP inspector or a scripted client — verify initialize, list tools/resources/prompts, call each tool, check schemas render
   - Model-facing eval: connect a real client and run 5-10 realistic prompts; verify the model picks the right tool with the right arguments — fix descriptions until it reliably does (see /ai--tool-calling)

6. **Document and register**
   - Write the client config snippet (command/args for stdio, URL for HTTP) and required env vars in the README
   - Log tool invocations with inputs (secrets redacted), duration, and outcome for debugging

**Notes:**
- Fewer, sharper tools beat a 1:1 mirror of your REST API — design for what the model should *do*, not what endpoints exist
- Tool descriptions are prompts: iterate on them with the step 5 eval like you would any prompt
- Version the server; note breaking schema changes in tool descriptions during transitions
- Destructive capabilities deserve a dry-run parameter or explicit confirmation convention

$ARGUMENTS
