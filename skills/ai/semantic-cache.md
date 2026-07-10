---
description: Add semantic caching to LLM calls - embedding keys, thresholds, invalidation
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Add a semantic cache in front of LLM calls so repeated or near-duplicate requests are served from
a stored response instead of a new generation. Covers key design (exact vs embedding-based),
similarity thresholds, invalidation, and the measurement that proves the cache helps instead of
silently serving wrong answers. Complements /ai--llm-cost-optimizer (broader cost work) and
/ai--embeddings (embedding pipeline details).

Steps:

1. **Find the cacheable call sites** (`$ARGUMENTS`)
   - Locate the LLM calls in the repo and detect the SDK/provider in use; reuse the existing client and conventions
   - Rank call sites by cacheability: high repeat rate, deterministic-enough answers (FAQ, classification, extraction) are good; personalized, time-sensitive, or creative outputs are bad candidates — exclude them explicitly
   - Pull real traffic (logs or /ai--llm-observability data) to estimate the potential hit rate before writing any code; if repeats are under ~10%, say so and stop

2. **Design the cache key**
   - Start with an **exact-match layer**: hash of normalized prompt (trim whitespace, lowercase where safe, strip volatile fields like timestamps/request IDs) + model + temperature + system-prompt version + tool-list version — any input that changes the output must be in the key
   - Add a **semantic layer** only for user-phrased inputs: embed the query (a small embedding model is fine) and match against stored entries by cosine similarity in a vector store the project already has, or a simple local index
   - Never semantically cache across users/tenants unless the answer is genuinely user-independent; partition keys by tenant and by any context that changes the answer

3. **Set and tune the similarity threshold**
   - Start conservative (e.g. 0.95+ cosine on normalized embeddings) — a false hit (wrong cached answer) usually costs more trust than a missed hit costs money
   - Build a small labeled set of query pairs (duplicates vs near-misses that need different answers, e.g. "cancel my order" vs "cancel my account") and pick the threshold from that data, not from a blog post
   - For borderline hits, consider a cheap verification call (e.g. `claude-haiku-4-5`, or an equivalent small model on other providers) that checks "does this cached answer fully answer this query?" before serving

4. **Implement invalidation and TTLs**
   - Every entry stores: key, embedding, response, model + prompt versions, created-at, hit count
   - Invalidate on: prompt/system version bump (version in the key handles this), model change, TTL expiry (short for volatile domains, longer for stable facts), and explicit purge hooks when underlying data changes (e.g. docs re-ingested — coordinate with the RAG pipeline)
   - Provide an admin path to purge a single bad entry fast — the first wrong cached answer in production will need it

5. **Measure it — hit rate is not the metric, correct hit rate is**
   - Instrument: hit rate, false-hit rate (sampled hits reviewed by an LLM judge or human against a fresh generation), latency saved, cost saved
   - Run the project's existing eval suite (/ai--llm-eval or /ai--rag-eval) **with the cache enabled** — quality must not drop versus cache-off baseline
   - Shadow mode first: log would-be hits without serving them for a few days, review the matches, then flip on

**Notes:**
- Exact-match caching is free wins with zero risk — ship that layer even if the semantic layer never lands
- Provider-side prompt caching (e.g. Anthropic prompt caching) is complementary, not a substitute: it caches the prompt prefix per provider call; a semantic cache skips the call entirely — see /ai--llm-cost-optimizer
- Cache entries containing personal data inherit that data's retention and deletion obligations — wire purges into the same deletion flows
- A cache that serves a stale or wrong answer confidently is worse than no cache; when in doubt, raise the threshold

$ARGUMENTS
