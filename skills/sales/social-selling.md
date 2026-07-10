---
description: Audit a LinkedIn presence and build a social selling content plan for a niche
permissions:
  reads: ["*.md", "*.txt"]
  writes: ["social_selling_plan_*.md"]
  commands: []
  network: true
  destructive: false
---

Audit a public LinkedIn presence against social selling best practices and build a content and
engagement plan for a specific niche: pillars mapped to buyer pains, a 4-week calendar, drafted
example posts, and a daily engagement routine that starts conversations instead of chasing likes.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: what you sell and to whom (niche/ICP — run `/sales--icp-builder` if undefined)
   - Optional: the user's public LinkedIn profile URL for the audit, examples of past posts, and the goal (pipeline, brand, recruiting) — never assume the industry

2. **Audit the presence** (if a profile URL was given; public page only, no login)
   - Score against a rubric table (0-10 each): headline (buyer outcome vs job title), about section (who you help + how + proof), featured section, activity recency, content-to-audience fit
   - Give a concrete rewrite suggestion for each item scoring under 7

3. **Map the niche landscape** (public web research)
   - Where the ICP actually engages: which voices they follow, which topics and formats get real discussion in this niche, relevant hashtags and communities
   - Cite examples found; if the niche is quiet on LinkedIn, say so and suggest the channel where it isn't

4. **Define content pillars**
   - 3-4 pillars, each mapped to a specific ICP pain: e.g., contrarian POV on an industry practice, teardown/how-to from real work, customer story (verifiable — see `/sales--case-study-generator`), behind-the-scenes lessons
   - Per pillar: the buyer question it answers and the proof it draws on — no generic thought-leadership filler

5. **Build the 4-week plan**
   - Calendar table: day, pillar, format (text, carousel, poll, short video script), hook line, CTA
   - Daily engagement routine (15 min): comment meaningfully on target accounts' and niche voices' posts — insight-adding comments, never pitch-in-comments
   - Draft 3 complete example posts (hook, body, CTA) in the user's voice

6. **Deliver**
   - Write `social_selling_plan_[YYYY-MM-DD].md`: audit scorecard, niche findings with sources, pillars, calendar, example posts, engagement routine, and the metric to track (conversations started per week, not likes)

**Notes:**
- Never recommend engagement pods, automation tools, or mass connection requests — they violate platform ToS and burn credibility
- Every claim or story in a post must be real; fabricated anecdotes are off the table
- Profile audit uses only the public page; if it's not publicly visible, ask the user to paste the text
- DMs earn their place: engage publicly first, connect with context, pitch only when invited
- Write posts in the language of the target market

$ARGUMENTS
