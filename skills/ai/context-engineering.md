---
description: Context engineering: what goes in the window, retrieval vs stuffing, compaction
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Engineer what goes into the model's context window so the signal-to-noise ratio stays high — the single
biggest lever on quality, latency, and cost once the prompt itself is good.

Steps:

1. **Map the current context** (`$ARGUMENTS`)
   - Detect the LLM SDK/provider and locate where the prompt/context is assembled in the repo
   - Inventory everything that goes into the window: system prompt, instructions, few-shot examples,
     retrieved chunks, conversation history, tool results — with rough token cost of each

2. **Diagnose the problems**
   Look for: irrelevant retrieved chunks, ballooning history, redundant instructions, few-shot examples that
   no longer earn their tokens, and "lost in the middle" where key facts sit where the model attends least.

3. **Decide retrieval vs stuffing**
   For each information source, choose: always-in-context (small, always relevant), retrieved on demand
   (large corpus — see `/ai--embeddings` and `/ai--rag-eval`), or summarized. Justify by relevance and size.

4. **Design compaction**
   For long conversations/agents: summarize old turns, keep a rolling working-memory of key facts, and evict
   stale tool output. Define WHEN compaction triggers (token threshold) and WHAT is always preserved.

5. **Order for attention**
   Place the most important instructions and facts at the start and end of the window; put bulky reference
   material in the middle. Use clear delimiters/structure so the model can locate sections.

6. **Validate with an eval**
   Re-run a quality eval (`/ai--llm-eval`) after trimming to confirm you removed noise, not signal.
   Report tokens saved and any quality delta.

**Notes:**
- More context is not better context — irrelevant tokens actively hurt accuracy and cost
- Measure before and after; context changes have non-obvious quality effects
- Works hand in hand with `/ai--llm-cost-optimizer` — a tighter window is cheaper and often smarter
- Provider-agnostic; window sizes differ but the discipline is the same

$ARGUMENTS
