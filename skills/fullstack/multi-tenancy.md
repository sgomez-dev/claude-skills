---
description: "Add multi-tenancy: isolation model choice (row/schema/db), scoping, migrations"
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Convert the current app to multi-tenant (or harden an existing half-done attempt): choose the right
isolation model for the scale and compliance needs, enforce tenant scoping at one server-side choke
point so a missing `WHERE tenant_id` can never leak data, and produce the migrations and backfill
plan for existing rows.

Steps:

1. **Detect the stack and current tenancy state**
   - Identify framework, ORM, and database; look for existing tenancy signals: `tenant_id`/`organization_id`/`account_id` columns, a tenants/orgs table, subdomain routing, or a tenancy library (`acts_as_tenant`, `django-tenants`, `stancl/tenancy`, Prisma client extensions) — complete and harden what exists rather than rewriting
   - Map how users relate to tenants today: one user per tenant, or memberships (a user in many orgs)? This decides the join model and the tenant-switcher UX

2. **Choose the isolation model and confirm trade-offs**
   - **Row-level (shared schema, `tenant_id` column)** — default for SaaS: cheapest to operate, scales to thousands of tenants, isolation is code-enforced; recommend pairing with Postgres RLS as a safety net
   - **Schema-per-tenant**: stronger isolation, per-tenant restore possible; migrations multiply by tenant count and connection/schema switching adds complexity — sensible up to hundreds of tenants with compliance pressure
   - **Database-per-tenant**: hard isolation for regulated/enterprise deals; real operational cost (provisioning, migrations, connection pools) — only with a concrete requirement
   - Present one recommendation with a one-line reason based on tenant count, compliance needs, and team size; confirm before writing code

3. **Data model and tenant resolution**
   - Tables: `tenants` (name, slug/subdomain, status, plan), `memberships` (user_id, tenant_id, role, unique together) — tenant-level roles here, not on the user (see `/fullstack--auth-flow` for the RBAC layer)
   - Resolve the current tenant from exactly one place per request: subdomain, path prefix, or a header/session claim for SPAs — validated against the user's memberships, never trusted raw from client input
   - Store the resolved tenant in request context (middleware) so nothing downstream re-derives it

4. **Enforce scoping at a choke point**
   - Use the ORM's global-scope mechanism (default scopes, Prisma client extension, SQLAlchemy events, Django manager) so every query on tenant-owned models is filtered automatically — hand-written `WHERE tenant_id` on every query is a leak waiting to happen
   - Writes: set `tenant_id` from request context on create; reject cross-tenant foreign keys (composite FK `(id, tenant_id)` or an application-level check)
   - **Defense in depth on Postgres**: enable row-level security with a `current_setting`-based policy per tenant-owned table, set by the same middleware — a forgotten scope then returns zero rows instead of another tenant's data
   - Escape hatch for jobs/admin must be explicit and logged (`withoutTenant()`-style), never the default

5. **Migrations and backfill for existing data**
   - Migration sequence that works on a live app: add nullable `tenant_id` → backfill in batches (map existing rows via their owning user/account) → add NOT NULL + FK + composite indexes (`(tenant_id, ...)` leading column on hot queries) → enable RLS policies
   - Write the backfill as a resumable, batched command; flag any rows that can't be attributed to a tenant for manual review instead of guessing
   - Schema/db-per-tenant paths: generate the migration-runner loop and a provisioning routine for new tenants instead

6. **Sweep the leak surface**
   - Audit beyond the ORM: raw SQL, search indexes (tenant filter mandatory — see `/fullstack--search-feature`), background jobs (must carry and restore tenant context — see `/fullstack--background-jobs`), file storage paths/URLs, caches (tenant in every cache key), and WebSocket channels
   - IDs in URLs: scoped lookups mean a guessed ID 404s instead of leaking — verify every `findById`-style call goes through the scoped path

7. **Tests and handoff**
   - The non-negotiable test: seed two tenants with look-alike data, authenticate as each, and assert every list/detail/update/delete endpoint returns or touches only its own tenant's rows — including a direct-ID probe for the other tenant's records (expect 404, not 403, to avoid existence leaks)
   - Test job context propagation and cache key isolation; run the suite
   - Summarize: isolation model chosen, migration order to run, backfill command, RLS policies added, and the tenant-provisioning entry point

**Notes:**
- Tenant scoping is a security boundary, not a convenience — one choke point plus RLS beats a hundred careful queries
- Never let the client name its tenant (header/body `tenant_id`) without validating membership server-side on every request
- Plan/billing limits belong on the tenant, feature access checks read from it — pairs with `/fullstack--feature-flags` for per-tenant rollouts and `/fullstack--saas-starter` which stubs this structure
- Cross-tenant admin tooling belongs behind the explicit unscoped escape hatch with audit logging — see `/fullstack--admin-panel`
- If moving to schema/db-per-tenant later is plausible, keep tenant resolution behind one interface now; the isolation model is much harder to change than the resolver

$ARGUMENTS
