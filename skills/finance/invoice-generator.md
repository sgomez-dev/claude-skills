---
description: "Generate professional HTML/PDF-ready invoices from line items and client data"
permissions:
  reads: ["*.csv", "*.json", "*.md", "*.html"]
  writes: ["invoice_*.html", "invoice_*.md"]
  commands: []
  network: false
  destructive: false
---

Generate a professional, print/PDF-ready invoice as a self-contained HTML file from the user's
line items, client details, and business information. Handles taxes, discounts, and multi-item
math with every calculation shown, and can produce a reusable template plus a batch of invoices
from a CSV.

Steps:

1. **Establish context and collect invoice data** (`$ARGUMENTS`)
   - If not given, ask: currency, and the seller's details — legal/business name, address, tax ID (VAT/EIN/CIF as applicable), contact, and payment instructions (bank/IBAN, or payment link text)
   - Collect per invoice: client name and address (and client tax ID where local rules require it), invoice number, issue date, due date or payment terms (e.g., Net 30), and line items (description, quantity, unit price)
   - Accept input as pasted text, a CSV/JSON file, or an existing invoice to replicate the layout of. Never invent seller, client, or tax data — ask for anything missing

2. **Confirm tax and numbering rules**
   - Ask which tax applies (rate and name — VAT, IVA, sales tax, GST — and whether prices are tax-inclusive or exclusive); support per-line rates if items differ, and reverse-charge/exempt notes where the user says they apply
   - Confirm the invoice numbering scheme (e.g., `2026-001`, sequential per year) and use it consistently
   - If the user is unsure about legal requirements for their jurisdiction, list the commonly required fields (labeled as general guidance) and tell them to verify with their accountant

3. **Compute the totals, showing the math**
   - Per line: `line total = quantity × unit price`, minus any per-line discount
   - `Subtotal = Σ line totals`, then global discount if any, then `tax = taxable base × rate` (per rate group if mixed), then `Total due`
   - Show the calculation as a markdown table for the user to verify before generating the file; round per the currency's convention and state the rounding rule used

4. **Generate the HTML invoice**
   - Single self-contained `.html` file: inline CSS, no external fonts/images/scripts, A4-friendly with `@media print` rules so browser "Print → Save as PDF" produces a clean one-page document
   - Layout: seller block and invoice metadata (number, dates) top; client block; items table; totals block right-aligned; payment instructions and terms footer; optional notes line
   - Clean, professional typography with a single accent color (ask for a brand color/logo file if the user wants one; embed logos as data URIs so the file stays self-contained)

5. **Handle batches and templates (if requested)**
   - Batch mode: from a CSV of clients/line items, generate one `invoice_[number].html` per row group, applying the numbering scheme sequentially
   - Template mode: also write a version with `{{placeholders}}` for the fields that change per invoice, plus a short note on how to reuse it
   - Produce a summary markdown table of all invoices generated: number, client, total, due date

6. **Deliver results**
   - Write `invoice_[number].html` (one per invoice) and, for batches, `invoice_summary_[YYYY-MM].md`
   - State how to produce the PDF (open in a browser → print → save as PDF) and verify the print layout fits one page for typical item counts
   - Suggest `/finance--revenue-forecast` if the user wants to project from their invoicing history

**Notes:**
- This is document generation assistance, not tax, accounting, or legal advice — invoice legal requirements vary by jurisdiction; the user must verify mandatory fields and tax treatment with a professional
- Never fabricate tax IDs, rates, bank details, or amounts — every field comes from the user
- Keep the HTML fully self-contained (no network requests) so it renders identically offline and in email attachments
- Show totals math before generating files; a wrong invoice is worse than a late one
- Sequential numbering gaps cause audit questions in many jurisdictions — warn if the user skips numbers

$ARGUMENTS
