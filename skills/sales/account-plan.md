---
description: Build a strategic account plan with org map, pains, initiatives, entry plays
permissions:
  reads: ["*.csv", "*.md", "*.txt"]
  writes: ["account_plan_*.md"]
  commands: []
  network: true
  destructive: false
---

Build a strategic plan for a single target or existing account: what the company is trying to
achieve, who matters inside it, which pains map to your offering, and the concrete plays to land
or expand. Combines public research with whatever relationship history you provide.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: account name or URL, what you sell, and relationship status (net-new, active opportunity, or existing customer)
   - Ask for anything the user has: known contacts, past interactions, current contract, goals for this account (land, expand, renew, save)

2. **Research the account** (public sources only)
   - Company snapshot: what they do, size, geography, business model, recent news, funding/financials if public
   - Strategic initiatives: annual reports, press releases, exec interviews, investor pages, and job postings — hiring patterns reveal priorities
   - Note the source URL for every finding; separate verified facts from inferences

3. **Map the org**
   - Build a stakeholder table from public sources (leadership pages, press releases, conference talks, public LinkedIn profiles) plus user-provided contacts: name, role, relevance to the deal, likely stance (champion / neutral / blocker — labeled as hypothesis), power/interest rating
   - Never fabricate names or contact details; unknown seats in the buying committee get a row with `research needed`

4. **Map pains to initiatives**
   - For each strategic initiative found, hypothesize the pains it creates and which of your capabilities address them: initiative → pain hypothesis → evidence → affected stakeholder → your relevant offer
   - Flag white space: business units or use cases you don't touch today (expansion accounts)

5. **Define entry points and plays**
   - 2-3 concrete plays, each with: trigger/signal, target stakeholder, message angle, first meeting objective, and success criteria
   - A 30-60-90 day action sequence: who to reach, with what, in what order

6. **Deliver the plan**
   - Confirm, then write `account_plan_[account-slug]_[YYYY-MM-DD].md`: executive summary, account snapshot, org map table, initiative/pain matrix, plays, risks and unknowns, 30-60-90 actions
   - Show the executive summary and top play in the conversation

**Notes:**
- Every claim is either sourced (URL) or labeled `hypothesis` — a plan built on guesses fails in the first meeting
- Public, free sources only; no scraping behind logins
- Run `/sales--intent-radar` on the account for fresh buying signals, and `/sales--discovery-prep` before each stakeholder meeting
- Revisit the plan quarterly or on trigger events (new exec, funding, reorg)
- Adapt deliverable language to the user's market

$ARGUMENTS
