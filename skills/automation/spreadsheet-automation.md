---
description: Automate spreadsheets: formulas, Apps Script/openpyxl, imports, validation
permissions:
  reads: ["*.xlsx", "*.xls", "*.csv", "*.gs"]
  writes: ["*.xlsx", "*.csv", "*.gs", "*.py"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Replace manual, error-prone spreadsheet work with a reliable automation — whether that's smarter formulas,
a Google Apps Script, or a Python script — so the report builds itself and the numbers are trustworthy.

Steps:

1. **Understand the current spreadsheet and goal** (`$ARGUMENTS`)
   - Ask for the file (or Google Sheet structure) and what should be automated: recurring import, calculation,
     reformatting, validation, or report generation
   - Detect the platform: Excel, Google Sheets, or a headless file the code produces

2. **Choose the approach**
   - Formula-only (LOOKUP/QUERY/pivot) when the user must keep editing in the sheet
   - Google Apps Script for Google Sheets automation (triggers, menus, scheduled runs)
   - Python (openpyxl/pandas) for headless, version-controlled, testable automation
   Justify the pick by who maintains it and how it runs.

3. **Build the automation**
   Write clean, commented code/formulas. Separate raw input, calculation, and presentation into different
   sheets/ranges so a re-import never clobbers formulas. Parameterize inputs instead of hardcoding cell refs.

4. **Add validation**
   Guard the data: type/format checks, required columns, range/sanity checks, and clear error surfacing for bad
   rows. A report built on silently-wrong input is worse than no report.

5. **Make it repeatable and test it**
   Run against a sample, verify totals against a known-good result, and document how to re-run.
   For scheduled runs, hand off to `/automation--scheduled-tasks`.

**Notes:**
- Keep raw data, logic, and presentation separate — the #1 cause of broken spreadsheets is mixing them
- Validate inputs; spreadsheets fail silently and propagate errors into every downstream cell
- For large or multi-source data, consider `/data--csv-wrangler` or a real database instead

$ARGUMENTS
