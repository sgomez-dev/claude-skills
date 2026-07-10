---
description: Build a conversion funnel: step definitions, drop-off SQL, insights template
permissions:
  reads: ["**/*.sql", "**/models/**", "**/migrations/**", "**/*.yml", "**/schema*", "**/*.prisma", "**/*.py"]
  writes: ["funnel_*.sql", "funnel_*.md"]
  commands: []
  network: false
  destructive: false
---

Build a conversion funnel analysis against the project's real event schema: define the ordered
steps, measure how many entities reach each one, locate where they drop off, and break the losses
down by segment. Deliver runnable SQL in the detected dialect plus an insights template that turns
the numbers into a prioritized list of fixes.

Steps:

1. **Detect schema and dialect**
   - Locate the event/activity tables via repo evidence (dbt models, migrations, DDL, tracking
     plans from `/data--event-tracking-plan`); identify event name/type columns, timestamps, and
     the entity key — never invent them, ask if nothing exists in the repo
   - Note dialect features that shape the SQL: window function support (universal), `QUALIFY`
     (BigQuery/Snowflake/DuckDB), date diff functions

2. **Define the funnel precisely** (`$ARGUMENTS`)
   - Steps: 3-7 ordered events from entry to conversion, each mapped to a concrete event
     name/condition in the real data; if a step has no tracked event, flag the gap instead of
     substituting a proxy silently
   - Ordering rule: strict sequence (step N+1 counts only after step N's timestamp) — default,
     prevents "converted before entering" nonsense — vs any-order arrival; state the choice
   - Scope: per user or per session? Conversion window (same session, 7 days, 30 days)? Entry
     population and date range? Timezone?
   - Counting: first attempt per entity (default) vs all attempts — re-attempt funnels need the
     all-attempts variant, at session grain

3. **Write the funnel SQL**
   - CTE per step: entities with the step event inside the window, keeping
     `MIN(event_timestamp)` as the step time; each subsequent CTE joins the previous and requires
     `step_n_ts >= step_n_minus_1_ts` to enforce the sequence
   - Final summary: one row per step with `entities_reached`, `pct_of_entry`,
     `pct_of_previous_step` (the drop-off rate — the number that matters), all divisions guarded
     with `NULLIF`
   - Add median time-between-steps per transition (percentile function per dialect) — a step with
     good conversion but a huge time lag is still a bottleneck
   - Include a drill-down query: sample entities that reached step N but not N+1, with their last
     events, for qualitative inspection

4. **Add segment breakdowns**
   - Re-run the summary grouped by 2-3 segments that could explain drop-off (acquisition channel,
     device/platform, plan tier, cohort month) — pick from columns that actually exist
   - Compute each segment's per-step conversion vs the overall baseline; a step that converts at
     60% overall but 20% on mobile is a mobile bug, not a funnel property

5. **Sanity-check the shape**
   - Counts must be monotonically non-increasing across steps — a step with more entities than its
     predecessor means the ordering rule or event mapping is wrong; fix before interpreting
   - Verify the entry population matches an independent count (e.g., signups in the same range)
     and that the window doesn't truncate recent entrants who haven't had time to convert —
     exclude entities entering within one conversion-window of "now" or flag them

6. **Deliver SQL plus the insights template**
   - Write `funnel_[name-slug].sql` with the funnel definition as a header comment, and
     `funnel_[name-slug].md` with a pre-structured insights template: overall conversion, the
     table of per-step rates, **biggest absolute loss** (rate × volume — a 5% leak on 100k entities
     beats a 50% leak on 200), time-to-convert outliers, segment gaps vs baseline, and a
     hypothesis + suggested experiment per top finding
   - Recommend which numbers to watch continuously (the top drop-off step) via `/data--dashboard-spec`

**Notes:**
- Prioritize by absolute entities lost, not percentage — percentages hide where the volume is
- Recent entrants who haven't had time to convert are the most common source of fake funnel decline
- A funnel measures the tracked path, not user intent; pair the biggest drop-off with session-level qualitative inspection before shipping fixes
- This skill writes SQL and docs only; the user runs the queries against their warehouse
- For return behavior over time rather than step completion, use `/data--cohort-analysis`; missing step events go to `/data--event-tracking-plan`

$ARGUMENTS
