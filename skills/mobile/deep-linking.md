---
description: Set up universal/app links: config, in-app routing, deferred links, QA matrix
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "flutter", "pod", "adb", "xcrun"]
  network: false
  destructive: false
---

Implement deep linking properly: custom URL scheme as the baseline, verified HTTPS links (iOS
Universal Links, Android App Links) as the real product surface, in-app routing that survives
cold starts and auth walls, and a QA matrix so "the link opened the browser instead of the app"
never ships. Produces both the app-side config and the server files the web team must host.

Steps:

1. **Detect the stack and current state** (`$ARGUMENTS`)
   - Framework: React Native (expo-router or react-navigation linking config), Flutter
     (`go_router`/`app_links`/`uni_links`), or native (iOS `AppDelegate`/`SceneDelegate`
     handlers, Android intent filters)
   - Inventory existing config: URL scheme in `app.config.ts`/`Info.plist`/`AndroidManifest.xml`,
     associated-domains entitlement, existing intent filters, any hosted
     `apple-app-site-association` or `assetlinks.json`
   - Extract from input: the web domain, which screens must be linkable, and whether deferred
     deep links (link → install → open at destination) are required

2. **Define the URL strategy**
   - Map every linkable screen to a canonical HTTPS path (`https://example.com/product/:id`) and
     mirror it in a custom scheme (`myapp://product/:id`) for QA and app-to-app use
   - Decide fallback behavior for each path when the app isn't installed: web page, store
     redirect, or smart banner — HTTPS links must degrade gracefully by design
   - Write the route table (path → screen → required params → auth required?) before touching
     config; this table drives steps 3-4 and the QA matrix

3. **Configure both platforms**
   - **iOS Universal Links**: `applinks:example.com` in the Associated Domains entitlement;
     generate the `apple-app-site-association` JSON (served at
     `/.well-known/apple-app-site-association`, `Content-Type: application/json`, no redirect,
     no extension) — hand this file to the web team with exact hosting requirements
   - **Android App Links**: intent filter with `android:autoVerify="true"` for the domain;
     generate `/.well-known/assetlinks.json` with the release **and** debug SHA-256 cert
     fingerprints (from the upload key or Play App Signing key — the Play one is what matters
     in production)
   - Register the custom scheme on both platforms; on Expo, all of this lives in
     `app.config.ts` (`scheme`, `ios.associatedDomains`, `android.intentFilters`)

4. **Implement in-app routing**
   - Handle both entry points with one code path: cold start (initial URL API) and warm/running
     (URL event listener) — a link must behave identically in both
   - Auth-gated destinations: if the target requires login, stash the destination, run the auth
     flow, then redirect — never drop the link on the login screen (pattern details in
     `/mobile--mobile-navigation`)
   - Validate params defensively: a malformed or stale ID must land on a friendly not-found
     screen, not a crash; unknown paths fall through to home with a log
   - Route push-notification taps through this same handler (see `/mobile--push-notifications`)

5. **Deferred deep links (if required)**
   - Native platforms don't preserve the link across a store install — you need an attribution
     layer: Branch/Appsflyer/Adjust, or a self-hosted approach (Play Install Referrer on
     Android; clipboard/probabilistic matching on iOS has App Store policy risk — flag it)
   - Firebase Dynamic Links is shut down (sunset August 2025) — if the repo uses it, plan the
     migration as part of this work
   - Keep the deferred payload identical to the direct-link payload so routing code is shared

6. **QA matrix and verification**
   - Build and run the matrix: {custom scheme, HTTPS link} × {app killed, backgrounded,
     foregrounded} × {logged in, logged out} × {valid, invalid params} — record pass/fail
   - Drive links from the CLI: `xcrun simctl openurl booted "https://…"` and
     `adb shell am start -a android.intent.action.VIEW -d "https://…" <package>`; verify Android
     App Links verification with `adb shell pm get-app-links <package>`
   - Validate hosted files: Apple's CDN caches AASA (allow up to 24-48 h for changes);
     Android's statement list can be checked via Google's digital asset links API
   - Deliver: route table, both well-known files, config diffs, and the completed QA matrix

**Notes:**
- Universal Links do not fire when the user types the URL or the app itself opens it — test by
  tapping links from Notes/Messages/another app, not Safari's address bar
- Android App Links verification silently fails on fingerprint mismatch — always include the
  Play App Signing SHA-256, not just the local keystore's
- The AASA file must be served without redirects and without authentication — a marketing-site
  redirect to `www.` is the most common breakage
- Never put secrets or session tokens in deep-link URLs; links end up in logs, browser history,
  and screenshots
- Keep scheme names unique-ish (`myapp` not `app`); Android resolves scheme collisions with a
  disambiguation dialog, iOS behavior is undefined

$ARGUMENTS
