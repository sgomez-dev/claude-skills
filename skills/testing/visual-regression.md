---
description: Set up visual regression tests with baselines, CI integration, and flake control
permissions:
  reads: ["**/*"]
  writes: ["**/*.test.*", "**/*.spec.*", "**/__screenshots__/**", "**/__image_snapshots__/**", "playwright.config.*", ".storybook/**", "*.config.*", "package.json", ".github/workflows/**", ".gitignore", ".gitattributes"]
  commands: ["npm", "npx", "yarn", "pnpm", "playwright", "docker"]
  network: false
  destructive: false
---

Catch unintended UI changes by comparing rendered screenshots against approved baselines. Choose a
tool that fits the existing test setup, capture stable baselines, wire the comparison into CI, and
design against flakiness from day one — a flaky visual suite gets ignored within weeks.

Steps:

1. **Detect the UI stack and existing test infrastructure**
   - Identify framework (React/Vue/Svelte/Angular/plain), styling approach, and whether Storybook exists
   - Check for existing E2E tooling (Playwright, Cypress) — extending it beats adding a parallel runner
   - Note what CI runs today and on which OS, since screenshots are platform-specific

2. **Choose the tool**
   - **Playwright `toHaveScreenshot()`** — default when Playwright is present or E2E-level pages need coverage; built-in diffing, no extra services
   - **Storybook + test-runner or Loki** — when Storybook exists; per-component snapshots are cheaper and more isolated than full pages
   - **Cypress + a snapshot plugin** — only if Cypress is entrenched and migration is off the table
   - Hosted diff services (Chromatic, Percy, Argos) need network and a paid account — mention them as an option but implement the local/CI-native path
   - Confirm the choice with the user before scaffolding

3. **Select what to snapshot**
   - Prioritize: design-system components in all states/variants, critical pages (landing, checkout, dashboard), and layouts at 2-3 representative viewports (mobile/desktop at least)
   - Skip screens dominated by dynamic data unless the data can be fixed — every snapshot added is a maintenance commitment
   - One assertion per state; avoid full-page screenshots where a component-scoped one answers the same question

4. **Stabilize rendering before capturing baselines**
   This step decides whether the suite is trustworthy:
   - Freeze time (mock `Date`/clock), seed random data, and mock network responses with fixtures
   - Disable animations and transitions (Playwright's `animations: 'disabled'`, or a global `prefers-reduced-motion`/CSS override injected in tests)
   - Wait for fonts (`document.fonts.ready`) and lazy images before capture; use bundled fonts, never system-default fallbacks
   - Fix viewport size and `deviceScaleFactor`; mask or hide inherently dynamic regions (timestamps, avatars, ads) with the tool's mask option
   - Set a small tolerance (`maxDiffPixelRatio` ~0.01 or equivalent) to absorb antialiasing noise — not to hide real diffs

5. **Generate baselines in the CI environment**
   - Screenshots differ across OS and browser builds — baselines must come from the same environment that compares them: generate inside the CI runner or the tool's Docker image (e.g., Playwright's), not from a developer laptop
   - Commit baselines to the repo (Git LFS if they're numerous/large); name them by test + browser + viewport
   - Document the one command that regenerates baselines (e.g., `npx playwright test --update-snapshots` inside the container)

6. **Wire into CI with a humane review flow**
   - Add a CI job that runs the visual suite and, on failure, uploads the diff report (actual/expected/diff images) as an artifact so reviewers can see what changed without rerunning locally
   - Make updating baselines an explicit, reviewable act: regenerated images land in the PR diff, reviewer approves the visual change alongside the code
   - Deliver a summary: tool chosen, states covered, how to run locally, how to update baselines, and where CI artifacts appear

**Notes:**
- Flake budget is zero: a visual test that fails randomly twice gets skipped forever — invest in step 4 before adding breadth
- Baseline updates in a PR are a *review signal*, not noise; a PR that updates 40 baselines for a one-line CSS change is telling you the change is global
- Component-level snapshots localize failures; page-level ones catch integration/layout bugs — a small number of both beats many of either
- If diffs appear with no code change, suspect environment drift (browser update in CI image) — pin the runner image version

$ARGUMENTS
