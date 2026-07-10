---
description: Clean, transform, dedupe, and reshape CSV/Excel files with a repeatable script
permissions:
  reads: ["*.csv", "*.tsv", "*.xlsx", "*.xls"]
  writes: ["*_clean.csv", "*_clean.xlsx", "wrangle_*.py"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Turn a messy spreadsheet into clean, analysis-ready data with a documented, re-runnable script —
never by hand-editing, so the transformation is auditable and repeatable next month.

Steps:

1. **Load and profile** the input file (`$ARGUMENTS`)
   - If no file is given, ask for the path
   - Report shape (rows × cols), column names, inferred dtypes, null counts, duplicate rows, and 5 sample rows
   - Flag obvious issues: mixed types, inconsistent casing, stray whitespace, encoding oddities, date-format chaos

2. **Agree the transformation plan**
   Propose a concrete list of operations and confirm with the user before running:
   rename/standardize columns, trim/normalize text, parse dates, coerce numerics, split/merge columns,
   dedupe (on which keys?), filter rows, fill/drop nulls, reshape (pivot/melt).

3. **Write a repeatable script**
   Generate a `wrangle_[name].py` (pandas by default; detect polars if the repo uses it) that reads the
   source, applies each step in order with a comment per step, and writes a NEW output file.

4. **Run and validate**
   - Execute the script and show before/after: row counts, null counts, dtype changes, duplicates removed
   - Assert row-count expectations (e.g. no unexpected row loss after a join) and report any surprise

5. **Deliver**
   - Write the cleaned data to `[name]_clean.csv` (or `.xlsx`) — never overwrite the source file
   - Keep the script so the user can re-run it on next month's export
   - Summarize what changed and any rows quarantined for manual review

**Notes:**
- Never overwrite the source file in place; always write a copy and confirm before any destructive filter
- Preserve a `_rejected.csv` for rows dropped by validation so nothing silently disappears
- For Excel with multiple sheets, ask which sheet(s) to process
- Pairs with `/data--data-quality-audit` for a deeper integrity check before wrangling

$ARGUMENTS
