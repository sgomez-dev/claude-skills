---
description: Prepare a dataset for ML — cleaning, splits, leakage checks, balance, versioning
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.csv", "**/*.parquet", "**/*.json", "**/*.yaml", "requirements.txt", "pyproject.toml"]
  writes: ["**/*.py", "data/**", "**/*.md", "**/*.yaml"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Take a raw dataset and turn it into a clean, well-split, leakage-free foundation for modeling.
Most ML failures are data failures — this skill front-loads the checks that prevent them.
Works with tabular, text, and time-indexed data; detect which applies from the data itself.

Steps:

1. **Detect the environment and locate the data** (`$ARGUMENTS`)
   - Find the Python environment (venv, conda, poetry) and installed libs: check `requirements.txt`/`pyproject.toml` for pandas, polars, sklearn, etc. — use what the project already has, don't introduce new dependencies without asking
   - If `$ARGUMENTS` names a file/table, load it; otherwise scan `data/` and the repo for candidate datasets and confirm with the user
   - Ask for the essentials if not stated: **target column** (or unsupervised?), **prediction unit** (one row = one what?), and **when the prediction happens** in the real world (this drives every leakage decision later)

2. **Profile before touching anything**
   - Write a small profiling script (or notebook cell): shape, dtypes, missing rates per column, cardinality of categoricals, duplicates, target distribution, basic stats and outliers on numerics
   - Flag suspicious columns: constant, near-constant, IDs, free-text that looks structured, dates stored as strings, columns whose name suggests post-outcome data (`resolved_at`, `final_status`, `total_paid`)
   - Report findings to the user before cleaning — some "dirt" is signal (missingness can be informative)

3. **Clean deliberately, not aggressively**
   - Fix dtypes and parse dates; standardize category labels (case, whitespace, synonyms)
   - Handle duplicates: exact duplicates usually drop; near-duplicates of the same entity need a decision from the user
   - Missing values: document the strategy per column (keep as-is + indicator, impute, or drop) — but **do not impute yet** if a modeling pipeline will follow; imputation belongs inside the pipeline (see /ml--feature-engineering) so it's fit on train only
   - Never silently drop rows — log every removal with a count and reason

4. **Run leakage checks — the most important step**
   - **Temporal leakage**: any feature computed from data after the prediction moment? Check date columns against the target event date
   - **Target leakage**: features that are proxies for or derived from the target — check near-perfect correlation/mutual information with the target; a single feature with suspiciously high predictive power is a red flag, not a win
   - **Entity leakage**: same customer/patient/device appearing in what will become both train and test — identify the grouping key
   - **Train/serve skew**: features that exist in the historical data but won't be available at prediction time — ask the user column by column if unsure

5. **Split correctly for the problem**
   - Time-indexed data or any deployment where the model predicts the future → **temporal split** (train on past, test on future), never random
   - Repeated entities → **group split** on the entity key (GroupShuffleSplit / GroupKFold)
   - Otherwise → stratified random split on the target
   - Standard: train/val/test (e.g., 70/15/15) — the test set is touched **once**, at the very end of the project. Write the split logic as a reproducible script with a fixed seed, not a one-off cell

6. **Assess class balance and dataset sufficiency**
   - For classification: report class ratios per split; if imbalanced, recommend handling at the modeling stage (class weights, threshold tuning) rather than blind oversampling — and never resample the validation/test sets
   - Sanity-check size: enough positive examples per class and per important segment to evaluate on? If not, say so now — no model fixes insufficient data

7. **Version and document**
   - Save cleaned splits to `data/processed/` in an efficient format (parquet if available), with the prep script that regenerates them from raw
   - If DVC/lakeFS/git-lfs is present in the repo, register the artifacts there; otherwise record a content hash + row counts in a `data/processed/DATASET.md` datasheet: source, prep steps, split strategy, leakage decisions, known limitations
   - Suggest the next step: `/ml--feature-engineering` or straight to `/ml--model-training` for a baseline

**Notes:**
- Raw data is immutable — prep scripts read raw and write processed; never edit raw files in place
- Every cleaning decision must be reproducible from the script; if it was done by hand, it doesn't count
- When in doubt about a column's availability at prediction time, exclude it and note it — a slightly weaker honest model beats a leaky one
- For text/image data the same principles apply: dedupe near-identical items across splits, split by source/author when items cluster
- Keep the test set sacred: no peeking, no iterating on it, no "just one look"

$ARGUMENTS
