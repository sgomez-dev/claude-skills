---
description: Cut LLM costs: model routing, caching, prompt compression, batching without quality loss
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Reduce LLM spend without degrading output quality — by measuring where tokens actually go, then applying
routing, caching, and prompt discipline, each gated by an eval so you never trade cost for silent regressions.

Steps:

1. **Measure the current spend** (`$ARGUMENTS`)
   - Detect the LLM SDK/provider and find all call sites in the repo
   - Break down cost by call site: model used, avg input/output tokens, call volume, and share of total spend
   - If usage data exists (logs/dashboards), use it; otherwise estimate from prompt sizes and note it as an estimate

2. **Attack the biggest line item first**
   Rank optimizations by expected savings. Common wins, in order of usual impact:
   - **Model routing**: send easy calls to a cheap model (claude-haiku-4-5), reserve claude-opus-4-8 for hard ones — with a classifier or heuristic to route
   - **Prompt caching**: cache stable system prompts / context prefixes so repeated calls bill less
   - **Semantic caching**: reuse answers for near-duplicate queries (see `/ai--semantic-cache`)
   - **Prompt compression**: trim redundant context, few-shot bloat, and verbose instructions
   - **Max-tokens & batching**: cap output length; batch offline workloads

3. **Guard each change with an eval**
   Before applying, capture a baseline quality score on a representative set (see `/ai--llm-eval`).
   Apply one optimization, re-run the eval, and keep it only if quality holds within an agreed threshold.

4. **Implement routing and caching**
   Add the routing/caching layer with a clean fallback (cache miss or router-unsure → default model).
   Make the cheap path the default and escalate on signals, not the reverse.

5. **Report savings**
   Show projected monthly savings per optimization and the quality delta for each. Flag anything that saved
   money but moved quality, and let the user decide.

**Notes:**
- Never optimize cost blind — every change ships with a before/after quality number
- The cheapest token is the one you don't send; prompt hygiene often beats model downgrades
- Provider-agnostic: the tactics apply to any vendor; only the model names change
- Pairs with `/ai--context-engineering` (what to put in the window) and `/ai--llm-observability` (cost tracking)

$ARGUMENTS
