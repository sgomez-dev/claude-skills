---
description: Scan dependencies for license compatibility, obligations, and copyleft risk
permissions:
  reads: ["**/*"]
  writes: ["legal/**", "LICENSE_REPORT*.md", "NOTICE*"]
  commands: ["npm ls*", "npx license-checker*", "yarn licenses*", "pnpm licenses*", "pip-licenses*", "pip show*", "cargo license*", "cargo metadata*", "go-licenses*", "composer licenses*", "mvn license:*", "gradle*licenseReport*", "dotnet list*"]
  network: false
  destructive: false
---

Scan the project's actual dependency tree for license compatibility problems and unmet obligations —
GPL/AGPL copyleft reaching into proprietary code, attribution requirements nobody is fulfilling,
licenses incompatible with how the product ships. Grounded in the real lockfiles and installed
packages, not a generic license explainer.

Steps:

1. **Establish how the product ships** (`$ARGUMENTS` may say — ask if not)
   - Distribution model changes everything: SaaS (server-side only), distributed binary/app, open-source project, embedded/on-device, internal tool
   - The project's own intended license (proprietary, MIT, Apache-2.0, GPL...) — compatibility is always relative to this
   - Any known constraints: customer contracts banning copyleft, plans to open-source, app store distribution

2. **Enumerate the full dependency tree**
   - Detect package managers from manifests: package.json/lockfiles, requirements.txt/poetry.lock/Pipfile, Cargo.toml, go.mod, composer.json, pom.xml/build.gradle, *.csproj, Gemfile
   - Prefer package-manager license tooling where installed (`npx license-checker`, `pip-licenses`, `cargo license`, `composer licenses`, `go-licenses`, `mvn license:aggregate-third-party-report`); fall back to reading lockfile metadata and LICENSE files inside installed packages
   - Include transitive dependencies — copyleft usually arrives transitively; note direct vs. transitive for each finding
   - Also scan for non-package inclusions: vendored code, copy-pasted snippets with license headers, bundled fonts/assets/models with their own licenses

3. **Classify every license found**
   - Buckets: permissive (MIT, BSD, Apache-2.0, ISC), weak copyleft (LGPL, MPL-2.0, EPL), strong copyleft (GPL-2.0/3.0), network copyleft (AGPL-3.0), source-available/non-OSS (SSPL, BUSL, Elastic, Commons Clause), public domain/CC0, unknown/missing
   - Flag dual-licensed packages (which license applies depends on usage) and "OR" expressions where the project can choose
   - Anything with `UNKNOWN`, custom, or missing license goes on the must-resolve list — unknown is not "probably fine"

4. **Assess compatibility against the distribution model**
   - AGPL: a problem even for SaaS — network use triggers source obligations; treat any AGPL dependency in a proprietary product as critical
   - GPL: critical if the product is distributed and links/bundles the dependency; usually acceptable server-side — but check per case (e.g., GPL code compiled into a shipped binary)
   - LGPL/MPL/EPL: fine if kept as replaceable/separate files or dynamically linked; flag static linking or source-level modification
   - Apache-2.0 in a GPL-2.0 project: incompatible — check both directions, not just "is it copyleft"
   - Check obligations already breached: Apache-2.0 NOTICE propagation, BSD/MIT attribution in distributed artifacts, LGPL relink ability

5. **Deliver report and fix list**
   - Write `legal/LICENSE_REPORT_[YYYY-MM-DD].md`: summary table (license → count → risk for this distribution model), then findings ordered by severity with package name, version, direct/transitive, dependency path, and the specific obligation or conflict
   - For each problem, give the practical options: replace with a permissive alternative (name a candidate if one is well known), isolate behind a process/API boundary, buy a commercial license, or comply with the copyleft terms
   - If attribution obligations are unmet, generate or update a `NOTICE`/third-party-licenses file from the scan
   - Suggest `/legal--contract-review` if customer contracts contain open-source warranties this report affects

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Report what the metadata says and flag uncertainty; lockfile license fields are sometimes wrong — for critical findings, verify against the LICENSE file shipped in the package itself
- Compatibility verdicts depend on linking, modification, and distribution details that code inspection cannot fully resolve — mark such findings `[COUNSEL]` rather than guessing
- Dev-only dependencies (test runners, linters) that never ship usually pose no distribution risk — separate them in the report instead of inflating the problem count
- Rerun this check in CI-adjacent routine (e.g., before releases); a clean report goes stale with every dependency bump

$ARGUMENTS
