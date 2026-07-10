---
description: Schedule tasks reliably: cron vs queues, retries, monitoring, timezone traps
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Set up scheduled/recurring work that actually runs on time and doesn't silently fail — choosing the right
mechanism for the reliability you need and building in the retries, locking, and monitoring most schedulers lack.

Steps:

1. **Define the job and its guarantees** (`$ARGUMENTS`)
   - Detect the runtime/hosting from the repo (Node/Python, container, serverless, PaaS)
   - Clarify: frequency, acceptable delay, what happens if a run is missed or runs twice, and expected duration

2. **Choose the mechanism**
   Pick and justify: OS `cron`/systemd timers (simple, single host), a job queue with scheduler (BullMQ, Celery,
   Sidekiq — retries + concurrency), a managed scheduler (cloud cron, GitHub Actions schedule), or a serverless
   scheduled trigger. Match the choice to the reliability and observability need.

3. **Make runs safe to repeat**
   Design for idempotency (a double-run must not double-charge/double-send). Add a distributed lock or
   leader election if multiple instances could fire the same job. Handle overlapping runs (skip vs queue).

4. **Add retries and failure handling**
   Configure retry with backoff, a dead-letter path for permanent failures, and a max attempt cap.
   Decide what a partial failure means and whether the job resumes or restarts.

5. **Get the timezone right**
   State the schedule's timezone explicitly. Watch DST transitions (a 2:30am job runs twice or zero times on
   switch days). Store/reason in UTC; convert only for display. Validate the cron expression's next 5 fire times.

6. **Monitor**
   Emit a heartbeat/success signal and alert on a MISSED run (absence of success), not just on errors — a job
   that never starts is the failure that hurts most. Log duration to catch creeping runtime.

**Notes:**
- The dangerous failure is the silent one: alert on missing successes, not only on thrown errors
- Idempotency is not optional for anything that sends money, email, or notifications
- Use `/utils--cron-explain` to sanity-check any cron expression before shipping

$ARGUMENTS
