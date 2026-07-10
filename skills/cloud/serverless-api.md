---
description: Build a serverless API — functions, routing, cold-start mitigation, local dev setup
permissions:
  reads: ["**/*"]
  writes: ["src/**", "functions/**", "api/**", "infra/**", "*.md", "*.json", "*.yml", "*.yaml", "*.toml", "**/*.tf"]
  commands: ["aws * describe-*", "aws * list-*", "gcloud * list *", "az * list *", "sam --version", "func --version", "npx --version"]
  network: false
  destructive: false
---

Build (or convert an existing app into) a serverless HTTP API: function layout, routing, IaC,
cold-start mitigation, and a working local development loop. Detects the provider and framework
already in use and produces deployable code plus infrastructure — without ever deploying it.

Steps:

1. **Detect provider and starting point**
   - Detect existing cloud usage before proposing one: IaC files (`**/*.tf`, `serverless.yml`, `template.yaml`/SAM, CDK, `host.json`, `functions-framework` deps, `wrangler.toml`), SDK imports (`boto3`/`aws-sdk`, `@google-cloud/*`, `@azure/*`), and `AWS_*`/`GOOGLE_*`/`AZURE_*` env vars
   - If nothing points anywhere and `$ARGUMENTS` doesn't say, ask — default suggestion: AWS Lambda + API Gateway (broadest ecosystem), noting Cloud Run/Container Apps as near-serverless container options and Cloudflare Workers for edge APIs (see `/networking--` skills for the Cloudflare path)
   - Establish: language/runtime, expected traffic shape (spiky vs steady — steady high traffic may not want serverless at all; say so), latency budget, and auth requirements

2. **Design the function layout and routing**
   - Choose deliberately between one "fat" function per API (framework router inside — Express/Hono/FastAPI via adapter; simpler ops, one cold start) vs one function per resource/route (finer IAM and scaling; more deploy surface) — recommend one with a one-line trade-off for this app's size
   - Map routes: method + path → handler, request validation at the edge (API Gateway models / framework validators), auth (JWT authorizer, API keys, or provider identity), CORS
   - Keep handlers thin: parse/validate → call plain business-logic modules → serialize; business logic stays framework-free and unit-testable

3. **Write the code and IaC**
   - Scaffold handlers, shared middleware (logging, error mapping, request IDs), and typed request/response models in the project's existing language and style
   - Generate IaC with the tool the repo already uses (Terraform, SAM, Serverless Framework, CDK) — never introduce a second one; if greenfield, default to Terraform and hand off applying to `/devops--terraform`
   - Wire structured JSON logging and provider tracing (X-Ray / Cloud Trace / App Insights); grant each function only the permissions it needs — point to `/cloud--iam-least-privilege`

4. **Mitigate cold starts**
   - Apply cheap wins first: trim bundle (tree-shake, exclude dev deps, avoid heavy SDK imports at top level), lazy-init clients outside handler scope but connect lazily, right-size memory (more memory = more CPU on Lambda), prefer lightweight runtimes
   - Only then consider paid options, with approximate cost: provisioned concurrency / min instances (~$5-15/month per warm instance-equivalent) — reserve for latency-critical routes, not the whole API
   - For SQL databases, use a connection-pooling proxy (RDS Proxy ~$0.015/vCPU-hr, Cloud SQL connectors, serverless drivers) — never raw connection-per-invocation

5. **Set up the local dev loop**
   - Configure the provider's local runner (`sam local start-api`, Functions Framework, `func start`, `serverless offline`, `wrangler dev`) with env vars from a `.env.example`, plus local emulation or a dev instance for data stores
   - Add npm/make scripts: `dev`, `test`, `build`, `deploy` (deploy script generated but NOT run) and a smoke-test script hitting each route locally
   - Document the loop in the project README section: run locally → test → review IaC plan → deploy

6. **Deliver and hand off**
   - Summarize: routing table, cold-start measures applied, an approximate monthly cost line (e.g., 1M requests + modest compute typically lands around $5-25/month on pay-per-use, before database) labeled as a rough estimate, and next steps
   - Suggest follow-ups: `/devops--terraform` to apply, `/cloud--autoscaling-strategy` for concurrency limits, `/cloud--cloud-cost-audit` once traffic is real

**Notes:**
- Pay-per-use pricing is the point: default to scale-to-zero and no provisioned capacity until measured latency demands it
- All cost figures are approximate — validate against the provider's pricing calculator with real traffic numbers
- Watch the hidden costs: API Gateway per-request fees, NAT gateways for VPC-attached functions, and per-invocation logging volume
- Never deploy from this skill — generate everything plan-ready and let the user apply via `/devops--terraform` or their pipeline
- If the workload is steady and latency-sensitive, say plainly that containers (Cloud Run/Fargate/Container Apps) may beat FaaS and offer `/cloud--aws-architect`, `/cloud--gcp-architect`, or `/cloud--azure-architect`

$ARGUMENTS
