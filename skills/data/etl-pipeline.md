---
description: Scaffold an idempotent ETL/ELT pipeline for your stack with error handling
permissions:
  reads: ["**/*.py", "**/*.yml", "**/*.toml", "**/*.json", "**/*.sql", "**/dags/**", "**/pipelines/**", "**/models/**"]
  writes: ["pipelines/**", "dags/**", "etl/**", "**/*.py", "**/*.sql", "**/*.yml"]
  commands: ["python -m py_compile", "python -m pytest --collect-only"]
  network: false
  destructive: false
---

Scaffold a production-grade ETL or ELT pipeline that matches the tools already in this repo instead
of imposing a new framework. The scaffold is safe to re-run (idempotent), fails loudly with context
(structured errors, no silent partial loads), and separates extract, transform, and load so each
stage is testable alone. Output is runnable code plus the config and run instructions.

Steps:

1. **Detect the stack — do not assume one**
   - Orchestrator: look for Airflow (`dags/`, `airflow.cfg`), Dagster (`definitions.py`,
     `dagster.yaml`), Prefect (`@flow`), dbt (`dbt_project.yml` → ELT, transforms belong in dbt),
     cron scripts, or nothing
   - Language and libs from dependency files: `pandas`/`polars`/`duckdb`/`sqlalchemy`/`dlt` in
     Python projects, or a Node/other stack — follow what exists
   - Warehouse dialect from drivers and configs (Postgres, BigQuery, Snowflake, DuckDB…)
   - If the repo is empty of data tooling, propose the lightest fit (plain Python + DuckDB for
     local, or dbt if transforms dominate) and confirm before scaffolding

2. **Define the pipeline contract** (`$ARGUMENTS`)
   - Pin down: source (API, DB, files), target table(s) and their grain, load pattern (full
     refresh vs incremental), expected volume, schedule, and what "late" means for this data
   - For incremental loads, choose the watermark: an `updated_at` cursor, an append-only ID, or
     CDC — and decide the late-arriving-data lookback window explicitly
   - If a `/data--data-contracts` contract exists for the source or target, honor its schema and
     SLAs; if not, suggest creating one

3. **Scaffold the structure with idempotency built in**
   - Layout: `extract` → `transform` → `load` as separate modules/functions; config (connections,
     table names, watermark) in one config file or env vars, never inline
   - Idempotency by design, pick per load pattern: full refresh → write to staging table then
     atomic swap/`CREATE OR REPLACE`; incremental → `MERGE`/upsert on a declared unique key, or
     delete+insert of the affected partition — re-running any day twice must produce identical state
   - Persist the watermark only *after* a successful load, in the target or a state table — never
     in a local file that drifts from reality
   - Land raw extracted data before transforming (staging area or raw table) so transforms can be
     replayed without re-extracting

4. **Build in error handling and observability**
   - Retries with backoff on transient extract/load failures; no retry on data errors — those fail
     the run with the offending sample rows in the error message
   - Validation gates between stages: row count > 0 (or explicitly expected empty), schema matches
     expectation, key uniqueness — fail before loading bad data, not after
   - Structured logging per stage: rows in, rows out, duration, watermark before/after; a final
     run summary line that a human or alert can parse
   - Dead-simple failure semantics: a failed run leaves the target exactly as the last successful
     run did (that is what the staging-swap and transactional merge buy you)

5. **Add tests and a dry-run path**
   - Unit tests for transform logic on small fixture data (the transforms are pure functions — the
     scaffold makes them so); a `--dry-run` flag that extracts and validates but skips the load
   - Verify the scaffold compiles: `python -m py_compile` on generated modules (or the stack's
     equivalent) — do not execute the pipeline itself, it needs credentials you should not touch

6. **Deliver with run instructions**
   - Summarize files created, the data flow diagram (source → raw → transform → target), the
     idempotency mechanism chosen and why, and the exact commands to: run locally, dry-run,
     backfill a date range, and schedule it in the detected orchestrator
   - List the credentials/env vars the user must provide — the scaffold reads them from env/config
     and never contains secrets

**Notes:**
- Idempotency is non-negotiable: every design decision above assumes the pipeline will be re-run after a partial failure, because it will
- Follow the repo's existing pipeline conventions even when they differ from these defaults — flag, don't fight
- ELT beats ETL when a warehouse and dbt exist: extract-load thin, transform in `/data--dbt-model`
- This skill never runs the pipeline against real systems and never handles credentials — it scaffolds code the user runs
- Backfills are first-class: parametrize every run by date/window from day one, not as a retrofit

$ARGUMENTS
