---
description: LLM output evals - rubrics, LLM-as-judge with bias controls, CI integration
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners", "CI config"]
  network: false
  destructive: false
---

Stand up an evaluation suite for an LLM feature so prompt and model changes are measured instead
of vibe-checked. Covers dataset design, rubric writing, code-based checks, LLM-as-judge with
explicit bias controls, and a CI gate. This is the general-purpose eval skill — for RAG-specific
metrics use /ai--rag-eval; for agent task evals see /ai--agent-builder step 6.

Steps:

1. **Locate the target and define "good"** (`$ARGUMENTS`)
   - Find the LLM call(s) under test: prompt, model, parameters, output consumer
   - Write down 3-6 concrete quality criteria with the feature owner (e.g. "answers in the user's language", "never invents order numbers", "under 120 words") — vague criteria produce noisy evals
   - Detect provider/SDK from the repo; the eval harness reuses the production client

2. **Build the eval dataset**
   - 30-200 input cases: real (anonymized) production inputs when available, plus authored edge cases — adversarial phrasing, empty/huge inputs, off-topic requests, each category labeled
   - For cases with a known correct output, record it (reference-based); the rest are judged rubric-only (reference-free)
   - Version the dataset in the repo; extend it whenever a production failure is triaged

3. **Prefer code-based checks; use a judge only where code can't reach**
   - Deterministic assertions first: valid JSON/schema, required fields present, length bounds, banned phrases, regexes for IDs/formats, exact-match for classification tasks — cheap, fast, zero bias
   - Reserve LLM-as-judge for genuinely subjective criteria: tone, helpfulness, faithfulness, instruction adherence

4. **Design the judge with bias controls**
   - One criterion per judge call, binary or 3-point scale with written anchors — not a 1-10 "overall quality" score
   - Require the judge to quote evidence from the output before scoring; parse a structured verdict
   - Controls: use a judge model at least as strong as (and ideally different from) the generator — e.g. judge with `claude-opus-4-8` while the product runs `claude-sonnet-5` or another provider's model; for pairwise comparisons run both orderings and discard disagreements (position bias); pin the judge model + prompt version; watch for verbosity and self-preference bias
   - **Calibrate**: hand-label 30-50 outputs and measure judge-human agreement; below ~85% agreement, fix the rubric before trusting the judge

5. **Score, aggregate, and set thresholds**
   - Per-case pass/fail per criterion → suite-level pass rates, sliced by input category; report cost and latency alongside quality
   - Run the suite N times if outputs are nondeterministic and report variance, not a single lucky run
   - Agree thresholds with the owner (e.g. "faithfulness ≥ 95%, format 100%") — 100% format compliance is realistic; 100% on subjective criteria is not

6. **Integrate with CI**
   - One command (`make eval` or a test target) runs everything and exits nonzero below threshold
   - Trigger on changes to prompts, model config, or the LLM code path; use a small smoke subset per-PR and the full suite nightly if cost matters
   - Store per-run scorecards (JSON in artifacts or committed history) so trends are visible; require an eval run in the PR template for prompt changes

**Notes:**
- An eval you don't run in CI is documentation, not a safety net
- Never let the same prompt author "improve" the rubric until their change passes — rubric changes are reviewed like code
- Keep a small held-out set the team doesn't optimize against; check it before big releases
- When a judge and a human disagree, the human is right — update the rubric, not the label

$ARGUMENTS
