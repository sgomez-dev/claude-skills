---
description: Enrich a lead list with public data - tech stack, size, funding, hiring, news
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["leads_enriched_*.csv", "leads_enriched_*.md"]
  commands: []
  network: true
  destructive: false
---

Take an existing lead list and enrich every row with public, verifiable data — company size,
industry, tech stack signals, funding, hiring activity, and recent news — so reps open every
conversation informed. Uses only free public sources; every enriched field carries its source.

Steps:

1. **Load and inspect the list** (`$ARGUMENTS`)
   - Accept a CSV/JSON file path or a pasted list of companies (names, domains, or both)
   - If input is missing, ask: "Give me a CSV or list of companies to enrich (a domain per company helps accuracy)."
   - Show the detected columns and row count; ask which enrichment fields matter most if the list is large (>50 rows) so effort goes where it counts

2. **Define the enrichment schema**
   - Default fields: `industry`, `employee_range`, `geography`, `website`, `tech_signals`, `funding_stage`, `hiring_activity`, `recent_news`, `likely_buyer_role`, `signal_summary`, `source_urls`
   - Ask what the user sells (one line) — enrichment is only useful relative to a product; `tech_signals` and `hiring_activity` should look for *relevant* tools and roles, not everything

3. **Research each company from public sources**
   - Per company, sweep: the company website (about, careers, customers pages), LinkedIn public company page, recent news search, public job boards, and case-study/testimonial mentions on vendor sites
   - Run companies in parallel batches (use subagents if available); cap research at ~3 minutes of effort per company — capture what's findable, mark the rest
   - Disambiguate carefully: same-name companies are the top enrichment error. Verify by domain or geography before attributing data

4. **Enforce verifiability**
   - Every filled field needs at least one `source_url`; fields with no public evidence get `not found` — never a guess
   - **Never fabricate contact data, revenue figures, or headcounts.** Employee counts are ranges from public pages, marked with their source date
   - Inferences (e.g., "likely uses Salesforce — job post mentions it") go in `tech_signals` with the evidence in parentheses, not stated as fact

5. **Derive the sales-usable layer**
   - `signal_summary`: one sentence combining the strongest findings ("Series B in March, hiring 4 SDRs, migrating off [tool]")
   - `enrichment_score` (0-100): how complete and how sales-relevant the found data is — flags which leads are ready to work vs need manual research
   - Sort output by enrichment_score descending so the most actionable rows lead

6. **Deliver results**
   - Write `leads_enriched_[YYYY-MM-DD].csv` preserving **all original columns** and appending the enrichment columns
   - Show a markdown summary: rows enriched, fields with best/worst coverage, top 5 most interesting findings, and companies that could not be verified (possible bad data in the source list)
   - Recommend next step: `/sales--lead-qualifier` to tier the enriched list, or `/sales--intent-radar` to monitor the top accounts for buying signals

**Notes:**
- Public, free sources only — no paid enrichment APIs, no scraping behind logins, respect robots.txt
- Freshness matters: prefer sources dated in the last 12 months; stamp `recent_news` items with their date
- If >20% of companies can't be identified confidently, stop and report it — the input list likely needs cleaning first
- Adapt output language to the user's market (e.g., signal summaries in Spanish for a Spanish-speaking team)

$ARGUMENTS
