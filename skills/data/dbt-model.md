---
description: Generate dbt models with staging/marts layers, tests, and documentation
permissions:
  reads: ["dbt_project.yml", "packages.yml", "models/**", "macros/**", "seeds/**", "**/*.sql", "**/*.yml"]
  writes: ["models/**/*.sql", "models/**/*.yml"]
  commands: ["dbt parse", "dbt ls"]
  network: false
  destructive: false
---

Generate production-quality dbt models following the staging → intermediate → marts layering
convention, complete with schema tests and column documentation. Respect the conventions already
established in this dbt project instead of imposing new ones, and never overwrite an existing model.

Steps:

1. **Detect and read the dbt project**
   - Locate `dbt_project.yml`; read `name`, `model-paths`, folder structure under `models/`, and any
     `+materialized`/`+schema` configs per layer
   - Inspect 2-3 existing models per layer to learn local conventions: naming (`stg_`, `int_`, `fct_`/`dim_`
     vs `mart_`), CTE style (import CTEs at top?), `source()` vs `ref()` usage, yml layout (one file
     per model vs per folder), whether `dbt_utils`/`dbt_expectations` are in `packages.yml`
   - If there is no dbt project, say so and offer to scaffold one (`dbt_project.yml`, `models/staging/`,
     `models/marts/`, a `sources.yml` template) before modeling — confirm first

2. **Clarify the modeling request** (`$ARGUMENTS`)
   - Identify: which source tables feed this, the grain of the final model (one row per what?),
     the entity or process being modeled, and refresh expectations (full refresh vs incremental)
   - If the source isn't declared yet, add it to the appropriate `_sources.yml` with `loaded_at_field`
     and a `freshness` block; never `ref()` a raw table directly

3. **Generate the staging layer**
   - One `stg_<source>__<entity>.sql` per source table, materialized as view unless the project
     says otherwise: rename to snake_case, cast types explicitly, convert timezones to the project
     standard, map magic values to labels, no joins and no aggregation
   - Structure: `with source as (select * from {{ source(...) }}), renamed as (...) select * from renamed`

4. **Generate the marts layer** (and intermediate models if a transformation is reused or complex)
   - Facts (`fct_`): one row per event/process at the declared grain, keyed with a surrogate key
     (`dbt_utils.generate_surrogate_key`) when no reliable natural key exists
   - Dimensions (`dim_`): one row per entity, current attributes (offer SCD2 via dbt snapshots only
     if the user needs history — see `/data--warehouse-schema` for the modeling rationale)
   - For large event tables, propose `materialized='incremental'` with an explicit `unique_key`,
     an `is_incremental()` filter with a small lookback window, and note the late-arriving-data tradeoff

5. **Write tests and documentation**
   - In the model's `.yml`: `description` for every model and every column; `unique` + `not_null`
     on each primary key; `relationships` tests on every foreign key to its dimension;
     `accepted_values` on low-cardinality status/enum columns
   - Add a grain assertion: a `unique` test on the surrogate key or a `dbt_utils.unique_combination_of_columns`
     test on the declared grain — this is the test that catches silent fan-out

6. **Validate and report**
   - Run `dbt parse` (and `dbt ls -s <new models>`) to catch syntax/ref errors — these are local-only
     commands and need no warehouse connection; do not run `dbt run`/`dbt test` (they hit the warehouse)
     — instead print the exact commands the user should run
   - Summarize: files created, the DAG lineage (`source → stg → int → fct/dim`), grain of each model,
     and tests added

**Notes:**
- Follow the project's existing conventions even when they differ from dbt best practice — flag the difference, don't fight it
- Never edit or overwrite an existing model without showing the diff and getting confirmation
- Every mart model must have a stated grain in its yml description; a model whose grain can't be stated in one sentence is modeling two things
- Keep business logic out of staging: staging cleans, marts decide
- Use `/data--metric-definition` output as the source of truth when a mart implements a named business metric

$ARGUMENTS
