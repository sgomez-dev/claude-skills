---
description: Build a cohort retention analysis: runnable SQL plus an interpretation guide
permissions:
  reads: ["**/*.sql", "**/models/**", "**/migrations/**", "**/*.yml", "**/schema*", "**/*.prisma", "**/*.py"]
  writes: ["cohort_*.sql", "cohort_*.md"]
  commands: []
  network: false
  destructive: false
---

Build a complete cohort retention analysis against the project's real schema: group entities by
when they started, track whether they came back in each subsequent period, and produce the classic
retention triangle — as runnable SQL in the detected dialect, plus a guide explaining how to read
the triangle and which patterns are artifacts rather than insights.

Steps:

1. **Detect schema and dialect**
   - Find the tables the same way `/data--analytics-sql` does: dbt models, migrations, DDL, ORM
     definitions; identify the entity table (users, accounts) and the activity/event table with
     their timestamp columns — never invent names; ask if the repo has no schema evidence
   - Note dialect specifics you will need: `DATE_TRUNC` vs `DATE_BUCKET`, date diff functions
     (`DATE_DIFF`/`DATEDIFF`/subtraction), and `PIVOT` availability

2. **Define the cohort precisely** (`$ARGUMENTS`)
   - Cohorting event: what puts an entity in a cohort — signup, first purchase, first key action?
     (First *value moment* usually beats signup for product questions)
   - Cohort grain: weekly for fast-moving products, monthly for slower ones; confirm timezone for
     period boundaries
   - Retention event: what counts as "came back" — any event, or a meaningful action? Bare logins
     flatter the curve; pick the event tied to value
   - Retention type: classic n-period retention (active *in* period N) vs unbounded (active in
     period N *or later*); default to classic and say so

3. **Write the cohort SQL**
   - CTE structure, one comment per step:
     `cohorts` — first qualifying event per entity, truncated to cohort period;
     `activity` — distinct entity-periods with a qualifying retention event;
     `joined` — activity joined to cohorts with `period_number` = date difference in cohort-grain
     units; `retention` — `COUNT(DISTINCT entity)` per cohort per period_number, plus cohort size
     at period 0
   - Output both absolute counts and rates (`retained / cohort_size`, guarded with `NULLIF`);
     exclude or clearly flag the incomplete current period — it always looks like a cliff
   - Provide the triangle pivot: conditional aggregation (`COUNT(DISTINCT CASE WHEN period_number = 1
     THEN entity END)`, …) for portability, or the dialect's `PIVOT` if cleaner, cohorts as rows
     and periods as columns

4. **Add sanity checks**
   - Cohort sizes sum to total qualifying entities (no double-cohorting); period 0 retention is
     100% by construction — if not, the cohorting and retention events disagree, fix before reading
     anything else
   - Spot-check one entity end-to-end: its cohort assignment and each period flag, as a small
     debug query included in the file

5. **Deliver SQL plus the interpretation guide**
   - Write `cohort_[definition-slug].sql` with the definition and assumptions as a header comment
   - Write `cohort_[definition-slug].md` covering how to read the triangle: **down a column** =
     are newer cohorts retaining better (the product-improvement signal); **across a row** = one
     cohort's lifecycle and where it flattens (the plateau is your long-term retention rate);
     diagonal patterns = calendar events (outages, seasonality) hitting all cohorts at once
   - List the artifact traps explicitly: incomplete last periods, small-cohort noise (< ~100
     entities → show counts, not just rates), definition changes mid-history, timezone-boundary
     bleed, and acquisition-mix shifts masquerading as retention changes

**Notes:**
- The retention event choice drives the whole result — a flattering curve from a weak event is worse than useless
- Always plot rates but keep counts one query away; small denominators make impressive-looking percentages
- A flattening curve is the finding: the plateau height, and whether newer cohorts plateau higher, is what leadership actually needs
- This skill writes SQL and docs only; the user runs the queries against their warehouse
- For step-based conversion rather than return behavior, use `/data--funnel-analysis`; to formalize "retention" as a metric, use `/data--metric-definition`

$ARGUMENTS
