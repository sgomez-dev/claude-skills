---
description: "Build user onboarding: signup-to-activation flow, checklists, empty states, metrics"
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Build the path from signup to activated user: a minimal-friction signup handoff, a guided first-run
flow that gets the user to the product's core value fast, checklist and empty states that pull them
forward, and the instrumentation to measure where they drop off. Onboarding is a funnel — this skill
builds both the flow and the ability to see it.

Steps:

1. **Detect the stack and define activation** (`$ARGUMENTS`)
   - Identify framework, ORM, frontend type, and what exists: auth/signup (see `/fullstack--auth-flow`), any onboarding routes, analytics/event tracking already wired (PostHog, Mixpanel, Amplitude, Segment, or a homegrown events table)
   - Define the **activation event** — the single action that predicts retention (first project created, first message sent, first report run). Infer a candidate from the domain model and confirm with the user; everything downstream optimizes for reaching it

2. **Map and trim the funnel**
   - Write out the current path: signup → (verify email?) → (setup steps?) → first value. Every step must justify itself — propose cuts: defer email verification until it's actually needed, make profile fields optional, collect only what personalizes the next step
   - Decide qualification questions (role, team size, use case) only if they change what the user sees next; otherwise cut them
   - Confirm the target flow as a short step list before building

3. **Build the first-run flow**
   - A resumable, skippable setup wizard: persist progress server-side (`onboarding_state` on the user/tenant — step reached, answers, completed_at) so refresh/logout doesn't reset it, and every screen has a visible skip
   - Get to a "aha" moment fast: pre-populate with sample/template data or a guided "create your first X" that completes the activation event inside the flow itself
   - Invited users (joining an existing team/tenant) skip creation steps and land in a shorter variant — branch on membership, don't force the founder path on them

4. **Checklist and empty states**
   - A dismissible getting-started checklist (3-5 items, progress bar) driven by real completion detection — mark items done from actual domain events server-side, never client-only ticks
   - Replace every dead-end empty state on core screens with an action: what this screen will show, one primary CTA, and optionally a "use sample data" path; find them by sweeping list views for bare "No items" renders
   - Keep checklist state in the same `onboarding_state` structure; hide the checklist automatically once complete or dismissed

5. **Instrument the funnel**
   - Emit one event per funnel step through the app's existing analytics layer (or a minimal `events` table if none exists): `signup_completed`, `onboarding_step_viewed/completed` (with step name), `activation_reached`, `checklist_item_completed` — consistent names, user/tenant IDs, no PII in properties
   - Fire the activation event from the server-side domain action, not the UI, so it can't be missed or faked
   - Add a simple funnel query/dashboard stub: conversion per step and time-to-activation, so drop-off is visible from day one

6. **Lifecycle nudges (if a notification system exists)**
   - Wire a "didn't activate within N days" trigger to the app's notification/email layer (see `/fullstack--notification-system`) — one well-timed nudge pointing back at the next checklist item, not a drip barrage
   - Respect consent and unsubscribe state; skip this step cleanly if no email infrastructure exists yet and note it as a follow-up

7. **Tests and handoff**
   - Tests: wizard resume after logout, skip paths land in a working app, invited-user branch, checklist items complete from domain events, activation event fires exactly once, funnel events emitted per step
   - Run the suite; summarize: the activation definition, the funnel steps and where each event fires, migrations to run, and what to watch in the first week (step with the worst drop-off is the next thing to fix)

**Notes:**
- The best onboarding is a shorter one — measure, cut the worst step, repeat; resist adding tours and tooltips before removing friction
- Never block the product behind the wizard: skip must always work, and returning users must never see it again (server-persisted state, not localStorage)
- Sample data must be clearly labeled and cleanly deletable — flag it in the schema, don't mix it irreversibly with real data
- Keep activation criteria honest: an event the team can game (e.g., "viewed dashboard") measures nothing
- Pairs with `/fullstack--feature-flags` to A/B different flows and `/fullstack--multi-tenancy` when onboarding creates the tenant itself

$ARGUMENTS
