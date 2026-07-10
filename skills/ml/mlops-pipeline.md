---
description: Set up MLOps — experiment tracking, model registry, CI for models, reproducibility
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.yaml", "**/*.toml", "**/*.cfg", "requirements.txt", "Dockerfile", ".github/**", "Makefile"]
  writes: ["**/*.py", "**/*.yaml", "**/*.toml", ".github/**", "Makefile", "**/*.md", "Dockerfile"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Give an ML project the operational backbone it needs: any past result can be reproduced, every
experiment is tracked and comparable, models are promoted through a registry rather than copied
around, and CI catches broken training code and degraded models before they ship. Right-size the
setup to the team — a solo project needs files and discipline, not a platform.

Steps:

1. **Audit what exists** (`$ARGUMENTS`)
   - Detect the Python env and any MLOps tooling already present: MLflow, W&B, DVC, ClearML, kubeflow configs, existing CI workflows (`.github/workflows/`), Makefile targets, Dockerfiles
   - Map the current workflow: where do training code, data, params, and model files live? How was the current "best model" produced — could anyone rebuild it today?
   - Score the gaps against the four pillars (reproducibility, tracking, registry, CI) and agree on scope with the user — extend what's installed rather than replacing it

2. **Make training reproducible — the foundation everything else stands on**
   - Pin the environment: lock file (`requirements.txt` with versions, poetry/uv lock) and, if serving is containerized, a Dockerfile that matches
   - Extract every magic number into a versioned config file (YAML/TOML): data path + version, features, model params, seeds, split scheme
   - Turn notebook training into a CLI entrypoint (`python -m src.train --config configs/xxx.yaml`) — notebooks explore, scripts produce artifacts
   - Version data: DVC if it fits the team, otherwise immutable snapshot paths + content hashes recorded per run (see /ml--dataset-prep)
   - Acceptance test: a colleague on a clean machine reproduces the current model's metrics from README instructions alone

3. **Add experiment tracking**
   - Prefer the tracker already in the repo; default to local MLflow (`mlflow.set_tracking_uri("file:./mlruns")` — zero infrastructure) if none
   - Log per run, automatically from the training entrypoint: config, git commit (fail or warn if the working tree is dirty), data version/hash, CV and holdout metrics, key plots, and the model artifact
   - Convention: one run per training execution, honest names, failed runs kept — a tracker where only successes are logged rewrites history
   - Backfill the current production/best model as run #1 so future comparisons have an anchor

4. **Set up a model registry and promotion flow**
   - Use the tracker's registry (MLflow model registry) or, minimally, a `models/` layout with versioned directories + a `registry.md` index — never `model_final_v2_REAL.pkl`
   - Each registered version carries: source run link, data version, metrics vs the incumbent, and a stage (`staging` → `production` → `archived`)
   - Promotion is an explicit, recorded action with a criteria checklist (evaluation report from `/ml--model-evaluation` attached), not a file copy
   - Serving code (see /ml--model-deployment) loads by registry stage/version, so rollback = repointing a stage

5. **Wire CI for the ML-specific failure modes**
   - Standard CI first: lint + unit tests on preprocessing and feature code (pure functions are testable — test them)
   - **Pipeline smoke test** on every PR: train on a tiny fixture dataset (seconds, not hours) to catch broken imports, schema drift, and shape errors
   - **Data validation** step: schema + ranges + null-rate checks on incoming data (pandera/Great Expectations if installed, plain asserts otherwise)
   - **Model regression gate** (on demand or scheduled, not necessarily per-PR): full train + eval, compare primary metric against the registered production model with a tolerance band — fail the pipeline on degradation
   - Keep CI honest about cost: smoke tests per PR, expensive retrains on schedule or label

6. **Document the loop and hand off**
   - Write a short `docs/ml-workflow.md`: how to run an experiment, where results land, how to compare runs, how promotion works, how to roll back
   - Define retraining triggers (calendar, data volume, drift alert from `/ml--model-deployment` monitoring) and who/what approves promotion
   - Leave one worked example: a tracked run, registered and promoted, referenced from CI — a template beats a page of prose

**Notes:**
- Right-size ruthlessly: local MLflow + git + a lock file covers a solo project; don't install a feature store because a blog post did
- The git commit + data version + config + seed quadruple is the minimum identity of any experiment — if one is missing, the run is not reproducible
- Never let training code and serving code drift apart: shared feature pipeline module, one source of truth (see /ml--feature-engineering)
- CI that takes 3 hours per PR gets disabled within a month — fixture-sized smoke tests are the sustainable default
- Track failures too; the most expensive experiment is the one you unknowingly run twice

$ARGUMENTS
