---
description: Define data contracts between producers and consumers: schema, SLAs, versioning
permissions:
  reads: ["**/*.yml", "**/*.json", "**/*.sql", "**/models/**", "**/schemas/**", "**/*.proto", "**/*.avsc", "**/*.py"]
  writes: ["contracts/**/*.yml", "contracts/**/*.md", "data_contract_*.yml"]
  commands: []
  network: false
  destructive: false
---

Define an explicit data contract for a dataset that crosses a team or system boundary: the schema
consumers can rely on, the semantic guarantees behind each field, the SLAs (freshness,
completeness, availability), and the versioning rules that govern change. The deliverable is a
machine-readable YAML contract plus enforcement hooks, replacing "the pipeline broke because
upstream renamed a column" with a reviewable, versioned agreement.

Steps:

1. **Identify the interface and its parties**
   - From `$ARGUMENTS`, pin down: the dataset (table, topic, file feed, API extract), the producer
     (owning team/service), and the known consumers with what each depends on — a contract with no
     named consumer is documentation, not a contract
   - Detect existing schema sources to build from rather than restate by hand: warehouse DDL, dbt
     model yml, protobuf/Avro/JSON Schema files, ORM models — the contract must match deployed
     reality on day one

2. **Specify the schema with semantics, not just types**
   - Per field: name, type, nullability, and constraints (enum values, ranges, formats, uniqueness)
   - Per field, one line of *meaning*: units, timezone, whether monetary values are gross or net,
     what NULL means here — type-level agreement with semantic-level drift is how contracts fail
     silently
   - Declare dataset-level guarantees: grain (one row per what), primary key, ordering/partitioning
     consumers may rely on, and PII/sensitivity classification per field with handling expectations

3. **Define the SLAs — only ones the producer can actually meet**
   - Freshness: data available within N of the source event, measured against a named timestamp
     column; state the delivery schedule and the late-data policy (are restatements allowed, and
     how far back?)
   - Completeness/quality: which quality checks are guaranteed (key uniqueness, FK validity, null
     ceilings on critical fields) — align with `/data--data-quality-audit` checks so the SLA is
     testable, not aspirational
   - Availability and support: where the data lives, retention window, who to page, and the
     response expectation when the contract is breached
   - Derive numbers from observed history where possible; an SLA the producer never met is a
     future incident report

4. **Set the versioning and evolution rules**
   - Classify changes: **non-breaking** (add nullable field, widen an enum the consumers treat as
     open, relax a constraint) ship with a minor version bump and a notification; **breaking**
     (remove/rename a field, change type or grain, tighten nullability) require a major version,
     a migration window with old and new versions running in parallel, and consumer sign-off
   - Define the deprecation process: announcement channel, minimum notice period, and how the
     sunset date is recorded in the contract itself
   - The contract file is versioned in git; changes arrive as pull requests reviewed by producer
     and consumers — the PR discussion is the negotiation record

5. **Wire up enforcement**
   - A contract nobody checks is a wish. Generate the hooks that fit the detected stack:
     dbt sources with `freshness` blocks and schema tests mirroring the constraints; a CI step
     that diffs the contract YAML against the live DDL/model schema and fails on undeclared
     changes; pipeline validation gates (see `/data--etl-pipeline`) that assert the contract
     before loading
   - Every SLA gets a corresponding check with an owner for its alert — list any guarantee that
     currently has no way to be verified as an explicit gap

6. **Deliver the contract package**
   - Write `contracts/[dataset-slug].yml` with sections: `info` (dataset, version, owner,
     consumers), `schema` (fields with types, constraints, descriptions), `guarantees` (grain,
     keys, SLAs), `versioning` (policy, changelog), `enforcement` (checks and where they run) —
     follow the Open Data Contract Standard field naming where it fits naturally
   - Add a short `contracts/[dataset-slug].md` summary for humans: what you can rely on, what you
     cannot, and how to request a change
   - Summarize the gaps found between current reality and the proposed guarantees — closing those
     is the producer's first action item

**Notes:**
- Contract what consumers actually depend on, not everything the producer emits — over-scoped contracts calcify pipelines
- The producer owns the contract; consumers own declaring their dependencies — a contract imposed by consumers alone will be ignored
- Semantic drift (same column, new meaning) is the failure mode schema checks miss — that is what the per-field meaning lines are for
- This skill writes contract files and check definitions only; it never modifies producer pipelines or data
- Pair with `/data--data-quality-audit` to baseline current quality before committing to SLAs, and `/data--warehouse-schema` when the contracted dataset needs proper modeling

$ARGUMENTS
