---
description: Repurpose one piece of content into native LinkedIn, X, and Instagram posts
permissions:
  reads: ["*.md", "*.txt", "content/**", "blog/**", "drafts/**"]
  writes: ["social_*.md", "drafts/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn one finished piece of content — a blog post, article, talk, or announcement — into posts that
are native to each platform, not one caption pasted three times. Each platform gets its own format,
length, and hook style; all of them get the source's strongest ideas instead of a summary of it.

Steps:

1. **Ingest the source and establish voice** (`$ARGUMENTS`)
   - Read the source content: a file path, pasted text, or a draft in the repo. If the input is only a URL, ask the user to paste the content (this skill has no network access)
   - Ask (or extract from past posts if provided): who follows these accounts — same audience on every platform, or different? What voice — founder-personal, brand-neutral, technical peer? Any posts that performed well to mimic?
   - Confirm which platforms to target (default: LinkedIn, X, Instagram) and the audience's language — post in the language of the market, and if audiences differ per platform, adapt per platform rather than translating one master post

2. **Extract atomic ideas, not a summary**
   - Pull 3-5 self-contained ideas from the source: a contrarian claim, a specific number or result, a mistake and its fix, a before/after, a step-by-step that fits in one post
   - Each idea must stand alone without reading the source — the source link is a bonus, not a requirement
   - Rank them by hook potential and let the user pick, or pick the strongest per platform and say why

3. **LinkedIn** — 1-2 posts
   - First 2 lines carry the hook (that is all that shows before "…see more"); make them earn the click
   - Format: short paragraphs, generous line breaks, 900-1,300 chars sweet spot; one idea developed with a concrete example or number from the source
   - End with one engagement prompt that a real person would answer — not "Thoughts?"; 0-3 hashtags, link in the post only if the post works without the click

4. **X** — 1 standalone post + 1 thread
   - Standalone: the sharpest single idea in ≤ 280 chars, written to be quotable — no "🧵 A thread on…" without a payoff in the first post
   - Thread (5-8 posts): first post is a complete hook with the promise, each subsequent post delivers one point and can be screenshot alone, last post lands the takeaway and links the source
   - Cut ruthlessly — X rewards density, not completeness

5. **Instagram** — caption + carousel outline
   - Caption: hook in the first line (before the fold), 3-6 short paragraphs, CTA to save/share/comment, 3-8 relevant hashtags at the end, "link in bio" only if there is one
   - Carousel: slide-by-slide text (6-10 slides) — slide 1 is the hook, one idea per slide in ≤ 20 words, final slide is the CTA; note visual direction per slide (e.g., "big number", "before/after split") without designing it

6. **Deliver**
   - Write `social_[source-slug].md` with all posts grouped by platform, each ready to copy-paste, plus a suggested posting order and spacing (do not publish everything the same day)
   - Show one post per platform in conversation for quick review

**Notes:**
- Anti-AI prose applies everywhere: no "In today's fast-paced world…", no "I'm excited/thrilled/humbled to share"; banned words: delve, leverage (verb), unlock, unleash, robust, seamless, game-changer, elevate; vary sentence length; no emoji walls — emojis only where the account's existing voice uses them
- Never invent engagement numbers, testimonials, or results not present in the source; mark gaps as `[verify]`
- Platform norms drift — treat the formats above as strong defaults, and follow the user's corrections about what currently works for their accounts
- No source content yet? Write it first with `/content--blog-post` or `/content--technical-writing`; to plan repurposing as a routine, use `/content--content-calendar`

$ARGUMENTS
