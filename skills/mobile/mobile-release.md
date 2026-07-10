---
description: Set up mobile releases: versioning, signing, beta tracks, staged rollout, submission
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "flutter", "pod", "gradle", "xcodebuild", "xcrun", "fastlane", "eas", "git tag", "keytool -list"]
  network: false
  destructive: false
---

Set up a repeatable release pipeline for a mobile app: coherent versioning across both platforms,
signing configured safely (secrets referenced, never committed), beta distribution through
TestFlight and Play internal/closed tracks, staged production rollout, and a store-submission
checklist that avoids the classic rejection traps. Produces automation the team can run, without
shipping anything itself.

Steps:

1. **Detect the stack and current release state** (`$ARGUMENTS`)
   - Framework: `package.json` with `react-native`/`expo` → React Native (Expo managed → EAS is the whole answer for builds/submission); `pubspec.yaml` → Flutter; bare `ios/`/`android/` → native
   - Inventory existing tooling: `fastlane/` folders, `eas.json`, CI workflows, signing configs (`build.gradle` signingConfigs, `ExportOptions.plist`), and how versions are currently bumped — extend what exists
   - Extract from input: target tracks (beta only vs full production), CI provider, and whether this is a first release (store listings must exist first — see `/mobile--app-store-listing`)

2. **Establish the versioning scheme**
   - One user-facing semver (`1.4.0`) shared by both platforms, sourced from a single place (`package.json`, `pubspec.yaml` `version:`, or a `VERSION` file) and injected into `CFBundleShortVersionString` and `versionName` at build time
   - Build numbers are monotonic and never reused: `CFBundleVersion` and `versionCode` auto-incremented by CI (timestamp or run number) — Apple and Play both hard-reject a reused build number, and `versionCode` can never decrease
   - Tag releases in git (`v1.4.0`) so any shipped binary maps back to a commit

3. **Configure signing without leaking secrets**
   - **iOS**: distribution certificate + provisioning profiles via fastlane `match` (encrypted repo/bucket) or EAS-managed credentials; App Store Connect API key (`.p8`) for CI auth — instruct the user to place keys in CI secrets, never paste them into chat or commit them
   - **Android**: release keystore stored outside the repo, referenced from `~/.gradle/gradle.properties` or CI secrets; strongly recommend enrolling in Play App Signing so Google holds the app signing key and a lost upload key is recoverable
   - Verify `.gitignore` covers keystores, `.p8`/`.p12` files, and service-account JSON; check git history for any already-committed secret and flag it for rotation if found

4. **Build lanes / pipeline**
   - Create the automation in the stack's native tool: fastlane lanes (`beta`, `release`) for native/bare RN and Flutter, or `eas.json` build profiles (`development`, `preview`, `production`) for Expo
   - Each lane: clean build → version/build-number injection → signed artifact (`.aab` for Play — required; `.ipa` for iOS) → upload to the right track; wire into existing CI as a manual-approval or tag-triggered job
   - Bake release hygiene in: R8/ProGuard rules verified, debug flags/logging stripped, sourcemaps/dSYMs/native symbols uploaded to the crash reporter, API endpoints pointing at production

5. **Beta distribution**
   - **iOS TestFlight**: internal testers (up to 100, instant, no review) for the team; external groups go through beta review (~first build of a version) — plan a day of buffer
   - **Android**: internal testing track (instant, up to 100 testers) → closed track for a wider group; note that new personal Play accounts face closed-testing requirements before production access
   - Define the promotion rule: a build must soak in beta with crash-free sessions above a threshold (e.g., 99.5%) before promotion — the same binary gets promoted, never rebuilt

6. **Staged production rollout**
   - **Play**: staged rollout starting at 5-10% → 25% → 50% → 100%, with the crash/ANR check between bumps; a halted rollout stops new installs but doesn't roll back installed users — a bad build needs a fixed `versionCode` above the old one
   - **iOS**: phased release (7-day automatic curve) — it can be paused but existing updates don't revert, and users can still update manually; pair with "Reset" only before full release
   - Document the halt/hotfix runbook: halt rollout → branch from the release tag → fix → new build number → expedited review request on iOS if user-facing breakage

7. **Store submission checklist and handoff**
   - Pre-flight the classic rejections: privacy "nutrition labels" / Play Data safety form matching actual SDK data collection, account-deletion path if the app has accounts, tracking-permission (ATT) prompt if applicable, demo credentials for review, export-compliance answer, target API level current for Play
   - Verify entitlements/permissions in the release build match features actually used (push entitlements — see `/mobile--push-notifications`; associated domains — see `/mobile--deep-linking`)
   - Summarize: the lane/profile commands to run, secrets the user must add to CI (named, not valued), the promotion + rollout runbook, and remaining manual store-console steps

**Notes:**
- This skill configures and documents the pipeline but never submits — the user (or their CI, on their trigger) runs the upload
- The binary that soaked in beta is the binary that ships; rebuilding "the same code" for production invalidates the testing
- Keep an eye on review-time asymmetry: Apple review is hours-to-days, Play is usually hours but can flag randomly — never plan a marketing date on same-day approval
- OTA update layers (Expo Updates, CodePush successors) shift JS-only fixes out of this pipeline but store rules still apply: no changing the app's primary purpose OTA
- First-time releases need listings, screenshots, and content ratings in place — run `/mobile--app-store-listing` first; crash-free promotion gates assume monitoring from `/mobile--mobile-performance`

$ARGUMENTS
