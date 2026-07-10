---
description: Find and score leads matching your ICP via web search, or prioritize an existing list
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["leads_*.csv", "leads_*.md"]
  commands: []
  network: true
  destructive: false
---

Find companies and contacts that match an Ideal Customer Profile using web search and public data
only (no paid APIs), score them by fit and intent, and deliver a prioritized, actionable lead list.
Works in two modes — detect which one applies from the input.

Steps:

1. **Detect mode from input** (`$ARGUMENTS`)
   - **Discover mode**: input is an ICP description, a product/service, or a company URL → find new leads
   - **Enrich mode**: input is a file path or pasted list of companies/contacts → enrich and prioritize it
   - If input is ambiguous or empty, ask: "Describe your ideal customer (industry, size, geography, role you sell to) or give me a CSV/list to prioritize."

2. **Establish the ICP** (both modes)
   - If the user gave a product or URL instead of an ICP, infer the ICP: research the product via web search, then confirm with the user: target industry/vertical, company size range, geography, buyer role/title, and the problem the product solves
   - If an ICP was provided, restate it in one paragraph and confirm before searching
   - Define 2-3 **disqualifiers** (anti-persona): segments that look like a fit but never buy

3. **Discover mode — find candidate companies via web search**
   Run multiple search angles in parallel (use subagents if available), each returning company candidates with evidence:
   - **Directory angle**: industry associations, chamber listings, "top X companies in [vertical] [region]" lists, awards, conference sponsor/exhibitor pages
   - **Signal angle**: companies showing buying intent — job postings for roles related to the problem, recent funding announcements, expansion/news mentions
   - **Lookalike angle**: competitors and peers of the user's existing best customers (ask for 1-3 example customers if available)
   - **Tech angle** (if the product integrates with or replaces a tool): companies publicly using that tool (case studies, testimonials, job posts mentioning it)
   - Target 20-40 raw candidates before filtering; note the source URL for every candidate

4. **Enrich each shortlisted company** (both modes)
   For each candidate, gather from public sources (company site, LinkedIn public pages, news, job boards):
   - Size (employee range), industry, geography, website
   - Relevant buying signals found (hiring, funding, news, tech mentions)
   - Likely buyer: role/title to approach (from ICP), and name if publicly listed (About/Team page, press releases, conference talks)
   - **Never fabricate contact data.** If an email/name isn't publicly verifiable, leave the field as `research needed` — do not guess email patterns as facts (a suggested pattern may go in a separate `email_hypothesis` column, clearly marked unverified)

5. **Score and rank**
   - **Fit score (0-100)**: match against ICP criteria — industry, size, geography, buyer accessibility. Apply disqualifiers as hard filters
   - **Intent score (0-100)**: strength and recency of buying signals found
   - **Priority = fit × intent weighting** — tier into A (contact this week), B (nurture), C (monitor)
   - Every score needs a one-line **reason** citing the evidence

6. **Deliver results**
   - Write `leads_[icp-slug]_[YYYY-MM-DD].csv` with columns: company, website, industry, size, geography, buyer_role, buyer_name, signal, fit_score, intent_score, tier, reason, source_url, suggested_angle
   - `suggested_angle`: one sentence — the personalized opener hook for this lead based on the signal found
   - Show a markdown summary table of the top 10 (tier A) in the conversation
   - Summarize: total found, tier distribution, the 3 strongest leads and why, and the recommended next step (e.g., run `/sales--cold-outreach` on tier A)

**Notes:**
- Use only public, free sources — no paid databases, no scraping behind logins, respect robots.txt
- Quality over quantity: 15 well-evidenced leads beat 100 guesses; drop candidates without a verifiable source
- If the niche is too narrow and results are thin, say so and suggest widening one ICP criterion at a time
- In enrich mode, preserve all original columns and append the enrichment/scoring columns
- Adapt output language to the user's market (e.g., Spanish leads → Spanish suggested angles)

$ARGUMENTS
