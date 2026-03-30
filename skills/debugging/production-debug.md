---
description: Debug production-only issues using logs, metrics, and traces without direct access
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["docker logs", "kubectl logs", "kubectl describe", "kubectl get", "journalctl", "tail", "zgrep"]
  network: true
  destructive: false
---

Debug issues that only reproduce in production by analyzing logs, metrics, configuration differences, and environmental factors — without needing to reproduce locally.

Steps:
1. Gather the production context:
   - Read deployment configuration (Dockerfile, docker-compose, k8s manifests, terraform)
   - Compare environment variables between local/staging/production
   - Check infrastructure differences: instance size, replicas, load balancer config
   - Review recent deployments: `git log --oneline -20`, last deploy timestamp
2. Analyze the failure pattern:
   **Timing-based**:
   - Only happens under load → concurrency bug, resource exhaustion, connection pool limits
   - Only at specific times → cron job conflict, timezone issue, certificate expiry, log rotation
   - Gradual degradation → memory leak, connection leak, disk fill, cache bloat

   **Environment-based**:
   - Works locally, fails in prod → env var difference, missing secret, DNS resolution, file path
   - Works in staging, fails in prod → data volume, traffic pattern, config drift, different DB version
   - Intermittent → race condition, upstream flakiness, network partition, GC pause

   **Data-based**:
   - Only for certain users/inputs → edge case in data, encoding issue, locale, schema mismatch
   - After data migration → orphaned references, type mismatch, null in new column
3. Build a diagnostic plan WITHOUT touching production state:
   - Log analysis: grep patterns, log aggregation queries (CloudWatch, Datadog, ELK)
   - Metrics correlation: CPU, memory, disk, network, request latency, error rates
   - Distributed tracing: trace ID lookup, span analysis, latency breakdown
   - Database: slow query log, connection count, lock waits, replication lag
4. Construct a local reproduction strategy:
   - Identify the minimal conditions that trigger the bug
   - Create a test that simulates the production environment (data volume, concurrency, config)
   - Use production-like seed data if data-dependent
5. Provide the fix and a safe rollout plan:
   - Feature flag the fix if possible
   - Canary deployment strategy
   - Rollback criteria and monitoring queries to validate the fix
6. Add observability improvements to prevent future blind spots:
   - Structured logging additions
   - Custom metrics for the affected code path
   - Alerting rules for early detection

Production issue description: $ARGUMENTS
