---
description: Scaffold a production SaaS starter - auth, orgs/teams, billing stubs, settings, emails
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Scaffold the production foundation every SaaS needs — authentication, organizations/teams with
invites, billing stubs, user and org settings, and transactional email — adapted to whatever stack
the repo already uses. This is the umbrella skill: it builds thin, correct versions of each pillar
and points to the deeper sibling skills (`/fullstack--auth-flow`, `/fullstack--payments-integration`)
for full implementations.

Steps:

1. **Detect the stack**
   - Inspect manifests and structure (`package.json`, `Gemfile`, `requirements.txt`/`pyproject.toml`, `composer.json`, config dirs) to identify language, framework (Next.js, Rails, Django, Laravel, Express...), ORM, and test runner
   - Audit what already exists: an auth system, a users table, a mailer, existing org/tenant concepts — never duplicate, extend
   - If the repo is empty or ambiguous, ask the user which stack to use before writing anything

2. **Propose the architecture and confirm trade-offs**
   Present a short plan and get explicit sign-off before generating code:
   - **Auth strategy**: framework-native library (Devise, django-allauth, Laravel Breeze, Auth.js/Lucia) vs hand-rolled — recommend the battle-tested library for the stack
   - **Org model**: every user gets a personal org (simpler upgrade path, recommended) vs orgs optional
   - **Billing**: stub-only now (plan/subscription tables + gating middleware) with real provider wired later
   - **Email**: provider-agnostic mailer interface with a console/log driver for development

3. **Data model and migrations**
   - Create migrations + models: `users`, `organizations`, `memberships` (user↔org with `role`), `invitations` (token, email, expiry), `subscriptions` (org, plan, status — stub), plus timestamps and soft-delete where the stack convention supports it
   - Add indexes on foreign keys and unique constraints (email, org slug, one membership per user+org)

4. **Auth core**
   - Email/password signup with verified email, login, logout, password reset via single-use expiring token; hash with the stack's standard (bcrypt/argon2)
   - Session or JWT per the confirmed choice, with secure cookie defaults (httpOnly, SameSite, Secure in prod) and CSRF protection where the framework needs it
   - Suggest `/fullstack--auth-flow` afterwards for OAuth providers and full RBAC depth

5. **Organizations and teams**
   - Create org on signup, org switcher context, invite flow (email token → accept → membership), member list with roles (owner/admin/member), remove member
   - Every org-scoped query and mutation checks membership **server-side** — no client-side-only gating

6. **Billing stubs and settings**
   - `plans` seed data, subscription status on org, a `requires_plan(...)` middleware/guard, and a placeholder billing settings page — real checkout/webhooks come from `/fullstack--payments-integration`
   - Settings: user profile (name, email change with re-verification, password change) and org settings (name, slug, danger zone: delete org gated to owner)

7. **Transactional email**
   - Mailer abstraction with one interface and swappable drivers (log driver by default, SMTP/provider env-configured)
   - Templates: welcome, verify email, invitation, password reset — plain but branded-slot-ready

8. **Tests, env vars, and summary**
   - Write tests per layer using the project's runner: auth happy paths + one failure each, invite flow, org access denial for non-members
   - Run the test suite; fix failures before finishing
   - Summarize: files created, migrations to run, `.env.example` additions (APP_URL, SESSION_SECRET, SMTP_*/MAIL_*), and recommended next skills

**Notes:**
- Follow existing project conventions (naming, folder layout, validation style) over any generic template
- Security first: server-side authorization on every org route, no secrets in code, tokens hashed at rest, rate-limit auth endpoints if the stack has middleware for it
- Implement incrementally — one pillar at a time with its tests passing before the next; keep each step reviewable
- Never run destructive migrations against an existing database; generate them and tell the user
- If the project already has one pillar (e.g. auth), skip it and integrate with it instead

$ARGUMENTS
