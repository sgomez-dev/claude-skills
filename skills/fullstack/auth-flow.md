---
description: Implement full auth - OAuth and email flows, sessions/JWT, RBAC, password reset
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Implement a complete, production-grade authentication system for the current stack: email/password
and OAuth login, session or JWT management, role-based access control enforced server-side, and a
secure password-reset flow. Extends existing auth if any is found rather than replacing it.

Steps:

1. **Detect the stack and existing auth**
   - Identify framework, ORM, and any auth already present (user model, middleware, sessions, an auth library half-installed)
   - Map current login/registration routes if they exist — the goal is to complete and harden, not rewrite
   - Note frontend type (server-rendered, SPA, mobile API) since it drives the session-vs-JWT choice

2. **Propose approach and confirm trade-offs**
   - **Library vs hand-rolled**: strongly recommend the stack's battle-tested option (Devise, django-allauth, Laravel Fortify/Breeze, Auth.js, Lucia, Passport) — hand-roll only the parts the library doesn't cover
   - **Sessions vs JWT**: server-rendered or same-domain SPA → httpOnly cookie sessions (revocable, simpler); separate API + mobile clients → short-lived JWT access + rotating refresh tokens. Present the trade-off and let the user pick
   - **OAuth providers**: ask which (Google, GitHub, Microsoft...) or detect from `$ARGUMENTS`

3. **Data model and migrations**
   - `users` (email unique + citext/lowercased, password_hash nullable for OAuth-only users, email_verified_at), `oauth_accounts` (provider, provider_user_id unique per provider), `sessions` or `refresh_tokens` (hashed token, expiry, revoked_at, user agent/IP for the sessions list), `password_reset_tokens` (hashed, single-use, short expiry)
   - Roles: `role` enum on user for simple apps, or `roles`/`permissions` join tables if `$ARGUMENTS` implies granular RBAC

4. **Email/password flows**
   - Registration with email verification (signed or stored token), login with constant-time comparison and generic "invalid credentials" errors, logout that actually revokes the session/refresh token
   - Password reset: request → email single-use token (hashed at rest, 30–60 min expiry) → reset form → invalidate all sessions on success; identical response whether the email exists or not
   - Hash with bcrypt/argon2 via the stack default; rate-limit login and reset endpoints

5. **OAuth flows**
   - Authorization-code flow with `state` (and PKCE where supported) via the stack's library
   - Account linking rules: match on verified email only; if email unverified at provider, require verification before linking; never auto-merge into an existing account silently

6. **Session/JWT hardening**
   - Cookies: httpOnly, Secure (prod), SameSite=Lax (Strict for sensitive apps), session ID rotation on login/privilege change; CSRF protection for cookie-based auth
   - JWT path: short access TTL (≤15 min), refresh rotation with reuse detection (revoke family on reuse), keys from env — never hardcoded
   - "Active sessions" management: list + revoke individual sessions

7. **RBAC enforcement**
   - Central authorization layer (middleware/policy/decorator per stack convention) — every protected route declares its requirement; deny by default
   - Server-side checks only are authoritative; frontend role checks are UX sugar. Seed an initial admin safely (env-driven, not a hardcoded password)

8. **Tests, env vars, and summary**
   - Tests: register/verify/login/logout, wrong password, reset happy + expired token, OAuth callback (mocked provider), RBAC denial for each protected role, session revocation
   - Run the suite; then summarize migrations to run and `.env.example` additions (SESSION_SECRET/JWT keys, OAUTH_<PROVIDER>_ID/SECRET, APP_URL for callbacks)

**Notes:**
- Never log passwords, tokens, or full JWTs; store only hashes of reset/refresh tokens
- Generic error messages everywhere user enumeration is possible (login, reset, registration conflicts)
- Follow the framework's own auth conventions before generic patterns — a Rails app gets Devise idioms, not Express middleware ported over
- Pairs with `/fullstack--saas-starter` (which stubs this) and `/fullstack--admin-panel` (which consumes the RBAC layer)
- If 2FA/TOTP is requested in `$ARGUMENTS`, add it as a final increment with backup codes hashed at rest

$ARGUMENTS
