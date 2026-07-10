---
description: API changelog - detect breaking changes between versions with migration notes
permissions:
  reads: ["**/*", ".git/**"]
  writes: ["API_CHANGELOG.md", "docs/api-changelog.md"]
  commands: ["git diff", "git log", "git show", "git tag"]
  network: false
  destructive: false
---

Generate an API changelog by comparing two versions of the codebase, classifying every
API change as breaking / non-breaking / deprecation, and writing migration notes for each
breaking change so consumers can upgrade without spelunking through diffs.

Steps:

1. **Determine what the API surface is and which versions to compare**
   - Detect API type: REST (OpenAPI spec, route definitions in Express/FastAPI/Spring/etc.), GraphQL schema, gRPC/protobuf, or a library's public exports (index exports, `__init__.py`, public headers)
   - Resolve versions from `$ARGUMENTS` (e.g., `v1.2.0..v2.0.0`); default to the last two tags (`git tag --sort=-creatordate`), or last tag vs HEAD if unreleased
   - Prefer a spec artifact when one exists (OpenAPI/GraphQL SDL/proto) — diffing specs beats diffing implementation code

2. **Extract both API surfaces**
   - Use `git show <ref>:<path>` to read the spec/route/export files at each version without touching the working tree
   - If no spec exists, reconstruct the surface from code at each ref: endpoints (method + path + params + request/response shapes), or exported symbols with signatures
   - Normalize into a comparable inventory: operation → inputs, outputs, auth, status codes / symbol → signature, types

3. **Diff and classify every change**
   - **Breaking**: removed endpoint/field/export, renamed without alias, type narrowed or changed, new required parameter/field, auth requirement added, status code semantics changed, enum value removed, default changed in observable ways
   - **Non-breaking**: new endpoints/fields (optional), type widened, new optional params, new enum values (flag: breaking for exhaustive-match clients), docs-only
   - **Deprecations**: markers found (`@deprecated`, `deprecated: true`, sunset headers) — note the announced removal timeline
   - Cross-check with `git log --oneline <a>..<b> -- <api paths>` for intent (commit messages mentioning `BREAKING CHANGE`, `feat!:`)

4. **Write migration notes for each breaking change**
   - Before/after example: the old call and the new equivalent call, in the consumer's terms
   - Why it changed (from commit messages/PR references if discoverable)
   - Mechanical migration hint where possible (rename map, codemod-style regex, header to add)

5. **Produce the changelog document**
   - Write `API_CHANGELOG.md` (or append a version section to `docs/api-changelog.md` if it exists) with: version header + date, `## Breaking Changes` (with migration notes), `## Deprecations`, `## Added`, `## Changed`, `## Fixed`
   - Order breaking changes by blast radius (most-used endpoints first, if usage is inferable)
   - Top of section: a one-paragraph upgrade summary and an "is this upgrade breaking for me?" checklist

6. **Recommend versioning**
   - Given the classification, state what the next semver should be (major if any breaking change) and flag mismatches (e.g., breaking changes found but the diff targets a minor bump)

**Notes:**
- Classify conservatively: when unsure whether a change is breaking, list it as breaking with a note — a false alarm is cheaper than a broken consumer
- Behavioral breaks don't show in signatures (validation tightened, ordering changed, rate limits) — scan the diff of handler bodies for these and mark them `behavioral`
- If both versions have OpenAPI specs, mention that CI can enforce this going forward (oasdiff or similar) — but do not add tooling unless asked
- Keep entries consumer-centric: describe what the caller experiences, not what the implementation did internally

$ARGUMENTS
