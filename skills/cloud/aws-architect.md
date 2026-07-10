---
description: Design an AWS architecture for this app — service choices, diagram, IaC starter
permissions:
  reads: ["**/*"]
  writes: ["docs/architecture/**", "infra/**", "*.md", "**/*.tf"]
  commands: ["aws sts get-caller-identity", "aws * describe-*", "aws * list-*", "aws * get-*"]
  network: false
  destructive: false
---

Design a pragmatic AWS architecture for the current application: analyze what the app actually is
(workload shape, state, traffic pattern), choose the smallest set of AWS services that fits, produce
a Mermaid architecture diagram, and scaffold a Terraform starting point. Favors boring, managed,
cost-efficient services over resume-driven complexity.

Steps:

1. **Understand the workload**
   - Read the codebase: language/framework, entry points, background jobs, data stores referenced (SQL, cache, files, queues), env vars, Dockerfiles, existing IaC (`**/*.tf`, CloudFormation, SAM, CDK, `serverless.yml`)
   - Detect existing AWS usage: SDK imports (`boto3`, `aws-sdk`), `AWS_*` env vars, ARNs in config — if the app is already partly on AWS, design around what exists rather than greenfield
   - If credentials are configured and the user agrees, run read-only CLI calls (`aws sts get-caller-identity`, `describe-*`/`list-*`) to inventory current resources — never run apply/create/delete commands
   - Establish from `$ARGUMENTS` or by asking: expected traffic (req/s or MAU), latency sensitivity, compliance constraints, region(s), and monthly budget ceiling

2. **Choose services deliberately**
   - For each layer (compute, data, storage, networking, async, observability) propose ONE primary choice plus one alternative with a one-line trade-off, e.g.:
     - Compute: Lambda (spiky/low traffic) vs ECS Fargate (steady/containerized) vs App Runner (simple web app) — EC2 only with justification
     - Data: RDS/Aurora Serverless v2 vs DynamoDB — decide from the app's actual query patterns, not preference
     - Async: SQS/EventBridge before Kafka/MSK; static assets to S3 + CloudFront
   - Reject services the workload doesn't need and say why (no EKS for a single container, no multi-region for an MVP)

3. **Draw the architecture**
   - Produce a Mermaid `graph TD`/`flowchart` diagram: user → edge (CloudFront/ALB) → compute → data stores, plus async paths, VPC boundaries as subgraphs, and IAM/security groups noted on edges
   - Include a second small diagram only if there is a meaningfully different async/batch flow
   - Save to `docs/architecture/aws-architecture.md` alongside the written design (or the path the user prefers)

4. **Estimate monthly cost (approximate)**
   - Build a table: service, sizing assumption, estimated $/month — label the total clearly as a **rough approximation** based on stated traffic and on-demand pricing in the chosen region
   - Show a "first 12 months" note: free-tier coverage, and the 2-3 biggest cost levers (e.g., NAT gateway, RDS instance class, CloudFront egress)

5. **Scaffold the IaC starting point**
   - Generate Terraform under `infra/` (or extend the existing IaC tool if the repo already uses CDK/SAM/CloudFormation — never introduce a second IaC tool): provider + backend stub, network module or default-VPC note, one module per layer, `variables.tf` with sensible defaults, `terraform.tfvars.example`
   - Keep it plan-ready but do NOT run `terraform apply` — tell the user to review and apply via `/devops--terraform`
   - Include least-privilege IAM role skeletons and point to `/cloud--iam-least-privilege` for hardening

6. **Deliver and hand off**
   - Summarize: chosen stack in one paragraph, the diagram, the cost table, key trade-offs made, and explicit next steps (apply order, DNS/cert setup, secrets management)
   - Suggest follow-ups where relevant: `/cloud--autoscaling-strategy`, `/cloud--disaster-recovery`, `/cloud--cloud-cost-audit`

**Notes:**
- Default to serverless/managed and scale-to-zero where traffic is unknown; upgrade paths beat premature capacity
- Cost estimates are approximate — always recommend validating with the AWS Pricing Calculator before committing
- One region, multi-AZ is the default posture; multi-region only when the user states an RTO/RPO that requires it (see `/cloud--disaster-recovery`)
- Never store secrets in IaC — reference Secrets Manager/SSM Parameter Store
- If the app clearly fits another provider already in use (GCP/Azure SDKs everywhere), say so and offer `/cloud--gcp-architect` or `/cloud--azure-architect` instead

$ARGUMENTS
