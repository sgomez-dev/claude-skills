---
description: Turn project notes and metrics into a customer case study (problem-solution-results)
permissions:
  reads: ["*.md", "*.txt", "*.csv", "*.json", "*.docx"]
  writes: ["case_study_*.md"]
  commands: []
  network: false
  destructive: false
---

Turn raw project material — delivery notes, metrics, retro docs, customer quotes — into a
publishable customer case study following the problem → solution → results arc. The output is a
main narrative plus sales-ready derivatives (one-pager summary, proof points), built only on facts
present in the input.

Steps:

1. **Collect the raw material** (`$ARGUMENTS`)
   - Accept project notes, file paths, metrics, emails, or a verbal recap
   - Extract into a fact sheet: customer (name, industry, size), initial situation and pain, why
     they acted when they did (trigger), what was delivered, timeline, measurable outcomes, and
     any verbatim customer quotes
   - Mark each fact as **verified** (explicit in the input) or **needs confirmation** — the
     dividing line for what can be published

2. **Pick the angle and audience**
   - Ask (or infer): who is this case study for — prospects in the same vertical, a specific deal,
     the website? The buyer persona determines which pain and which metric leads
   - Choose the headline result: one number or transformation, specific and attributable
     (e.g., "cut onboarding time from 3 weeks to 4 days"), not a vague "improved efficiency"
   - If no quantified result exists in the input, say so and offer qualitative framing
     (before/after states, effort avoided) — do not manufacture percentages

3. **Structure the narrative (problem → solution → results)**
   - **Problem**: the customer's world before — business stakes, what they tried, the cost of
     inaction; written from the customer's perspective, the customer is the protagonist
   - **Solution**: why they chose us (selection criteria), what was implemented, and one honest
     obstacle overcome mid-project — friction makes the story credible
   - **Results**: metrics table | Metric | Before | After | Timeframe | plus secondary/soft
     outcomes; every number traces to the fact sheet
   - Target 600-900 words; skimmable — a reader who only reads headline, pull-quote, and metrics
     table must get the full story

4. **Write the supporting elements**
   - Headline formula: [Customer] + [headline result] + [timeframe or context]
   - A pull-quote: use a real quote from the input if one exists; otherwise draft a **proposed**
     quote clearly marked `[DRAFT — needs customer approval]`
   - Sidebar box: customer snapshot (industry, size, use case) and "Results at a glance" (3 bullet
     metrics)
   - Closing CTA adapted to the intended channel

5. **Generate sales derivatives**
   - **One-pager summary** (~150 words) for proposal appendices and follow-up emails
   - **Proof-point lines**: 3 single-sentence versions of the headline result for cold outreach
     and battlecards (feed `/sales--cold-outreach` and `/sales--sales-battlecard`)
   - 2-3 social-post drafts if the user mentions LinkedIn (or hand off to `/sales--social-selling`)

6. **Deliver with an approval checklist**
   - Write `case_study_[customer-slug]_[YYYY-MM-DD].md` with the main narrative, sidebar content,
     derivatives, and an **approval checklist** at the top: facts needing confirmation, quotes
     needing sign-off, whether the customer approved being named (offer an anonymized variant:
     "a mid-size [industry] company" if not)
   - Show the metrics table and the checklist in the conversation

**Notes:**
- Never fabricate metrics, quotes, or customer details — a case study is a reference document;
  one invented number poisons the whole asset and the relationship
- Customer approval is mandatory before publication: name, logo, quotes, and numbers; the
  checklist exists to make that review fast
- Specificity beats scale: "reduced invoice processing from 4 hours to 20 minutes for a 12-person
  finance team" outsells "up to 90% faster"
- Adapt language and tone to the market where the case study will be used; if the customer operates
  in another language, produce the customer-approval version in theirs
- Best input: run this right after project close while metrics and quotes are fresh

$ARGUMENTS
