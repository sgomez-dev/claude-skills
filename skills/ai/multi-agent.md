---
description: Design multi-agent systems: orchestrator patterns, handoffs, shared state, failure modes
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design and implement a multi-agent system that is actually better than a single well-prompted agent —
with clear boundaries, explicit handoffs, and failure handling — not a fragile chain that amplifies errors.

Steps:

1. **Justify the decomposition** (`$ARGUMENTS`)
   - Detect the existing LLM SDK/provider from the repo (Anthropic, OpenAI, local) and any agent framework
   - Ask: what task, and why can't one agent with tools do it? Valid reasons: genuinely parallel subtasks,
     distinct tool/permission scopes, independent context windows, adversarial review. If none apply, recommend a single agent and stop.

2. **Choose an orchestration pattern**
   Pick and justify one: orchestrator-workers (a lead delegates and synthesizes), pipeline (staged handoffs),
   parallel fan-out + reduce, or debate/critic. Diagram the agents, their inputs/outputs, and the control flow.

3. **Define contracts between agents**
   For each agent: role, system prompt sketch, allowed tools, and a strict input/output schema.
   Handoffs pass structured data, not free text, so a downstream agent can't misread an upstream result.

4. **Design shared state and memory**
   Decide what is shared (a blackboard/state object) vs isolated per agent. Prevent context bloat: summarize
   between stages rather than forwarding full transcripts. Define who can write which fields.

5. **Handle failure modes**
   Address: an agent looping, a bad handoff, partial failure in a fan-out, cost/latency runaway.
   Add stop conditions, per-agent step budgets, timeouts, and a fallback path when a subagent returns null.

6. **Implement incrementally and evaluate**
   Build the smallest version first (2 agents), add an end-to-end eval comparing it against the single-agent
   baseline on a small task set. Ship only if the multi-agent version measurably wins on quality or latency.
   For concrete models use claude-opus-4-8 for the orchestrator and claude-haiku-4-5 for cheap workers (other providers have tier equivalents).

**Notes:**
- More agents = more failure surface and cost; the burden of proof is on the decomposition
- Structured handoffs beat prose handoffs every time — validate them
- See `/ai--agent-builder` for the single-agent loop each node runs, and `/ai--llm-eval` for the comparison harness
- Log every handoff for debugging; a multi-agent bug is invisible without the trace (`/ai--llm-observability`)

$ARGUMENTS
