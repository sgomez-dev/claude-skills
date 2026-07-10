---
description: Admin panel - CRUD for core models, impersonation, audit log, role gates
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Build an internal admin panel: CRUD over the core models with search and filters, safe user
impersonation for support, an append-only audit log of every admin action, and role gates enforced
server-side on every route. Uses the stack's admin framework where a good one exists instead of
hand-building tables.

Steps:

1. **Detect the stack and existing admin surface**
   - Identify framework, ORM, the core models (users, orgs, subscriptions, the domain's main entities), and the existing auth/RBAC layer — this skill consumes it; if there are no roles yet, run `/fullstack--auth-flow` first
   - Check for an admin framework already present or idiomatic: Django admin, ActiveAdmin/Avo/Administrate, Filament/Nova, AdminJS/React-Admin — configuring one beats building one
   - Read `$ARGUMENTS` for which models and admin capabilities matter most

2. **Propose the approach and confirm trade-offs**
   - **Admin framework** (recommended when the stack has a mature one): fast, consistent, already handles pagination/filters; customize per resource
   - **Homegrown routes**: when the stack lacks one or the panel needs to feel like the product — build a thin, boring CRUD layer, resist making it a second app
   - Mounting: same app under `/admin` (simplest, shares auth) vs separate service (only if compliance demands isolation)
   - Roles: at minimum `admin` and `support` (read + impersonate, no destructive writes); map to the existing RBAC scheme

3. **Role gates on every route**
   - One admin middleware/policy at the mount point: authenticated + admin-level role, deny by default; individual actions further gated (destroy, impersonate, billing edits → higher role)
   - Server-side only — nav hiding is UX, not security; every admin endpoint re-checks
   - Rate-limit and log admin logins; if the app has 2FA, require it for admin roles

4. **CRUD for core models**
   - Per resource: paginated index with search (id, email, name) and the filters support actually uses (status, plan, created range), detail view with linked associations, edit limited to **legitimately editable fields** (no direct edits to password hashes, balances, or provider-owned state like Stripe status)
   - Destructive actions: soft-delete where the schema supports it, hard delete behind an extra confirmation and a higher role; bulk actions only where safe
   - Read-only panels for operational views: recent signups, failed jobs (link the queue dashboard from `/fullstack--background-jobs`), webhook failures

5. **Impersonation**
   - Start: record impersonator id + target + reason, swap the session to the target **while keeping the true admin identity in the session** — the audit trail must always know who is really acting
   - During: persistent banner "Viewing as X — return to admin", block sensitive actions while impersonating (password/email change, payment method edits, deleting the account)
   - Stop: one click restores the admin session; sessions expire impersonation on timeout; **admins cannot impersonate other admins**

6. **Audit log**
   - Append-only `audit_logs`: actor (real admin, even when impersonating), action, target type/id, before→after diff for updates (sensitive fields redacted), IP/user agent, timestamp — written from the admin layer automatically, not by remembering to call it per action
   - No update/delete path in application code for this table; viewable and filterable in the panel itself (actor, target, date)
   - Log reads of highly sensitive resources too if `$ARGUMENTS` implies compliance needs

7. **Tests, env vars, and summary**
   - Tests: non-admin gets 403/404 on every admin route, support role denied destructive actions, impersonation writes audit entries and blocks sensitive actions, audit row created on update with correct actor, admin cannot impersonate admin
   - Run the suite; summarize migrations (audit_logs, role additions), how to grant the first admin (env-driven or console task — no seeded default password), and any `.env.example` additions

**Notes:**
- The admin panel is the most attractive attack target in the app — smallest possible surface, strictest gates, everything audited
- Prefer returning 404 over 403 for admin routes probed by non-admins (don't confirm the panel's existence)
- Keep business rules in the domain layer; admin edits go through the same validations and callbacks as user-facing writes — no raw attribute bypasses
- Pairs with `/fullstack--auth-flow` (RBAC source), `/fullstack--feature-flags` (kill-switch UI lives here), and `/fullstack--search-feature` (admin search over big tables)
- If the app is multi-tenant, admin queries are the one sanctioned cross-tenant path — make that explicit in code, not an accidental unscoped query (see `/fullstack--multi-tenancy`)

$ARGUMENTS
