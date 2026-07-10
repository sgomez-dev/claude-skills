---
description: Audit IAM policies and generate least-privilege replacements you review and apply
permissions:
  reads: ["**/*"]
  writes: ["infra/**", "docs/iam-audit*.md", "*.md", "**/*.tf", "**/*.json", "**/*.yml", "**/*.yaml"]
  commands: ["aws iam list-*", "aws iam get-*", "aws sts get-caller-identity", "aws accessanalyzer *", "gcloud iam * list *", "gcloud iam * describe *", "gcloud projects get-iam-policy *", "az role assignment list *", "az role definition list *"]
  network: false
  destructive: false
---

Audit IAM policies, roles, and service accounts for over-permission and generate least-privilege
replacements as reviewable IaC diffs. Works from IaC files and read-only CLI inventory, derives
what each identity *actually needs* from the code that uses it, and never applies anything itself.

Steps:

1. **Inventory identities and policies**
   - Detect the provider(s) from IaC, SDK imports, and env vars, then collect every IAM artifact: Terraform `aws_iam_*`/`google_*_iam_*`/`azurerm_role_assignment` resources, inline JSON policies, SAM/serverless `iamRoleStatements`, Kubernetes service accounts with cloud bindings, GitHub Actions OIDC roles
   - If credentials are configured and the user agrees, run read-only CLI calls (`aws iam list-*`/`get-*`, `gcloud projects get-iam-policy`, `az role assignment list`) to capture what's live — never attach, detach, create, or delete anything
   - Scope from `$ARGUMENTS`: a specific role/service, or the whole project

2. **Flag the dangerous patterns**
   - Rank findings by blast radius: `*:*` / Owner / Contributor-at-subscription grants, wildcard actions (`s3:*`) or resources (`Resource: "*"`), broad managed policies (`AdministratorAccess`, `PowerUserAccess`, project Editor), `iam:PassRole` without conditions, privilege-escalation paths (ability to edit own policy, create keys for stronger identities), human users with permanent keys instead of SSO/roles, cross-account trust without external IDs, public/unknown principals
   - For each: identity, grant, why it's risky (one line), and severity

3. **Derive what each identity actually needs**
   - Read the code the identity runs: SDK calls map to IAM actions (e.g., `s3.get_object` → `s3:GetObject` on that bucket ARN; a Pub/Sub publisher needs `roles/pubsub.publisher` on one topic, not project Editor)
   - Cross-check with access data where available: AWS IAM Access Advisor / Access Analyzer policy generation, GCP Policy Intelligence recommender, Azure "last used" — services never called in 90 days are removal candidates
   - When usage can't be proven, propose the narrow version but mark it `verify before apply` rather than guessing silently

4. **Generate least-privilege replacements**
   - Rewrite each flagged policy: explicit actions, resource ARNs/scopes (with sane prefixes, not account-wide), and conditions where they add real protection (`aws:SourceArn`, VPC/IP conditions, `iam:PassedToService`)
   - Produce them in the repo's IaC format as a reviewable diff — one identity per commit-sized change; prefer predefined narrow roles (GCP) / built-in roles scoped to the resource group (Azure) over custom roles unless needed
   - Replace long-lived keys with workload identity/OIDC federation wherever the platform supports it

5. **Plan a safe rollout**
   - Order changes low-risk-first; for each, include a verification step (run the service's test suite / smoke test) and an instant rollback (the old policy, kept in the diff)
   - For high-traffic identities, recommend a monitor-first step: deny nothing yet, watch CloudTrail / audit logs for would-be-denied calls for a few days, then tighten
   - Hand the applying itself to the user via `/devops--terraform` — this skill stops at the reviewed diff

6. **Deliver the report**
   - Write `docs/iam-audit-[YYYY-MM].md`: findings table (identity, issue, severity, fix), the proposed diffs or links to them, rollout order, and what couldn't be verified
   - Summarize the top risks in the conversation; suggest `/security--` skills for broader posture and `/cloud--cloud-cost-audit` if unused identities hint at unused infrastructure

**Notes:**
- Strictly read-only against the cloud: all changes land as IaC diffs for human review — never applied, and `destructive: false` is literal
- Least privilege is iterative: shipping a 60% tighter policy today beats a perfect one that breaks prod; always pair tightening with a tested rollback
- Don't break glass: keep (or create) one tightly-audited break-glass admin path before removing broad access from everything else
- Conditions beat wildcards, but only add conditions you can explain in one sentence — clever policies rot
- Service-to-service auth should prefer workload identity/managed identities/IRSA over static credentials in env vars

$ARGUMENTS
