---
description: Design mobile navigation: stacks/tabs/modals, auth gating, state restoration
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design a mobile navigation architecture that scales with the app and matches platform conventions — clear
hierarchy, correct back behavior, and state that survives the OS killing the app in the background.

Steps:

1. **Detect the framework and map the screens** (`$ARGUMENTS`)
   - Detect React Native (React Navigation/Expo Router), Flutter (Navigator 2.0/go_router), or native from the repo
   - List the app's screens and group them into flows (onboarding, main, settings, detail)

2. **Choose the navigation structure**
   Design the hierarchy: root stack, tab navigator for top-level sections, nested stacks per tab, and modals for
   focused tasks. Justify tabs vs drawer vs stack by information architecture and platform norms.

3. **Gate authenticated vs unauthenticated flows**
   Split navigators by auth state (auth stack ↔ app stack) so a logged-out user can't reach protected screens via
   deep link or back stack. Define what happens on token expiry mid-session.

4. **Get back behavior and deep links right**
   Handle the Android hardware back button, iOS swipe-back, and correct back-stack construction when arriving via
   a deep link (`/mobile--deep-linking`) so "back" goes somewhere sensible, not out of the app.

5. **Preserve and restore state**
   Implement state restoration so the app returns to where the user was after the OS reclaims memory. Decide what
   is restored (position, scroll, form drafts) vs reset for security (sensitive screens).

6. **Verify transitions and edge cases**
   Check modal dismissal, nested-stack resets on tab switch, and navigation from notifications. Keep transitions
   platform-native and smooth.

**Notes:**
- Respect platform conventions — iOS and Android users expect different back and tab behavior
- Auth-gate at the navigator level, not per-screen — per-screen checks leak via deep links and the back stack
- Pairs with `/mobile--deep-linking` (entry points) and `/mobile--react-native-scaffold` (initial setup)

$ARGUMENTS
