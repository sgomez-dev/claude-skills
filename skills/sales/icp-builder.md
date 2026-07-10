---
description: Build an ICP from your customers, product, or website, plus lead-finder queries
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["icp_*.md"]
  commands: []
  network: true
  destructive: false
---

Build a rigorous Ideal Customer Profile from whatever evidence exists — a list of current
customers, a product description, or just a website URL — and turn it into concrete,
ready-to-run search queries for `/sales--lead-finder`. An ICP is only useful if it excludes:
the deliverable defines who to walk away from as clearly as who to chase.

Steps:

1. **Identify the evidence base** (`$ARGUMENTS`)
   - **Customer-driven**: input is a list/CSV of existing customers → strongest signal, work from patterns
   - **Product-driven**: input is a product/service description → derive who has the problem
   - **Website-driven**: input is a URL → research the site (positioning, case studies, pricing page) via web search to infer both product and current targeting
   - If input is empty, ask: "Give me your 5-10 best customers, a product description, or your website URL."

2. **Extract patterns from the evidence**
   - Customer-driven: for each customer, research public data (industry, employee range, geography, business model) and find what the *best* ones share. Ask the user to mark which customers were fastest to close / highest retention — pattern-match on those, not the whole list
   - Product/website-driven: identify the core problem solved, who feels that pain most acutely, and what triggers make it urgent (growth, regulation, tool migration, headcount change)
   - Explicitly note where evidence is thin — an ICP from 3 customers is a hypothesis, not a profile; say so

3. **Draft the ICP across four layers**
   - **Firmographics**: industry/vertical (specific — "B2B SaaS 20-200 employees", not "tech"), size range, geography, revenue band or funding stage, business model
   - **Buyer personas**: 1-2 roles — title patterns, what they own, what they're measured on, where they hang out
   - **Situational triggers**: observable events that create urgency (hiring for X, new funding, tool sunset, compliance deadline)
   - **Disqualifiers (anti-persona)**: 3-5 hard exclusions — segments that look like a fit but never buy, churn fast, or can't pay. Ask the user for lost/churned deals to sharpen these

4. **Pressure-test with the user**
   - Present the draft as a table and ask three checks: "Would your best customer match every row? Would your worst-fit deal be excluded? Is this segment reachable at a size worth pursuing?"
   - Revise until all three pass; keep at most one "stretch" criterion marked as experimental

5. **Generate lead-finder search queries**
   - Translate the ICP into 6-10 concrete web search queries grouped by angle: directory queries ("[industry] association members [region]"), signal queries ("[title] job posting [problem keyword]"), lookalike queries (competitors/peers of named best customers), and tech queries if the product replaces or integrates with a known tool
   - Each query gets a one-line note: what a hit looks like and which ICP criterion it validates

6. **Deliver the ICP document**
   - Write `icp_[segment-slug].md` with sections: summary paragraph, firmographics table, personas, triggers, disqualifiers, ready-to-run queries, and open assumptions to validate
   - Recommend next step: run `/sales--lead-finder` with this ICP, then `/sales--lead-qualifier` on the results

**Notes:**
- One ICP per document — if the evidence points to two distinct segments, produce two files and say which to test first
- Mark every criterion as **evidence-backed** (seen in real customers) or **hypothesis** (inferred); hypotheses need validation before scaling outbound
- Use only public, free sources when researching customers or the website — no paid databases
- Adapt output language to the user's market (e.g., a Spanish-market ICP → Spanish personas and queries)

$ARGUMENTS
