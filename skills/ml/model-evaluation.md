---
description: Evaluate a model properly — right metrics, calibration, slices, error analysis
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.csv", "**/*.parquet", "**/*.json", "models/**", "requirements.txt", "pyproject.toml"]
  writes: ["**/*.py", "**/*.ipynb", "reports/**", "**/*.md"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Evaluate a trained model beyond a single headline number: pick metrics that reflect the business
cost of each error type, check calibration, break performance down by slice, and read actual
errors one by one. A model is only as good as its worst slice that matters.

Steps:

1. **Reconstruct the evaluation setup** (`$ARGUMENTS`)
   - Detect the Python env and libs (sklearn, matplotlib, etc.); locate the trained model artifact and the held-out evaluation data (validation for iteration, test only for the final report)
   - Confirm what a prediction is used for downstream: who consumes it, what action it triggers, and the **relative cost of a false positive vs a false negative** — this single question decides most metric choices
   - Verify the eval set was never trained or tuned on; if hygiene is unclear, stop and audit with `/ml--dataset-prep` before trusting any number

2. **Choose metrics that match the problem — reject defaults**
   - **Imbalanced binary classification**: accuracy is banned; use PR-AUC + precision/recall at the operating threshold; ROC-AUC only as a secondary, threshold-free view
   - **Cost-asymmetric decisions**: build a cost matrix and report expected cost directly — it beats any proxy metric
   - **Regression**: MAE when errors cost linearly, RMSE when large errors are disproportionately bad; add MAPE/pinball only when relative error or quantiles are the business framing; always compare vs the naive baseline (skill score)
   - **Ranking/retrieval**: precision@k / recall@k / NDCG at the k the product actually shows
   - Report one **primary** metric (the decision-maker) and 2-3 secondary metrics (the sanity checks); state each with the baseline's value next to it

3. **Tune and justify the operating threshold** (classification)
   - The default 0.5 is almost never right — sweep thresholds and plot precision/recall/cost against them; pick the threshold that optimizes the business objective
   - Report the confusion matrix **at the chosen threshold** in plain-language terms ("of every 100 flagged, N are real; we miss M per week")
   - If different consumers need different tradeoffs, publish scores + several named operating points, not one hard label

4. **Check calibration if probabilities are consumed as probabilities**
   - Plot a reliability diagram and compute Brier score / ECE; tree ensembles and boosted models are commonly miscalibrated
   - If probabilities feed expected-value calculations, ranking cutoffs, or are shown to users: calibrate (isotonic or Platt) on validation data, never on test, and re-check
   - If only the ranking matters, note that and skip recalibration

5. **Slice the performance — the average hides the failures**
   - Compute the primary metric per meaningful segment: key categoricals (region, product line, customer tier), value buckets, time periods (is the newest data worse?), and data-quality strata (rows with imputed values)
   - Flag any slice that is meaningfully worse than the aggregate, and any slice with too few samples to judge (report n per slice)
   - If the model will affect people, slice by any relevant protected or sensitive attributes available and report gaps explicitly — degrading a subgroup silently is a launch blocker, not a footnote

6. **Do manual error analysis — read the actual errors**
   - Pull the top-N worst errors (highest-confidence wrong predictions, largest residuals) and read them individually
   - Categorize: label noise, missing feature/context, genuine ambiguity, systematic pattern (e.g., all from one source), leakage artifact
   - Quantify each bucket — "38% of large errors are mislabeled data" redirects effort from modeling to labeling; end with a ranked list of the highest-leverage fixes

7. **Write the evaluation report**
   - Save to `reports/`: dataset + model version, metric table (model vs baseline, with CI or fold std), threshold choice and rationale, calibration status, slice table with flags, error-analysis buckets, and a clear **ship / don't ship / ship-with-guardrails** recommendation
   - List what evaluation could NOT cover (unseen segments, temporal drift risk) — these become the monitoring plan in `/ml--model-deployment`

**Notes:**
- Never evaluate on data the model or its threshold was tuned on; the test set gives you one honest reading — spend it wisely
- Add uncertainty to every headline number (bootstrap CI or CV fold std); differences inside the noise band are not improvements
- A suspiciously great score is a bug until proven otherwise — check leakage before publishing it
- Metrics summarize; examples convince — put 3 real errors in the report, stakeholders reason better from them than from AUC
- Offline metrics don't guarantee online impact; recommend a shadow run or A/B test for decisions that matter (see /ml--model-deployment)

$ARGUMENTS
