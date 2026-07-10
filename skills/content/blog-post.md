---
description: Write a technical or business blog post with a real angle and human prose
permissions:
  reads: ["*.md", "*.txt", "src/**", "docs/**"]
  writes: ["blog_*.md", "drafts/*.md"]
  commands: []
  network: true
  destructive: false
---

Write a blog post that a real practitioner would publish: a specific angle, a working outline, a
full draft, and SEO basics — without the generic AI voice that gets posts ignored. The topic can be
anything from a technical deep-dive to a business opinion piece; the process is the same, the
register changes.

Steps:

1. **Establish voice and audience** (`$ARGUMENTS`)
   - Ask (or extract from context/existing posts if available): who reads this — role, seniority, what they already know? What tone does the brand use — direct, playful, academic, contrarian? Any style samples (past posts, a URL) to mimic?
   - If existing posts are provided or linked, extract 3-4 concrete voice traits (e.g., "short paragraphs, second person, dry humor, code-first") and follow them
   - Confirm the publication language — write in the language of the target audience/market, not automatically in English

2. **Find the angle**
   - A topic is not an angle. Propose 3 candidate angles for the topic: an opinion ("X is overrated because…"), an experience ("what happened when we…"), or a synthesis ("the 3 ways teams actually solve X")
   - For each angle, state the one-sentence takeaway a reader leaves with and why it isn't already said everywhere
   - Optionally search the web for what already ranks/circulates on this topic to avoid repeating it — differentiate or don't write it
   - Let the user pick, or pick the strongest and say why

3. **Outline**
   - Title (working), hook (first 2-3 sentences that earn the scroll), 4-7 H2 sections each with the point it makes and the evidence/example it uses, and a closing that lands the takeaway (not a summary that repeats everything)
   - Flag where a concrete artifact belongs: code snippet, screenshot placeholder, real numbers, a short anecdote — every major claim needs one

4. **Draft**
   - Write the full post in the established voice. Hard rules against AI-sounding prose:
     - No throat-clearing openers ("In today's fast-paced world…", "In the ever-evolving landscape of…")
     - Banned words: delve, leverage (as a verb), unlock, unleash, robust, seamless, game-changer, elevate
     - Vary sentence length deliberately — some short. Some that run longer because the idea needs room
     - No symmetrical triads everywhere ("clear, concise, and compelling"); no section that exists only to transition
     - Concrete over abstract: name the tool, show the number, quote the error message
   - Use real code/examples from the project when the post is technical and a codebase is available

5. **SEO basics** (light touch — this is a blog post, not an SEO play; for full SEO work use `/content--seo-content`)
   - Title tag ≤ 60 chars with the main phrase people would search; meta description ≤ 155 chars that makes a promise
   - One H1, descriptive H2s, a URL slug suggestion, and 2-4 natural internal-link opportunities if the user has related content

6. **Deliver and self-edit**
   - Write `blog_[slug].md` with frontmatter (title, description, slug, date, tags), then do one edit pass: cut 10-15% of words, kill every sentence that could open any blog post on any topic
   - Show the title options (3 variants), the meta description, and the first paragraph in the conversation for quick review

**Notes:**
- If the user has no angle preference and no context, ask one question — audience — before writing anything; a post for CTOs and a post for junior devs are different posts
- Never invent statistics, customer names, or quotes; mark anything needing verification as `[verify]`
- Ideal length follows the angle, not a word count target; most good posts are 800-1,500 words
- For repurposing the finished post into social content, suggest `/content--social-posts`

$ARGUMENTS
