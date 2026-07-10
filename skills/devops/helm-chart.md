---
description: Build a Helm chart with clean templates, values, dependencies, lint, release strategy
permissions:
  reads: ["**/*"]
  writes: ["charts/**", "helm/**", "Chart.yaml", "values*.yaml", "templates/**", ".helmignore", ".github/workflows/**"]
  commands: ["helm", "kubectl", "yamllint"]
  network: false
  destructive: false
---

Create or improve a Helm chart that installs cleanly, upgrades safely, and stays readable. Covers
template hygiene, a values contract that consumers can rely on, dependency management, linting,
and a versioning/release strategy — verified locally with `helm template` and `helm lint`, never
by installing into a cluster.

Steps:

1. **Detect the app and any existing Kubernetes assets**
   - Identify what's being packaged: language/framework, exposed ports, health endpoints, config and secret needs, persistence, from the repo (Dockerfile, existing manifests, compose files)
   - Check for an existing chart (`Chart.yaml`, `charts/`, `helm/`) or raw manifests in `k8s/` that should be converted rather than duplicated
   - Note the target Kubernetes version range — it constrains API versions (`Ingress`, `HPA`, `PodDisruptionBudget`)

2. **Scaffold the chart structure**
   - `Chart.yaml` with semver `version` (chart) and `appVersion` (app) kept distinct; `helm create` layout as the base: `templates/` with deployment, service, ingress (gated), serviceaccount, HPA (gated), plus `_helpers.tpl`, `NOTES.txt`, `.helmignore`
   - Standard labels via helpers: `app.kubernetes.io/name`, `instance`, `version`, `managed-by` on every resource — selectors use the immutable subset only
   - Every resource name derives from `fullname` helper so multiple releases coexist in one namespace

3. **Design the values contract**
   - `values.yaml` is the public API: sensible defaults that install out of the box, comments on every non-obvious key, and a consistent shape (`image.repository/tag/pullPolicy`, `resources`, `nodeSelector`, `tolerations`, `affinity`, `podAnnotations`)
   - Gate optional features with `enabled` flags (`ingress.enabled`, `autoscaling.enabled`, `serviceMonitor.enabled`) — templates wrapped in `{{- if }}` produce nothing when off
   - Fail fast on missing required values with `required "message" .Values.x` instead of rendering broken manifests
   - Add per-environment override files (`values-dev.yaml`, `values-prod.yaml`) containing *only* the deltas
   - Never put secret values in values files — take existing Secret names as references (`existingSecret` pattern) or document external-secrets integration

4. **Handle dependencies and config-driven restarts**
   - Declare subcharts (postgresql, redis, etc.) in `Chart.yaml` `dependencies` with pinned version ranges and `condition:` flags so consumers can bring their own; run `helm dependency update` and commit `Chart.lock`
   - Prefer `enabled: false` defaults for bundled databases in anything production-oriented — bundled DBs are for dev convenience
   - Add checksum annotations on the pod template (`checksum/config: {{ include ... | sha256sum }}`) so ConfigMap/Secret changes trigger rollouts

5. **Lint and render-verify locally**
   - `helm lint` on the chart and on each values override file
   - `helm template . -f values-prod.yaml` — inspect rendered output for correct API versions, labels, resource limits present, no empty/invalid blocks; repeat with feature flags toggled both ways
   - If available, pipe rendered output through `kubectl apply --dry-run=client -f -` or a schema validator for structural validation without touching a cluster
   - Optionally add a `values.schema.json` so bad values fail at install time with a clear message

6. **Define the release strategy**
   - Version bumps: chart `version` on any chart change (semver: template changes = minor, breaking values changes = major), `appVersion` tracks the app image
   - Publishing: chart repo (OCI registry via `helm push`, or chartmuseum/GitHub Pages) with a CI job that lints, templates, and packages on tag
   - Upgrades: document `helm upgrade --install --atomic --timeout` as the standard invocation; note that `--atomic` auto-rolls-back failed upgrades
   - Record breaking changes and value migrations in the chart's README/CHANGELOG

**Notes:**
- Do not install into any cluster from this skill — verification is `lint` + `template` + dry-run rendering only
- Keep templates boring: complex logic belongs in `_helpers.tpl` with named templates, and if logic gets deep, reconsider the values shape instead
- `helm template` output is also the escape hatch — consumers who don't run Helm in-cluster can render and apply; don't rely on Helm hooks for anything critical to correctness
- Immutable fields (Deployment selectors, PVC specs) must never depend on mutable values — changing them breaks `helm upgrade`

$ARGUMENTS
