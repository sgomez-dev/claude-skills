---
description: Scaffold a documentation site — tool choice, information architecture, templates
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["node", "npm", "npx", "pnpm", "yarn", "pip", "python"]
  network: true
  destructive: false
---

Scaffold a documentation site that developers will actually use: pick the right generator for the
project, design the information architecture before writing a single page, and ship page templates
plus 2-3 real seeded pages so the docs don't die as an empty skeleton. Works for a product, an API,
an open-source library, or internal docs.

Steps:

1. **Understand the project and audience** (`$ARGUMENTS`)
   - Detect the stack from the repo: language, package manager, existing docs (`README.md`, `docs/`, wiki exports), and whether an API spec (OpenAPI/GraphQL schema) exists to generate reference pages from
   - Ask what's not detectable: who reads these docs (end users, API consumers, contributors, internal team)? Where will they be hosted (GitHub Pages, Vercel, Netlify, Cloudflare Pages, internal)?
   - Confirm the docs language — write in the audience's language, and note early if the site needs i18n, because that constrains tool choice

2. **Choose the generator — match the project, don't default**
   - **Starlight (Astro)**: best default for product/library docs today — fast, accessible, built-in search, i18n, dark mode, low config
   - **Docusaurus**: React ecosystem, docs versioning out of the box, MDX with React components — pick when versioned docs or heavy custom components are needed
   - **VitePress**: Vue ecosystem or when the team already lives in Vite; minimal and fast
   - **MkDocs Material**: Python projects or teams who want pure Markdown and zero JS toolchain
   - Recommend one with a one-line reason tied to the detected stack and requirements (versioning, i18n, API reference volume); confirm before scaffolding

3. **Design the information architecture first**
   - Structure around the Diátaxis quadrants and label sections by reader intent: **Getting started** (tutorial), **Guides** (how-to, task-named: "Authenticate a request", not "Authentication overview"), **Reference** (API/config, generated where possible), **Concepts** (explanations)
   - Draft the full sidebar tree with every planned page as a stub title; cap top-level sections at ~6 and nesting at 2 levels
   - Define the golden path: the one sequence a new user follows from landing page to first success in under 10 minutes — this gets built first and best

4. **Scaffold the site**
   - Run the generator's official scaffold (e.g., `npm create astro@latest -- --template starlight`) into `docs/` or a `docs-site/` directory — don't clobber an existing `docs/` folder; migrate its content instead
   - Configure: site title, repo edit links ("Edit this page"), sidebar from the IA tree, search, dark mode, and the base path matching the hosting target
   - Wire the build into the repo: add docs scripts to the package manifest and a CI step or host config (Pages workflow, `vercel.json`, etc.) so previews build on PRs

5. **Create page templates and seed real content**
   - Add templates (as `_templates/` or documented skeletons) for the recurring page types: how-to guide (goal, prerequisites, numbered steps, verify, troubleshoot), reference page, concept page, changelog entry
   - Seed 2-3 real pages, not lorem ipsum: the getting-started tutorial (from the README and actual project code — verify every command runs), one guide, and the reference index (generated from the OpenAPI spec if one exists)
   - Migrate salvageable existing docs into the new IA; leave redirects or a mapping note for old paths

6. **Verify and hand off**
   - Run the dev server and production build; check search works, sidebar matches the IA, internal links resolve, and mobile layout holds
   - Write a short `docs/CONTRIBUTING.md` section: how to add a page, which template to use, how to preview locally
   - Suggest next steps: full writing pass via `/content--technical-writing`, and `/content--seo-content` if the docs are public and discoverability matters

**Notes:**
- Tool choice is reversible, IA is not — teams live with a bad structure for years; spend the review time on the sidebar tree, not the theme
- Prose in docs follows technical-writing rules: task-oriented headings, second person, no marketing adjectives, every code block copy-pasteable and tested
- Generate reference docs from source (OpenAPI, docstrings, JSON schema) whenever possible — hand-written reference pages rot immediately
- Don't enable versioning until there are actually two versions to document; it doubles maintenance from day one
- Keep the scaffold minimal: skip blog plugins, analytics, and fancy landing pages until the golden-path docs exist

$ARGUMENTS
