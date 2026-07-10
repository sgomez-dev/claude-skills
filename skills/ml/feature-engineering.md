---
description: Engineer features with leakage-safe pipelines — encodings, scaling, interactions
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.csv", "**/*.parquet", "**/*.json", "requirements.txt", "pyproject.toml"]
  writes: ["**/*.py", "**/*.ipynb", "data/**", "**/*.md"]
  commands: ["python", "pip"]
  destructive: false
  network: false
---

Design and implement features for a tabular ML problem inside a leakage-safe pipeline: every
transform is fit on training data only and applied identically at validation, test, and serving
time. Prefer a handful of well-motivated features over a wall of automated ones.

Steps:

1. **Understand the data and the stack** (`$ARGUMENTS`)
   - Detect the Python env and available libs (sklearn, pandas/polars, category_encoders, feature-engine, xgboost/lightgbm) from `requirements.txt`/`pyproject.toml` — build with what's installed
   - Load the prepared splits (run `/ml--dataset-prep` first if they don't exist); confirm target, prediction moment, and entity key
   - Ask what the model family will be if not obvious — tree ensembles need far less transformation (no scaling, native missing handling in lightgbm/xgboost) than linear models or neural nets

2. **Propose features from domain reasoning, not brute force**
   - For each raw column, ask: what would a domain expert derive from this? Ratios, differences, rates, tenure/age from dates, counts per entity, flags for special values
   - Datetimes → cyclical or categorical parts (hour, day-of-week, month), time since last event, time to known deadline
   - High-cardinality categoricals → grouping rare levels, frequency encoding, or target encoding (with CV, see step 4)
   - Text columns → length, keyword flags, or TF-IDF if genuinely predictive; don't reach for embeddings unless simpler encodings fail
   - Present the proposed feature list with rationale before implementing; drop anything the user says won't exist at prediction time

3. **Choose encodings and scaling per model family**
   - Low-cardinality categoricals: one-hot for linear models; ordinal/native categorical for tree ensembles
   - Numerics: StandardScaler/RobustScaler only for scale-sensitive models (linear, SVM, kNN, NN) — skip for trees
   - Skewed positives: log1p where it helps linear models; document why
   - Missing values: impute inside the pipeline (median/most-frequent) + missing-indicator column when missingness may be informative
   - Interactions: add explicitly only where domain logic suggests them (price × quantity, rate × exposure) — trees find most interactions on their own

4. **Build it as a single fitted pipeline — this is the leakage guard**
   - Implement everything as an sklearn `Pipeline`/`ColumnTransformer` (or equivalent in the project's framework): `fit` on train only, `transform` everywhere else. No `fit_transform` on the full dataset, ever
   - Target encoding, aggregations against the target, and any statistic computed from labels must be done **inside cross-validation folds** (e.g., `TargetEncoder` with internal CV) — a target-encoded column computed on the full training set already leaks
   - Entity-level aggregates (customer's average past order) must use only data **before** each row's timestamp — write these as point-in-time joins, not global groupbys
   - The pipeline object is the artifact: it must serialize (joblib) and reproduce identical transforms at serving time

5. **Validate that features actually help**
   - Compare against the pre-feature-engineering baseline with the same CV scheme (see /ml--model-training): keep a feature set only if it beats the baseline meaningfully and consistently across folds
   - Check feature importances / permutation importance for sanity: a new feature dominating everything is a leakage suspect — investigate before celebrating
   - Prune: remove features with ~zero importance; fewer features mean cheaper serving, easier monitoring, fewer drift surfaces

6. **Persist and document**
   - Save the pipeline code to `src/`/the project's module layout (not just a notebook), with the fitted pipeline artifact alongside the data version it was built on
   - Document each engineered feature in one line: definition, source columns, availability at prediction time
   - Hand off: `/ml--model-training` consumes this pipeline; `/ml--model-deployment` must ship the exact same fitted object

**Notes:**
- The cardinal rule: anything learned from data (means, encodings, scalers, imputers, vocabularies) is learned from **train only**
- Do transforms in the pipeline, not in pandas preprocessing scripts — offline/online skew is born in "quick" pandas steps that never make it to serving
- Start simple: raw features + a good tree ensemble is a strong bar; feature engineering must beat it to earn its complexity
- If two features are near-duplicates, keep the one that's cheaper/more reliable to compute in production
- Deep learning on tabular data rarely beats gradient boosting + good features — don't skip this step to go fancy

$ARGUMENTS
