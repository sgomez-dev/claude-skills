---
description: Generate a cookie policy from the cookies and trackers actually set in code
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "COOKIE_POLICY*.md"]
  commands: []
  network: false
  destructive: false
---

Generate a cookie policy from the cookies, local storage, and trackers the code actually sets —
scan the frontend, backend, and third-party SDKs to build the real cookie inventory, then write the
policy around it. Generic cookie policies list cookies the site doesn't set and miss the ones it
does; this one is a census, not a template.

Steps:

1. **Gather context** (`$ARGUMENTS` may contain some — ask for the rest)
   - Jurisdiction: EU/EEA (ePrivacy + GDPR consent rules), UK (PECR), US (disclosure-oriented), other — this decides whether consent-before-setting is legally required or just disclosure
   - Company legal name, website domain(s), and contact for privacy questions
   - Whether a consent management platform (CMP) is in place or planned — check the code for one before asking

2. **Scan the code for first-party cookies and storage**
   - Backend: `Set-Cookie` calls, session middleware config (session cookie name, lifetime, flags), auth/CSRF cookies, framework defaults (many set cookies implicitly — check the framework's session/auth config)
   - Frontend: `document.cookie` writes, `localStorage`/`sessionStorage`/`IndexedDB` usage that stores identifiers or preferences (storage counts under ePrivacy the same as cookies)
   - For each: name, purpose (from surrounding code), lifetime (from `maxAge`/`expires` in code), and flags

3. **Scan for third-party trackers and their cookies**
   - Dependencies and script tags: analytics (Google Analytics, Plausible, Matomo, Mixpanel, PostHog), ads/pixels (Meta, Google Ads, LinkedIn), session replay (Hotjar, FullStory), embedded content that sets cookies (YouTube, maps, social widgets), tag managers (whatever GTM loads must be asked about — code alone can't see it, mark `[CONFIRM: GTM container contents]`)
   - For each service, list its known cookies (e.g., `_ga`, `_gid`, `_fbp`) — mark cookie details from vendor knowledge rather than code as `[VERIFY in browser]`
   - Note whether each fires unconditionally or is gated behind consent in the code — this is the single most important finding

4. **Classify the inventory**
   - Categories: strictly necessary (session, auth, CSRF, load balancing, consent-choice storage), preferences/functional, analytics/performance, marketing/advertising
   - Build the master table: name → provider (first/third party) → category → purpose → lifetime → consent required (per jurisdiction from step 1)
   - Flag legal problems found: non-essential cookies set before consent where consent is required, analytics categorized as "necessary", missing CMP entirely — these go in a fix list

5. **Draft the policy**
   - Write `legal/COOKIE_POLICY.md`: what cookies/storage are (one plain paragraph), the categorized cookie tables from step 4, how consent works on this site (matching the actual CMP behavior found — or `[PLACEHOLDER]` if none exists yet), how to withdraw consent and manage cookies in browsers, third-party links for opt-outs, changes, contact
   - Only list cookies with evidence; keep every `[VERIFY]`/`[CONFIRM]` marker visible

6. **Deliver and flag gaps**
   - Show the inventory table in the conversation; recommend the user verify it against a real browser session (DevTools → Application → Cookies) since runtime-only cookies escape static scanning
   - List the fix list separately: consent gating to add, trackers to remove or gate, CMP to install
   - Suggest follow-ups: `/legal--privacy-policy` (the cookie policy should be linked from it), `/legal--gdpr-audit` if consent gaps were found

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Static scanning has limits: tag managers, A/B tools, and embeds inject cookies at runtime — always recommend a live-browser verification pass and mark unverifiable entries clearly
- A policy listing cookies that consent tooling then blocks is fine; a site setting cookies the policy doesn't list is not — err toward scanning too much
- If the product is an API or has no web frontend, say so and produce a minimal statement instead of inventing cookies
- Keep the tables maintainable: recommend re-running this skill whenever a new SDK or pixel lands in the code

$ARGUMENTS
