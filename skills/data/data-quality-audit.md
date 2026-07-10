---
description: Audit a dataset or pipeline for nulls, duplicates, drift, and broken references
permissions:
  reads: ["**/*.sql", "**/models/**", "**/migrations/**", "**/*.yml", "**/schema*", "**/*.csv", "**/*.py"]
  writes: ["data_quality_audit_*.sql", "data_quality_audit_*.md"]
  commands: []
  network: false
  destructive: false
---

Audit the quality of a dataset or pipeline output systematically: completeness (nulls and blanks),
uniqueness (duplicate keys), validity (out-of-range and malformed values), referential integrity
(orphaned foreign keys), and drift (volume and distribution shifts over time). Deliver a runnable
SQL audit suite for the detected dialect plus a findings report ranked by business impact.

Steps:

1. **Scope the audit and detect the environment**
   - From `$ARGUMENTS`, identify the target: specific tables, a pipeline's output models, or a file
   - Detect the warehouse dialect and schema the same way `/data--analytics-sql` does: dbt project,
     migrations, DDL dumps, ORM models, connection configs — never invent table or column names
   - For each target table establish: intended grain (one row per what?), primary/natural key,
     foreign keys, and the timestamp column that orders the data — ask if the grain is unclear,
     because every check below depends on it

2. **Generate completeness checks**
   - Per column: null rate, and for strings also blank/whitespace-only and sentinel values
     (`'N/A'`, `'unknown'`, `-1`, `1970-01-01`) which are nulls wearing a disguise
   - Split rates by recent period vs all-time — a column that went from 2% to 40% null last week
     is a pipeline incident, not a data property
   - Flag columns that are 100% null or 100% constant: dead weight or a broken extraction

3. **Generate uniqueness and validity checks**
   - Duplicate detection on the declared key: `GROUP BY key HAVING COUNT(*) > 1` with sample
     offending rows; if duplicates exist, diagnose the pattern (exact copies → loader retries;
     same key different values → missing dedup logic or wrong grain)
   - Validity per column type: numeric ranges (negative quantities, >100% percentages), timestamps
     in the future or before the business existed, enum columns vs their accepted value set,
     malformed emails/IDs via pattern checks
   - Cross-field consistency: `end_date >= start_date`, `total = sum(parts)`, status/timestamp
     agreement (e.g., `status = 'shipped'` but `shipped_at IS NULL`)

4. **Generate referential integrity checks**
   - For every foreign key: orphan count via `LEFT JOIN ... WHERE dim.key IS NULL`, reported as
     count and percentage, with the top offending values (a single magic value like `0` causing 90%
     of orphans is one bug, not systemic rot)
   - Check the reverse where it matters: dimension rows with zero facts when every entity should
     have activity

5. **Generate drift and freshness checks**
   - Volume drift: daily/weekly row counts over the trailing 8-12 periods with period-over-period
     deltas; flag periods deviating hard from the trailing average
   - Distribution drift: for 3-5 business-critical columns, compare recent category shares or
     numeric percentiles (approximate quantiles on big engines) against the prior period
   - Freshness: `MAX(updated_at)` vs now against the pipeline's expected cadence

6. **Run (if possible) and report**
   - Write the full suite to `data_quality_audit_[target]_[YYYY-MM-DD].sql`, one commented section
     per check, each query returning `check_name, status, affected_rows, pct, sample` so results
     paste into one summary
   - If the user runs the queries and shares output, write `data_quality_audit_[target]_[date].md`:
     findings ranked by severity (breaks correctness > breaks trust > cosmetic), likely root cause,
     and a recommended fix per finding
   - Recommend which checks to make permanent — as dbt tests (see `/data--dbt-model`) or as
     contract clauses (see `/data--data-contracts`)

**Notes:**
- An audit without a declared grain is guesswork — get the grain first, everything else follows
- Prefer percentage + trend over absolute counts; 500 nulls means nothing without the denominator and the direction
- Distinguish one-off incidents (bad backfill on one date) from systemic issues (nulls growing weekly) — the fixes differ completely
- This skill writes queries and reports only; it never modifies, deletes, or "fixes" data
- For cleaning a local CSV rather than a warehouse table, use `/data--csv-wrangler`

$ARGUMENTS
