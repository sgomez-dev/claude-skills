---
description: Newsletter issue: curation, structure, A/B subject lines, plain-text friendly
permissions:
  reads: ["*.md", "*.txt", "newsletters/**", "content/**"]
  writes: ["newsletter_*.md", "drafts/*.md"]
  commands: []
  network: false
  destructive: false
---

Assemble a complete newsletter issue from the user's raw material — links, notes, things that
happened this week — into something subscribers actually open and finish. Curation with a point of
view, a structure that survives plain-text email clients, and subject lines built to be tested, not
admired.

Steps:

1. **Establish the newsletter's identity** (`$ARGUMENTS`)
   - Ask (or extract from past issues if provided): who subscribes — role, why they signed up, what they skip? What is the newsletter's promise in one sentence ("5 dev tools, every Friday")? What voice — personal letter, curated digest, opinionated brief?
   - If past issues exist, extract 3-4 concrete voice traits and the recurring section structure, and follow them
   - Write in the audience's language — a newsletter for a Spanish-speaking market gets Spanish subject lines tested against Spanish reading habits, not translated English ones

2. **Gather and curate the material**
   - Collect what the user provides: links, notes, article drafts, announcements. This skill has no network access — if the input is bare URLs, ask the user to paste each item's content or a 2-3 sentence summary
   - Select 3-7 items maximum; a newsletter that includes everything recommends nothing. State what was cut and why
   - For every kept item, write the **"so what"**: one sentence on why the subscriber should care, in the curator's own opinion — not a rephrased headline

3. **Structure the issue**
   - Opening note (2-4 sentences, personal, earns the scroll — not "Welcome to another edition of…")
   - Sections matching the newsletter's established format; if none exists, propose one: lead item (the deepest take), quick hits (one-liners with links), and one closing element (a question, a P.S., a recommendation)
   - Exactly one primary CTA per issue — reply, click, share, buy. More CTAs means fewer clicks on each

4. **Draft it plain-text friendly**
   - Short paragraphs (1-3 sentences), links written as full visible URLs or clearly labeled — the issue must work with all formatting stripped
   - No images as load-bearing content; describe or summarize instead. No tables, no multi-column layouts
   - Anti-AI prose rules: no throat-clearing openers ("In today's fast-paced world…"); banned words: delve, leverage (verb), unlock, unleash, robust, seamless, game-changer, elevate; vary sentence length — some short, some long; sound like one person writing to one person, because that is what email is

5. **Subject lines — A/B pairs and preview text**
   - Write 2 A/B pairs (4 subject lines total), each pair testing one distinct lever: curiosity vs. clarity, benefit vs. specificity, question vs. statement. Label which lever each pair tests
   - Keep subjects ≤ 50 chars where possible (mobile truncation); avoid spam-trigger patterns (ALL CAPS, "free!!!", excessive punctuation)
   - Write matching preview text (≤ 90 chars) that extends the subject rather than repeating it

6. **Deliver**
   - Write `newsletter_[issue-or-date].md` with: subject line pairs + preview text at the top, then the full issue body, then a pre-send checklist (links verified by the user, one CTA, plain-text render check, unsubscribe/footer reminder)
   - Show the subject line pairs and the opening note in conversation for quick review

**Notes:**
- Curation is the product — the opinion attached to each link is why people subscribe instead of using a feed reader
- Never invent metrics, quotes, or "a subscriber wrote in" anecdotes; mark anything unverified as `[verify]`
- Consistent cadence beats occasional brilliance; if the user has no schedule, suggest planning issues with `/content--content-calendar`
- Long items deserve their own home: draft them with `/content--blog-post` and link from the newsletter

$ARGUMENTS
