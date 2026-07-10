---
description: Design an Azure architecture for this app — service choices, diagram, IaC starter
permissions:
  reads: ["**/*"]
  writes: ["docs/architecture/**", "infra/**", "*.md", "**/*.tf", "**/*.bicep"]
  commands: ["az account show", "az * show *", "az * list *"]
  network: false
  destructive: false
---

Design a pragmatic Azure architecture for the current application: analyze what the app actually is
(workload shape, state, traffic pattern), choose the smallest set of Azure services that fits,
produce a Mermaid architecture diagram, and scaffold an IaC starting point (Terraform or Bicep).
Favors boring, managed, cost-efficient services over resume-driven complexity.

Steps:

1. **Understand the workload**
   - Read the codebase: language/framework, entry points, background jobs, data stores referenced (SQL, cache, files, queues), env vars, Dockerfiles, existing IaC (`**/*.tf`, `**/*.bicep`, ARM templates, `azure-pipelines.yml`)
   - Detect existing Azure usage: SDK imports (`azure-*`, `@azure/*`, `Azure.*` NuGet), `AZURE_*` env vars, connection strings, resource IDs in config — if the app is already partly on Azure, design around what exists rather than greenfield
   - If credentials are configured and the user agrees, run read-only CLI calls (`az account show`, `az ... list/show`) to inventory current resources — never run create/deploy/delete commands
   - Establish from `$ARGUMENTS` or by asking: expected traffic (req/s or MAU), latency sensitivity, compliance constraints (many Azure shops have them — ask explicitly), region(s), and monthly budget ceiling; note any Microsoft ecosystem ties (Entra ID, .NET, Microsoft 365) that shape the design

2. **Choose services deliberately**
   - For each layer (compute, data, storage, networking, async, observability) propose ONE primary choice plus one alternative with a one-line trade-off, e.g.:
     - Compute: Azure Container Apps (default for containers — scales to zero) vs Azure Functions (event glue) vs App Service (classic web app) — AKS only when Kubernetes primitives are genuinely needed, VMs only with justification
     - Data: Azure SQL / Database for PostgreSQL Flexible Server vs Cosmos DB — decide from the app's actual query patterns and consistency needs, not preference; Cosmos serverless tier for spiky low volume
     - Async: Storage Queues (simple) vs Service Bus (ordering/dead-letter/sessions) vs Event Grid (eventing); static assets to Blob Storage + Azure Front Door or CDN
   - Reject services the workload doesn't need and say why (no AKS for a single container, no Front Door Premium for an internal tool, no multi-region for an MVP)

3. **Draw the architecture**
   - Produce a Mermaid `graph TD`/`flowchart` diagram: user → edge (Front Door/App Gateway) → compute → data stores, plus async paths, VNet/resource-group boundaries as subgraphs, and managed identities/RBAC noted on edges
   - Include a second small diagram only if there is a meaningfully different async/batch flow
   - Save to `docs/architecture/azure-architecture.md` alongside the written design (or the path the user prefers)

4. **Estimate monthly cost (approximate)**
   - Build a table: service, sizing assumption, estimated $/month — label the total clearly as a **rough approximation** based on stated traffic and pay-as-you-go pricing in the chosen region
   - Call out Azure-specific levers: consumption vs dedicated plans, reserved instances / savings plans, dev/test subscription pricing, and the 2-3 biggest line items (App Gateway/Front Door base fees, database tier, egress)

5. **Scaffold the IaC starting point**
   - Pick the tool the repo already uses (Terraform `azurerm`, Bicep, or ARM) — never introduce a second IaC tool; if greenfield, default to Terraform for consistency with `/devops--terraform`, offering Bicep as the Azure-native alternative
   - Generate under `infra/`: provider + backend stub (storage-account state note), resource group + network module or default note, one module per layer, `variables.tf`/params with sensible defaults, example tfvars/params file
   - Keep it plan-ready but do NOT run `terraform apply`/`az deployment create` — tell the user to review and apply via `/devops--terraform`
   - Use managed identities over connection strings wherever possible and point to `/cloud--iam-least-privilege` for RBAC hardening

6. **Deliver and hand off**
   - Summarize: chosen stack in one paragraph, the diagram, the cost table, key trade-offs made, and explicit next steps (subscription/RG layout, apply order, DNS/cert setup, secrets in Key Vault)
   - Suggest follow-ups where relevant: `/cloud--autoscaling-strategy`, `/cloud--disaster-recovery`, `/cloud--cloud-cost-audit`

**Notes:**
- Default to consumption-based, scale-to-zero services where traffic is unknown; upgrade paths beat premature capacity
- Cost estimates are approximate — always recommend validating with the Azure Pricing Calculator before committing
- One region with availability zones is the default posture; paired-region DR only when the user states an RTO/RPO that requires it (see `/cloud--disaster-recovery`)
- Never store secrets in IaC — reference Key Vault and managed identities
- If the app clearly fits another provider already in use (AWS/GCP SDKs everywhere), say so and offer `/cloud--aws-architect` or `/cloud--gcp-architect` instead

$ARGUMENTS
