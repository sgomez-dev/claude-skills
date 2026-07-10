---
description: Audit cloud costs from billing exports and IaC — find waste, rightsize, plan savings
permissions:
  reads: ["**/*"]
  writes: ["docs/cost-audit*.md", "*.md", "*.csv"]
  commands: ["aws ce get-cost-and-usage *", "aws * describe-*", "aws * list-*", "gcloud * list *", "az consumption usage list *", "az * list *"]
  network: false
  destructive: false
---

Audit cloud spend and produce a prioritized savings plan: parse billing exports (CSV/CUR/BigQuery
export) and IaC to find waste, rightsizing candidates, and commitment opportunities, then deliver a
ranked action list with approximate monthly savings per item. Read-only throughout — it recommends
changes, it never makes them.

Steps:

1. **Gather cost inputs**
   - Detect the provider(s) from IaC (`**/*.tf`, Bicep, CloudFormation, `serverless.yml`), SDK imports, and env vars — audit what's actually in use, including multi-cloud
   - Look for billing data the user can provide: AWS Cost & Usage Report / Cost Explorer CSV, GCP billing BigQuery/CSV export, Azure cost analysis export — ask for one if none is in the repo or `$ARGUMENTS`
   - If credentials are configured and the user agrees, run read-only CLI calls (`aws ce get-cost-and-usage`, `describe-*`/`list-*`, `gcloud ... list`, `az consumption usage list`) to fetch spend and inventory — never modify, stop, or delete anything
   - With no billing data at all, fall back to an IaC-based estimate: infer resource sizes from Terraform/config and price them approximately, clearly labeling the whole audit as estimate-based

2. **Build the spend picture**
   - Break down cost by service, then by resource/tag, for the last 1-3 months; flag month-over-month growth outliers
   - Identify the top 5 line items — they usually hold 80% of the savings; note untagged/unattributed spend as its own finding (you can't cut what you can't see)

3. **Hunt for waste**
   - Cross-reference billing against IaC and inventory for the classics: unattached volumes/disks and idle IPs, stopped-but-billed instances, old snapshots, oversized or idle databases, dev/test running 24/7, orphaned load balancers, NAT gateway data processing, multi-AZ/zone-redundancy on non-critical envs, over-retained logs and storage without lifecycle policies, cross-AZ/region egress
   - For each finding: resource, evidence, approximate monthly cost, and the fix (with the exact IaC change or CLI command the *user* would run — do not run it)

4. **Rightsize and re-architect**
   - Compare provisioned size vs utilization where metrics are available (CPU/memory/connections); propose one-size-down candidates with a rollback note
   - Flag architecture-level savers: scale-to-zero for spiky workloads (Lambda/Cloud Run/Container Apps), storage class/lifecycle tiering, caching to cut database or egress cost, spot/preemptible for fault-tolerant batch
   - Anything requiring redesign gets pointed at `/cloud--aws-architect` / `/cloud--gcp-architect` / `/cloud--azure-architect` rather than hand-waved here

5. **Plan commitments last**
   - Only after waste is cut: size Savings Plans / Reserved Instances / Committed Use Discounts on the *post-cleanup* steady-state baseline (commit to ~70-80% of it, never the peak)
   - Show the trade-off table: on-demand vs 1-yr vs 3-yr, approximate monthly figures, break-even point, and the lock-in risk in one line each

6. **Deliver the report**
   - Write `docs/cost-audit-[YYYY-MM].md`: current spend breakdown, findings table ranked by savings-to-effort (quick wins first), approximate total monthly savings, and a 30/60/90-day action plan
   - Summarize the top 3 actions in the conversation; suggest `/cloud--iam-least-privilege` if the audit surfaced over-broad access, and re-running this skill quarterly

**Notes:**
- All dollar figures are approximate — based on list pricing and visible usage; validate against the provider's calculator and next month's bill
- Strictly read-only: this skill never stops, resizes, or deletes resources — it produces the commands and IaC diffs for the user to review and apply (via `/devops--terraform` where applicable)
- Sequence matters: cut waste → rightsize → then commit; buying reservations on top of waste locks the waste in
- Recommend tagging/labeling standards and a budget alert as standing infrastructure if they're missing — they pay for themselves in the next audit
- Watch for savings that cost more than they save: engineer-days to shave $10/month is a loss — the effort column exists for a reason

$ARGUMENTS
