---
description: SEO brief + article: keyword intent, SERP analysis, headings, internal links
permissions:
  reads: ["*.md", "*.txt", "content/**", "blog/**", "docs/**"]
  writes: ["seo_brief_*.md", "seo_article_*.md", "drafts/*.md"]
  commands: []
  network: true
  destructive: false
---

Produce an SEO content brief grounded in what actually ranks, then write the article to that brief —
built to satisfy search intent and still read like a human wrote it. Works from a target keyword, a
topic, or a page URL to improve. The brief alone is a valid deliverable; ask if the user wants brief
only or brief + article.

Steps:

1. **Establish voice, audience, and target** (`$ARGUMENTS`)
   - Parse the input: a keyword ("kubernetes cost optimization"), a topic, or an existing URL to improve
   - Ask (or extract from existing content in the repo): who is the reader — role, expertise level, what they search like? What voice does the brand use? Any past articles to mimic?
   - Confirm the target market and write in its language — a keyword in Spanish gets Spanish SERP analysis and a Spanish article, not a translation of an English one

2. **Classify keyword intent**
   - Determine the dominant intent: informational (learn), commercial (compare), transactional (buy/do), or navigational — and state the evidence
   - List 5-10 related queries and long-tail variants (search suggestions, "people also ask" style questions found in the SERP)
   - If intent is mixed or the keyword is too broad to win, say so and propose a sharper target before continuing

3. **Analyze the SERP** (web search)
   - Fetch and skim the top 5-8 ranking results for the target query
   - Record for each: format (guide, listicle, tool page, video), approximate depth, headings used, what it covers well
   - Identify the **gap**: the question searchers have that no result answers well, the outdated info, the missing example or data — this gap is the article's reason to exist. If there is no gap, recommend a different angle or keyword

4. **Write the brief** (`seo_brief_[slug].md`)
   - Target keyword + secondary keywords, intent, target reader, and the gap being filled
   - Title tag (≤ 60 chars, keyword near the front), meta description (≤ 155 chars, makes a promise), URL slug
   - Full heading outline (one H1, descriptive H2/H3s) — each heading annotated with the point it must make and which SERP gap or related query it serves
   - Entities and subtopics that every ranking page covers (table stakes) vs. what differentiates this one
   - **Internal links**: scan the user's existing content (repo, sitemap, or provided URL list) and specify 3-6 internal links with anchor text and target page; flag pages that should link back to this article
   - Target length based on what ranks, not a round number

5. **Draft the article** (if requested)
   - Follow the brief exactly; where the draft needs to deviate, update the brief and say why
   - Hard rules against AI-sounding prose: no "In today's fast-paced world…" openers; banned words: delve, leverage (verb), unlock, unleash, robust, seamless, game-changer, elevate; vary sentence length deliberately — some short, some that run on because the idea needs room; concrete over abstract — name the tool, show the number, give the real example
   - Answer the searcher's question in the first screen — no 300-word preamble before the payoff
   - Use keywords where a human would; if a sentence exists only to hold a keyword, cut it

6. **Deliver with an on-page checklist**
   - Write `seo_article_[slug].md` with frontmatter (title, description, slug, keywords, date)
   - Include a checklist: title/meta lengths verified, one H1, internal links placed, image alt-text suggestions, FAQ section if "people also ask" queries warrant one
   - Summarize in conversation: the gap the article fills, the top 3 competing results, and the internal links to add on other pages

**Notes:**
- Never fabricate search volume or ranking data — this skill analyzes SERPs qualitatively, it does not have keyword-tool metrics; mark any volume claims as `[verify in your SEO tool]`
- Satisfying intent beats keyword density every time; if the SERP is all listicles, a 4,000-word essay will not rank regardless of quality
- For a post where SEO is secondary to the argument, use `/content--blog-post` instead
- To repurpose the finished article across channels, follow up with `/content--social-posts`

$ARGUMENTS
