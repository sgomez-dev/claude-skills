---
description: Scaffold a production React Native/Expo app: navigation, state, theming, CI
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "npm", "yarn", "pnpm", "bun", "git", "pod", "eas"]
  network: false
  destructive: false
---

Scaffold a production-grade React Native app — not a hello-world. Sets up navigation, state
management, theming with dark mode, environment config, linting, and CI from day one, so the first
feature commit lands on solid rails. Defaults to Expo (managed workflow) unless the user needs
native modules Expo can't provide, in which case use a bare React Native + Expo modules setup.

Steps:

1. **Clarify scope and choose the workflow** (`$ARGUMENTS`)
   - Extract from input: app name, purpose, target platforms (iOS/Android/both), and any hard
     requirements (Bluetooth, background audio, custom native code, in-app purchases)
   - Default to **Expo with expo-router** — recommend bare React Native only if a required native
     capability rules Expo out; state the reason explicitly
   - Confirm package manager (detect from lockfiles in the directory, else ask; default npm)
   - Confirm TypeScript (default yes — only skip if the user explicitly refuses)

2. **Create the project skeleton**
   - `npx create-expo-app` with the TypeScript template, then strip demo screens
   - Establish a feature-first structure: `app/` (routes), `src/features/<feature>/`,
     `src/components/ui/`, `src/lib/` (api client, storage, analytics stubs), `src/theme/`
   - Configure absolute imports (`@/`) in `tsconfig.json` and Babel/Metro
   - Add `.env` handling with `expo-constants`/`app.config.ts` — separate `development`,
     `staging`, `production` values; never commit secrets, ship a `.env.example`

3. **Navigation and app shell**
   - expo-router file-based routes: a `(tabs)` group for the main surface, an `(auth)` group
     gated by session state, and a root layout that decides between them
   - Wire a modal route and a not-found route; set Android back-button behavior sanely
   - Deep linking scheme registered in `app.config.ts` from the start (see `/mobile--deep-linking`
     for full universal/app links later)
   - For complex flows, follow the architecture patterns in `/mobile--mobile-navigation`

4. **State, data, and storage**
   - Server state: TanStack Query with a configured client (retry, staleTime, offline-aware)
   - Client state: Zustand for the small global slices (session, preferences) — avoid a
     mega-store; colocate state with features
   - Persistent storage: `expo-secure-store` for tokens, MMKV or AsyncStorage for non-sensitive
     cache; write one `src/lib/storage.ts` wrapper so the backend can be swapped
   - Stub an API client (`src/lib/api.ts`) with base URL from env, auth header injection, and
     typed error handling

5. **Theming and design tokens**
   - `src/theme/`: color tokens (semantic names, light + dark palettes), spacing scale,
     typography scale, radii — one source of truth
   - A `useTheme` hook driven by `useColorScheme()` with a user override persisted in storage
   - 2-3 base UI components (`Button`, `Text`, `Screen`) consuming tokens, as the pattern for
     everything that follows — no inline hex colors anywhere

6. **Quality gates and CI**
   - ESLint + Prettier + strict TypeScript; `lint`, `typecheck`, `test` npm scripts
   - Jest + React Native Testing Library with one real example test per layer (component, hook)
   - GitHub Actions (or the CI detected from the org's other repos): install → lint → typecheck →
     test on every PR; add an EAS Build job for `main` if the user has an Expo account
   - Husky pre-commit running lint-staged (skip if the user dislikes hooks — ask)

7. **Handoff**
   - Run the app once on at least one platform to verify the skeleton boots
   - Print a summary: structure tree, chosen libraries with one-line rationale each, env setup
     instructions, and next steps — `/mobile--push-notifications`, `/mobile--mobile-release`
     when the app is ready to ship

**Notes:**
- Opinionated defaults, but every choice is swappable — say why each library was picked and what
  the alternative is (e.g., Zustand vs Redux Toolkit, MMKV vs AsyncStorage)
- Pin versions that Expo SDK dictates; never mix incompatible RN/Expo versions
- iOS quirks: run `pod install` only in bare workflow; safe-area handling via
  `react-native-safe-area-context` everywhere, never hardcoded insets
- Android quirks: set `edgeToEdge` deliberately, test back-button on the auth gate, and declare
  only the permissions actually used in `app.config.ts`
- Keep the scaffold runnable at every step — commit-sized increments, no big-bang generation
- If a project already exists in the directory, stop and confirm before writing anything

$ARGUMENTS
