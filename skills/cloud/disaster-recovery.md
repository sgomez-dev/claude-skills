---
description: Build a DR plan — RTO/RPO targets, backup strategy, failover runbook, test schedule
permissions:
  reads: ["**/*"]
  writes: ["docs/dr/**", "infra/**", "*.md", "**/*.tf"]
  commands: ["aws * describe-*", "aws * list-*", "aws backup list-*", "gcloud * list *", "az * list *", "az backup * list *"]
  network: false
  destructive: false
---

Produce a disaster recovery plan grounded in what this system actually runs: agree RTO/RPO targets
per component, pick the cheapest DR tier that meets them, design the backup strategy, write a
step-by-step failover runbook, and schedule the tests that keep it honest. Read-only against the
cloud; changes land as IaC diffs and documents.

Steps:

1. **Map what must survive**
   - Inventory from the repo and IaC: services, data stores (the real crown jewels), queues, file/object storage, DNS, secrets, third-party dependencies; detect the provider(s) from IaC, SDK imports, and env vars
   - If credentials are configured and the user agrees, run read-only CLI calls to inventory current backup/replication posture (`aws backup list-*`, snapshot/replica `describe`/`list` calls) — never create, restore, or delete anything
   - Rank components by business criticality; note single points of failure (one AZ, one region, one database, one person who knows the deploy)

2. **Set RTO/RPO per component — with the business, not by default**
   - From `$ARGUMENTS` or by asking: how long can each component be down (RTO) and how much data can be lost (RPO)? Push back on reflexive "zero/zero" — show what each order of magnitude costs
   - Approximate monthly cost ladder for a typical mid-size app (label as rough): backup & restore (hours-day RTO, ~$20-100 for storage) → pilot light (tens of minutes-hours, ~$100-500 for replicated data + dormant infra) → warm standby (minutes, ~50-70% of production cost) → active-active (near-zero, ≥2× production plus engineering complexity)
   - Different components get different tiers — the database rarely shares a tier with the marketing site

3. **Design the backup strategy**
   - Per data store: mechanism (automated snapshots, PITR/WAL, cross-region copy), frequency matching RPO, retention schedule, encryption, and isolation — at least one copy in a separate account/project with delete protection, because DR must survive the attacker or the fat-fingered admin, not just the outage
   - Cover the forgotten state: object storage replication/versioning, secrets, IaC state files, container images, DNS zone exports, queue/broker config
   - Backups that are never restored are Schrödinger's backups — every mechanism gets a restore test in step 6

4. **Design failover (and failback)**
   - For the chosen tier per component: replication topology, health checks and failover trigger (who/what decides — automatic where safe, human for region evacuation), DNS or traffic-manager switch with realistic TTLs, and how writes are fenced to prevent split-brain
   - Ensure the whole recovery path is IaC-reproducible (`/devops--terraform`) — hand-built DR environments drift; anything hand-built is a finding
   - Failback gets its own section: resyncing data accumulated in DR back to primary is usually harder than the failover

5. **Write the runbook**
   - `docs/dr/failover-runbook.md`, executable by an engineer at 3am who didn't build the system: preconditions and decision criteria (when to declare disaster), numbered steps with exact commands/console paths, expected output per step, verification checklist, communication plan (status page, stakeholders), abort criteria, and the failback procedure
   - One runbook per scenario that differs materially: AZ/zone loss, region loss, data corruption or ransomware (restore-to-point-in-time, NOT failover — replication faithfully replicates the corruption), and critical third-party outage

6. **Schedule tests and deliver**
   - Test ladder with cadence: monthly automated restore verification, quarterly tabletop walkthrough of the runbook, semi-annual live failover of a non-critical component or staging, annual full DR exercise — each with success criteria and an owner
   - Write `docs/dr/dr-plan.md` (targets table, tier per component, backup matrix, approximate monthly DR cost, test calendar) plus any IaC diffs for missing backup/replication resources — for review, not applied
   - Summarize gaps found vs current posture; suggest `/cloud--cloud-cost-audit` if DR spend looks heavy and `/cloud--autoscaling-strategy` for absorbing failover traffic

**Notes:**
- RTO/RPO are business decisions with price tags — this skill's job is to make the trade-off visible, not to pick "zero data loss" by default
- All cost figures are approximate; cross-region replication egress and duplicate storage are the usual big lines
- An untested DR plan is documentation, not capability — the test schedule is part of the deliverable, not an appendix
- Keep the runbook where it's reachable when the primary region is down (printed, second account, separate wiki)
- Multi-region active-active is an architecture, not a setting — if targets truly demand it, route through `/cloud--aws-architect` / `/cloud--gcp-architect` / `/cloud--azure-architect` first

$ARGUMENTS
