---
description: Set up GitOps with ArgoCD or Flux — repo structure, sync policies, safe rollbacks
permissions:
  reads: ["**/*"]
  writes: ["**/*.yaml", "**/*.yml", "apps/**", "clusters/**", "environments/**", "infrastructure/**", "kustomization.yaml", ".github/workflows/**", "README.md"]
  commands: ["kubectl", "kustomize", "helm", "argocd", "flux", "git", "yamllint"]
  network: false
  destructive: false
---

Establish Git as the single source of truth for what runs in Kubernetes: choose between ArgoCD and
Flux, lay out the config repo so environments and apps scale cleanly, define sync and self-heal
policies deliberately, and make rollback a `git revert` away. Produces manifests and structure —
applying them to a cluster is the user's explicit action.

Steps:

1. **Assess the current deployment landscape**
   - Detect how deploys happen today: CI pushing `kubectl apply`/`helm upgrade`, existing ArgoCD/Flux resources (`Application`, `Kustomization`, `HelmRelease` CRDs), or manual
   - Inventory what needs managing: how many apps, environments, and clusters; whether manifests are Helm charts, Kustomize overlays, or raw YAML
   - Identify where app source lives vs. where deployment config lives — GitOps needs them separable

2. **Choose the operator**
   - **ArgoCD** — default when a UI for visualizing sync state matters, multiple teams share clusters (Projects/RBAC), or app-of-apps orchestration is wanted
   - **Flux** — default for a leaner CRD-native footprint, strong Helm integration via `HelmRelease`, and when no UI requirement exists (or Weave GitOps/headlamp fills it)
   - Either is a fine choice; if one is already partially adopted, extend it rather than switching — state the trade-off briefly and confirm with the user

3. **Structure the config repository**
   - Separate **app config repo** from app source repos (avoids CI loops and gives ops-only history); monorepo of all deployments is the usual starting point
   - Layout: `apps/<app>/base/` with shared manifests, `apps/<app>/overlays/<env>/` (Kustomize) or per-env values files (Helm); `clusters/<cluster>/` declaring which apps land where; `infrastructure/` for cluster-wide concerns (ingress controller, cert-manager, monitoring) synced before apps
   - **Environment promotion = PR** that bumps the image tag/chart version in the next env's overlay — never a direct push to prod paths; protect prod directories with CODEOWNERS/branch protection
   - Image updates: CI writes the new tag to the dev overlay via automated PR (or use Argo Image Updater / Flux image automation) so every deploy is a commit

4. **Define sync policies per environment**
   - Dev: automated sync with `prune: true` and `selfHeal: true` — drift is corrected immediately, deletions propagate
   - Prod: automated sync is still the GitOps ideal, but enable `prune` only after resource coverage is verified; some teams start prod with manual sync + PR approval as the gate — make this an explicit choice
   - Set sync waves/dependencies (Argo `sync-wave` annotations, Flux `dependsOn`) so CRDs and infrastructure reconcile before consumers
   - Configure health checks and `progressingDeadline` so a bad rollout reports Degraded instead of hanging; alerts on OutOfSync/reconcile failure go to the team channel

5. **Make rollback a first-class path**
   - Primary rollback: `git revert` of the offending commit — the operator converges the cluster back; document this as *the* procedure with the exact commands
   - Emergency path: pause reconciliation (Argo `sync-policy: none` toggle / `flux suspend`), act, then resume and reconcile Git to match — never leave manual drift unrecorded
   - Ensure everything needed to re-create state is in Git: no `kubectl edit` survivors; run a drift audit (`argocd app diff` / `flux diff`) as part of the setup verification
   - Note what GitOps rollback does *not* undo: database migrations and PVC data — pair risky app rollbacks with the app's migration strategy

6. **Deliver the bootstrap and runbook**
   - Produce the operator bootstrap manifests (App-of-apps root Application, or Flux `GitRepository` + root `Kustomization`) pointing at the repo — for the user to apply
   - Validate all YAML locally: `kustomize build` each overlay, `helm template` each release, yamllint
   - Write a short runbook in the repo: how to deploy, promote, roll back, and handle drift — one page, command-level

**Notes:**
- Do not apply anything to a cluster or push to remotes from this skill — generate, validate, and hand over
- Secrets never go in the GitOps repo in plaintext: use External Secrets Operator, Sealed Secrets, or SOPS (Flux native) — pick one and reference it, don't inline secret values
- Resist per-branch environments (branch=env); directory-per-env in one branch keeps promotion diffs reviewable and avoids long-lived branch drift
- The config repo's git history is now the deployment audit log — enforce meaningful commit messages via PR titles

$ARGUMENTS
