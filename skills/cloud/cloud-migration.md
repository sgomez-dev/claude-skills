---
description: Plan a migration to the cloud — assessment, 6 Rs strategy, phased plan, rollback
permissions:
  reads: ["**/*"]
  writes: ["docs/migration/**", "*.md"]
  commands: ["aws * describe-*", "aws * list-*", "gcloud * list *", "az * list *"]
  network: false
  destructive: false
---

Produce a concrete, phased migration plan for moving this application (or estate) to the cloud —
or between clouds. Assesses what actually exists, assigns a 6 Rs strategy per component with
honest trade-offs, sequences phases with cutover and rollback steps, and estimates approximate
target-state costs. A planning skill: it writes documents, not infrastructure.

Steps:

1. **Assess the current state**
   - Inventory from the repo: services/components, languages, frameworks, data stores (engines, approximate sizes if stated), queues/brokers, cron jobs, file storage, external integrations, licenses, and anything hardware- or OS-pinned
   - Map dependencies between components (who calls whom, shared databases) — this drives migration order more than anything else
   - Detect the destination if one is already implied: existing IaC, SDK imports, `AWS_*`/`GOOGLE_*`/`AZURE_*` env vars; if credentials exist and the user agrees, run read-only `list`/`describe` calls to inventory what's already in the target cloud — never create or modify anything
   - Establish from `$ARGUMENTS` or by asking: source (on-prem/other cloud/managed hosting), target cloud, drivers (cost/scale/exit/compliance), timeline, downtime tolerance per component, and team cloud experience

2. **Assign a strategy per component (the 6 Rs)**
   - For each component pick one, with a one-line justification: **Rehost** (lift-and-shift), **Replatform** (lift-and-reshape — e.g., self-managed Postgres → managed Postgres), **Refactor** (re-architect for cloud-native), **Repurchase** (move to SaaS), **Retire** (kill it), **Retain** (leave it for now)
   - Default bias: replatform databases and queues to managed equivalents, rehost stateless compute first, refactor only where the payoff is named — a refactor-everything plan is a rewrite wearing a migration costume
   - Anything marked Refactor gets pointed at `/cloud--aws-architect`, `/cloud--gcp-architect`, or `/cloud--azure-architect` for its target design

3. **Design the target landing zone (right-sized)**
   - Sketch the minimum viable landing zone: account/project/subscription layout, network (VPC/VNet, connectivity to source during migration — VPN/interconnect), identity (SSO, workload identity — see `/cloud--iam-least-privilege`), tagging standard, and IaC-from-day-one via `/devops--terraform`
   - Include a Mermaid diagram of the target state and the transitional state (both environments live, data replicating)

4. **Sequence the phases**
   - Phase 0: landing zone + CI/CD to cloud + one throwaway proof component end-to-end
   - Then order by risk-adjusted value: stateless/low-risk services first, data stores second (with replication running well before cutover), the scariest stateful component last
   - For each phase: components, strategy, data-sync method (dump/restore, DMS/replication, dual-write), cutover mechanic (DNS TTL drop, feature flag, traffic split), validation checklist, and an explicit **rollback trigger + procedure** (what metric or failure flips it, how to point traffic back, data-reconciliation plan)
   - State the shape of each cutover honestly: near-zero-downtime (replication + switch) vs maintenance window, and what each costs in effort

5. **Estimate costs and risks (approximate)**
   - Target-state monthly cost table per component, labeled a **rough approximation**; include the transitional double-running period and one-time costs (data transfer/egress from source, replication tooling, parallel environments)
   - Risk register: top 5-8 risks (data loss at cutover, latency between half-migrated components, license terms in the cloud, team ramp-up), each with a mitigation
   - Note the post-migration cleanup that always gets skipped: decommission source, kill the VPN, remove dual-write paths — schedule it in the plan

6. **Deliver the plan**
   - Write `docs/migration/migration-plan.md`: assessment table, 6 Rs matrix, diagrams, phased schedule with rollback procedures, cost estimate, risk register, and a go/no-go checklist per phase
   - Summarize in conversation: recommended first phase, biggest risk, approximate steady-state cost; suggest `/cloud--disaster-recovery` for the target's DR posture and `/cloud--cloud-cost-audit` ~2 months after cutover

**Notes:**
- Every phase needs a tested rollback before its cutover, not after — a rollback that's never been rehearsed is a hope, not a plan
- Migrate, then modernize: resist bundling refactors into cutover phases; each phase should change one hard thing at a time
- Data is the critical path — start replication early, measure lag, and define the reconciliation story for writes that land during cutover
- All cost figures are approximate; egress fees from the source provider are the classic surprise — quote them explicitly
- If assessment reveals the driver is weak (e.g., "cloud" for a stable, cheap on-prem app), say so — Retain is a valid answer

$ARGUMENTS
