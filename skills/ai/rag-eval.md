---
description: Evaluate a RAG pipeline - retrieval metrics, groundedness, golden set, regression
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Build an evaluation harness for an existing RAG pipeline so retrieval and generation quality are
measured, not guessed. Produces a golden dataset, retrieval metrics, groundedness/faithfulness
checks, and a regression gate you can run on every change to chunking, embeddings, or prompts.
Complements /ai--embeddings (building the pipeline) and /ai--llm-eval (general output evals).

Steps:

1. **Map the pipeline** (`$ARGUMENTS`)
   - Locate the RAG code: ingestion/chunking, embedding model, vector store, retriever (top-k, filters, hybrid, reranker), and the generation prompt
   - Identify the knobs you'll want to compare later: chunk size/overlap, k, reranker on/off, embedding model, prompt version
   - Detect provider/SDK from the repo and reuse it for any judge or generation calls

2. **Build the golden set**
   - 30-100 questions with, for each: the expected answer (or key facts) and the IDs of the document chunks that contain the evidence
   - Source them from real user queries or logs when available; otherwise draft from the corpus and have a domain owner review — cover easy lookups, multi-chunk questions, paraphrases, and questions the corpus **cannot** answer (to test abstention)
   - Store as versioned data in the repo (JSONL/CSV) with stable IDs, next to the eval code

3. **Measure retrieval in isolation first**
   - For each golden question, run only the retriever and compute: **recall@k** (are the gold chunks in the top k?), **MRR/nDCG** (how high?), and precision@k
   - Retrieval is the usual bottleneck — if recall@k is low, no prompt work will fix the answers; iterate on chunking/embeddings/hybrid search here before touching generation
   - Log per-question results so failures are inspectable, not just averaged away

4. **Measure generation: groundedness and correctness**
   - **Groundedness/faithfulness**: every claim in the answer must be supported by the retrieved context — check with an LLM judge (use a strong model such as `claude-sonnet-5` or `claude-opus-4-8` for the hardest sets; equivalent judge models exist on other providers) prompted to list unsupported claims, not just score
   - **Answer correctness**: compare against the golden answer/key facts (judge or string/fact matching where possible)
   - **Abstention**: on unanswerable questions, the pipeline must say it doesn't know — count confident fabrications as hard failures
   - Apply the judge-bias controls from /ai--llm-eval (fixed rubric, spot-check against human labels)

5. **Wire the regression gate**
   - One command runs the full suite and prints a scorecard: recall@k, MRR, groundedness %, correctness %, abstention %, cost and latency per query
   - Store baseline scores; fail the run (CI or pre-merge) when a metric drops beyond an agreed tolerance
   - Every config experiment (new chunking, new embedding model) is compared on this same suite — never eyeballed

6. **Close the loop with production**
   - Log retrieval + answer pairs in production (see /ai--llm-observability); feed flagged/thumbs-down cases back into the golden set monthly

**Notes:**
- Diagnose in order: retrieval recall → context precision (noise crowding the window) → generation faithfulness; most "hallucinations" are retrieval misses
- Keep the golden set stable between experiments; extend it, don't rewrite it, or scores stop being comparable
- A small, honest set of 50 questions you actually run beats an aspirational 1000 you don't
- Re-run the full suite whenever the corpus is re-ingested — chunk IDs and recall both shift

$ARGUMENTS
