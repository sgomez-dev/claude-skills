---
description: "Audit mobile performance: startup time, jank, bundle/APK size, memory, images"
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "flutter", "pod", "gradle", "adb", "xcrun", "xcodebuild"]
  network: false
  destructive: false
---

Audit and fix mobile performance where users actually feel it: cold-start time, dropped frames
while scrolling, download size, memory growth, and image handling. Measurement first — every
finding gets a number before and a number after, so the report is a prioritized list of fixes
with proven impact, not a pile of generic advice.

Steps:

1. **Detect the stack and available tooling** (`$ARGUMENTS`)
   - Framework: React Native (check Hermes enabled, old vs new architecture, Expo vs bare),
     Flutter (stable channel, impeller), or native — the profiling toolbox differs completely
   - Extract from input: the specific complaint if there is one ("slow to open", "list stutters",
     "app is 180 MB") and the target devices — always audit against a low-end Android device
     profile, not the dev's flagship
   - Locate release-build configs; **all measurements below happen on release/profile builds**
     (JS dev mode and Flutter debug builds are 2-10x slower and lie)

2. **Measure baselines**
   - Cold start: `adb shell am start -W <package>/<activity>` (TTID/TTFD) on Android; Xcode
     Organizer launch metrics or the App Launch Instruments template on iOS; record 5 runs,
     take the median
   - Frames: Flutter DevTools timeline / RN Perf Monitor + Perfetto (`adb shell perfetto`) /
     Instruments Core Animation — capture a trace of the janky flow
   - Size: build the release artifact and analyze — `apkanalyzer`/Android Studio APK Analyzer
     for AAB/APK, App Store Connect size report or `.ipa` inspection for iOS; JS bundle via
     `npx react-native-bundle-visualizer` or `source-map-explorer`; Flutter via
     `flutter build --analyze-size`
   - Memory: a 10-minute usage session watching for monotonic growth (Instruments Allocations,
     Android Studio Memory Profiler)

3. **Fix startup**
   - Defer everything not needed for first frame: lazy-load heavy modules (RN `require` on
     demand, Flutter deferred components), move SDK inits (analytics, crash reporting) off the
     critical path to post-first-frame
   - RN: confirm Hermes is on and `inlineRequires` enabled; check for a fat root import graph
   - Kill splash-screen sins: no artificial delays, no network calls before first render — show
     cached content immediately (pairs with `/mobile--offline-sync`)
   - Native: audit `Application.onCreate`/`didFinishLaunching` for synchronous I/O

4. **Fix jank**
   - Lists: virtualization with correct item sizing — FlashList over FlatList (RN),
     `ListView.builder` with `itemExtent`/`prototypeItem` (Flutter); no full-list re-renders on
     item state change
   - RN re-renders: profile with React DevTools, memoize expensive subtrees, move animations to
     the UI thread (Reanimated), keep bridge/JSI traffic out of scroll handlers
   - Flutter: shrink rebuild scopes (const constructors, granular widgets), `RepaintBoundary`
     around expensive stable subtrees, watch for shader-compilation jank on first run
   - Confirm each fix in a new trace — same flow, same device, frame-time histogram before/after

5. **Fix size**
   - Android: ship AAB (Play splits per device), R8/ProGuard with shrinking on, remove unused
     ABIs from any standalone APK
   - iOS: app thinning is automatic — attack asset bloat and Swift/static library duplication;
     check `ipatool`-style breakdowns per framework
   - Assets: the usual 80% — convert PNG/JPEG to WebP (Android) / HEIF (iOS) or serve remotely,
     strip unused fonts and icon packs (tree-shake Flutter icons), audit `assets/` for
     forgotten 4 MB onboarding videos
   - Dependencies: from the bundle visualization, list the top 10 heaviest and flag replaceable
     ones (moment→date-fns class of fixes)

6. **Fix memory and images**
   - Leaks: LeakCanary (Android), Instruments Leaks (iOS); usual suspects — listeners/timers
     not cleaned up on unmount/dispose, retained closures over screens, unbounded in-memory
     caches
   - Images: downsample to display size (never decode a 4000px photo into a 100px avatar),
     cache decoded images (`expo-image`/FastImage, `cached_network_image`), request resized
     variants from the CDN instead of resizing on device

7. **Report and lock in the wins**
   - Deliver a findings table: issue → evidence (trace/number) → fix applied or recommended →
     measured/estimated impact → effort; ordered by user-felt impact per unit effort
   - Set budgets (cold start ms, artifact MB, frame-time p95) and wire regression checks into
     CI where cheap: size diff on PRs, a startup-time smoke test on a device farm if available
   - Point remaining work at siblings: keep budgets enforced through `/mobile--mobile-release`

**Notes:**
- Never conclude anything from a debug build or a simulator — emulators fake GPU and disk
  characteristics; use a real low-end Android device as the reference
- One variable at a time: apply a fix, re-measure, record — batching fixes destroys attribution
- Perceived performance counts: skeletons, cached-first rendering, and optimistic UI often beat
  another 100 ms of real optimization
- Don't micro-optimize below the noise floor (< ~5% on a 5-run median); device thermals and
  background daemons produce that much variance
- Startup regressions creep back — the CI budget checks from step 7 are the actual deliverable

$ARGUMENTS
