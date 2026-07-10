---
description: Train a model — baseline first, framework choice, cross-validation, tuning
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.csv", "**/*.parquet", "**/*.json", "**/*.yaml", "requirements.txt", "pyproject.toml"]
  writes: ["**/*.py", "**/*.ipynb", "models/**", "**/*.yaml", "**/*.md"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Train a model the disciplined way: a trivial baseline first, then the simplest model that could
work, then complexity only where it pays. Every comparison runs under the same cross-validation
scheme against the same metric, and the test set stays untouched until the very end.

Steps:

1. **Establish context** (`$ARGUMENTS`)
   - Detect the Python env and installed ML libs (sklearn, xgboost, lightgbm, catboost, pytorch, tensorflow) from `requirements.txt`/`pyproject.toml` — prefer what's already there
   - Load prepared splits and any feature pipeline (from `/ml--dataset-prep` / `/ml--feature-engineering`); if they don't exist, run those first — do not train on unsplit, unchecked data
   - Confirm the problem type (binary/multiclass/regression/ranking) and the **primary metric** tied to the business cost (see /ml--model-evaluation for choosing it) — you can't train toward a metric you haven't picked

2. **Build the dumb baseline — non-negotiable**
   - Classification: majority class + `DummyClassifier(strategy="stratified")`; regression: mean/median predictor; also a one-feature rule if a domain heuristic exists ("last month's value", "price > X")
   - Score it with the exact metric and CV scheme everything else will use
   - This number is the floor: any model that doesn't clearly beat it is noise, and if the dumb baseline is already "good", the problem may not need ML

3. **Pick the CV scheme to match the data — same rules as the split**
   - Random rows → stratified k-fold (k=5); repeated entities → GroupKFold on the entity key; temporal data → expanding-window / `TimeSeriesSplit` (never shuffle time)
   - Report mean ± std across folds, not a single number — a model that wins by less than the fold std hasn't won
   - Fix seeds everywhere (numpy, model, split) for reproducibility

4. **Train the simplest real model, then escalate**
   - Tabular: logistic/linear regression (with the feature pipeline) → gradient boosting (lightgbm/xgboost/HistGradientBoosting) — this ladder covers most problems
   - Text: TF-IDF + linear model before any transformer fine-tune; images: pretrained backbone + linear head before training anything from scratch
   - Wrap model + preprocessing in one Pipeline so CV refits everything per fold — preprocessing fit outside CV is leakage
   - Stop escalating when the incremental gain stops justifying the complexity (training cost, serving latency, explainability)

5. **Tune hyperparameters — modestly**
   - Tune only the model that earned it, only its few high-leverage params (e.g., for GBMs: learning rate, depth/leaves, regularization, n_estimators via early stopping)
   - Prefer random search or Optuna (if installed) over grid search; budget ~20-50 trials; tune inside the same CV scheme, never against the test set
   - Early-stop on the validation fold, not on training loss
   - Expect single-digit-% gains from tuning; if you need more than that, the answer is features or data, not more trials

6. **Diagnose before declaring victory**
   - Learning curve: does more data help (underfit) or has it flattened (feature ceiling)? Train-vs-val gap: overfitting → more regularization/less complexity
   - Compare all candidates in one table: metric mean ± std, train time, model size; pick the simplest within one std of the best
   - Sanity-check top feature importances against domain sense — an implausible dominant feature means leakage, go back to `/ml--dataset-prep` checks

7. **Finalize and persist**
   - Refit the chosen pipeline on train+val, evaluate **once** on the held-out test set — this is the number you report, and you don't iterate on it
   - Save the fitted artifact to `models/` with a metadata file: data version, code commit, params, CV scores, test score, seed, library versions
   - Log the run if experiment tracking exists in the repo (MLflow/W&B — see /ml--mlops-pipeline); next: `/ml--model-evaluation` for the deep evaluation, then `/ml--model-deployment`

**Notes:**
- The baseline-first rule has no exceptions — a model without a baseline comparison is an anecdote
- One change per experiment: new features OR new model OR new params, never all at once, or you can't attribute the gain
- Beware metric improvements smaller than fold-to-fold variance; run repeated CV if the decision is close
- GPU/deep learning is a means, not a goal — on tabular data, gradient boosting usually wins and ships easier
- Keep every experiment's config and score, including the failures — negative results prevent re-running dead ends

$ARGUMENTS
