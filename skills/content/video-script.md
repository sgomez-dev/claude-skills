---
description: Video script: hook, retention structure, B-roll notes, CTA — short or long form
permissions:
  reads: ["*.md", "*.txt", "content/**", "scripts/**"]
  writes: ["script_*.md", "drafts/*.md"]
  commands: []
  network: false
  destructive: false
---

Write a video script engineered for retention: a hook that stops the scroll, a structure that keeps
people past the drop-off points, B-roll and visual notes for the edit, and a CTA placed where it
converts. Handles both short form (Reels/Shorts/TikTok, ≤ 90s) and long form (YouTube, 5-20 min) —
the format changes everything, so it is decided first.

Steps:

1. **Establish format, audience, and voice** (`$ARGUMENTS`)
   - Determine from the input: short form or long form? Which platform? Talking-head, screen recording, voiceover, or mixed?
   - Ask (or extract from past scripts/videos if provided): who watches — what do they already know, why did they click? What on-camera voice — energetic, calm expert, deadpan? Any videos of theirs to match?
   - Script in the audience's language, including platform-specific speech patterns of that market — spoken register differs from written far more across languages

2. **Write the hook — 3 options**
   - Short form: the first 1-3 seconds decide everything. Long form: the first 15-30 seconds must restate the click's promise and preview the payoff
   - Draft 3 hooks using different mechanisms: a bold claim ("Most X advice is backwards"), a result shown first ("This took our build from 12 minutes to 40 seconds"), or an open loop ("There's one mistake in this code — most seniors miss it")
   - Never open with "Hey guys, welcome back" or the topic's definition; the hook is the reason to stay, stated immediately
   - Let the user pick, or pick the strongest and say why

3. **Design the retention structure**
   - Map the beats with rough timestamps. Short form: hook → context in one sentence → 2-4 fast points or steps → payoff → CTA, no dead air. Long form: hook → roadmap (one sentence, not a table of contents) → segments of 60-120s each, with a pattern change between segments (location, visual, energy, question)
   - Plant one open loop early ("later I'll show the part that broke") and close it in the final third
   - Mark the known drop-off points (the 30% and 60% marks in long form) and place the strongest material just before them

4. **Write the full script — two columns**
   - Format as a table or two-column layout: **SPOKEN** (exact words to say) | **VISUAL** (B-roll, screen capture, text overlay, cut note)
   - Write for the ear, not the eye: contractions, short sentences, one idea per sentence, no subclauses a speaker would trip on — read it aloud mentally and cut anything that sounds like an essay
   - Anti-AI prose rules apply to speech too: no "In today's fast-paced world…", banned words (delve, leverage as a verb, unlock, unleash, robust, seamless, game-changer, elevate), vary rhythm deliberately, concrete examples with real names and numbers
   - B-roll/visual notes must be specific and shootable: "close-up of the terminal as the error appears", not "relevant footage"

5. **Place the CTA**
   - One primary CTA, matched to the video's goal (subscribe, comment a keyword, click the link, watch the next video) — placed at the natural payoff moment, not tacked on after the value ends
   - Short form: CTA in the final 2-3 seconds plus a caption suggestion. Long form: verbal CTA mid-video where relevance peaks, plus an end-screen CTA pointing to a specific next video
   - Write the CTA as a reason, not a request: "if you want the config file, it's linked below" beats "don't forget to like and subscribe"

6. **Deliver**
   - Write `script_[slug].md` with: chosen hook + the 2 alternates, the beat map with timestamps, the full two-column script, title options (3), thumbnail text suggestion (≤ 4 words), and description draft with the CTA link placeholder
   - Show the hook and the first 30 seconds of script in conversation for quick review

**Notes:**
- Estimate runtime at ~150 spoken words per minute (adjust for language — Spanish runs faster, German slower) and flag if the script overshoots the target length
- Never invent results, view counts, or testimonials for the script; mark claims needing proof as `[verify]`
- One video, one idea — if the outline wants two ideas, that is two videos; park the second one
- The source material can come from `/content--blog-post` or `/content--technical-writing`; to slot videos into a schedule, use `/content--content-calendar`

$ARGUMENTS
