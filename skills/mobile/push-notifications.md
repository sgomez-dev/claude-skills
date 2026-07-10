---
description: Implement push notifications: FCM/APNs setup, token lifecycle, permission UX
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "flutter", "pod", "gradle", "xcrun", "adb"]
  network: false
  destructive: false
---

Implement production-grade push notifications end to end: provider setup (FCM for Android, APNs
for iOS — usually via FCM as the single backend-facing API), device token lifecycle, deep-link
payloads that open the right screen, and a permission UX that maximizes opt-in instead of burning
the one-shot iOS prompt on app launch.

Steps:

1. **Detect the stack and current state** (`$ARGUMENTS`)
   - Framework: `package.json` with `react-native`/`expo` → React Native; `pubspec.yaml` →
     Flutter; only `ios/`/`android/` (or `.xcodeproj`/`build.gradle` at root) → native
   - Inventory what already exists: push libraries (`expo-notifications`,
     `@react-native-firebase/messaging`, `notifee`, `firebase_messaging`), Firebase config files
     (`google-services.json`, `GoogleService-Info.plist`), iOS entitlements, notification
     channels — extend what's there, don't duplicate
   - Extract from input: notification use cases (transactional, marketing, silent data pushes),
     backend that will send them, and any provider preference (raw FCM/APNs vs OneSignal/Braze)

2. **Wire the platform plumbing**
   - **iOS**: Push Notifications capability + `aps-environment` entitlement, APNs auth key
     (`.p8`) uploaded to Firebase/provider (tell the user to create it in the Apple Developer
     portal — never ask them to paste the key into chat), `remote-notification` background mode
     only if silent pushes are used
   - **Android**: `google-services.json` in place, Gradle plugin applied, a default notification
     channel created at startup (required API 26+; no channel = dropped notifications), small
     icon as a white-on-transparent silhouette (a colored icon renders as a white square)
   - Expo managed: prefer `expo-notifications` + EAS credentials; bare RN: React Native Firebase;
     Flutter: `firebase_messaging` + `flutter_local_notifications` for foreground display

3. **Implement the token lifecycle**
   - Obtain the token after permission is granted, register a refresh listener, and POST it to
     the backend with platform + app version; re-sync on every app start (tokens rotate)
   - Delete the token server-side on logout so a shared device doesn't receive the previous
     user's notifications; handle multi-device users as a token list, not a single column
   - Treat tokens as sensitive: never log them in production, never commit test tokens

4. **Handle messages in all three app states**
   - Foreground (OS shows nothing by default — display in-app or via local notification),
     background (tap handler), and killed/cold start (initial-notification API) — each path must
     land on the same routing code
   - Define the payload contract with the backend: a `data` block containing a deep-link URL or
     `{type, id}` pair — route taps through the app's deep-link handler (see
     `/mobile--deep-linking`) instead of a parallel navigation path
   - Silent/data-only pushes: iOS `content-available: 1` is throttled and never guaranteed —
     don't build sync correctness on it (see `/mobile--offline-sync` for real sync triggers)

5. **Design the permission UX**
   - Never request on first launch: show a pre-permission primer at the moment of value ("Get
     notified when your order ships") and only trigger the OS prompt after the user opts in —
     iOS gives exactly one system prompt, a decline is near-permanent
   - Android 13+ requires the `POST_NOTIFICATIONS` runtime permission — same primer pattern;
     older Android grants it implicitly
   - Handle the denied state gracefully: an in-app settings row that deep-links to the OS
     settings page; consider iOS provisional authorization (quiet delivery, no prompt) for
     low-stakes content

6. **Test and verify**
   - Send a real test push (FCM console or a `curl` example for the backend team) to a physical
     Android device and a physical iPhone — real APNs delivery cannot be tested on the simulator
     (simulated pushes via `xcrun simctl push` verify handling code only)
   - Walk the matrix: foreground/background/killed × notification tap → correct screen, correct
     badge/channel behavior, logout → no more pushes
   - Summarize what was configured, the payload contract for the backend, and remaining manual
     steps (APNs key upload, store review notes if using VoIP/critical alerts)

**Notes:**
- APNs environment must match the build: development builds get sandbox APNs, TestFlight/App
  Store get production — a "token registered but nothing arrives" bug is usually this
- Don't put sensitive content in the notification payload; it transits Google/Apple servers —
  send an ID and fetch on open
- Notification permissions ≠ delivery: OEM battery savers (Xiaomi, Samsung) kill background
  delivery — document this for support, don't fight it in code
- If the app targets the EU/California, tie marketing pushes to an explicit consent flag,
  separate from the OS permission
- Signing and entitlements must be reflected in release builds — coordinate with
  `/mobile--mobile-release`

$ARGUMENTS
