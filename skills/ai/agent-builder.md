---
description: Build an AI agent - loop design, tool surface, memory, stop conditions, evals
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Design and implement an LLM agent: a loop where the model calls tools, observes results, and
iterates until the task is done. Covers loop architecture, tool surface design, memory, stop
conditions, and — before anything ships — a task-level eval harness. Complements
/ai--tool-calling (tool schema depth) and /ai--multi-agent (multiple agents).

Steps:

1. **Detect stack and decide if an agent is warranted** (`$ARGUMENTS`)
   - Detect language and LLM SDK from the repo (Anthropic, OpenAI, local model, or none yet); reuse the existing client, key handling, and conventions — never introduce a second SDK for the same provider
   - Gate the architecture: if the task is a fixed sequence of steps, build a **workflow** (code-orchestrated calls), not an agent. Reserve the agent loop for tasks that are multi-step, hard to fully specify in advance, and where errors are recoverable
   - Pick the model: a strong reasoning model for the loop (e.g. `claude-opus-4-8`; equivalents exist for other providers), a cheap one (e.g. `claude-haiku-4-5`) for sub-tasks like summarizing tool output

2. **Design the agent loop**
   - Core shape: build messages → call model → if tool calls requested, execute them, append results, repeat → else return final answer
   - Always append the model's full response (including tool-call blocks) to history before appending tool results; return all results for parallel calls in a single turn
   - Make the loop resumable: persist message history so a crash or restart doesn't lose the run

3. **Design the tool surface**
   - Few, well-described tools beat many vague ones; each description must say *when* to use the tool, not just what it does
   - Promote actions needing approval, audit, or custom UI to dedicated tools rather than hiding them behind a generic `run_command`
   - Mark read-only tools as parallel-safe; gate hard-to-reverse actions (sends, deletes, payments) behind explicit confirmation

4. **Add memory and context management**
   - Within a run: truncate or summarize old tool results when history grows; keep the system prompt and tool list byte-stable to preserve provider prompt caching
   - Across runs: a simple scratchpad file or notes store the agent reads at start and updates at end goes a long way — see /ai--context-engineering for window budgeting

5. **Implement stop conditions and failure handling**
   - Hard limits: max iterations, max tokens/cost per run, wall-clock timeout — all configurable, all logged when hit
   - Return tool errors to the model as error-marked results (so it can adapt) instead of raising; abort after N consecutive failures of the same tool
   - Detect loops (same tool + same input twice in a row → intervene)

6. **Build the eval harness before polishing the agent**
   - Collect 10-20 representative tasks with a programmatic success check each (assertion on output, state change, or file produced) — outcome checks, not transcript matching
   - Run the suite on every prompt/tool change; track success rate, iterations per task, and cost per task
   - Add regression cases whenever a real failure is found and fixed

7. **Instrument it**
   - Log every model call and tool call with timing, tokens, and outcome; emit a run summary (result, iterations, cost) — wire into /ai--llm-observability if tracing exists

**Notes:**
- Start with the dumbest loop that works; add planning steps, reflection, or sub-agents only when evals show they help
- A tool the model never calls in evals is dead weight in the context window — cut it
- Never let the agent's own output expand its permissions (e.g. writing to its own tool config)
- Nothing ships without the eval suite from step 6 passing at an agreed threshold

$ARGUMENTS
