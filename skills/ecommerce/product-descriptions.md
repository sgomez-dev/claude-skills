---
description: Write conversion-focused product descriptions at scale from specs or a CSV
permissions:
  reads: ["*.csv", "*.json", "*.md", "*.txt", "*.xlsx"]
  writes: ["product_descriptions_*.csv", "product_descriptions_*.md", "descriptions/**"]
  commands: []
  network: false
  destructive: false
---

Turn raw product specs into descriptions that sell — one product or a 500-row CSV. Specs answer
"what is it"; a description that converts answers "why should I care" in the shopper's own words,
then backs it with the specs. Output lands in the exact import format the store's platform expects,
so the result goes from file to storefront without manual rework.

Steps:

1. **Establish brand voice, audience, and platform** (`$ARGUMENTS`)
   - Extract voice from existing descriptions, the store's About page, or provided samples — capture 3-4 concrete traits (e.g., "playful, second person, short sentences, no exclamation marks"); if nothing exists, ask for a brand the user wants to sound like and one to avoid
   - Identify the buyer: who buys this and why — gift buyer vs enthusiast vs professional changes every word; ask if unclear
   - Detect the platform (Shopify, WooCommerce, Medusa, custom) from the input file's columns or the project, because it sets the output format, HTML tolerance, and field limits
   - Confirm the output language — write in the language of the store's market; multilingual stores get one column/file per language

2. **Ingest and audit the source data**
   - Parse the input (CSV/JSON/pasted specs); map columns to: name, category, key attributes, materials/ingredients, dimensions, price tier, existing description
   - Flag rows with too little to work from (name only, no attributes) — list them and ask for enrichment or write shorter honest descriptions rather than inventing features
   - Group products into templates by category: a 500-SKU run is really 5-15 description patterns with per-product substance, not 500 one-offs

3. **Define the description structure per category**
   - **Hook** (1-2 sentences): the main benefit in the buyer's terms — the moment of use, the problem gone, the feeling; never open with the product name restated or "Introducing…"
   - **Body** (2-4 sentences): the 2-3 attributes that matter for this category translated into benefits ("full-grain leather" → "scuffs fade into character instead of ruining it")
   - **Specs block**: bullets for scannable facts — dimensions, materials, care, compatibility — kept factual and complete
   - Set target lengths from platform and category norms (fashion ~80-120 words, technical products longer); define what varies per product vs stays fixed per template

4. **Write at scale without sounding like a machine**
   - Hard rules: no "delve", "leverage", "unlock", "elevate", "seamless", "game-changer"; no "Whether you're X or Y" openers; vary sentence length and structure across products in the same category — two adjacent products must not share a sentence skeleton
   - Every claim traces to a spec in the source data; never invent materials, certifications, origins, or performance numbers — missing info becomes `[needs input]`, not fiction
   - Work in batches of 10-20, spot-check the first batch with the user before running the rest; keep a per-category "used phrases" list to prevent repetition across the catalog
   - Legal care: regulated categories (cosmetics, supplements, kids' products) get no health/safety claims beyond what the source data explicitly supports

5. **Add the SEO layer**
   - Per product: a title tag (≤60 chars, product + primary attribute buyers search), meta description (≤155 chars with a reason to click), and the primary keyword used naturally once in the description — never stuffed
   - Alt-text suggestions for product images (descriptive, attribute-rich) if image columns exist

6. **Deliver in the platform's import format**
   - **Shopify**: CSV matching the product import schema (`Body (HTML)` with clean HTML — `<p>`, `<ul>` only) or Matrixify format if the source used it; **WooCommerce**: product CSV importer columns (`short_description`, `description`); **Medusa/custom**: JSON keyed by handle/SKU, or match the schema found in the project
   - Preserve every original column; append, never overwrite source data in place
   - Show 3 finished examples from different categories in the conversation for approval, plus a summary: rows written, rows flagged `[needs input]`, template count

**Notes:**
- One honest description outsells one inflated one: superlatives without evidence lower trust across the whole store
- Variants (size/color) share a description; don't generate near-duplicates per variant row — write once per parent product
- If existing descriptions are present, ask whether to rewrite all or only fill gaps — wholesale rewrites can hurt pages that already rank
- Sanity-check encoding on delivery (UTF-8, quoted fields) — a broken CSV import wastes the whole run
- For the surrounding catalog structure (categories, attributes, variants), see `/ecommerce--product-catalog`

$ARGUMENTS
