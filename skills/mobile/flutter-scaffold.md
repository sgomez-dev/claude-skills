---
description: Scaffold a production Flutter app: routing, state management, theming, flavors
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["flutter", "dart", "git", "pod", "gradle"]
  network: false
  destructive: false
---

Scaffold a production-grade Flutter app with routing, an explicit state-management choice, a
token-based theme with dark mode, and build flavors (dev/staging/prod) wired for both platforms.
The goal is a skeleton where the first real feature slots into an obvious place — not a counter
demo.

Steps:

1. **Clarify scope and make the state-management choice** (`$ARGUMENTS`)
   - Extract: app name, org/bundle id, purpose, target platforms (iOS/Android/others), team size
     and Flutter experience
   - Recommend state management based on context and confirm before scaffolding:
     **Riverpod** (default — compile-safe, testable, scales well), **Bloc** (teams that want
     enforced event/state discipline), or **plain ChangeNotifier/Provider** (small apps, beginners)
   - State the trade-off in two sentences; do not silently pick

2. **Create the project and structure**
   - `flutter create` with the confirmed org id and platforms; strip the counter demo
   - Feature-first layout: `lib/features/<feature>/{data,domain,presentation}/`,
     `lib/core/` (router, theme, network, storage, error handling), `lib/shared/widgets/`
   - Turn on strict analysis: `analysis_options.yaml` with `flutter_lints` plus stricter rules
     (`strict-casts`, `strict-raw-types`); zero analyzer warnings is the baseline
   - Add core dependencies for the chosen stack only — no speculative packages

3. **Routing and app shell**
   - `go_router`: typed routes, a `ShellRoute` with bottom navigation for the main surface, an
     auth-gated redirect (`redirect:` reading session state), error/404 route
   - Deep link scheme declared now in `AndroidManifest.xml` and `Info.plist` (full universal/app
     links later via `/mobile--deep-linking`)
   - Navigation architecture patterns — nested stacks per tab, modals, state restoration — follow
     `/mobile--mobile-navigation`

4. **Flavors and environment config**
   - Three flavors: `dev`, `staging`, `prod` — distinct bundle ids/application ids (`.dev`,
     `.stg` suffixes), app names, and icons so all three install side by side
   - Android: `productFlavors` in `build.gradle`; iOS: xcconfig files + schemes per flavor
   - `--dart-define-from-file` env files (`env/dev.json`, etc.) surfaced through a single
     `AppConfig` class; ship examples, never commit real secrets
   - Entry points `main_dev.dart` / `main_staging.dart` / `main_prod.dart` sharing one `bootstrap()`

5. **Theming and design tokens**
   - `lib/core/theme/`: `ColorScheme.fromSeed` for light and dark, a `ThemeExtension` for custom
     tokens (spacing, radii, semantic colors), typography via `TextTheme`
   - Theme mode (system/light/dark) persisted with `shared_preferences` and exposed via the
     chosen state solution
   - 2-3 base widgets (`AppButton`, `AppScaffold`) consuming the theme — the pattern for all UI;
     no raw `Color(0xFF...)` in feature code

6. **Data layer, quality gates, and CI**
   - Network: `dio` with interceptors (auth header, logging in dev, typed errors); storage:
     `flutter_secure_storage` for tokens, `shared_preferences` or `drift` for the rest — wrapped
     behind small interfaces for testability
   - Tests: one unit test (domain), one widget test (a base widget), one provider/bloc test —
     real examples, not placeholders; `very_good_analysis` optional if the team wants stricter
   - CI (GitHub Actions or detected provider): `flutter analyze` → `flutter test` →
     `flutter build apk --flavor dev` on PRs; cache pub and Gradle
   - Run `flutter run --flavor dev` once to verify the skeleton boots, then print a summary:
     structure, choices with rationale, flavor how-to, and next steps
     (`/mobile--push-notifications`, `/mobile--mobile-release`)

**Notes:**
- Flavors are the hardest part to retrofit — that is why they are in the scaffold, not a TODO
- iOS quirks: flavor schemes must be created in Xcode project files (`project.pbxproj`) —
  verify with `flutter build ios --flavor dev --no-codesign`; set minimum iOS target explicitly
- Android quirks: `applicationIdSuffix` per flavor, and keep `minSdkVersion` deliberate rather
  than the template default
- Pick package versions compatible with the current stable Flutter SDK; run `flutter pub outdated`
  at the end and note anything already stale
- Keep it runnable after every step; if a project already exists in the directory, stop and
  confirm before writing anything

$ARGUMENTS
