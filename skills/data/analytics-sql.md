---
description: Turn a plain-language question into optimized analytical SQL for your schema
permissions:
  reads: ["**/*.sql", "**/migrations/**", "**/models/**", "**/*.yml", "**/schema*", "**/*.prisma", "**/*.py"]
  writes: ["analytics_*.sql", "queries/*.sql"]
  commands: []
  network: false
  destructive: false
---

Translate a business question written in plain language into correct, readable, and performant
analytical SQL against the actual schema of this project — not a generic imaginary one. Detect the
warehouse/database dialect, ground every column reference in real schema evidence, and deliver a
runnable query with an explanation of what it does and where it could be wrong.

Steps:

1. **Detect the dialect and schema source**
   - Scan the repo for schema evidence, in priority order: dbt project (`dbt_project.yml`, `models/`),
     migration files (Django, Rails, Alembic, Flyway, Prisma, raw `.sql`), ORM model definitions,
     `schema.sql`/DDL dumps, and existing queries in the codebase
   - Infer the dialect from config: `profiles.yml`, connection strings, drivers in dependency files
     (`psycopg2` → Postgres, `google-cloud-bigquery` → BigQuery, `snowflake-connector` → Snowflake,
     `duckdb` → DuckDB, etc.)
   - If no schema evidence exists in the repo, ask the user to paste the relevant `CREATE TABLE`
     statements or table/column names — **never invent table or column names**

2. **Restate the question as a measurable definition**
   - Rewrite the plain-language question as: metric(s) + grain + time window + filters + segments
   - Example: "how are signups doing?" → "count of distinct users with a `created_at` in the last
     12 complete weeks, weekly grain, excluding internal/test accounts, split by acquisition channel"
   - Surface ambiguities explicitly (which timestamp? which status values count? timezone?) and ask
     only the questions that change the result; if a metric is already defined via `/data--metric-definition`
     output in the repo, reuse that definition verbatim

3. **Write the query with CTE structure**
   - Structure: one CTE per logical step (filtered base → joins → aggregation → final select),
     each with a one-line comment saying what it produces
   - Use dialect-correct syntax: date functions (`DATE_TRUNC` vs `DATE_BUCKET`), quoting, `QUALIFY`
     availability, division semantics (guard against integer division and divide-by-zero with `NULLIF`)
   - Handle the classic traps deliberately: fan-out from one-to-many joins (pre-aggregate before
     joining), NULL behavior in `NOT IN` and aggregates, incomplete current period (flag or exclude it),
     timezone of timestamp columns

4. **Optimize for the detected engine**
   - Filter early on partition/cluster keys (BigQuery partition column, Snowflake clustering,
     Postgres indexed columns visible in migrations); never wrap a filtered column in a function if it
     defeats pruning — rewrite the predicate instead
   - Select only needed columns (matters on columnar engines); replace self-joins with window
     functions where the dialect supports it
   - If the user reports an existing slow query, ask for the `EXPLAIN` output and rewrite based on
     the actual plan rather than guessing

5. **Deliver and verify**
   - Output the final query in a fenced `sql` block, plus a short "How to read the result" section
     and a "Caveats" list (assumptions made, edge cases that could skew numbers)
   - Provide a cheap **sanity-check query** alongside (e.g., row counts of the base CTE, min/max of
     the date range) so the user can validate before trusting the numbers
   - If the user wants it saved, write to `analytics_[question-slug].sql` with the question and
     assumptions as a header comment — do not modify any existing file

**Notes:**
- Correctness beats cleverness: a query that is 20% slower but obviously right wins
- Never fabricate schema — every table and column in the query must come from repo evidence or the user
- Prefer ANSI-portable SQL; use dialect-specific features only when they clearly improve the query, and say so
- For retention/funnel questions, suggest `/data--cohort-analysis` or `/data--funnel-analysis` which build the full analysis
- This skill writes SQL only; it does not connect to any database — the user runs the query themselves

$ARGUMENTS
