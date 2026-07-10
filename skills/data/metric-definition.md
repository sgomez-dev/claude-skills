---
description: Define a business metric precisely: formula, grain, filters, edge cases, owner
permissions:
  reads: ["**/*.sql", "**/models/**", "**/*.yml", "**/metrics/**", "**/*.md", "**/schema*"]
  writes: ["metrics/*.md", "metric_*.md"]
  commands: []
  network: false
  destructive: false
---

Turn a loosely named business metric ("active users", "churn", "revenue") into a definition precise
enough that two analysts implementing it independently get the same number. The deliverable is a
single-source-of-truth metric document: exact formula, grain, filters, edge-case rulings, reference
SQL against the real schema, and a named owner — the artifact that ends "whose number is right?"
debates.

Steps:

1. **Capture the metric and its stakes** (`$ARGUMENTS`)
   - Record the metric name, who asked for it, and the decisions it drives — a metric used for
     bonuses or board reporting needs stricter edge-case rulings than an exploratory one
   - Search the repo for existing definitions before writing a new one: dbt `metrics`/semantic
     layer yml, `metrics/` docs, mart models with the metric's name, prior `/data--metric-definition`
     outputs. If one exists, update it (with a changelog entry) rather than forking a rival truth

2. **Nail the formula and grain**
   - Write the formula as numerator / denominator (or plain aggregate) using real table.column
     references — detect the schema and dialect as `/data--analytics-sql` does; never invent columns
   - Declare the grain explicitly: measured per what (user, account, order) and per time period
     (day, week, month)? Calendar or rolling window? Which timezone anchors the period boundary?
   - For ratio metrics, pin the denominator population precisely — "churn rate" disputes are
     almost always denominator disputes (churned this month / active at month start? / ever active?)

3. **Specify filters and the counted population**
   - List every inclusion/exclusion rule with its column-level test: internal/test accounts,
     unpaid tiers, deleted/anonymized records, specific statuses, minimum-activity thresholds
   - For each filter, state the *why* — filters without rationale get silently dropped by the next
     implementer

4. **Rule on the edge cases**
   - Walk the classics and record an explicit ruling for each, even when the ruling is "ignore":
     refunds and cancellations (net or gross?), late-arriving data (does yesterday's number get
     restated?), timezone boundary events, entities changing segment mid-period, nulls in the
     numerator source, partial current period (report, exclude, or annotate?), currency conversion
     (which rate, which date?)
   - Each ruling is one line: *case → decision → rationale*. Ask the user only where the ruling
     genuinely changes the number and no convention exists

5. **Write the reference SQL and validation**
   - Provide the canonical query in the detected dialect, CTE-structured with the filters visible
     as named CTEs so the definition is legible in the code itself
   - Include 2-3 sanity checks: expected order of magnitude, invariants (rate between 0 and 1,
     weekly sum vs monthly value relationship), and a comparison query against any existing report
     the business already trusts — reconcile or explain every discrepancy

6. **Assign governance and deliver**
   - Record: owner (a person or team who arbitrates disputes), review cadence, downstream
     consumers (dashboards, reports), and a versioned changelog (definition changes restate history
     — say whether backfill is required)
   - Write `metrics/[metric-slug].md` with sections: Definition (one sentence), Formula, Grain,
     Filters, Edge-case rulings, Reference SQL, Validation, Owner & changelog
   - If the project has a dbt semantic layer, offer the equivalent yml entry alongside

**Notes:**
- Precision beats elegance: a definition with ten ugly explicit rulings outperforms a clean one that two people read differently
- The reference SQL is the contract — prose and query must agree, and the query wins ties
- One metric per document; "revenue" and "recognized revenue" are different metrics, not variants
- Changing a definition without a changelog entry and a restatement decision is how trust in data dies
- Downstream, `/data--analytics-sql` and `/data--dbt-model` reuse these definitions verbatim; `/data--dashboard-spec` references them per chart

$ARGUMENTS
