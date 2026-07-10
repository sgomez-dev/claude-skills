---
description: Multi-channel notifications - in-app, email, push with preferences and digests
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Build a multi-channel notification system: one domain event fans out to in-app feed, email, and
(optionally) push, filtered through per-user preferences, with digest batching so nobody gets ten
emails in an hour. Designed so adding a channel or a notification type later is one class, not a
refactor.

Steps:

1. **Detect the stack and existing pieces**
   - Identify framework, ORM, mailer setup, any existing notifications table or ad-hoc email sends scattered through the code, and whether a job queue exists (this system needs one — run `/fullstack--background-jobs` first if not)
   - Check for a framework-native layer (Rails/Laravel Notifications, django-notifications) and build on it instead of parallel plumbing
   - Read `$ARGUMENTS` for the notification types wanted (mentions, invites, billing alerts...)

2. **Propose the architecture and confirm trade-offs**
   - **Fan-out model**: domain code emits one typed notification (`CommentMentioned`, `InvoiceFailed`); a dispatcher resolves recipients, checks preferences, and delivers per channel via jobs — callers never talk to channels directly
   - **Channels now vs later**: in-app + email first; web/mobile push only if `$ARGUMENTS` asks (it adds real operational surface)
   - **Delivery timing**: instant vs digest-eligible per type — urgent (security, billing) always instant

3. **Data model and migrations**
   - `notifications`: recipient, type, JSON payload (ids + minimal display data), `read_at`, timestamps; index on (recipient, read_at, created_at)
   - `notification_preferences`: recipient × type (or category) × channel → enabled, with sensible seeded defaults; transactional/security types are **not** disableable
   - `notification_deliveries` (per channel attempt: status, sent_at, error) if `$ARGUMENTS` implies auditing/debugging delivery

4. **In-app channel**
   - Feed endpoint (paginated, newest first), unread count, mark-one/mark-all read; every query scoped to the authenticated recipient server-side
   - Bell/badge UI in the stack's frontend idiom; live-update the badge via `/fullstack--realtime-feature` if realtime exists, otherwise poll modestly
   - Render from type + payload through one registry of templates, so payloads stay small and re-renderable when copy changes

5. **Email channel and digests**
   - Deliver through the app's existing mailer abstraction with one layout + per-type templates (subject, preview text, single clear CTA back into the app)
   - **Digests**: digest-eligible notifications accumulate; a scheduled job (cron via the queue) groups them per user per window (e.g. hourly/daily per preference) into one summary email; anything already seen in-app is skipped
   - Every non-transactional email carries an unsubscribe/manage link (signed token — works logged out); honor it before send, not after complaints

6. **Push channel** (only if requested)
   - Web Push with VAPID keys and per-device subscription storage, and/or FCM/APNs via a thin adapter; prune dead tokens on provider rejection
   - Push payloads are minimal (title, body, deep link) — sensitive details stay behind the login, never in the push body

7. **Preferences UI**
   - Settings page: matrix of category × channel toggles plus digest frequency; changes take effect on next dispatch
   - The dispatcher is the single enforcement point — no channel sends without passing the preference check

8. **Tests, env vars, and summary**
   - Tests: event creates in-app row, preference-off suppresses a channel, digest job batches N into one email, unsubscribe link disables the category, transactional type ignores opt-out, recipient can't read another user's feed
   - Run the suite; summarize migrations, seeded default preferences, and `.env.example` additions (mailer vars if new, `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` or `FCM_*` if push)

**Notes:**
- Deliveries are jobs with idempotency keys — a retried job must not send the email twice
- Keep payloads as references (ids) plus minimal display text; look up fresh state at render where staleness would mislead
- Rate-limit per recipient per type (collapse "5 new comments" style) to prevent event storms becoming inbox storms
- Pairs with `/fullstack--background-jobs` (required), `/fullstack--realtime-feature` (live badge), and `/fullstack--onboarding-flow` (lifecycle nudges reuse these channels)
- Never leak other users' data in a shared notification payload; check the recipient's authorization to the subject at dispatch time

$ARGUMENTS
