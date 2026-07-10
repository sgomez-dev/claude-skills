---
description: Background job system - queue choice for the stack, workers, retries, cron, monitoring
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", "Procfile", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Set up a production background-job system for the current stack: the right queue backend, worker
processes, retries with idempotency, scheduled/cron jobs, and a way to see what's failing. Migrates
inline slow work (emails, webhooks, file processing) onto the queue as the first proof.

Steps:

1. **Detect the stack and existing async work**
   - Identify framework, ORM, and anything already queue-shaped (Sidekiq/Solid Queue, Celery, BullMQ, Laravel queues on `sync`, a half-configured Redis)
   - Find inline work that should be async: mail sends, third-party API calls, image processing, report generation — list the candidates
   - Note hosting: can it run a persistent worker process? Serverless pushes toward managed queues (SQS + functions, QStash, Cloud Tasks) or DB-polling

2. **Propose the queue and confirm trade-offs**
   - **Framework-native first**: Rails → Solid Queue/Sidekiq, Django → Celery (or a DB-backed option for small apps), Laravel → queues with Redis/database driver, Node → BullMQ (Redis) or pg-boss/Graphile Worker (Postgres)
   - **Database-backed vs Redis**: DB-backed wins below serious volume — one less service, transactional enqueue with your data; Redis wins on throughput and latency. Recommend DB-backed unless scale says otherwise
   - Present the choice with the operational cost of each; confirm before installing anything

3. **Job layer and first migration of inline work**
   - One base job convention: named queues (`default`, `mailers`, `low`), serialized arguments as ids not records (fetch fresh state at run time), per-job timeout
   - Move the detected inline work into jobs; enqueue **after** the surrounding DB transaction commits (or via transactional enqueue if the backend is DB-backed) so jobs never run against uncommitted state
   - Wire the worker process: dev runs it alongside the app (Procfile/compose entry), document the prod command

4. **Retries, idempotency, and the dead-letter path**
   - Retries with exponential backoff + jitter, capped attempts; classify errors — validation/permanent failures must not retry
   - Every job **idempotent**: guard with a natural key or processed-marker so a retry after a partial run doesn't double-send the email or double-charge; this is the rule, not the exception
   - Exhausted jobs land in a dead-letter/failed set that is visible and re-runnable, never silently dropped

5. **Scheduled and cron jobs**
   - Use the backend's scheduler (Solid Queue recurring, Celery beat, BullMQ repeatables, Laravel scheduler) rather than system crontab, so schedules live in code and deploy with it
   - Ensure single-execution across multiple workers (built-in locks or an advisory lock); make schedules timezone-explicit
   - Add the cleanup jobs the rest of the app needs: stale uploads, expired tokens, old job records

6. **Monitoring and operations**
   - Mount the backend's dashboard (Sidekiq Web, Flower, Bull Board, Horizon) **behind admin auth** (see `/fullstack--admin-panel` role gates)
   - Emit queue depth, oldest-job age, and failure count where the app's metrics/logging already go; an alert on "oldest job > N minutes" catches dead workers better than error counts
   - Graceful shutdown: workers finish or re-enqueue in-flight jobs on SIGTERM so deploys don't lose work

7. **Tests, env vars, and summary**
   - Tests: job enqueued by the triggering action, job performs its effect, retry on transient error, no retry on permanent error, idempotency under double-run; use the framework's inline/test adapter
   - Run the suite; summarize migrations (if DB-backed), the worker start command for dev and prod, and `.env.example` additions (`REDIS_URL` or queue DB settings, `QUEUE_CONCURRENCY`)

**Notes:**
- Job arguments are ids and scalars only — no serialized objects, no secrets in payloads (they end up in logs and dashboards)
- Set per-queue concurrency deliberately; one slow queue must not starve `mailers`
- Keep jobs small and composable — a big batch job enqueues item jobs rather than looping for an hour
- Pairs with `/fullstack--file-upload` (thumbnail processing), `/fullstack--notification-system` (delivery jobs), and `/fullstack--payments-integration` (webhook processing)
- If the app is multi-tenant, jobs must carry and re-assert tenant context (see `/fullstack--multi-tenancy`)

$ARGUMENTS
