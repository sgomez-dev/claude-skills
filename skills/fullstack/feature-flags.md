---
description: Feature flags - provider vs homegrown choice, targeting, kill switches, cleanup
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Add a feature-flag system: choose between a hosted provider and a homegrown store, implement
percentage and audience targeting, kill switches that work when everything else is on fire, and a
cleanup lifecycle so flags don't rot into permanent config. One evaluation API for the whole app,
whatever sits behind it.

Steps:

1. **Detect the stack and existing flagging**
   - Identify framework, ORM, and anything flag-shaped already there (env-var toggles, a `settings` table, Flipper/django-waffle/Laravel Pennant/Unleash SDK half-wired)
   - Note the org model (users? organizations? — see `/fullstack--saas-starter`) since targeting hangs off it
   - Read `$ARGUMENTS` for the first flags wanted and whether a provider preference exists

2. **Propose provider vs homegrown, confirm trade-offs**
   - **Framework-native library** (Flipper, django-waffle, Laravel Pennant, Unleash/OpenFeature for Node): recommended default — battle-tested storage, admin UI, no vendor bill
   - **Hosted provider** (LaunchDarkly, PostHog, etc.): when the team needs non-engineers editing targeting or cross-app flags; wrap the SDK behind your own interface so the provider is swappable
   - **Homegrown table**: fine for a handful of boolean flags — but only choose it knowingly; you'll rebuild targeting and audit later
   - Either way: evaluation must have a **local fallback** (cached rules or hardcoded default) so a flag-store outage degrades to defaults, never to a crash

3. **Storage and evaluation core**
   - Flags: key, description, owner, `default_enabled`, targeting rules, `expires_at` (intent date, not enforcement), timestamps; homegrown → migration; library/provider → its native store
   - One evaluation helper for the entire codebase — `feature_enabled?(:key, actor)` in the stack's idiom — evaluated **server-side** with a short-TTL in-process cache; no scattered direct store reads
   - Deterministic bucketing for percentages: hash(flag key + stable actor id) so a user doesn't flip between variants per request

4. **Targeting rules**
   - Support, in precedence order: explicit actor allow/deny lists (user or org), attribute rules (plan, role, signup date), percentage rollout, then default
   - Target **orgs, not users**, for anything collaborative — half a team seeing a feature is worse than nobody
   - Environment awareness: a flag can be on in staging and off in prod from one definition

5. **Kill switches**
   - Distinguish rollout flags from **operational kill switches** (payments provider degraded, expensive feature melting the DB): kill switches are checked at the entry point of the risky path, flippable at runtime without deploy, and default to the *safe* state if the flag store is unreachable
   - Admin UI or CLI task to flip them, gated to admin roles server-side and **audit-logged** (who flipped what, when — see `/fullstack--admin-panel`)

6. **Frontend exposure**
   - Bootstrap the evaluated flag set for the current actor into the page/API session — client code reads that, it never evaluates rules itself
   - Flags gate UX only in the client; every server endpoint behind a flag re-checks it server-side — hidden is not disabled
   - Don't ship unlaunched feature names/rules to the client beyond the booleans it needs

7. **Cleanup lifecycle, tests, and summary**
   - Every flag gets an owner and an `expires_at` at creation; add a scheduled check (CI step or cron job) that lists expired and 100%-rolled-out flags as "remove me" — the flag's job ends with the flag deleted from code and store
   - Tests: default off, explicit target on, percentage bucketing is stable for one actor, kill switch blocks the path, store-down falls back to default, server endpoint denies when flag off even if UI was bypassed
   - Run the suite; summarize migrations, admin UI route, and `.env.example` additions (provider SDK key as `FEATURE_FLAGS_*` if hosted)

**Notes:**
- Flags are not authorization: entitlements and security checks belong in the RBAC/billing layer (`/fullstack--auth-flow`, `/fullstack--payments-integration`), not in a flag someone can flip
- Keep flag checks at boundaries (controller/route/service entry), not sprinkled through domain logic — cleanup should be deleting one conditional
- Log flag evaluations for debugging rollouts sparingly (key + variant, not full actor data)
- Percentage rollouts need a metrics check between steps — pair increases with error-rate watching before going 10% → 50% → 100%
- Long-lived config (plan limits, tenant settings) belongs in settings/entitlements, not in the flag system

$ARGUMENTS
