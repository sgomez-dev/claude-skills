---
description: Automate a recurring report — data pull, template, schedule, delivery channel
permissions:
  reads: ["package.json", "requirements.txt", "pyproject.toml", "*.py", "*.js", "*.ts", "*.sql", "templates/**", ".env.example"]
  writes: ["reports/**", "templates/**", "*.py", "*.js", "*.ts", "*.sql", ".env.example"]
  commands: ["node", "npm", "python", "pip", "uv"]
  network: true
  destructive: false
---

Turn a report someone builds by hand every week into an automated pipeline: pull the data, render
it into a stable template, run it on a schedule, and deliver it where people already look (email,
Slack, a shared drive). The goal is a report that arrives on time, looks identical every run, and
fails loudly instead of sending wrong numbers.

Steps:

1. **Reverse-engineer the manual report** (`$ARGUMENTS`)
   - Get a copy of the current report (or a description) and list: every metric, its source, the time window, filters, and who receives it when
   - Ask the two questions that shape everything: **cadence** (daily/weekly/monthly, which timezone, before which meeting?) and **channel** (email, Slack, saved file, dashboard link?)
   - Flag metrics with no queryable source — those stay manual or need instrumentation first; don't fake them

2. **Automate the data pull**
   - Detect the stack (`package.json` → Node; `requirements.txt`/`pyproject.toml` → Python; standalone → Python with `pandas` is the default for reporting)
   - Per source: SQL database → parameterized queries in `.sql` files (window as a parameter, never hardcoded dates); REST API → paginated fetch with retries; spreadsheet/CSV exports → see `/automation--spreadsheet-automation`; a portal with no API → last resort, `/automation--browser-automation`
   - All connection strings and API keys via env vars with an `.env.example`; read-only credentials wherever the source supports them
   - Snapshot raw pulled data per run (`reports/data/YYYY-MM-DD/`) so any report can be reproduced and audited later

3. **Validate before rendering** (the step everyone skips and regrets)
   - Sanity checks after the pull: row counts within expected range, no nulls in key fields, totals within N% of last run, freshness (newest record is from the expected window)
   - A failed check **blocks delivery** and alerts the owner — an empty or wrong report sent on time is worse than a late one
   - Compare against the last manual report once, number by number, before trusting the pipeline

4. **Build the template**
   - Match format to channel: **email** → HTML template (jinja2/handlebars) with inline styles, key numbers first, tables under; **Slack** → Block Kit message with 3-5 headline metrics + link to the full file; **file** → xlsx (`openpyxl`/`exceljs`) or PDF; **markdown** → for wikis/repos
   - Template shows: period covered, generated-at timestamp, each metric with comparison vs previous period (Δ and %), and a data-freshness footer
   - Keep layout identical run to run — readers scan by position; charts only if the channel renders them well (static PNG for email)

5. **Schedule it**
   - Wire the run via `/automation--scheduled-tasks`: cron/Task Scheduler/CI scheduled job, timed in the **recipients' timezone** with margin before the moment it's needed (e.g., 06:00 for a 09:00 meeting — leaves room for one retry)
   - One retry with delay on transient failure; on final failure, alert the owner on the same channel the report would have arrived on ("report failed" beats silence)
   - Make runs idempotent: re-running for the same period overwrites/reposts the same period, never duplicates

6. **Deliver and hand off**
   - Email → via SMTP/ESP (machinery in `/automation--email-automation`); Slack → incoming webhook or bot token (env var); drive/folder → dated filename `report_<name>_<YYYY-MM-DD>.<ext>` plus a stable `latest` copy
   - Document: sources and credentials needed, how to change recipients, how to re-run for a past period, what each validation check guards
   - First two weeks: run automated and manual in parallel, then retire the manual one

**Notes:**
- Wrong numbers delivered confidently are the failure mode — validation gates before delivery are not optional
- Parameterize the reporting window; "last 7 days" computed at runtime breaks on month boundaries and timezones — define windows explicitly in the recipients' timezone
- Never embed credentials in queries, templates, or scheduler entries — env vars / secret stores only
- Keep the report short in-channel with a link to depth; nobody reads a 40-row table in Slack
- If recipients keep asking follow-up questions, the report wants to become a dashboard — different tool, say so

$ARGUMENTS
