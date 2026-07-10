---
description: Build PDF workflows — extract text/tables, fill forms, merge/split, OCR fallback
permissions:
  reads: ["package.json", "requirements.txt", "pyproject.toml", "*.pdf", "*.py", "*.js", "*.ts"]
  writes: ["pdf/**", "output/**", "*.py", "*.js", "*.ts", "*.csv", "*.json"]
  commands: ["node", "npm", "python", "pip", "uv", "tesseract", "qpdf"]
  network: false
  destructive: false
---

Build a repeatable PDF workflow: extract text and tables into structured data, fill form fields,
merge/split/reorder pages, and fall back to OCR when the PDF is a scan. The critical first move is
diagnosing what kind of PDF you actually have — digital-native, scanned image, or a hybrid — because
that decides every tool choice downstream.

Steps:

1. **Diagnose the input** (`$ARGUMENTS`)
   - Open a sample PDF and probe it: does text extraction return real text, or nothing/garbage? Real text → **digital-native** (parse directly); empty/garbage → **scanned image** (OCR path); mixed pages → handle per page
   - Note: page count, encrypted/password-protected (ask the user for the password — never attempt to crack protection), AcroForm fields present, and whether the layout is consistent across documents (batch workflows need consistency)
   - Confirm the goal: extract (→ what schema?), fill (→ which fields from which data?), or assemble (merge/split → what rules?)

2. **Detect the stack and pick libraries**
   - `requirements.txt`/`pyproject.toml` → **Python** (richest PDF ecosystem — default for extraction): `pymupdf` (fast text/layout), `pdfplumber` (tables), `pypdf` (merge/split/forms), `ocrmypdf` (OCR layer)
   - `package.json` → **Node**: `pdf-parse`/`pdfjs-dist` (text), `pdf-lib` (create/fill/merge); for heavy table extraction or OCR in a Node project, recommend a small Python sidecar script — the tooling gap is real
   - CLI allies for one-off or pipeline use: `qpdf` (split/merge/decrypt with password), `tesseract` (raw OCR)

3. **Extraction path** (text and tables)
   - Text: extract per page with layout awareness; anchor field extraction to stable labels ("Invoice No:", "Total:") with regex/positions, not absolute coordinates alone
   - Tables: `pdfplumber` with tuned settings (lines vs whitespace strategy) → pandas/CSV; verify column counts per row and flag ragged rows instead of silently misaligning
   - Define the output schema first (JSON/CSV columns, types); every extracted record carries `source_file` and `page` for traceability
   - **Validate**: required fields present, numbers parse as numbers, totals cross-check where possible; route failures to a `needs_review/` folder — never emit half-parsed rows silently

4. **OCR fallback** (scanned pages)
   - `ocrmypdf` (wraps tesseract) adds an invisible text layer while preserving the original image — output stays a searchable PDF, then reuse the step-3 extraction on it
   - Set the language pack explicitly (`-l eng`, `-l spa`...); use `--skip-text` for hybrid docs so digital pages aren't re-OCRed
   - Treat OCR output as **low-confidence**: numbers (0/O, 1/l) and totals need validation rules or human review; say so in the workflow docs rather than pretending OCR is exact

5. **Forms and assembly**
   - **Fill forms**: enumerate AcroForm field names first (pypdf/pdf-lib can list them), map data → fields explicitly, then fill and optionally flatten (so values can't be edited); no AcroForm fields → overlay text at coordinates via `pymupdf`/`pdf-lib` as the fallback
   - **Merge/split**: `pypdf`/`pdf-lib`/`qpdf` — merge with a deterministic order rule (filename, date), split by page ranges or by detected markers (e.g., "Page 1 of" resets → new document)
   - Never modify inputs in place: read from an input folder, write to `output/`, keep originals untouched

6. **Batch it and hand off**
   - Wrap as a script: process a folder, per-file try/except so one corrupt PDF doesn't kill the batch, log `ok / failed / needs_review` counts, exit non-zero if anything failed
   - Idempotent: skip already-processed files (by name or hash manifest)
   - Recurring intake (e.g., invoices arriving weekly)? Schedule via `/automation--scheduled-tasks`; PDFs arriving by email → intake via `/automation--email-automation`; extracted tables feeding sheets → `/automation--spreadsheet-automation`

**Notes:**
- The digital-vs-scanned diagnosis (step 1) is the whole game — OCRing a digital PDF or parsing a scan both waste hours
- Respect document security: ask for passwords, never strip DRM or crack protection
- Layout variance is the killer in batches — build for the 2-3 layouts you've seen and route unknown layouts to review, don't guess
- PDF generation (data → new PDF report) is the reverse problem: templates via HTML-to-PDF or `reportlab`, covered better by `/automation--report-automation`
- Keep a small corpus of sample PDFs as test fixtures; rerun extraction against them after any change

$ARGUMENTS
