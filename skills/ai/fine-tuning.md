---
description: Fine-tune an LLM - decide vs prompting, prep dataset, train, eval before/after
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners, training scripts"]
  network: false
  destructive: false
---

Decide whether fine-tuning is actually warranted, and if so, prepare the dataset, run the
training, and prove the improvement with before/after evals on a held-out set. Most teams reach
for fine-tuning too early — this skill makes the cheaper alternatives fail first. Complements
/ai--prompt-engineer (the alternative to beat) and /ai--llm-eval (the measurement).

Steps:

1. **Make the fine-tune vs prompt decision honestly** (`$ARGUMENTS`)
   - State the goal in one sentence and classify it: **style/format/tone consistency** and **narrow classification at scale** favor fine-tuning; **new knowledge** does not (use RAG — /ai--embeddings), **complex reasoning** does not (use a stronger model or better prompts), **fixable-by-instruction behavior** does not (fix the prompt)
   - Require that the cheaper ladder has been climbed first, with eval evidence at each rung: better prompt → few-shot examples → structured output (/ai--structured-output) → RAG → stronger model. Fine-tune only if the best of those still misses the quality bar, or hits it at a unit cost/latency the product can't afford
   - Check feasibility: hosted fine-tuning availability varies by provider and model generation (check current provider docs); open-weight models (Llama, Mistral, Qwen…) are always an option via LoRA/QLoRA but add hosting responsibility. Note that frontier hosted models (e.g. `claude-sonnet-5`) often beat a fine-tuned small model with good prompting — that's the baseline to beat

2. **Build the eval before touching training data**
   - 50-200 held-out cases with programmatic checks or a rubric-based LLM judge (/ai--llm-eval); this set is sacred — it never enters training data
   - Run it against the current best prompted setup and record the baseline: quality score, cost per task, latency. This baseline is what the fine-tune must beat, on the same set, or the project stops

3. **Prepare the dataset**
   - Target hundreds to a few thousand high-quality examples for style/format tasks; quality beats volume — 500 clean examples beat 5000 noisy ones
   - Each example is exactly the shape of a production call: same system prompt structure, realistic inputs, ideal outputs (written or curated by a domain expert, or drafted by a strong model such as `claude-opus-4-8` and human-reviewed)
   - Deduplicate (exact and near-duplicate), scrub PII, balance categories/edge cases to match production distribution, and split train/validation before any inspection of the validation half
   - Store the dataset versioned (JSONL) with a datasheet: source, date, filtering applied, known gaps

4. **Train**
   - Hosted route: follow the provider's fine-tuning API with default hyperparameters first (1-3 epochs; more epochs = memorization risk)
   - Open-weight route: LoRA/QLoRA before full fine-tuning — cheaper, faster to iterate, usually sufficient for style/format goals
   - Watch validation loss; stop when it plateaus. Change one variable per run (data mix OR epochs OR base model), and record every run's config so results are attributable

5. **Evaluate before/after — the step that decides everything**
   - Run the held-out eval on the fine-tuned model with the *simplified* production prompt (a key payoff is shortening the prompt); compare against the step-2 baseline on quality, cost per task, and latency
   - Check for regressions beyond the target skill: general instruction-following, refusal behavior, and out-of-distribution inputs — fine-tunes can get brittle outside their training distribution
   - Ship only if the fine-tune wins on the metric that motivated it without losing elsewhere; otherwise iterate on data (usually the fix) rather than hyperparameters

6. **Operationalize**
   - Version the model artifact alongside the dataset and eval scores that justified it; route traffic gradually and monitor with /ai--llm-observability
   - Plan for re-training: base-model deprecations and data drift both expire fine-tunes — re-run the eval on schedule, and keep the pipeline (data prep → train → eval) reproducible as one command

**Notes:**
- Fine-tuning teaches form, not facts — if the model needs to know something new, that's retrieval's job
- The most common failure is contaminated evals: any overlap between training data and the eval set voids the results
- Cost the whole lifecycle, not the training run: data curation, re-training cadence, and (for open weights) hosting usually dominate
- If the eval set doesn't exist yet, that — not training — is the first deliverable

$ARGUMENTS
