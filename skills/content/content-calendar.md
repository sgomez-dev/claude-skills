---
description: Build a content calendar — pillars, cadence, formats mapped to funnel stages
permissions:
  reads: ["*.md", "*.csv", "*.txt", "docs/**", "content/**"]
  writes: ["content_calendar_*.md", "content_calendar_*.csv"]
  commands: []
  network: false
  destructive: false
---

Build a content calendar a team can actually execute: 3-5 content pillars derived from what the
business sells and what the audience asks, a cadence the team can sustain, and every piece mapped
to a funnel stage so the calendar drives pipeline instead of vanity metrics. Output is a concrete
schedule with working titles, not a vague "post 3x/week" plan.

Steps:

1. **Establish brand voice, audience, and capacity** (`$ARGUMENTS`)
   - Extract from context (existing posts, docs, site copy) or ask: who is the audience — role, seniority, what problems they're paying to solve? What does the business sell and to whom?
   - Capture the brand voice in 3-4 concrete traits (e.g., "direct, first person, opinionated, no jargon") from samples if available; otherwise ask for one adjective pair to avoid ("not corporate, not cutesy")
   - Ask the honest capacity question: hours per week and who produces (founder, marketer, agency)? A calendar beyond capacity fails in week 3 — plan for 70% of stated capacity
   - Confirm the publication language(s) — write titles and briefs in the language of the target market, not automatically in English

2. **Define 3-5 content pillars**
   - Each pillar = a topic territory where the business has genuine authority and the audience has recurring questions; name it, state the audience question it answers, and the business reason it exists
   - Balance the set: at least one bottom-funnel pillar (product/use-case adjacent), one middle (how-to/comparison), one top (industry opinion/education) — reject pillar sets that are 100% top-of-funnel thought leadership
   - Kill vanity pillars: if a pillar can't be traced to a buyer question or a sales objection, cut it

3. **Map formats to funnel stages**
   - **TOFU (awareness)**: opinion posts, social threads, short video — goal is reach and recall; CTA is follow/subscribe
   - **MOFU (consideration)**: how-tos, comparisons, newsletters, case-study teasers — goal is email capture and return visits
   - **BOFU (decision)**: case studies, product deep-dives, migration guides, FAQs from real sales calls — goal is demo/purchase
   - Assign each pillar its natural formats and stages; a rough healthy mix is 40/40/20 TOFU/MOFU/BOFU, skewed more BOFU for niche B2B

4. **Set the cadence and channel plan**
   - Pick a repeatable weekly rhythm from real capacity (e.g., "1 blog post biweekly, 3 social posts/week, 1 newsletter/month") — consistency beats volume
   - Build in a repurposing chain so one core piece feeds the week: blog post → 2-3 social posts → newsletter section (point to `/content--blog-post`, `/content--social-posts`, `/content--newsletter` for production)
   - Note per-channel constraints: LinkedIn vs X tone, newsletter day/time, SEO pieces that need `/content--seo-content` treatment

5. **Fill 4-8 weeks of concrete slots**
   - For every slot: date, pillar, funnel stage, format, channel, **working title**, one-line angle (the specific take, not the topic), CTA, and owner
   - Working titles must pass the anti-generic test: no "delve", "leverage", "unlock", "ultimate guide to X" filler; each title states a specific claim or outcome a human would click
   - Sequence deliberately: launch-adjacent BOFU pieces near product dates, seasonal/industry-event hooks on their real dates, evergreen filling the gaps

6. **Deliver the calendar**
   - Write `content_calendar_[YYYY-MM].md` with: pillar definitions, cadence summary, the slot-by-slot schedule as a table, and the repurposing chains
   - Also write `content_calendar_[YYYY-MM].csv` (date, pillar, stage, format, channel, title, angle, cta, owner, status) for import into Notion/Sheets/Airtable
   - Close with a 3-line operating note: the weekly production ritual, what to measure per stage (reach / signups / demos — not likes across the board), and when to revisit pillars (quarterly)

**Notes:**
- A calendar is a hypothesis: mark 20% of slots as flex so real-time topics and what's working can displace what's planned
- Never schedule content nobody is assigned to produce; "owner: TBD" rows get cut, not published late
- If the user has zero published content, start with a 4-week pilot calendar, not a quarter — learn the actual production speed first
- Angles and titles must vary in structure across the calendar — a feed of identically-shaped headlines reads as automated
- Adapt everything (titles, CTAs, channel choice) to the audience's market and language; a Spanish-market calendar gets Spanish titles

$ARGUMENTS
