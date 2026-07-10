---
description: Write an Amazon working-backwards PR/FAQ for a product idea
permissions:
  reads: ["*.md", "*.txt", "docs/**", "README*"]
  writes: ["prfaq_*.md", "docs/prfaq/*.md"]
  commands: []
  network: false
  destructive: false
---

Write a working-backwards PR/FAQ: a fictional press release announcing the product as if it just
launched, followed by the hard questions a skeptical leadership team would ask. The exercise forces
clarity — if the press release is boring or the customer benefit needs three sentences to explain,
the idea isn't ready, and the document should say so.

Steps:

1. **Gather context** (`$ARGUMENTS`)
   - Read the product idea from the input; if a file path is given (pitch doc, PRD), read it
   - Detect product context from the repo (README, docs/) to infer the company, existing product, and domain
   - Ask for anything missing: the target customer (specific, not "everyone"), the problem in the customer's own words, evidence the problem is real and painful, how customers solve it today, and what success would look like a year after launch

2. **Draft the press release** (one page, dated at the imagined launch)
   - Structure, in order: **Headline** (customer benefit, no product name puffery), **Subheading** (who it's for and the one-line benefit), **Opening paragraph** (what launched, for whom, the single most important benefit — a reader who stops here knows everything essential), **Problem paragraph** (the customer's pain, told from their side), **Solution paragraph** (how the product solves it — outcomes, not feature lists), **Leader quote** (why the company built it), **Customer quote** (fictional but plausible — a named persona describing their life before/after), **How to get started** (the first concrete step a customer takes)
   - Rules: plain language a customer would use; no internal jargon, no "leveraging", no unverifiable superlatives; every claim must be one the team believes it can make true at launch

3. **Write the customer FAQ** (external)
   - 5-8 questions a real customer would ask before adopting: What does it cost? How is it different from [current alternative]? What happens to my data? How long does setup take? What are the limits?
   - Answer honestly, including the unflattering ones — an FAQ that dodges pricing or migration pain is theater

4. **Write the internal FAQ** (the hard part)
   - 8-12 questions a skeptical exec or engineer would ask, at minimum covering: How big is the market / how many customers have this problem? Why now, and why us? What are the top 3 things that could kill this? What does it cost to build and run? What do we deliberately not build in v1? How do we measure success (link to a primary metric)? What's the riskiest assumption and how do we test it cheaply? What alternatives did we reject and why?
   - Answers must contain the actual reasoning, with numbers where available and `assumption` labels where not — "TBD" is acceptable only with a named owner-role and a date

5. **Deliver and pressure-test**
   - Write `prfaq_[idea-slug].md` with sections: Press Release, Customer FAQ, Internal FAQ, Open Questions, Riskiest Assumptions (ranked)
   - Show the headline, opening paragraph, and the three hardest internal FAQ answers in the conversation
   - Give a frank verdict: is this PR exciting enough to build? If the benefit is weak or the problem evidence is thin, say so and name what would change the verdict
   - Suggest next steps: `/product--prd` if the idea survives review, `/product--user-interview-guide` if the problem evidence is thin

**Notes:**
- The press release must fit one page; the FAQs may run long — that ratio is the point of the format
- Write for the customer's grandmother: if a sentence needs domain knowledge to parse, rewrite it
- Fictional quotes are fine, fictional facts are not — market sizes, benchmarks, and costs are either sourced from input or labeled as assumptions
- Resist listing features: the press release sells the change in the customer's life, not the spec
- Match the document language to the user's working language

$ARGUMENTS
