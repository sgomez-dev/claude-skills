---
description: Spec a dashboard: audience, key questions, metrics, chart types, and layout
permissions:
  reads: ["**/*.sql", "**/models/**", "**/*.yml", "**/*.lkml", "**/schema*", "**/*.prisma", "**/*.md"]
  writes: ["dashboard_*.md", "specs/dashboard_*.md"]
  commands: []
  network: false
  destructive: false
---

Produce a complete dashboard specification before anyone opens a BI tool: who it serves, which
decisions it supports, exactly which metrics answer which questions, the right chart type for each,
and a layout that reads top-left to bottom-right in order of importance. The output is a markdown
spec a data engineer or analyst can implement in any BI tool without further meetings.

Steps:

1. **Pin down the audience and the decisions** (`$ARGUMENTS`)
   - Identify: who looks at this dashboard, how often, and what they *decide or do* after looking
   - Rewrite vague goals as decision statements: "monitor sales" → "spot regions trending below
     quota early enough to reallocate pipeline this quarter"
   - One dashboard, one audience. If the request mixes exec overview with operational drill-down,
     propose splitting into two specs and confirm before continuing

2. **Detect the data reality**
   - Scan the repo for what actually exists: dbt models/marts, warehouse DDL, existing BI configs
     (`.lkml`, Metabase/Superset exports), and metric definitions from `/data--metric-definition`
   - Note the warehouse dialect and the grain/freshness of candidate source tables — a "real-time
     ops dashboard" on a daily-batch mart is a spec-level bug, catch it here
   - If no schema evidence exists, ask for table names or mark each metric's source as
     `TBD — needs source` rather than inventing tables

3. **Derive the question → metric map**
   - List 4-8 questions the audience needs answered, ordered by importance; more than ~8 means the
     dashboard lacks focus — cut or split
   - For each question define the metric(s) that answer it: name, formula sketch, grain, time
     window, comparison baseline (vs prior period, vs target, vs cohort)
   - Reuse existing metric definitions verbatim where they exist; flag any metric that needs a
     proper definition and suggest running `/data--metric-definition` for it

4. **Choose chart types deliberately**
   - Match form to question: trend over time → line; comparison across categories → horizontal bar;
     part-of-whole at one point → stacked bar (avoid pies beyond 3 slices); single KPI with context
     → number tile with delta and sparkline; distribution → histogram; two-metric relationship → scatter
   - Specify per chart: axes, units, sort order, expected series count, and what "good" looks like
     (target line, threshold band) so anomalies are visible without reading numbers
   - Define global filters (date range, segment) and which charts they apply to

5. **Lay out the page**
   - Sketch the grid in markdown (rows × columns): KPI tiles across the top answering "are we
     okay?", trends in the middle answering "which way is it going?", breakdowns at the bottom
     answering "where exactly?"
   - Annotate each slot with the question it answers — any slot without a question gets cut
   - State refresh cadence, expected load time budget, and mobile/print considerations if relevant

6. **Deliver the spec**
   - Write `dashboard_[name-slug].md` containing: audience & decisions, question→metric table,
     per-chart specs, layout sketch, filters, data sources with grain/freshness, and open questions
   - Include a "Definition of done" checklist the implementer can verify against
   - Where source tables exist, include a starter query per chart (or point to
     `/data--analytics-sql` to generate them against the real schema)

**Notes:**
- Every chart must answer a named question for the named audience; decoration is scope creep
- Prefer fewer, denser, well-chosen charts over exhaustive coverage — the spec should fit one screen per audience
- Specify comparison context (target, prior period) for every KPI; a number without a baseline is trivia
- This skill writes the spec only; it does not connect to a BI tool or database
- Pair with `/data--metric-definition` for contested metrics and `/data--analytics-sql` for the queries

$ARGUMENTS
