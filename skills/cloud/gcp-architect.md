---
description: Design a GCP architecture for this app — service choices, diagram, IaC starter
permissions:
  reads: ["**/*"]
  writes: ["docs/architecture/**", "infra/**", "*.md", "**/*.tf"]
  commands: ["gcloud config list", "gcloud * describe *", "gcloud * list *", "gcloud projects describe *"]
  network: false
  destructive: false
---

Design a pragmatic Google Cloud architecture for the current application: analyze what the app
actually is (workload shape, state, traffic pattern), choose the smallest set of GCP services that
fits, produce a Mermaid architecture diagram, and scaffold a Terraform starting point. Favors
boring, managed, scale-to-zero services over resume-driven complexity.

Steps:

1. **Understand the workload**
   - Read the codebase: language/framework, entry points, background jobs, data stores referenced (SQL, cache, files, queues), env vars, Dockerfiles, existing IaC (`**/*.tf`, Deployment Manager, `app.yaml`, `cloudbuild.yaml`)
   - Detect existing GCP usage: SDK imports (`google-cloud-*`, `@google-cloud/*`), `GOOGLE_*`/`GCP_*` env vars, `GOOGLE_APPLICATION_CREDENTIALS`, project IDs in config — if the app is already partly on GCP, design around what exists rather than greenfield
   - If credentials are configured and the user agrees, run read-only CLI calls (`gcloud config list`, `gcloud ... list/describe`) to inventory current resources — never run create/deploy/delete commands
   - Establish from `$ARGUMENTS` or by asking: expected traffic (req/s or MAU), latency sensitivity, compliance constraints, region(s), and monthly budget ceiling

2. **Choose services deliberately**
   - For each layer (compute, data, storage, networking, async, observability) propose ONE primary choice plus one alternative with a one-line trade-off, e.g.:
     - Compute: Cloud Run (default for containers — scales to zero) vs Cloud Functions (event glue) vs GKE Autopilot only when the workload genuinely needs Kubernetes primitives — GCE VMs only with justification
     - Data: Cloud SQL vs Firestore vs BigQuery (analytics only, never as an app database) — decide from the app's actual query patterns, not preference
     - Async: Pub/Sub + Cloud Tasks before self-managed brokers; static assets to Cloud Storage + Cloud CDN behind a global external load balancer
   - Reject services the workload doesn't need and say why (no GKE for a single container, no Spanner without global-consistency requirements, no Memorystore if a table cache suffices)

3. **Draw the architecture**
   - Produce a Mermaid `graph TD`/`flowchart` diagram: user → edge (Cloud CDN/LB) → compute → data stores, plus async paths, VPC boundaries as subgraphs, and service accounts/IAM noted on edges
   - Include a second small diagram only if there is a meaningfully different async/batch flow
   - Save to `docs/architecture/gcp-architecture.md` alongside the written design (or the path the user prefers)

4. **Estimate monthly cost (approximate)**
   - Build a table: service, sizing assumption, estimated $/month — label the total clearly as a **rough approximation** based on stated traffic and on-demand pricing in the chosen region
   - Call out GCP-specific levers: Cloud Run scale-to-zero and free tier, sustained/committed use discounts, egress costs, and the 2-3 biggest line items (LB forwarding rules, Cloud SQL instance tier, NAT)

5. **Scaffold the IaC starting point**
   - Generate Terraform under `infra/` using the `google` provider (or extend the repo's existing IaC tool — never introduce a second one): provider + backend stub (GCS bucket note), network module or default-VPC note, one module per layer, `variables.tf` with sensible defaults, `terraform.tfvars.example`
   - Keep it plan-ready but do NOT run `terraform apply` — tell the user to review and apply via `/devops--terraform`
   - Include least-privilege service-account skeletons and point to `/cloud--iam-least-privilege` for hardening

6. **Deliver and hand off**
   - Summarize: chosen stack in one paragraph, the diagram, the cost table, key trade-offs made, and explicit next steps (project/billing setup, apply order, DNS/cert via Cloud DNS + managed certs, secrets in Secret Manager)
   - Suggest follow-ups where relevant: `/cloud--autoscaling-strategy`, `/cloud--disaster-recovery`, `/cloud--cloud-cost-audit`

**Notes:**
- Default to Cloud Run and managed services where traffic is unknown; upgrade paths beat premature capacity
- Cost estimates are approximate — always recommend validating with the Google Cloud Pricing Calculator before committing
- One region, multi-zone is the default posture; multi-region only when the user states an RTO/RPO that requires it (see `/cloud--disaster-recovery`)
- Never store secrets in IaC — reference Secret Manager; prefer workload identity over exported service-account keys
- If the app clearly fits another provider already in use (AWS/Azure SDKs everywhere), say so and offer `/cloud--aws-architect` or `/cloud--azure-architect` instead

$ARGUMENTS
