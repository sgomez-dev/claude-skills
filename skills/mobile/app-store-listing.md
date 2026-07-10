---
description: "Craft App Store/Play listings: title, keywords/ASO, descriptions, screenshot plan"
permissions:
  reads: ["**/*"]
  writes: ["store/**", "fastlane/metadata/**", "*.md"]
  commands: []
  network: true
  destructive: false
---

Produce a complete, submission-ready store listing for both the Apple App Store and Google Play:
keyword research grounded in real competitor listings, title/subtitle within the hard character
limits, descriptions written for how each store actually indexes them, and a screenshot plan the
designer can execute — plus the compliance metadata (ratings, privacy) reviewers check first.

Steps:

1. **Understand the app from the repo** (`$ARGUMENTS`)
   - Detect the stack (React Native/Expo, Flutter, native) and pull facts from the source:
     app name and bundle ID (`app.config.ts`/`pubspec.yaml`/`Info.plist`/`build.gradle`),
     README, feature folders, in-app strings, existing metadata (`fastlane/metadata/`,
     `store/`) — extend existing metadata rather than replacing it blind
   - Extract from input: target audience, top 3 differentiators, category, markets/languages,
     and whether this is a new listing or an optimization pass on a live one
   - If the value proposition isn't clear from repo + input, ask one concise question — the
     whole listing hangs on it

2. **Keyword research (web search)**
   - Search the app's category: top-ranking competitor listings on both stores, their titles,
     subtitles, and short descriptions — extract the keyword patterns that rank
   - Build a keyword sheet: term, est. relevance, competition (who ranks for it), and where it
     will be placed (title > subtitle/short description > keyword field > Play long
     description); prefer specific mid-tail terms over unwinnable head terms ("expense tracker
     for freelancers" over "finance")
   - Note store-specific mechanics: Apple indexes title + subtitle + the 100-char keyword field
     (comma-separated, no spaces after commas, no duplicates of title words); Google indexes
     title, short description, and the full description

3. **Titles and taglines (hard limits)**
   - **App Store**: title ≤ 30 chars, subtitle ≤ 30 chars, keyword field ≤ 100 chars — draft 3
     title+subtitle candidates and recommend one with the reasoning
   - **Google Play**: title ≤ 30 chars, short description ≤ 80 chars — the short description is
     both indexed and the conversion hook above the fold; write it as benefit-first copy
   - Play policy: no keyword stuffing, no "free/#1/best" spam, no emoji in titles — violations
     get listings rejected; Apple rejects titles that claim ranking or price

4. **Descriptions, written per store**
   - **App Store** (≤ 4000 chars, *not* indexed for search): pure conversion copy — first two
     lines carry the hook (visible before "more"), then benefit-led feature blocks, social
     proof placeholder, closing CTA
   - **Google Play** (≤ 4000 chars, indexed): same structure but weave the keyword sheet terms
     in naturally at ~2-3% density; use short paragraphs and unicode-safe bullets
   - Draft promotional text (App Store, 170 chars, updatable without review) and localize the
     listing for each target market from input — transcreate the hook, don't machine-translate
     the whole thing

5. **Screenshot and asset plan**
   - Plan a caption-led narrative: shot 1 = core value promise, shots 2-4 = key features in
     priority order, shot 5+ = social proof/breadth; captions ≤ 6 words, readable at thumbnail
     size — most users never swipe past shot 2
   - Required sizes: App Store — 6.9" iPhone set (mandatory; 6.5" derivable) and 13" iPad if
     iPad is supported; Play — phone screenshots (min 2), 7"/10" tablet if supported, plus the
     1024×500 feature graphic and 512×512 icon; app preview video/promo video optional but
     spec'd if the user wants it
   - Deliver this as a shot-by-shot brief (screen to capture, caption, device frame y/n) that a
     designer or `/mobile--mobile-performance`-tuned build can produce

6. **Compliance metadata and deliverables**
   - Fill in the reviewer-checked fields: category (primary/secondary), age rating
     questionnaire answers, Apple privacy nutrition labels and Play Data Safety form (derive
     honestly from the SDKs actually present in the repo — an analytics SDK means "data
     collected"), support URL, privacy policy URL
   - Write everything to `store/` (or `fastlane/metadata/<locale>/` if fastlane is present, in
     its exact file layout: `title.txt`, `subtitle.txt`, `description.txt`, etc.) so
     `/mobile--mobile-release` can upload it directly
   - Summarize: chosen keywords and why, the recommended title pair, and the top 3 things to
     A/B test after launch (Play Store listing experiments; Apple Product Page Optimization)

**Notes:**
- Never fabricate ratings, download counts, or testimonials — placeholders must be clearly
  marked `[replace with real quote]`
- Keyword data from free sources is directional, not exact — say so; paid ASO tools (Sensor
  Tower, AppTweak) are the upgrade path if the user wants volume numbers
- The privacy labels must match runtime behavior; a mismatch is a rejection (Apple) or a
  listing takedown (Play) — cross-check against the dependency list, not intentions
- Character limits are enforced in UTF-16 code units; count carefully for non-Latin locales
- Re-run this skill before major releases: listings decay as competitors iterate

$ARGUMENTS
