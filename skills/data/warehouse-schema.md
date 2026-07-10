---
description: Design a star/snowflake warehouse schema with fact and dimension tables
permissions:
  reads: ["**/*.sql", "**/models/**", "**/migrations/**", "**/*.yml", "**/schema*", "**/*.prisma", "**/*.py"]
  writes: ["warehouse_schema_*.sql", "warehouse_schema_*.md", "ddl/*.sql"]
  commands: []
  network: false
  destructive: false
---

Design a dimensional warehouse schema — star by default, snowflaked only where justified — from the
business processes the user needs to analyze. The deliverable is dialect-correct DDL, an entity
diagram, and a design document that states the grain of every fact table in one sentence, because a
fact table whose grain can't be stated is two tables in a trench coat.

Steps:

1. **Detect the engine and current state**
   - Identify the warehouse dialect from repo evidence (drivers, `profiles.yml`, connection
     strings, existing DDL) — the physical design in step 5 depends on it; ask if ambiguous
   - Inventory what already exists: OLTP schema (migrations, ORM models) as the source shape, and
     any existing marts or dimensional tables whose conventions (naming, key style) you must match
   - Clarify from `$ARGUMENTS` the business processes to model and the questions the schema must
     answer cheaply — the questions decide the design, not the source tables

2. **Declare the fact tables and their grain**
   - One fact table per business process (order placed, payment captured, page viewed, ticket
     resolved); for each, write the grain declaration first: "one row per ___ per ___"
   - Classify each fact: transactional (one row per event), periodic snapshot (one row per entity
     per period — for balances/inventory), or accumulating snapshot (one row per process instance
     with milestone timestamps — for funnels with defined stages)
   - List the measures per fact and their additivity: fully additive (amounts, counts),
     semi-additive (balances — never SUM across time), non-additive (rates — store components, not
     the ratio)

3. **Design the dimensions**
   - Extract the who/what/where/when of each fact into dimensions: customer, product, date, and
     the domain-specific ones; conform dimensions shared across facts (one `dim_customer`, not
     three) so cross-process analysis joins cleanly
   - Decide slowly-changing behavior per dimension attribute honestly: Type 1 overwrite for
     corrections, Type 2 row-versioning (`valid_from`/`valid_to`/`is_current`) only for attributes
     where "as it was then" analysis is genuinely needed — SCD2 everywhere is a maintenance tax
   - Include an explicit `dim_date` with fiscal/holiday attributes; handle unknowns with a `-1`
     "Unknown" dimension row rather than NULL foreign keys

4. **Choose star vs snowflake and the key strategy**
   - Default to star: denormalize dimension hierarchies (category → subcategory flattened into
     `dim_product`) — storage is cheap, joins at query time are not
   - Snowflake only with a stated reason: a very large dimension with a frequently-updated
     sub-entity, or a hierarchy shared verbatim across several dimensions
   - Surrogate keys on every dimension (integer sequence or hash per house style), natural key
     kept as an attribute with a uniqueness expectation; facts carry only surrogate keys and
     degenerate dimensions (order number)

5. **Write the physical DDL for the detected dialect**
   - Generate `CREATE TABLE` statements with correct types per engine; apply the engine's physical
     levers: BigQuery partition (on the fact's date) + clustering keys, Snowflake clustering on
     large facts, Postgres indexes on FK columns and date, DuckDB/columnar engines mostly need
     nothing — say so instead of cargo-culting indexes
   - Declare constraints per engine reality: real FK constraints where enforced (Postgres),
     informational/`NOT ENFORCED` where not (BigQuery, Snowflake) — and note that unenforced
     constraints need tests instead (see `/data--data-quality-audit`)

6. **Deliver the design package**
   - Write `warehouse_schema_[domain].sql` (DDL, one commented section per table) and
     `warehouse_schema_[domain].md`: grain declarations, a mermaid ER diagram, bus matrix
     (facts × conformed dimensions), SCD decisions with rationale, and 3-5 example queries proving
     the target questions are one-join-deep
   - Flag open modeling questions (grain disputes, SCD candidates) rather than deciding silently

**Notes:**
- The grain declaration is the design; everything else is consequences — never add a measure that violates the declared grain
- Design for the questions asked, not for the source system's shape; the OLTP schema is input, not a template
- Conformed dimensions are what make a warehouse a warehouse instead of a pile of marts
- This skill designs and writes DDL files only; it never executes DDL against a database
- Implement the loading logic with `/data--dbt-model` or `/data--etl-pipeline`; define the metrics on top with `/data--metric-definition`

$ARGUMENTS
