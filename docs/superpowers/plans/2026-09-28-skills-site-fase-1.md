# skills.sgomez.dev — Fase 1 (Fundación) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a static, bilingual (ES/EN) Next.js site at `skills.sgomez.dev`. It catalogs every public skill in this repo with one page per skill, per section and per language, plus search, full SEO/GEO and CI deployment to Cloudflare Workers.

**Architecture:** `site/` lives inside the repo. A generate step reads `skills/`, `external/` and `pipelines/`, then writes a typed `catalog.json` plus static GEO files (Markdown twins, `llms.txt`, search indexes) into `public/`. Every route is prerendered with `generateStaticParams` and served by Cloudflare Workers through `@opennextjs/cloudflare`, using the static-assets incremental cache. Spanish text comes from a versioned translation cache written inside Claude Code sessions. There are **no API calls** anywhere.

**Tech Stack:** Next.js 16.3.6 (App Router, RSC), React 19.3, TypeScript strict, Tailwind CSS 4.3, Motion 13 (`motion/react`), fuse.js 7.5, zod 4, gray-matter, yaml, schema-dts, Vitest 5, Playwright 1.63, Lighthouse CI 0.15, `@opennextjs/cloudflare` 1.20.6, wrangler 4.142.

**Spec:** `docs/superpowers/specs/2026-09-28-skills-site-design.md` (read it before starting; this plan implements its §11 phase 1).

## Global Constraints

- **Zero paid API calls.** No `@anthropic-ai/sdk`, no `ANTHROPIC_API_KEY` and no LLM call in code, scripts or CI (spec §3.2). Spanish translations are written by Claude Code sessions into `site/content/i18n/skills/*.json`.
- Node ≥ 22. `next@16.3.6` exactly (OpenNext peer range is `>=16.3.3`).
- Every route is static: `generateStaticParams` plus `export const dynamicParams = false`. The only dynamic route is `src/app/route.ts` (the `/` language redirect).
- Do **not** create `proxy.ts` or `middleware.ts`. Next 16 proxy is Node-only; the root redirect is a Route Handler.
- Site URL `https://skills.sgomez.dev`. Repo `https://github.com/sgomez-dev/claude-skills`.
- Author credit is exactly **"Santiago Gómez de la Torre"**, URL `https://sgomez.dev`. Never write "Santiago Gómez" alone.
- Routes: `/{lang}`, `/{lang}/{section}`, `/{lang}/s/{slug}` and `/{lang}/credits`. `lang` ∈ {`es`, `en`}, default `en`. Section ids are English in both languages: `video web brand ads sales business ai data code`. *(Deviation from spec §4, which wrote `/creditos`: one path for both languages keeps `swapLang` trivial.)*
- The skill slug is the invocation name: `<category>--<name>` for commands, the directory name for externals.
- Colour tokens (spec §2): night `#0d0d0f`, ink `#f4eee4`, acid `#c6ff3d`, pink `#ff5ea8`, cyan `#2af5ff`, sun `#ffd23d`, terra `#D97757`.
- Fonts: Bricolage Grotesque 500/800 (display, the only preloaded one), Instrument Serif 400 italic (accents only) and JetBrains Mono 500/700, via `next/font/google` with the `latin` subset.
- Every UI string lives in `src/lib/i18n/dictionaries/{en,es}.ts`. `es` is typed as `Dictionary`, so a missing key fails `tsc`.
- Never read `external/.local/` or the contents of `external/sources.local.txt`, except to collect private *names* for the leak guard.
- `prefers-reduced-motion: reduce` disables every animation (spec §6).
- Mobile Lighthouse budgets on home, a section and a skill page: LCP < 2500 ms, CLS < 0.05, TBT < 200 ms (lab proxy for INP), SEO = 1.0, Accessibility ≥ 0.95. Home first-load JS ≤ 120 KB gzip.
- Phase 1 does **not** include `/empieza`, recipes, the demo reel, reportajes or demos. Do not leave placeholders for them: CTAs point to the README install section instead.

## Review Focus

1. **A skill description containing `<`, `</script>`, quotes or backticks** must render as text, never break the JSON-LD `<script>` and never inject HTML. Test: `serializeJsonLd` escapes `<` (Task 8).
2. **Very long upstream descriptions (1000+ chars, multi-paragraph) and long slugs** (`ads-server-side-tracking`, `vercel-react-best-practices`) must produce a meta description ≤ 160 chars cut at a word boundary, and no horizontal scroll at 375 px. Tests: `truncate` (Task 8), and an e2e check with no overflow on the longest skill page (Task 15).
3. **`Accept-Language` edge cases** (`null`, `*`, `es-MX`, `en-US,es;q=0.9`, `es;q=0`, garbage) must pick a supported language or fall back to `en`. Test: `pickLanguage` table (Task 7).
4. **Searching without accents** ("revision", "contrato", "subtitulos") must still find Spanish text that has them. Test: searcher with `ignoreDiacritics` (Task 12).
5. **A developer machine with `external/sources.local.txt` and `external/.local/`** must never publish a private skill in the catalog, sitemap, search index, `.md` twins or `llms.txt`. Tests: guard (Task 3) and a post-build scan of `.open-next/` (Task 15).

## Execution notes (model choice)

Per the user's global rules: tasks **3, 7, 8 and 9** are *core*. Other tasks consume their outputs: catalog, layout/routing, SEO helpers and the skill page components. Review those four with **opus**; review the rest with **sonnet**. Implement with **sonnet**; Task 5 (translations) runs in batches with **sonnet** subagents. Always pass the model explicitly.

## File Structure

```
site/
├── package.json · tsconfig.json · next.config.ts · open-next.config.ts · wrangler.jsonc
├── postcss.config.mjs · vitest.config.ts · playwright.config.ts · lighthouserc.json · .gitignore
├── assets/og-fonts/*.woff + OFL.txt          fonts for OG images (build time only)
├── content/i18n/skills/<slug>.json           ES translations + "how to ask" (written in Claude Code)
├── scripts/
│   ├── generate.ts                           repo → .generated/catalog.json + public/ GEO files
│   ├── translations.ts                       `plan` (worklist) and `check` (validator); no API
│   └── check-no-private.ts                   post-build leak scan
├── src/
│   ├── app/
│   │   ├── route.ts                          GET / → 307 /es|/en
│   │   ├── sitemap.ts · robots.ts
│   │   └── [lang]/
│   │       ├── layout.tsx · page.tsx · opengraph-image.tsx
│   │       ├── credits/page.tsx
│   │       ├── [section]/page.tsx · [section]/opengraph-image.tsx
│   │       └── s/[slug]/page.tsx · s/[slug]/opengraph-image.tsx
│   ├── content/sections.ts · featured.ts     editorial config (sections, mapping, featured slugs)
│   ├── lib/
│   │   ├── site.ts · urls.ts                 constants, path builders, swapLang
│   │   ├── catalog/                          types · clean · license · parse-* · text · sections-map · schema · guard · git-dates · build · index
│   │   ├── i18n/                             languages · negotiate · format · dictionaries/{en,es} · index
│   │   ├── seo/                              truncate · metadata · jsonld
│   │   ├── geo/                              markdown · llms · write
│   │   ├── search/                           index (writer) · searcher (client, lazy)
│   │   ├── design/                           tokens · contrast
│   │   ├── og/cover.tsx
│   │   ├── fonts.ts · motion.ts · install.ts
│   ├── components/
│   │   ├── layout/                           Masthead · Footer · LangSwitch
│   │   ├── ui/                               Sticker · CopyButton · Reveal · JsonLd
│   │   ├── skill/                            SkillCard · InstallTabs · PermissionManifest · Provenance · HowToAsk
│   │   ├── section/SkillGrid.tsx
│   │   ├── home/                             Cover · CommandTicker · SectionIndex · StatsStrip · Faq
│   │   └── search/                           SearchDialog · SearchTrigger
│   └── styles/globals.css
└── tests/
    ├── fixtures/repo/…                       mini repo for catalog tests
    ├── unit/**/*.test.ts
    └── e2e/*.spec.ts
.github/workflows/site.yml
```

---

### Task 1: Scaffold `site/` and prove OpenNext on Workers

**Files:**
- Create: `site/package.json`, `site/tsconfig.json`, `site/next.config.ts`, `site/open-next.config.ts`, `site/wrangler.jsonc`, `site/vitest.config.ts`, `site/.gitignore`, `site/public/_headers`
- Create (temporary, replaced in Task 7): `site/src/app/[lang]/layout.tsx`, `site/src/app/[lang]/page.tsx`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `preview`, `deploy`, `typecheck` and `test`, used by every later task. Local preview runs at `http://localhost:8787`.

This task retires the top risk in spec §12, OpenNext + Next 16. If Step 6 fails, stop and report; do not work around it.

- [ ] **Step 1: Create `site/package.json`**

```json
{
  "name": "claude-skills-site",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run from `site/`:
```bash
npm i next@16.3.6 react@19.3.0 react-dom@19.3.0
npm i -D typescript @types/node @types/react @types/react-dom @opennextjs/cloudflare@1.20.6 wrangler@4.142.0 vitest@5.0.2 tsx@4.23.15
```
Expected: `package-lock.json` created, no peer-dependency errors.

- [ ] **Step 3: Config files**

`site/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2024"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "types": ["node"],
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", ".open-next"]
}
```
(If `next build` rewrites `jsx` or adds `include` entries, keep Next's changes.)

`site/next.config.ts`:
```ts
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;

initOpenNextCloudflareForDev();
```

`site/open-next.config.ts`:
```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
```

`site/wrangler.jsonc`:
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "claude-skills-site",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-09-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "claude-skills-site" }]
}
```
(The custom domain route is added in Task 16, not now.)

`site/vitest.config.ts`:
```ts
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
```

`site/.gitignore`:
```
node_modules/
.next/
.open-next/
.wrangler/
.generated/
next-env.d.ts
*.tsbuildinfo
test-results/
playwright-report/
.lighthouseci/
# generated by scripts/generate.ts
public/es/
public/en/
public/es.md
public/en.md
public/llms.txt
public/llms-full.txt
public/search/
```

`site/public/_headers`:
```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

- [ ] **Step 4: Temporary minimal routes**

`site/src/app/[lang]/layout.tsx`:
```tsx
import type { ReactNode } from 'react';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
```

`site/src/app/[lang]/page.tsx`:
```tsx
export default function Home() {
  return (
    <main>
      <h1>claude/skills</h1>
    </main>
  );
}
```

- [ ] **Step 5: Build with Next**

Run: `npm run build`
Expected: success. The route table lists `/[lang]` as prerendered (●/○) with `/es` and `/en`.

- [ ] **Step 6: Build and run in the Workers runtime**

Run: `npm run preview` (in background), wait for `Ready on http://localhost:8787`, then:
```bash
curl -s http://localhost:8787/en | grep -c 'claude/skills'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8787/es
```
Expected: `1`, then `200`. Stop the preview server.

- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "feat(site): scaffold Next 16 + OpenNext Cloudflare"
```

---

### Task 2: Catalog parsers (commands, externals, pipelines, licenses)

**Files:**
- Create: `site/src/lib/i18n/languages.ts`, `site/src/lib/catalog/types.ts`, `site/src/lib/catalog/clean.ts`, `site/src/lib/catalog/license.ts`, `site/src/lib/catalog/parse-command.ts`, `site/src/lib/catalog/parse-external.ts`, `site/src/lib/catalog/parse-pipeline.ts`
- Create fixtures under `site/tests/fixtures/repo/` (listed in Step 1)
- Test: `site/tests/unit/catalog/parsers.test.ts`

**Interfaces:**
- Produces:
  - `LANGS`, `Lang`, `DEFAULT_LANG`, `isLang(v: string): v is Lang`
  - `SECTION_IDS`, `SectionId`, `Permissions`, `SkillText`, `CommandSkill`, `ExternalSkill`, `Skill`, `Pipeline`, `PipelineStep`, `Catalog`, `RawCommand`, `RawExternal`
  - `toPosix(p: string): string`, `cleanDescription(v: unknown): string`
  - `detectLicense(text: string): string`
  - `listCommandFiles(repoRoot: string): string[]`, `parseCommand(file: string, repoRoot: string): RawCommand`
  - `listExternalDirs(repoRoot: string): string[]`, `parseExternal(dir: string, repoRoot: string): RawExternal`
  - `listPipelineFiles(repoRoot: string): string[]`, `parsePipeline(file: string): Pipeline`

- [ ] **Step 1: Install parser deps and write fixtures**

```bash
npm i gray-matter@4.0.3 yaml@2.9.1 zod@4.6.5
```

Create these fixture files exactly.

`site/tests/fixtures/repo/skills/legal/contract-review.md`:
```markdown
---
description: Review a contract draft - flag risky clauses
permissions:
  reads: ["**/*.md"]
  writes: ["legal/**"]
  commands: []
  network: false
  destructive: false
---

Body.
```

`site/tests/fixtures/repo/skills/utils/ffmpeg.md`:
```markdown
---
description: Convert, trim and compress media with ffmpeg
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["ffmpeg"]
  network: false
  destructive: true
---

Body.
```

`site/tests/fixtures/repo/skills/utils/ffmpeg.test.yaml`:
```yaml
cases: []
```

`site/tests/fixtures/repo/broken/no-description.md`:
```markdown
---
permissions: {}
---
Body.
```

`site/tests/fixtures/repo/external/ffmpeg/SKILL.md`:
```markdown
---
name: ffmpeg
description: FFmpeg recipes for video production.
---
Body.
```

`site/tests/fixtures/repo/external/ffmpeg/UPSTREAM.md`:
```markdown
# Upstream provenance — ffmpeg

- Source repo: <https://github.com/digitalsamba/claude-code-video-toolkit>
- Tracked ref: `main`
- Upstream path: `.claude/skills/ffmpeg`
- Vendored commit: `abc1234def`
- Commit date: 2026-09-21T15:46:43+02:00
- Synced: 2026-09-28T10:00:00Z
- Scope: public
```

`site/tests/fixtures/repo/external/ffmpeg/LICENSE`:
```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
```

`site/tests/fixtures/repo/external/multi/SKILL.md`:
```markdown
---
name: multi
description: >
  Line one
  continues here.   Second sentence.
---
Body.
```

`site/tests/fixtures/repo/external/multi/UPSTREAM.md`: same as the ffmpeg one, but with `<https://github.com/kylezantos/design-motion-principles>`, path `` `skills/multi` ``, commit `` `feedbeef01` `` and no `Commit date:` line.

`site/tests/fixtures/repo/external/multi/LICENSE`:
```
                                 Apache License
                           Version 2.0, January 2004
```

`site/tests/fixtures/repo/external/no-skill-here/README.md`: `not a skill`

`site/tests/fixtures/repo/external/.local/secret-skill/SKILL.md`:
```markdown
---
name: secret-skill
description: Private, never published.
---
```

`site/tests/fixtures/repo/external/sources.local.txt`:
```
# private
secret-skill|https://github.com/example/secret.git|main|.
```

`site/tests/fixtures/repo/broken/external-no-license/SKILL.md`:
```markdown
---
name: external-no-license
description: Has no license.
---
```
plus `site/tests/fixtures/repo/broken/external-no-license/UPSTREAM.md`, copied from the ffmpeg one.

`site/tests/fixtures/repo/pipelines/code-cleanup.yaml`:
```yaml
name: Code Cleanup
description: Dead code removal and DRY fixes
trigger: /pipeline--code-cleanup
steps:
  - name: Dead Code Removal
    skill: code-quality--dead-code
    description: Find and remove unused code
  - name: DRY Analysis
    skill: code-quality--dry
    description: Find duplicated code
```

`site/tests/fixtures/repo/.claude-plugin/marketplace.json`:
```json
{
  "name": "claude-skills-collection",
  "plugins": [
    { "name": "legal-skills", "source": { "source": "git-subdir", "url": "x", "path": "skills/legal" } },
    { "name": "utility-skills", "source": { "source": "git-subdir", "url": "x", "path": "skills/utils" } }
  ]
}
```

- [ ] **Step 2: Write the failing tests**

`site/tests/unit/catalog/parsers.test.ts`:
```ts
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { detectLicense } from '@/lib/catalog/license';
import { listCommandFiles, parseCommand } from '@/lib/catalog/parse-command';
import { listExternalDirs, parseExternal } from '@/lib/catalog/parse-external';
import { listPipelineFiles, parsePipeline } from '@/lib/catalog/parse-pipeline';
import { cleanDescription, toPosix } from '@/lib/catalog/clean';

const FIX = path.resolve(import.meta.dirname, '../../fixtures/repo');

describe('parseCommand', () => {
  it('reads description, permissions and the invocation slug', () => {
    const c = parseCommand(path.join(FIX, 'skills/legal/contract-review.md'), FIX);
    expect(c).toEqual({
      kind: 'command',
      slug: 'legal--contract-review',
      name: 'contract-review',
      category: 'legal',
      description: 'Review a contract draft - flag risky clauses',
      sourcePath: 'skills/legal/contract-review.md',
      permissions: { reads: ['**/*.md'], writes: ['legal/**'], commands: [], network: false, destructive: false },
    });
  });

  it('throws when description is missing', () => {
    expect(() => parseCommand(path.join(FIX, 'broken/no-description.md'), FIX)).toThrow(/missing description/);
  });

  it('lists only .md files under skills/<category>/', () => {
    expect(listCommandFiles(FIX).map((f) => path.basename(f))).toEqual(['contract-review.md', 'ffmpeg.md']);
  });
});

describe('parseExternal', () => {
  it('reads SKILL.md, UPSTREAM.md and LICENSE', () => {
    const e = parseExternal(path.join(FIX, 'external/ffmpeg'), FIX);
    expect(e).toEqual({
      kind: 'external',
      slug: 'ffmpeg',
      name: 'ffmpeg',
      description: 'FFmpeg recipes for video production.',
      sourcePath: 'external/ffmpeg',
      license: 'MIT',
      upstream: {
        url: 'https://github.com/digitalsamba/claude-code-video-toolkit',
        owner: 'digitalsamba',
        repo: 'digitalsamba/claude-code-video-toolkit',
        commit: 'abc1234def',
        path: '.claude/skills/ffmpeg',
      },
      commitDate: '2026-09-21T15:46:43+02:00',
    });
  });

  it('collapses folded YAML descriptions and tolerates a missing commit date', () => {
    const e = parseExternal(path.join(FIX, 'external/multi'), FIX);
    expect(e.description).toBe('Line one continues here. Second sentence.');
    expect(e.license).toBe('Apache-2.0');
    expect(e.commitDate).toBeNull();
  });

  it('skips dot-directories and directories without SKILL.md', () => {
    expect(listExternalDirs(FIX).map((d) => path.basename(d))).toEqual(['ffmpeg', 'multi']);
  });

  it('throws when LICENSE is missing', () => {
    expect(() => parseExternal(path.join(FIX, 'broken/external-no-license'), FIX)).toThrow(/missing LICENSE/);
  });
});

describe('parsePipeline', () => {
  it('reads name, trigger and steps', () => {
    const [file] = listPipelineFiles(FIX);
    const p = parsePipeline(file!);
    expect(p.slug).toBe('code-cleanup');
    expect(p.trigger).toBe('/pipeline--code-cleanup');
    expect(p.steps.map((s) => s.skill)).toEqual(['code-quality--dead-code', 'code-quality--dry']);
  });
});

describe('detectLicense', () => {
  it.each([
    ['Permission is hereby granted, free of charge, to any person', 'MIT'],
    ['Apache License\n Version 2.0, January 2004', 'Apache-2.0'],
    ['Creative Commons Attribution 4.0 International', 'CC-BY-4.0'],
    ['Some bespoke terms', 'LicenseRef-see-file'],
  ])('%s → %s', (text, spdx) => expect(detectLicense(text)).toBe(spdx));
});

describe('clean helpers', () => {
  it('normalises paths and whitespace', () => {
    expect(toPosix('skills\\legal\\a.md')).toBe('skills/legal/a.md');
    expect(cleanDescription('  a\n  b\t c ')).toBe('a b c');
    expect(cleanDescription(undefined)).toBe('');
  });
});
```

- [ ] **Step 3: Run to confirm failure**

Run: `npx vitest run tests/unit/catalog/parsers.test.ts`
Expected: FAIL, cannot resolve `@/lib/catalog/license` (and the other modules).

- [ ] **Step 4: Implement**

`site/src/lib/i18n/languages.ts`:
```ts
export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
export function isLang(v: string | undefined): v is Lang {
  return v !== undefined && (LANGS as readonly string[]).includes(v);
}
```

`site/src/lib/catalog/types.ts`:
```ts
import type { Lang } from '@/lib/i18n/languages';

export const SECTION_IDS = ['video', 'web', 'brand', 'ads', 'sales', 'business', 'ai', 'data', 'code'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Permissions {
  reads: string[];
  writes: string[];
  commands: string[];
  network: boolean;
  destructive: boolean;
}

export interface SkillText {
  description: string;
  howToAsk: string[];
  translated: boolean;
}

interface SkillBase {
  slug: string;
  name: string;
  description: string;
  section: SectionId;
  sourcePath: string;
  updatedAt: string | null;
  text: Record<Lang, SkillText>;
}

export interface CommandSkill extends SkillBase {
  kind: 'command';
  category: string;
  bundle: string | null;
  permissions: Permissions;
}

export interface Upstream {
  url: string;
  owner: string;
  repo: string;
  commit: string;
  path: string;
}

export interface ExternalSkill extends SkillBase {
  kind: 'external';
  license: string;
  upstream: Upstream;
}

export type Skill = CommandSkill | ExternalSkill;

export interface PipelineStep {
  name: string;
  skill: string;
  description: string;
}

export interface Pipeline {
  slug: string;
  name: string;
  description: string;
  trigger: string;
  steps: PipelineStep[];
}

export interface Catalog {
  generatedAt: string;
  counts: { commands: number; external: number; total: number };
  skills: Skill[];
  pipelines: Pipeline[];
}

export type RawCommand = Omit<CommandSkill, 'section' | 'text' | 'updatedAt' | 'bundle'>;
export type RawExternal = Omit<ExternalSkill, 'section' | 'text' | 'updatedAt'> & { commitDate: string | null };
```

`site/src/lib/catalog/clean.ts`:
```ts
export function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

export function cleanDescription(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
}
```

`site/src/lib/catalog/license.ts`:
```ts
export function detectLicense(text: string): string {
  if (/Permission is hereby granted, free of charge/.test(text)) return 'MIT';
  if (/Apache License[\s\S]{0,200}Version 2\.0/.test(text)) return 'Apache-2.0';
  if (/Creative Commons Attribution 4\.0/i.test(text)) return 'CC-BY-4.0';
  return 'LicenseRef-see-file';
}
```

`site/src/lib/catalog/parse-command.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cleanDescription, toPosix } from './clean';
import type { Permissions, RawCommand } from './types';

export function listCommandFiles(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'skills');
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      fs
        .readdirSync(path.join(base, d.name))
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.join(base, d.name, f)),
    )
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function list(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function parsePermissions(p: unknown, rel: string): Permissions {
  if (p == null || typeof p !== 'object') throw new Error(`${rel}: missing permissions`);
  const o = p as Record<string, unknown>;
  return {
    reads: list(o.reads),
    writes: list(o.writes),
    commands: list(o.commands),
    network: o.network === true,
    destructive: o.destructive === true,
  };
}

export function parseCommand(file: string, repoRoot: string): RawCommand {
  const rel = toPosix(path.relative(repoRoot, file));
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  const description = cleanDescription(data.description);
  if (!description) throw new Error(`${rel}: missing description`);
  const category = path.basename(path.dirname(file));
  const name = path.basename(file, '.md');
  return {
    kind: 'command',
    slug: `${category}--${name}`,
    name,
    category,
    description,
    sourcePath: rel,
    permissions: parsePermissions(data.permissions, rel),
  };
}
```

`site/src/lib/catalog/parse-external.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cleanDescription, toPosix } from './clean';
import { detectLicense } from './license';
import type { RawExternal, Upstream } from './types';

export function listExternalDirs(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'external');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && fs.existsSync(path.join(base, d.name, 'SKILL.md')))
    .map((d) => path.join(base, d.name))
    .sort((a, b) => a.localeCompare(b));
}

function parseUpstream(md: string, rel: string): { upstream: Upstream; commitDate: string | null } {
  const repo = md.match(/^- Source repo: <(https:\/\/github\.com\/([^/>]+)\/([^/>]+))>/m);
  const commit = md.match(/^- Vendored commit: `([0-9a-f]+)`/m);
  const upath = md.match(/^- Upstream path: `([^`]+)`/m);
  const date = md.match(/^- Commit date: (\S+)/m);
  if (!repo || !commit || !upath) throw new Error(`${rel}/UPSTREAM.md: unrecognised format`);
  return {
    upstream: { url: repo[1]!, owner: repo[2]!, repo: `${repo[2]}/${repo[3]}`, commit: commit[1]!, path: upath[1]! },
    commitDate: date?.[1] ?? null,
  };
}

export function parseExternal(dir: string, repoRoot: string): RawExternal {
  const rel = toPosix(path.relative(repoRoot, dir));
  const slug = path.basename(dir);
  const { data } = matter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
  const description = cleanDescription(data.description);
  if (!description) throw new Error(`${rel}/SKILL.md: missing description`);
  const licensePath = path.join(dir, 'LICENSE');
  if (!fs.existsSync(licensePath)) throw new Error(`${rel}: missing LICENSE`);
  const upstreamPath = path.join(dir, 'UPSTREAM.md');
  if (!fs.existsSync(upstreamPath)) throw new Error(`${rel}: missing UPSTREAM.md`);
  const { upstream, commitDate } = parseUpstream(fs.readFileSync(upstreamPath, 'utf8'), rel);
  const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : slug;
  return {
    kind: 'external',
    slug,
    name,
    description,
    sourcePath: rel,
    license: detectLicense(fs.readFileSync(licensePath, 'utf8')),
    upstream,
    commitDate,
  };
}
```

`site/src/lib/catalog/parse-pipeline.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { Pipeline } from './types';

export function listPipelineFiles(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'pipelines');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => path.join(base, f));
}

interface RawStep {
  name?: unknown;
  skill?: unknown;
  description?: unknown;
}

export function parsePipeline(file: string): Pipeline {
  const doc = YAML.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  const steps = Array.isArray(doc.steps) ? (doc.steps as RawStep[]) : [];
  return {
    slug: path.basename(file, '.yaml'),
    name: String(doc.name ?? ''),
    description: String(doc.description ?? ''),
    trigger: String(doc.trigger ?? ''),
    steps: steps.map((s) => ({ name: String(s.name ?? ''), skill: String(s.skill ?? ''), description: String(s.description ?? '') })),
  };
}
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/unit/catalog/parsers.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 6: Commit**

```bash
git add site/src/lib site/tests site/package.json site/package-lock.json
git commit -m "feat(site): catalog parsers for commands, externals, pipelines"
```

---

### Task 3: Sections, catalog assembly, leak guard, generate script (CORE)

**Files:**
- Create: `site/src/content/sections.ts`, `site/src/lib/catalog/sections-map.ts`, `site/src/lib/catalog/text.ts`, `site/src/lib/catalog/schema.ts`, `site/src/lib/catalog/guard.ts`, `site/src/lib/catalog/git-dates.ts`, `site/src/lib/catalog/build.ts`, `site/src/lib/catalog/index.ts`, `site/scripts/generate.ts`
- Modify: `site/package.json` (scripts)
- Test: `site/tests/unit/catalog/build.test.ts`, `site/tests/unit/catalog/real-repo.test.ts`

**Interfaces:**
- Consumes: everything Task 2 produced.
- Produces:
  - `SectionDef { id; number: string; accent: Accent; name: Record<Lang,string>; headline: Record<Lang,{ lead: string; accent: string }>; dek: Record<Lang,string> }`, `type Accent = 'acid'|'pink'|'cyan'|'sun'|'terra'`, `SECTIONS: SectionDef[]`, `getSection(id: SectionId): SectionDef`
  - `CATEGORY_SECTION`, `REPO_SECTION`, `SKILL_OVERRIDES`, `sectionFor(raw): SectionId` (throws `no section for …`)
  - `TranslationEntry`, `TranslationEntrySchema`, `hashDescription(d: string): string`, `resolveText(description: string, entry: TranslationEntry | null): Record<Lang, SkillText>`, `loadTranslation(dir: string, slug: string): TranslationEntry | null`
  - `CatalogSchema`
  - `readPrivateNames(repoRoot: string): string[]`, `assertNoPrivate(catalog: Catalog, privateNames: string[]): void`
  - `readGitDates(repoRoot: string, pathspecs: string[]): Map<string, string>`
  - `buildCatalog(opts: BuildOptions): Catalog`, where `BuildOptions = { repoRoot: string; translationsDir: string; gitDates?: Map<string,string>; now?: Date }`
  - Runtime: `catalog: Catalog`, `getSkill(slug: string): Skill | undefined`, `skillsInSection(id: SectionId): Skill[]`, `relatedSkills(skill: Skill, n?: number): Skill[]`
  - `scripts/generate.ts` exports `type Writer = (catalog: Catalog, publicDir: string) => void` and runs `WRITERS`. Later tasks add writers here.
  - File `site/.generated/catalog.json`

- [ ] **Step 1: Write the failing tests**

`site/tests/unit/catalog/build.test.ts`:
```ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalog } from '@/lib/catalog/build';
import { assertNoPrivate, readPrivateNames } from '@/lib/catalog/guard';
import { sectionFor } from '@/lib/catalog/sections-map';
import { hashDescription, resolveText } from '@/lib/catalog/text';
import type { Catalog } from '@/lib/catalog/types';

const FIX = path.resolve(import.meta.dirname, '../../fixtures/repo');
const emptyDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tr-'));

describe('buildCatalog (fixture repo)', () => {
  const catalog = buildCatalog({
    repoRoot: FIX,
    translationsDir: emptyDir(),
    gitDates: new Map([['skills/legal/contract-review.md', '2026-07-10T13:21:22+02:00']]),
    now: new Date('2026-09-28T00:00:00Z'),
  });

  it('counts commands and externals, ignoring private and invalid dirs', () => {
    expect(catalog.counts).toEqual({ commands: 2, external: 2, total: 4 });
    expect(catalog.skills.map((s) => s.slug)).toEqual(['ffmpeg', 'legal--contract-review', 'multi', 'utils--ffmpeg']);
  });

  it('assigns sections by category, upstream repo and override', () => {
    const bySlug = Object.fromEntries(catalog.skills.map((s) => [s.slug, s.section]));
    expect(bySlug).toEqual({ ffmpeg: 'video', 'legal--contract-review': 'business', multi: 'web', 'utils--ffmpeg': 'video' });
  });

  it('maps commands to their marketplace bundle', () => {
    const c = catalog.skills.find((s) => s.slug === 'utils--ffmpeg');
    expect(c?.kind === 'command' && c.bundle).toBe('utility-skills');
  });

  it('dates commands from git and externals from UPSTREAM.md', () => {
    const find = (slug: string) => catalog.skills.find((s) => s.slug === slug)!;
    expect(find('legal--contract-review').updatedAt).toBe('2026-07-10T13:21:22+02:00');
    expect(find('utils--ffmpeg').updatedAt).toBeNull();
    expect(find('ffmpeg').updatedAt).toBe('2026-09-21T15:46:43+02:00');
  });

  it('falls back to English when no translation exists', () => {
    const s = catalog.skills.find((x) => x.slug === 'legal--contract-review')!;
    expect(s.text.es).toEqual({ description: s.description, howToAsk: [], translated: false });
    expect(s.text.en.translated).toBe(true);
  });

  it('includes pipelines', () => {
    expect(catalog.pipelines.map((p) => p.slug)).toEqual(['code-cleanup']);
  });
});

describe('translations', () => {
  const description = 'Review a contract draft - flag risky clauses';
  const entry = {
    sourceHash: hashDescription(description),
    es: { description: 'Revisa un borrador de contrato', howToAsk: ['a', 'b', 'c'] },
    en: { howToAsk: ['x', 'y', 'z'] },
  };

  it('uses a fresh entry', () => {
    const t = resolveText(description, entry);
    expect(t.es).toEqual({ description: 'Revisa un borrador de contrato', howToAsk: ['a', 'b', 'c'], translated: true });
    expect(t.en).toEqual({ description, howToAsk: ['x', 'y', 'z'], translated: true });
  });

  it('ignores a stale entry entirely', () => {
    const t = resolveText('A changed description', entry);
    expect(t.es).toEqual({ description: 'A changed description', howToAsk: [], translated: false });
    expect(t.en.howToAsk).toEqual([]);
  });

  it('loads entries from the translations dir during build', () => {
    const dir = emptyDir();
    fs.writeFileSync(path.join(dir, 'legal--contract-review.json'), JSON.stringify(entry));
    const c = buildCatalog({ repoRoot: FIX, translationsDir: dir });
    expect(c.skills.find((s) => s.slug === 'legal--contract-review')!.text.es.translated).toBe(true);
  });
});

describe('sectionFor', () => {
  it('throws for an unmapped upstream so a new source forces a decision', () => {
    expect(() =>
      sectionFor({ kind: 'external', slug: 'x', upstream: { url: '', owner: 'nobody', repo: 'nobody/new-repo', commit: '', path: '' } }),
    ).toThrow(/no section for x/);
  });
  it('throws for an unmapped category', () => {
    expect(() => sectionFor({ kind: 'command', slug: 'zzz--a', category: 'zzz' })).toThrow(/no section for zzz--a/);
  });
});

describe('private leak guard', () => {
  it('reads private names from sources.local.txt and external/.local', () => {
    expect(readPrivateNames(FIX)).toEqual(['secret-skill']);
  });

  it('throws when a private slug or a .local path reaches the catalog', () => {
    const base = buildCatalog({ repoRoot: FIX, translationsDir: emptyDir() });
    const leaked: Catalog = { ...base, skills: [...base.skills, { ...base.skills[0]!, slug: 'secret-skill' }] };
    expect(() => assertNoPrivate(leaked, ['secret-skill'])).toThrow(/private skill/);
    const leakedPath: Catalog = { ...base, skills: [{ ...base.skills[0]!, sourcePath: 'external/.local/x' }] };
    expect(() => assertNoPrivate(leakedPath, [])).toThrow(/private skill/);
  });
});
```

`site/tests/unit/catalog/real-repo.test.ts`:
```ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalog } from '@/lib/catalog/build';
import { readPrivateNames } from '@/lib/catalog/guard';
import { listCommandFiles } from '@/lib/catalog/parse-command';
import { listExternalDirs } from '@/lib/catalog/parse-external';
import { SKILL_OVERRIDES } from '@/lib/catalog/sections-map';
import { SECTION_IDS } from '@/lib/catalog/types';

const REPO = path.resolve(import.meta.dirname, '../../../..');
const catalog = buildCatalog({ repoRoot: REPO, translationsDir: fs.mkdtempSync(path.join(os.tmpdir(), 'tr-')) });
const slugs = new Set(catalog.skills.map((s) => s.slug));

describe('real repository', () => {
  it('catalogs every public command and external skill', () => {
    expect(catalog.counts.commands).toBe(listCommandFiles(REPO).length);
    expect(catalog.counts.external).toBe(listExternalDirs(REPO).length);
    expect(catalog.counts.commands).toBeGreaterThanOrEqual(327);
    expect(catalog.counts.external).toBeGreaterThanOrEqual(151);
  });

  it('has no dangling section overrides', () => {
    for (const slug of Object.keys(SKILL_OVERRIDES)) expect(slugs, slug).toContain(slug);
  });

  it('puts at least one skill in every section', () => {
    for (const id of SECTION_IDS) expect(catalog.skills.some((s) => s.section === id), id).toBe(true);
  });

  it('never includes a private skill', () => {
    for (const name of readPrivateNames(REPO)) expect(slugs.has(name), name).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run tests/unit/catalog`
Expected: FAIL, cannot resolve `@/lib/catalog/build`.

- [ ] **Step 3: Implement sections**

`site/src/content/sections.ts`:
```ts
import type { SectionId } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';

export type Accent = 'acid' | 'pink' | 'cyan' | 'sun' | 'terra';

export interface SectionDef {
  id: SectionId;
  number: string;
  accent: Accent;
  name: Record<Lang, string>;
  headline: Record<Lang, { lead: string; accent: string }>;
  dek: Record<Lang, string>;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'video', number: '01', accent: 'acid',
    name: { es: 'Video & Motion', en: 'Video & Motion' },
    headline: { es: { lead: 'Edita como', accent: 'estudio' }, en: { lead: 'Edit like a', accent: 'studio' } },
    dek: { es: 'Cortes, subtítulos karaoke, motion graphics y sonido. Del bruto al reel.', en: 'Cuts, karaoke captions, motion graphics and sound. From raw footage to reel.' },
  },
  {
    id: 'web', number: '02', accent: 'pink',
    name: { es: 'Web y Diseño', en: 'Web & Design' },
    headline: { es: { lead: 'Webs de', accent: 'premio' }, en: { lead: 'Websites that win', accent: 'awards' } },
    dek: { es: 'Landings, animación con GSAP, interfaces con criterio y accesibilidad.', en: 'Landing pages, GSAP animation, interfaces with taste, and accessibility.' },
  },
  {
    id: 'brand', number: '03', accent: 'sun',
    name: { es: 'Marca y Contenido', en: 'Brand & Content' },
    headline: { es: { lead: 'Una marca con', accent: 'voz propia' }, en: { lead: 'A brand with', accent: 'a voice' } },
    dek: { es: 'Identidad, textos que no suenan a IA, imágenes, presentaciones y traducción.', en: 'Identity, copy that does not sound like AI, images, slides and translation.' },
  },
  {
    id: 'ads', number: '04', accent: 'cyan',
    name: { es: 'Ads y Redes', en: 'Ads & Social' },
    headline: { es: { lead: 'Contenido que', accent: 'vende' }, en: { lead: 'Content that', accent: 'sells' } },
    dek: { es: 'Instagram, Meta, TikTok, Google Ads y auditorías de campañas.', en: 'Instagram, Meta, TikTok, Google Ads and campaign audits.' },
  },
  {
    id: 'sales', number: '05', accent: 'acid',
    name: { es: 'Ventas', en: 'Sales' },
    headline: { es: { lead: 'Pipeline en', accent: 'piloto' }, en: { lead: 'Pipeline on', accent: 'autopilot' } },
    dek: { es: 'Leads, cold outreach, propuestas, objeciones y tienda online.', en: 'Leads, cold outreach, proposals, objections and online stores.' },
  },
  {
    id: 'business', number: '06', accent: 'sun',
    name: { es: 'Negocio', en: 'Business' },
    headline: { es: { lead: 'Letra', accent: 'pequeña' }, en: { lead: 'The fine', accent: 'print' } },
    dek: { es: 'Contratos, GDPR, finanzas, pricing y producto.', en: 'Contracts, GDPR, finance, pricing and product.' },
  },
  {
    id: 'ai', number: '07', accent: 'cyan',
    name: { es: 'IA y Agentes', en: 'AI & Agents' },
    headline: { es: { lead: 'Máquinas que', accent: 'piensan' }, en: { lead: 'Machines that', accent: 'think' } },
    dek: { es: 'Agentes, RAG, evals, MCP y machine learning.', en: 'Agents, RAG, evals, MCP and machine learning.' },
  },
  {
    id: 'data', number: '08', accent: 'pink',
    name: { es: 'Datos', en: 'Data' },
    headline: { es: { lead: 'Números', accent: 'claros' }, en: { lead: 'Numbers, made', accent: 'clear' } },
    dek: { es: 'SQL, embudos, cohortes, modelos de datos y bases de datos.', en: 'SQL, funnels, cohorts, data models and databases.' },
  },
  {
    id: 'code', number: '09', accent: 'terra',
    name: { es: 'Código', en: 'Code' },
    headline: { es: { lead: 'Para los', accent: 'devs' }, en: { lead: 'For the', accent: 'devs' } },
    dek: { es: 'Testing, devops, seguridad, git, cloud y depuración.', en: 'Testing, devops, security, git, cloud and debugging.' },
  },
];

export function getSection(id: SectionId): SectionDef {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown section ${id}`);
  return s;
}
```

`site/src/lib/catalog/sections-map.ts`:
```ts
import type { RawCommand, RawExternal, SectionId } from './types';

export const CATEGORY_SECTION: Record<string, SectionId> = {
  accessibility: 'web', ai: 'ai', api: 'code', automation: 'code', cloud: 'code', 'code-quality': 'code',
  content: 'brand', data: 'data', database: 'data', debugging: 'code', devops: 'code', docs: 'code',
  ecommerce: 'sales', finance: 'business', fullstack: 'code', git: 'code', i18n: 'brand', legal: 'business',
  marketing: 'ads', meta: 'ai', ml: 'ai', mobile: 'code', networking: 'code', observability: 'code',
  performance: 'code', product: 'business', sales: 'sales', scaffold: 'code', security: 'code',
  testing: 'code', utils: 'code', web: 'web',
};

export const REPO_SECTION: Record<string, SectionId> = {
  'heygen-com/hyperframes': 'video',
  'digitalsamba/claude-code-video-toolkit': 'video',
  'nateherkai/hyperframes-student-kit': 'video',
  'haidrrrry/claude-remotion-skill': 'video',
  'AgriciDaniel/claude-shorts': 'video',
  'browser-use/video-use': 'video',
  'emilkowalski/skills': 'web',
  'Leonxlnx/taste-skill': 'web',
  'nextlevelbuilder/ui-ux-pro-max-skill': 'web',
  'pbakaus/impeccable': 'web',
  'kylezantos/design-motion-principles': 'web',
  'greensock/gsap-skills': 'web',
  'oso95/scroll-world': 'web',
  'Hainrixz/claude-webkit': 'web',
  'higgsfield-ai/skills': 'brand',
  'AgriciDaniel/banana-claude': 'brand',
  'AgriciDaniel/claude-ads': 'ads',
  'Jakeschincariol/instagram-agent-skill': 'ads',
  'Panniantong/Agent-Reach': 'ai',
  'vercel-labs/agent-browser': 'code',
};

/** Per-skill exceptions. Keys must be real slugs: real-repo.test.ts checks them. */
export const SKILL_OVERRIDES: Record<string, SectionId> = {
  'content--video-script': 'video',
  'docs--video-spec': 'video',
  'scaffold--remotion': 'video',
  'scaffold--create-video': 'video',
  'utils--ffmpeg': 'video',
  'higgsfield-video-explainer': 'video',
  'higgsfield-websites': 'web',
  brand: 'brand',
  'banner-design': 'brand',
  slides: 'brand',
  brandkit: 'brand',
  humanizer: 'brand',
  'write-swift': 'code',
  'deep-research': 'ai',
  'web-reader': 'data',
  'playwright-cli': 'code',
  'chrome-bridge-automation': 'code',
  'seo-audit': 'code',
};

type SectionInput = Pick<RawCommand, 'kind' | 'slug' | 'category'> | Pick<RawExternal, 'kind' | 'slug' | 'upstream'>;

export function sectionFor(skill: SectionInput): SectionId {
  const override = SKILL_OVERRIDES[skill.slug];
  if (override) return override;
  const section = skill.kind === 'command' ? CATEGORY_SECTION[skill.category] : REPO_SECTION[skill.upstream.repo];
  if (!section) {
    const where = skill.kind === 'command' ? `category "${skill.category}"` : `upstream "${skill.upstream.repo}"`;
    throw new Error(`no section for ${skill.slug} (${where}): add it to site/src/lib/catalog/sections-map.ts`);
  }
  return section;
}
```

- [ ] **Step 4: Implement text, schema, guard, git dates and build**

`site/src/lib/catalog/text.ts`:
```ts
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import type { Lang } from '@/lib/i18n/languages';
import type { SkillText } from './types';

export const TranslationEntrySchema = z.strictObject({
  sourceHash: z.string().regex(/^[0-9a-f]{16}$/),
  es: z.strictObject({ description: z.string().min(1), howToAsk: z.array(z.string().min(1)).length(3) }),
  en: z.strictObject({ howToAsk: z.array(z.string().min(1)).length(3) }),
});
export type TranslationEntry = z.infer<typeof TranslationEntrySchema>;

export function hashDescription(description: string): string {
  return createHash('sha256').update(description).digest('hex').slice(0, 16);
}

export function resolveText(description: string, entry: TranslationEntry | null): Record<Lang, SkillText> {
  const fresh = entry !== null && entry.sourceHash === hashDescription(description);
  return {
    en: { description, howToAsk: fresh ? entry.en.howToAsk : [], translated: true },
    es: fresh
      ? { description: entry.es.description, howToAsk: entry.es.howToAsk, translated: true }
      : { description, howToAsk: [], translated: false },
  };
}

export function loadTranslation(dir: string, slug: string): TranslationEntry | null {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  return parsed.success ? parsed.data : null;
}
```

`site/src/lib/catalog/schema.ts`:
```ts
import { z } from 'zod';
import { SECTION_IDS } from './types';

const slug = z.string().regex(/^[a-z0-9]+(?:--?[a-z0-9]+)*$/);
const skillText = z.object({ description: z.string().min(1), howToAsk: z.array(z.string()), translated: z.boolean() });
const base = {
  slug,
  name: z.string().min(1),
  description: z.string().min(1),
  section: z.enum(SECTION_IDS),
  sourcePath: z.string().min(1),
  updatedAt: z.string().nullable(),
  text: z.object({ es: skillText, en: skillText }),
};

const command = z.object({
  ...base,
  kind: z.literal('command'),
  category: z.string().min(1),
  bundle: z.string().nullable(),
  permissions: z.object({
    reads: z.array(z.string()), writes: z.array(z.string()), commands: z.array(z.string()),
    network: z.boolean(), destructive: z.boolean(),
  }),
});

const external = z.object({
  ...base,
  kind: z.literal('external'),
  license: z.string().min(1),
  upstream: z.object({ url: z.url(), owner: z.string().min(1), repo: z.string().min(1), commit: z.string().min(1), path: z.string().min(1) }),
});

export const CatalogSchema = z.object({
  generatedAt: z.string(),
  counts: z.object({ commands: z.number().int(), external: z.number().int(), total: z.number().int() }),
  skills: z.array(z.discriminatedUnion('kind', [command, external])),
  pipelines: z.array(
    z.object({
      slug: z.string(), name: z.string(), description: z.string(), trigger: z.string(),
      steps: z.array(z.object({ name: z.string(), skill: z.string(), description: z.string() })),
    }),
  ),
});
```

`site/src/lib/catalog/guard.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import type { Catalog } from './types';

/** Names only. Never reads the content of private skills. */
export function readPrivateNames(repoRoot: string): string[] {
  const names = new Set<string>();
  const manifest = path.join(repoRoot, 'external', 'sources.local.txt');
  if (fs.existsSync(manifest)) {
    for (const line of fs.readFileSync(manifest, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const name = t.split('|')[0]?.trim();
      if (name) names.add(name);
    }
  }
  const localDir = path.join(repoRoot, 'external', '.local');
  if (fs.existsSync(localDir)) {
    for (const d of fs.readdirSync(localDir, { withFileTypes: true })) if (d.isDirectory()) names.add(d.name);
  }
  return [...names].sort();
}

export function assertNoPrivate(catalog: Catalog, privateNames: string[]): void {
  const priv = new Set(privateNames);
  const leaks = catalog.skills.filter((s) => priv.has(s.slug) || priv.has(s.name) || s.sourcePath.includes('/.local/'));
  if (leaks.length) throw new Error(`private skill(s) in catalog: ${leaks.map((s) => s.slug).join(', ')}`);
}
```

`site/src/lib/catalog/git-dates.ts`:
```ts
import { execFileSync } from 'node:child_process';

/** Latest commit date (ISO) per repo-relative path. Empty map when git is unavailable. */
export function readGitDates(repoRoot: string, pathspecs: string[]): Map<string, string> {
  let out: string;
  try {
    out = execFileSync('git', ['log', '--format=__%cI', '--name-only', '--', ...pathspecs], {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 512 * 1024 * 1024,
    });
  } catch {
    return new Map();
  }
  const dates = new Map<string, string>();
  let current = '';
  for (const line of out.split('\n')) {
    if (line.startsWith('__')) current = line.slice(2).trim();
    else if (line.trim() && !dates.has(line.trim())) dates.set(line.trim(), current);
  }
  return dates;
}
```

`site/src/lib/catalog/build.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { assertNoPrivate, readPrivateNames } from './guard';
import { listCommandFiles, parseCommand } from './parse-command';
import { listExternalDirs, parseExternal } from './parse-external';
import { listPipelineFiles, parsePipeline } from './parse-pipeline';
import { CatalogSchema } from './schema';
import { sectionFor } from './sections-map';
import { loadTranslation, resolveText } from './text';
import type { Catalog, CommandSkill, ExternalSkill, Skill } from './types';

export interface BuildOptions {
  repoRoot: string;
  translationsDir: string;
  gitDates?: Map<string, string>;
  now?: Date;
}

function readBundles(repoRoot: string): Map<string, string> {
  const file = path.join(repoRoot, '.claude-plugin', 'marketplace.json');
  const bundles = new Map<string, string>();
  if (!fs.existsSync(file)) return bundles;
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { plugins?: { name: string; source?: { path?: string } }[] };
  for (const p of data.plugins ?? []) {
    const m = p.source?.path?.match(/^skills\/([^/]+)$/);
    if (m?.[1]) bundles.set(m[1], p.name);
  }
  return bundles;
}

function assertUniqueSlugs(skills: Skill[]): void {
  const seen = new Set<string>();
  for (const s of skills) {
    if (seen.has(s.slug)) throw new Error(`duplicate slug ${s.slug}`);
    seen.add(s.slug);
  }
}

export function buildCatalog({ repoRoot, translationsDir, gitDates = new Map(), now = new Date() }: BuildOptions): Catalog {
  const bundles = readBundles(repoRoot);

  const commands: CommandSkill[] = listCommandFiles(repoRoot)
    .map((f) => parseCommand(f, repoRoot))
    .map((raw) => ({
      ...raw,
      bundle: bundles.get(raw.category) ?? null,
      section: sectionFor(raw),
      updatedAt: gitDates.get(raw.sourcePath) ?? null,
      text: resolveText(raw.description, loadTranslation(translationsDir, raw.slug)),
    }));

  const externals: ExternalSkill[] = listExternalDirs(repoRoot)
    .map((d) => parseExternal(d, repoRoot))
    .map(({ commitDate, ...raw }) => ({
      ...raw,
      section: sectionFor(raw),
      updatedAt: commitDate,
      text: resolveText(raw.description, loadTranslation(translationsDir, raw.slug)),
    }));

  const skills: Skill[] = [...commands, ...externals].sort((a, b) => a.slug.localeCompare(b.slug));
  assertUniqueSlugs(skills);

  const catalog = CatalogSchema.parse({
    generatedAt: now.toISOString(),
    counts: { commands: commands.length, external: externals.length, total: skills.length },
    skills,
    pipelines: listPipelineFiles(repoRoot).map(parsePipeline),
  }) as Catalog;

  assertNoPrivate(catalog, readPrivateNames(repoRoot));
  return catalog;
}
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/unit/catalog`
Expected: PASS. If `real-repo.test.ts` fails with `no section for …`, a skill landed in the repo after this plan was written: add it to `sections-map.ts` following spec §3.3 and rerun. If the slug regex rejects a real slug, report it; do not loosen the regex silently.

- [ ] **Step 6: Generate script and runtime accessor**

`site/scripts/generate.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { buildCatalog } from '../src/lib/catalog/build';
import { readGitDates } from '../src/lib/catalog/git-dates';
import type { Catalog } from '../src/lib/catalog/types';

export type Writer = (catalog: Catalog, publicDir: string) => void;

/** Later tasks register their writers here. */
const WRITERS: Writer[] = [];

const siteRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(siteRoot, '..');
const publicDir = path.join(siteRoot, 'public');

const catalog = buildCatalog({
  repoRoot,
  translationsDir: path.join(siteRoot, 'content', 'i18n', 'skills'),
  gitDates: readGitDates(repoRoot, ['skills']),
});

fs.mkdirSync(path.join(siteRoot, '.generated'), { recursive: true });
fs.writeFileSync(path.join(siteRoot, '.generated', 'catalog.json'), JSON.stringify(catalog));
for (const write of WRITERS) write(catalog, publicDir);

const pendingEs = catalog.skills.filter((s) => !s.text.es.translated).length;
console.log(`catalog: ${catalog.counts.commands} commands + ${catalog.counts.external} external = ${catalog.counts.total}; ES pending: ${pendingEs}`);
```

`site/src/lib/catalog/index.ts`:
```ts
import data from '../../../.generated/catalog.json';
import type { Catalog, SectionId, Skill } from './types';

export const catalog = data as unknown as Catalog;

const bySlug = new Map(catalog.skills.map((s) => [s.slug, s]));

export function getSkill(slug: string): Skill | undefined {
  return bySlug.get(slug);
}

export function skillsInSection(id: SectionId): Skill[] {
  return catalog.skills.filter((s) => s.section === id);
}

function groupOf(s: Skill): string {
  return s.kind === 'command' ? s.category : s.upstream.repo;
}

/** Same section; same category or upstream first, then the rest, alphabetically. Deterministic. */
export function relatedSkills(skill: Skill, n = 6): Skill[] {
  const pool = skillsInSection(skill.section).filter((s) => s.slug !== skill.slug);
  const same = pool.filter((s) => groupOf(s) === groupOf(skill));
  const rest = pool.filter((s) => groupOf(s) !== groupOf(skill));
  return [...same, ...rest].slice(0, n);
}
```

In `site/package.json`, replace the `scripts` block with:
```json
  "scripts": {
    "generate": "tsx scripts/generate.ts",
    "predev": "npm run generate",
    "dev": "next dev",
    "prebuild": "npm run generate",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "pretypecheck": "npm run generate",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
```

- [ ] **Step 7: Run generate against the real repo**

Run: `npm run generate`
Expected output, with counts matching the repo: `catalog: 327 commands + 151 external = 478; ES pending: 478`. `site/.generated/catalog.json` now exists.

- [ ] **Step 8: Typecheck and commit**

Run: `npm run typecheck && npm test`
Expected: both succeed.

```bash
git add site/
git commit -m "feat(site): catalog assembly, sections, leak guard and generate step"
```

---

### Task 4: Translation worklist and validator (no API)

**Files:**
- Create: `site/src/lib/catalog/translations.ts`, `site/scripts/translations.ts`
- Create: `site/content/i18n/skills/.gitkeep`
- Modify: `site/package.json` (add `translations:plan`, `translations:check`)
- Test: `site/tests/unit/catalog/translations.test.ts`

**Interfaces:**
- Consumes: `Catalog`, `Skill`, `hashDescription`, `TranslationEntrySchema` (Task 3).
- Produces:
  - `WorkItem { slug: string; kind: 'command' | 'external'; description: string; sourceHash: string; reason: 'missing' | 'stale' | 'invalid' }`
  - `planTranslations(skills: Skill[], dir: string): WorkItem[]`
  - `checkTranslations(skills: Skill[], dir: string): { errors: string[]; warnings: string[] }`
  - The CLI `npm run translations:plan` writes `.generated/translation-worklist.json`; `npm run translations:check` exits 1 on errors.

- [ ] **Step 1: Failing tests**

`site/tests/unit/catalog/translations.test.ts`:
```ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashDescription } from '@/lib/catalog/text';
import { checkTranslations, planTranslations } from '@/lib/catalog/translations';
import type { Skill } from '@/lib/catalog/types';

const skill = (slug: string, description: string): Skill => ({
  kind: 'command', slug, name: slug, category: 'legal', bundle: null, description, section: 'business',
  sourcePath: `skills/legal/${slug}.md`, updatedAt: null,
  permissions: { reads: [], writes: [], commands: [], network: false, destructive: false },
  text: { en: { description, howToAsk: [], translated: true }, es: { description, howToAsk: [], translated: false } },
});

const entry = (description: string) => ({
  sourceHash: hashDescription(description),
  es: { description: 'ES', howToAsk: ['a', 'b', 'c'] },
  en: { howToAsk: ['x', 'y', 'z'] },
});

function dirWith(files: Record<string, unknown>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tr-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return dir;
}

describe('planTranslations', () => {
  it('lists missing, stale and invalid entries, skipping fresh ones', () => {
    const dir = dirWith({ 'fresh.json': entry('A'), 'stale.json': entry('old text'), 'broken.json': '{"nope":1}' });
    const plan = planTranslations([skill('fresh', 'A'), skill('stale', 'B'), skill('broken', 'C'), skill('missing', 'D')], dir);
    expect(plan.map((w) => [w.slug, w.reason])).toEqual([['stale', 'stale'], ['broken', 'invalid'], ['missing', 'missing']]);
    expect(plan[0]).toMatchObject({ kind: 'command', description: 'B', sourceHash: hashDescription('B') });
  });
});

describe('checkTranslations', () => {
  it('errors on invalid files and on orphans; warns on missing or stale', () => {
    const dir = dirWith({ 'fresh.json': entry('A'), 'stale.json': entry('old'), 'broken.json': '{', 'orphan.json': entry('Z') });
    const r = checkTranslations([skill('fresh', 'A'), skill('stale', 'B'), skill('broken', 'C'), skill('missing', 'D')], dir);
    expect(r.errors.sort()).toEqual(['broken.json: invalid', 'orphan.json: no such skill']);
    expect(r.warnings.sort()).toEqual(['missing: no translation', 'stale: stale (description changed)']);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run tests/unit/catalog/translations.test.ts`
Expected: FAIL, cannot resolve `@/lib/catalog/translations`.

- [ ] **Step 3: Implement**

`site/src/lib/catalog/translations.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { hashDescription, TranslationEntrySchema } from './text';
import type { Skill } from './types';

export interface WorkItem {
  slug: string;
  kind: 'command' | 'external';
  description: string;
  sourceHash: string;
  reason: 'missing' | 'stale' | 'invalid';
}

function readEntry(dir: string, slug: string): { state: 'missing' } | { state: 'invalid' } | { state: 'ok'; sourceHash: string } {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return { state: 'missing' };
  try {
    const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    return parsed.success ? { state: 'ok', sourceHash: parsed.data.sourceHash } : { state: 'invalid' };
  } catch {
    return { state: 'invalid' };
  }
}

export function planTranslations(skills: Skill[], dir: string): WorkItem[] {
  const items: WorkItem[] = [];
  for (const s of skills) {
    const sourceHash = hashDescription(s.description);
    const e = readEntry(dir, s.slug);
    const reason = e.state === 'missing' ? 'missing' : e.state === 'invalid' ? 'invalid' : e.sourceHash !== sourceHash ? 'stale' : null;
    if (reason) items.push({ slug: s.slug, kind: s.kind, description: s.description, sourceHash, reason });
  }
  return items;
}

export function checkTranslations(skills: Skill[], dir: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set(skills.map((s) => s.slug));
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const f of files) {
    const slug = f.slice(0, -'.json'.length);
    if (!slugs.has(slug)) errors.push(`${f}: no such skill`);
    else if (readEntry(dir, slug).state === 'invalid') errors.push(`${f}: invalid`);
  }
  for (const s of skills) {
    const e = readEntry(dir, s.slug);
    if (e.state === 'missing') warnings.push(`${s.slug}: no translation`);
    else if (e.state === 'ok' && e.sourceHash !== hashDescription(s.description)) warnings.push(`${s.slug}: stale (description changed)`);
  }
  return { errors, warnings };
}
```

`site/scripts/translations.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { checkTranslations, planTranslations } from '../src/lib/catalog/translations';
import type { Catalog } from '../src/lib/catalog/types';

const siteRoot = path.resolve(import.meta.dirname, '..');
const dir = path.join(siteRoot, 'content', 'i18n', 'skills');
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, '.generated', 'catalog.json'), 'utf8')) as Catalog;
const command = process.argv[2];

if (command === 'plan') {
  const work = planTranslations(catalog.skills, dir);
  const out = path.join(siteRoot, '.generated', 'translation-worklist.json');
  fs.writeFileSync(out, JSON.stringify(work, null, 2));
  console.log(`${work.length} entries to write → ${path.relative(siteRoot, out)}`);
} else if (command === 'check') {
  const { errors, warnings } = checkTranslations(catalog.skills, dir);
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`error ${e}`);
  console.log(`${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
} else {
  console.error('usage: tsx scripts/translations.ts <plan|check>');
  process.exit(2);
}
```

Add to `site/package.json` scripts:
```json
    "translations:plan": "npm run generate && tsx scripts/translations.ts plan",
    "translations:check": "npm run generate && tsx scripts/translations.ts check",
```
Create an empty `site/content/i18n/skills/.gitkeep`.

- [ ] **Step 4: Run tests and the CLI**

Run: `npx vitest run tests/unit/catalog/translations.test.ts && npm run translations:plan && npm run translations:check`
Expected: tests PASS. `plan` prints `478 entries to write`; `check` prints `0 errors, 478 warnings` and exits 0.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): translation worklist and validator (no API calls)"
```

---

### Task 5: Write the Spanish translations (content, inside Claude Code)

**Files:**
- Create: `site/content/i18n/skills/<slug>.json`, one per item in `.generated/translation-worklist.json`

**Interfaces:**
- Consumes: the worklist (`WorkItem[]`) and `TranslationEntrySchema` (Task 3/4).
- Produces: cache files; `resolveText` picks them up on the next `generate`.

This is content work done **by Claude Code itself**: the controller session dispatches `sonnet` subagents. Nothing is sent to any API from code.

- [ ] **Step 1: Split the worklist into batches of 40**

Run: `npm run translations:plan`, then read `.generated/translation-worklist.json`. Split it into batches of 40 items, in order.

- [ ] **Step 2: Dispatch one `sonnet` subagent per batch (up to 4 in parallel)**

Give each subagent this exact brief, with its batch pasted as JSON:

> For each item, write `site/content/i18n/skills/<slug>.json` containing exactly:
> `{ "sourceHash": "<item.sourceHash>", "es": { "description": "...", "howToAsk": ["...","...","..."] }, "en": { "howToAsk": ["...","...","..."] } }`
> Rules:
> - `es.description`: natural Spanish (Spain, neutral, "tú"), same meaning and roughly the same length as `description`. Keep product names, commands, file names, code identifiers and tool names untranslated (Claude Code, GSAP, `/pipeline--x`, React, GDPR, SEO…). No marketing fluff added.
> - `howToAsk`: 3 realistic requests a non-expert would type in Claude Code to use this skill, concrete and specific, ≤ 120 characters each. If `kind` is `command`, each one starts with `/<slug> ` followed by the argument text (for example `/legal--contract-review contrato-proveedor.pdf, soy el cliente`). If `kind` is `external`, write a plain sentence, because the skill triggers from its description.
> - `en.howToAsk`: the same 3 intents, written natively in English, not literally translated.
> - Copy `sourceHash` verbatim. Write valid JSON, UTF-8, 2-space indent.
> Do not edit any other file.

- [ ] **Step 3: Validate**

Run: `npm run translations:check`
Expected: `0 errors, 0 warnings`. For any error, re-dispatch only those slugs.

- [ ] **Step 4: Spot-check quality by hand**

Open 10 random files, plus these 5: `legal--contract-review`, `short-form-edit`, `sales--cold-outreach`, `taste-skill` and `finance--burn-runway`. Reject and redo any file where the translation changes the meaning, translates a command or tool name, or where a command's `howToAsk` does not start with `/<slug> `.

- [ ] **Step 5: Commit**

```bash
git add site/content/i18n/skills
git commit -m "content(site): Spanish descriptions and how-to-ask prompts for all skills"
```

---

### Task 6: Design system (tokens, fonts, motion primitives)

**Files:**
- Create: `site/postcss.config.mjs`, `site/src/styles/globals.css`, `site/src/lib/design/tokens.ts`, `site/src/lib/design/contrast.ts`, `site/src/lib/fonts.ts`, `site/src/lib/motion.ts`, `site/src/components/ui/Sticker.tsx`, `site/src/components/ui/Reveal.tsx`
- Test: `site/tests/unit/design/contrast.test.ts`

**Interfaces:**
- Produces:
  - `COLORS: { night; ink; inkMuted; acid; pink; cyan; sun; terra }` (hex strings)
  - `ACCENT_BG: Record<Accent, string>` and `ACCENT_TEXT: Record<Accent, string>` (Tailwind classes)
  - `contrastRatio(a: string, b: string): number`
  - `bricolage`, `instrument`, `jetbrains` (next/font objects exposing `.variable`)
  - `DURATION = { fast: 0.12, base: 0.2, slow: 0.32, xslow: 0.6 }`, `EASE_OUT = [0.2, 0.8, 0.2, 1]`
  - `<Sticker color?: Accent rotate?: number className?>`, `<Reveal delay?: number className?>`
  - Tailwind utilities: `bg-night text-ink text-ink-muted border-line bg-acid bg-pink bg-cyan bg-sun bg-terra font-display font-serif font-mono`

- [ ] **Step 1: Install Tailwind**

```bash
npm i -D tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3
```

`site/postcss.config.mjs`:
```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

- [ ] **Step 2: Failing contrast test**

`site/tests/unit/design/contrast.test.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/design/contrast';
import { COLORS } from '@/lib/design/tokens';

describe('colour tokens', () => {
  it.each(['ink', 'inkMuted', 'acid', 'pink', 'cyan', 'sun', 'terra'] as const)('%s on night meets WCAG AA', (k) => {
    expect(contrastRatio(COLORS[k], COLORS.night)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['acid', 'pink', 'cyan', 'sun', 'terra', 'ink'] as const)('night text on %s chip meets AA', (k) => {
    expect(contrastRatio(COLORS.night, COLORS[k])).toBeGreaterThanOrEqual(4.5);
  });

  it('globals.css declares the same hex values', () => {
    const css = fs.readFileSync(path.resolve(import.meta.dirname, '../../../src/styles/globals.css'), 'utf8').toLowerCase();
    for (const hex of Object.values(COLORS)) expect(css).toContain(hex.toLowerCase());
  });

  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });
});
```

Run: `npx vitest run tests/unit/design` → FAIL (modules missing).

- [ ] **Step 3: Implement tokens, contrast and CSS**

`site/src/lib/design/tokens.ts`:
```ts
import type { Accent } from '@/content/sections';

export const COLORS = {
  night: '#0d0d0f',
  ink: '#f4eee4',
  inkMuted: '#b9b2a8',
  acid: '#c6ff3d',
  pink: '#ff5ea8',
  cyan: '#2af5ff',
  sun: '#ffd23d',
  terra: '#d97757',
} as const;

export const ACCENT_BG: Record<Accent, string> = { acid: 'bg-acid', pink: 'bg-pink', cyan: 'bg-cyan', sun: 'bg-sun', terra: 'bg-terra' };
export const ACCENT_TEXT: Record<Accent, string> = { acid: 'text-acid', pink: 'text-pink', cyan: 'text-cyan', sun: 'text-sun', terra: 'text-terra' };
```

`site/src/lib/design/contrast.ts`:
```ts
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
```

`site/src/styles/globals.css`:
```css
@import 'tailwindcss';

@theme {
  --color-night: #0d0d0f;
  --color-ink: #f4eee4;
  --color-ink-muted: #b9b2a8;
  --color-line: rgb(244 238 228 / 0.18);
  --color-acid: #c6ff3d;
  --color-pink: #ff5ea8;
  --color-cyan: #2af5ff;
  --color-sun: #ffd23d;
  --color-terra: #d97757;
  --font-display: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-instrument), ui-serif, Georgia, serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace;
  --ease-out-soft: cubic-bezier(0.2, 0.8, 0.2, 1);
}

html {
  background: var(--color-night);
  color: var(--color-ink);
  color-scheme: dark;
  -webkit-text-size-adjust: 100%;
}
body {
  font-family: var(--font-display);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
::selection { background: var(--color-acid); color: var(--color-night); }
:focus-visible { outline: 2px solid var(--color-acid); outline-offset: 3px; border-radius: 4px; }

/* Stickers "stick" once on mount. */
.sticker { transform: rotate(var(--r, -3deg)); animation: stick 0.5s var(--ease-out-soft) both; }
@keyframes stick {
  from { transform: rotate(calc(var(--r, -3deg) - 8deg)) scale(1.18); opacity: 0; }
}

/* Reveal: hidden only when JS is present, so no-JS readers and crawlers always see content. */
.js .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s var(--ease-out-soft), transform 0.6s var(--ease-out-soft); }
.js .reveal.is-in { opacity: 1; transform: none; }

/* Ticker (home). */
.ticker-track { animation: ticker 48s linear infinite; }
.ticker:hover .ticker-track, .ticker:focus-within .ticker-track { animation-play-state: paused; }
@keyframes ticker { to { transform: translateY(-50%); } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .js .reveal { opacity: 1; transform: none; }
  .ticker-track { animation: none; }
}
```

- [ ] **Step 4: Fonts, motion tokens and primitives**

`site/src/lib/fonts.ts`:
```ts
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '800'], variable: '--font-bricolage', display: 'swap', preload: true });
export const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic'], variable: '--font-instrument', display: 'swap', preload: false });
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-jetbrains', display: 'swap', preload: false });
```

`site/src/lib/motion.ts`:
```ts
export const DURATION = { fast: 0.12, base: 0.2, slow: 0.32, xslow: 0.6 } as const;
export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;
```

`site/src/components/ui/Sticker.tsx`:
```tsx
import type { CSSProperties, ReactNode } from 'react';
import type { Accent } from '@/content/sections';
import { ACCENT_BG } from '@/lib/design/tokens';

export function Sticker({ children, color = 'acid', rotate = -3, className = '' }: { children: ReactNode; color?: Accent; rotate?: number; className?: string }) {
  return (
    <span
      className={`sticker inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 font-display text-[13px] font-extrabold text-night shadow-[0_5px_0_rgba(0,0,0,.35)] ${ACCENT_BG[color]} ${className}`}
      style={{ '--r': `${rotate}deg` } as CSSProperties}
    >
      {children}
    </span>
  );
}
```

`site/src/components/ui/Reveal.tsx`:
```tsx
'use client';
import { useEffect, useRef, type ReactNode } from 'react';

/** Fades content in once it enters the viewport. Never wrap the LCP element with it. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/unit/design`
Expected: PASS.

```bash
git add site/
git commit -m "feat(site): design tokens, fonts, motion primitives"
```

---

### Task 7: i18n, routing, root layout and root redirect (CORE)

**Files:**
- Create: `site/src/lib/site.ts`, `site/src/lib/urls.ts`, `site/src/lib/i18n/negotiate.ts`, `site/src/lib/i18n/format.ts`, `site/src/lib/i18n/dictionaries/en.ts`, `site/src/lib/i18n/dictionaries/es.ts`, `site/src/lib/i18n/index.ts`, `site/src/app/route.ts`, `site/src/components/layout/Masthead.tsx`, `site/src/components/layout/Footer.tsx`, `site/src/components/layout/LangSwitch.tsx`
- Modify (replace): `site/src/app/[lang]/layout.tsx`
- Test: `site/tests/unit/i18n/negotiate.test.ts`, `site/tests/unit/i18n/urls.test.ts`

**Interfaces:**
- Consumes: `LANGS`, `Lang`, `isLang` (Task 2); `catalog` (Task 3); fonts and CSS (Task 6).
- Produces:
  - `SITE_URL`, `REPO_URL`, `RAW_URL`, `AUTHOR = { name: 'Santiago Gómez de la Torre', url: 'https://sgomez.dev' }`
  - `paths.home(lang)`, `paths.section(lang, id)`, `paths.skill(lang, slug)`, `paths.credits(lang)`, `absolute(path: string): string`, `mdPath(htmlPath: string): string`, `swapLang(pathname: string, to: Lang): string`, `sourceUrl(skill: Skill): string`
  - `pickLanguage(header: string | null | undefined): Lang`
  - `fmtMonth(locale: string, d: Date): string`, `fmtDay(locale: string, d: Date): string`
  - `type Dictionary`, `getDictionary(lang: Lang): Dictionary`. Keys are exactly as defined below; later tasks use them verbatim.
  - The layout renders `<Masthead>` and `<Footer>`. Task 12 adds `<SearchDialog>` to the layout and `<SearchTrigger>` to the Masthead.

- [ ] **Step 1: Failing tests**

`site/tests/unit/i18n/negotiate.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { pickLanguage } from '@/lib/i18n/negotiate';

describe('pickLanguage', () => {
  it.each([
    [null, 'en'],
    ['', 'en'],
    ['*', 'en'],
    ['es', 'es'],
    ['es-MX', 'es'],
    ['en-US,es;q=0.9', 'en'],
    ['fr-FR,fr;q=0.9,es;q=0.8,en;q=0.7', 'es'],
    ['es;q=0,en;q=0.5', 'en'],
    ['de-DE,de;q=0.9', 'en'],
    ['ES-es', 'es'],
    [';;;,,q=abc', 'en'],
  ])('%j → %s', (header, lang) => expect(pickLanguage(header)).toBe(lang));
});
```

`site/tests/unit/i18n/urls.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { absolute, mdPath, paths, sourceUrl, swapLang } from '@/lib/urls';
import type { ExternalSkill } from '@/lib/catalog/types';

describe('urls', () => {
  it('builds paths', () => {
    expect(paths.skill('es', 'legal--contract-review')).toBe('/es/s/legal--contract-review');
    expect(paths.section('en', 'video')).toBe('/en/video');
    expect(absolute('/en')).toBe('https://skills.sgomez.dev/en');
    expect(mdPath('/es/s/x')).toBe('/es/s/x.md');
    expect(mdPath('/es')).toBe('/es.md');
  });

  it.each([
    ['/es/s/x', 'en', '/en/s/x'],
    ['/en', 'es', '/es'],
    ['/', 'es', '/es'],
    ['/zz/whatever', 'en', '/en'],
  ] as const)('swapLang(%s, %s) → %s', (from, to, out) => expect(swapLang(from, to)).toBe(out));

  it('points externals at the vendored upstream commit', () => {
    const s = { kind: 'external', upstream: { url: 'https://github.com/a/b', commit: 'abc', path: 'skills/x', owner: 'a', repo: 'a/b' } } as ExternalSkill;
    expect(sourceUrl(s)).toBe('https://github.com/a/b/tree/abc/skills/x');
    expect(sourceUrl({ ...s, upstream: { ...s.upstream, path: '.' } })).toBe('https://github.com/a/b/tree/abc');
  });
});
```

Run: `npx vitest run tests/unit/i18n` → FAIL.

- [ ] **Step 2: Implement site constants, URLs and negotiation**

`site/src/lib/site.ts`:
```ts
export const SITE_URL = 'https://skills.sgomez.dev';
export const REPO_URL = 'https://github.com/sgomez-dev/claude-skills';
export const RAW_URL = 'https://raw.githubusercontent.com/sgomez-dev/claude-skills/main';
export const AUTHOR = { name: 'Santiago Gómez de la Torre', url: 'https://sgomez.dev' } as const;
```

`site/src/lib/urls.ts`:
```ts
import type { SectionId, Skill } from '@/lib/catalog/types';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { REPO_URL, SITE_URL } from '@/lib/site';

export const paths = {
  home: (lang: Lang) => `/${lang}`,
  section: (lang: Lang, id: SectionId) => `/${lang}/${id}`,
  skill: (lang: Lang, slug: string) => `/${lang}/s/${slug}`,
  credits: (lang: Lang) => `/${lang}/credits`,
};

export function absolute(p: string): string {
  return new URL(p, SITE_URL).toString().replace(/\/$/, '');
}

export function mdPath(htmlPath: string): string {
  return `${htmlPath}.md`;
}

export function swapLang(pathname: string, to: Lang): string {
  const parts = pathname.split('/');
  if (!isLang(parts[1])) return `/${to}`;
  parts[1] = to;
  return parts.join('/');
}

export function sourceUrl(skill: Skill): string {
  if (skill.kind === 'command') return `${REPO_URL}/blob/main/${skill.sourcePath}`;
  const { url, commit, path } = skill.upstream;
  return path === '.' ? `${url}/tree/${commit}` : `${url}/tree/${commit}/${path}`;
}
```

`site/src/lib/i18n/negotiate.ts`:
```ts
import { DEFAULT_LANG, isLang, type Lang } from './languages';

export function pickLanguage(header: string | null | undefined): Lang {
  if (!header) return DEFAULT_LANG;
  const ranked = header
    .split(',')
    .map((part, i) => {
      const [tag = '', ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { base: tag.trim().toLowerCase().split('-')[0] ?? '', q, i };
    })
    .filter((x) => x.base && Number.isFinite(x.q) && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const r of ranked) if (isLang(r.base)) return r.base;
  return DEFAULT_LANG;
}
```

`site/src/lib/i18n/format.ts`:
```ts
export function fmtMonth(locale: string, d: Date): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}
export function fmtDay(locale: string, d: Date): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
}
```

- [ ] **Step 3: Dictionaries**

`site/src/lib/i18n/dictionaries/en.ts`:
```ts
import { fmtDay, fmtMonth } from '../format';

export const en = {
  locale: 'en-GB',
  meta: {
    siteName: 'Claude Skills',
    title: 'Claude Skills: nobody knows everything. Your agent, now it does.',
    description: (n: number) =>
      `${n} free, open-source skills for Claude Code: video, web design, sales, legal, finance, AI and code. One command each, every permission declared.`,
  },
  nav: { label: 'Main', skipToContent: 'Skip to content', language: 'Language', github: 'GitHub', home: 'Home', credits: 'Credits' },
  masthead: { issue: (d: Date, n: number) => `Nº 01 · ${fmtMonth('en-GB', d)} · ${n} specialists` },
  home: {
    claim: { lead: 'Nobody knows', accent: 'everything.', highlight: 'Your agent,', tail: 'now it does.' },
    dek: (n: number) => `${n} specialists for Claude Code. Video, motion, brand, sales, legal and code: one command and done.`,
    inThisIssue: 'In this issue',
    coverLines: [
      { section: 'business', text: 'Contracts reviewed without a lawyer' },
      { section: 'sales', text: 'Sales on autopilot' },
      { section: 'web', text: 'Websites that win awards' },
      { section: 'video', text: 'Videos that stop the scroll' },
    ],
    tickerLabel: 'On the desk right now',
    stickerFree: 'free & open source',
    stickerPlatforms: 'Claude Code · Cursor · Windsurf · Codex',
    index: 'Contents',
    stats: {
      skills: 'skills in this issue',
      permissionsLabel: 'commands declare what they can touch',
      platforms: 'agents supported',
      updated: 'last updated',
    },
    cta: {
      title: 'Install everything in 30 seconds',
      body: 'One line in your terminal copies every skill into Claude Code. Type / and they are there.',
      more: 'Every way to install',
    },
    faqTitle: 'Questions',
    faq: [
      { q: 'What is a skill?', a: 'A skill is a set of expert instructions that Claude Code loads when you need it. Type a command such as /legal--contract-review, or simply describe the task, and your agent works like a specialist.' },
      { q: 'Do I need to know how to code?', a: 'No. Many skills never touch code: contracts, sales emails, video edits, brand work. You need Claude Code installed; installing the skills takes one line.' },
      { q: 'How much does it cost?', a: 'The skills are free and MIT licensed. Claude Code itself needs a Claude subscription (Pro or higher) or an API key.' },
      { q: 'What can a skill touch on my computer?', a: 'Every command built here declares what it reads, what it writes, which commands it runs and whether it uses the network. You see it on each skill page before installing. Community skills follow their own upstream rules, so read their source first.' },
      { q: 'Does it work outside Claude Code?', a: 'Yes. The repository has guides for Cursor, Windsurf and Codex.' },
    ],
  },
  section: {
    skills: (n: number) => `${n} skills`,
    filters: {
      label: 'Filters', origin: 'Origin', all: 'All', command: 'Built here', external: 'Community',
      group: 'Category', allGroups: 'All categories', network: 'Uses the network',
    },
    showing: (v: number, t: number) => `Showing ${v} of ${t}`,
    empty: 'No skill matches these filters.',
  },
  skill: {
    answer: (slug: string, section: string) => `/${slug} is a Claude Code skill in the ${section} section.`,
    answerExternal: (owner: string, license: string) => ` It is maintained by ${owner} and published under the ${license} license.`,
    builtHere: 'Built here',
    copy: 'Copy',
    copied: 'Copied',
    by: (owner: string) => `By ${owner}`,
    updated: (d: Date) => `Updated ${fmtDay('en-GB', d)}`,
    howToAsk: 'How to ask for it',
    invoke: 'After installing with the script, type',
    install: 'Install',
    tabs: { 'script-unix': 'macOS · Linux', 'script-windows': 'Windows', plugin: 'Claude Code plugin' },
    pluginNote: (bundle: string) => `Installs the whole ${bundle} bundle.`,
    otherAgents: 'Using Cursor, Windsurf or Codex?',
    otherAgentsLink: 'Platform guides',
    permissions: 'What it can touch',
    perm: {
      reads: 'Reads', writes: 'Writes', commands: 'Runs', network: 'Network', destructive: 'Destructive',
      nothing: 'Nothing', yes: 'Yes', no: 'No', more: (n: number) => `+${n} more`,
    },
    permissionsExternal: 'Community skills follow their upstream conventions and ship no permission manifest. Read the source before you run it.',
    provenance: 'Where it comes from',
    author: 'Author', license: 'License', source: 'Source', commit: 'Vendored commit', viewSource: 'View source',
    related: 'More from this section',
    demoSoon: 'Demo coming soon',
    notTranslated: 'Shown in English: the translation is on its way.',
  },
  credits: {
    title: 'Credits',
    dek: 'This issue is written by many hands. These are the upstream authors whose skills are vendored here, with their licenses.',
    builtHere: (n: number) => `${n} commands written in this repository by`,
    skills: (n: number) => `${n} skills`,
    license: 'License',
  },
  search: {
    open: 'Search skills',
    placeholder: (n: number) => `Search ${n} skills… try “contract” or “captions”`,
    noResults: 'Nothing found. Try another word.',
    hint: '↑↓ move · Enter open · Esc close',
    close: 'Close',
    results: 'Results',
    loading: 'Loading…',
  },
  footer: { madeBy: 'Made by', license: 'MIT licensed', source: 'Source on GitHub', llms: 'For AI agents: llms.txt', credits: 'Credits' },
  md: { web: 'Web version', install: 'Install', howToAsk: 'How to ask for it', permissions: 'Permissions', source: 'Source', section: 'Section', skills: 'Skills', license: 'License', author: 'Author' },
  date: (d: Date) => fmtDay('en-GB', d),
};

export type Dictionary = typeof en;
```

`site/src/lib/i18n/dictionaries/es.ts`:
```ts
import { fmtDay, fmtMonth } from '../format';
import type { Dictionary } from './en';

export const es: Dictionary = {
  locale: 'es-ES',
  meta: {
    siteName: 'Claude Skills',
    title: 'Claude Skills: nadie lo sabe todo. Tu agente, ahora sí.',
    description: (n) =>
      `${n} skills gratuitas y open source para Claude Code: video, diseño web, ventas, legal, finanzas, IA y código. Un comando cada una, con todos sus permisos declarados.`,
  },
  nav: { label: 'Principal', skipToContent: 'Saltar al contenido', language: 'Idioma', github: 'GitHub', home: 'Portada', credits: 'Créditos' },
  masthead: { issue: (d, n) => `Nº 01 · ${fmtMonth('es-ES', d)} · ${n} especialistas` },
  home: {
    claim: { lead: 'Nadie lo sabe', accent: 'todo.', highlight: 'Tu agente,', tail: 'ahora sí.' },
    dek: (n) => `${n} especialistas para Claude Code. Video, motion, marca, ventas, legal y código: una orden y listo.`,
    inThisIssue: 'En este número',
    coverLines: [
      { section: 'business', text: 'Contratos revisados sin abogado' },
      { section: 'sales', text: 'Ventas en piloto automático' },
      { section: 'web', text: 'Webs que ganan premios' },
      { section: 'video', text: 'Videos que paran el scroll' },
    ],
    tickerLabel: 'Ahora mismo en la mesa',
    stickerFree: 'gratis y open source',
    stickerPlatforms: 'Claude Code · Cursor · Windsurf · Codex',
    index: 'Índice',
    stats: {
      skills: 'skills en este número',
      permissionsLabel: 'comandos declaran qué pueden tocar',
      platforms: 'agentes compatibles',
      updated: 'última actualización',
    },
    cta: {
      title: 'Instálalo todo en 30 segundos',
      body: 'Una línea en tu terminal copia todas las skills a Claude Code. Escribe / y ahí están.',
      more: 'Todas las formas de instalar',
    },
    faqTitle: 'Preguntas',
    faq: [
      { q: '¿Qué es una skill?', a: 'Una skill es un conjunto de instrucciones expertas que Claude Code carga cuando las necesitas. Escribes un comando como /legal--contract-review, o simplemente describes la tarea, y tu agente trabaja como un especialista.' },
      { q: '¿Necesito saber programar?', a: 'No. Muchas skills no tocan código: contratos, emails de venta, edición de video, marca. Necesitas Claude Code instalado; instalar las skills es una línea.' },
      { q: '¿Cuánto cuesta?', a: 'Las skills son gratuitas y con licencia MIT. Claude Code en sí necesita una suscripción de Claude (Pro o superior) o una clave de API.' },
      { q: '¿Qué puede tocar una skill en mi ordenador?', a: 'Cada comando hecho aquí declara qué lee, qué escribe, qué comandos ejecuta y si usa la red. Lo ves en la ficha de cada skill antes de instalarla. Las skills de la comunidad siguen las reglas de su repositorio original: lee su código antes.' },
      { q: '¿Funciona fuera de Claude Code?', a: 'Sí. El repositorio tiene guías para Cursor, Windsurf y Codex.' },
    ],
  },
  section: {
    skills: (n) => `${n} skills`,
    filters: {
      label: 'Filtros', origin: 'Origen', all: 'Todas', command: 'Hechas aquí', external: 'Comunidad',
      group: 'Categoría', allGroups: 'Todas las categorías', network: 'Usa la red',
    },
    showing: (v, t) => `Mostrando ${v} de ${t}`,
    empty: 'Ninguna skill cumple estos filtros.',
  },
  skill: {
    answer: (slug, section) => `/${slug} es una skill de Claude Code de la sección ${section}.`,
    answerExternal: (owner, license) => ` La mantiene ${owner} y se publica con licencia ${license}.`,
    builtHere: 'Hecha aquí',
    copy: 'Copiar',
    copied: 'Copiado',
    by: (owner) => `Por ${owner}`,
    updated: (d) => `Actualizada el ${fmtDay('es-ES', d)}`,
    howToAsk: 'Cómo pedírselo',
    invoke: 'Tras instalar con el script, escribe',
    install: 'Instalar',
    tabs: { 'script-unix': 'macOS · Linux', 'script-windows': 'Windows', plugin: 'Plugin de Claude Code' },
    pluginNote: (bundle) => `Instala el paquete ${bundle} completo.`,
    otherAgents: '¿Usas Cursor, Windsurf o Codex?',
    otherAgentsLink: 'Guías por plataforma',
    permissions: 'Qué puede tocar',
    perm: {
      reads: 'Lee', writes: 'Escribe', commands: 'Ejecuta', network: 'Red', destructive: 'Destructiva',
      nothing: 'Nada', yes: 'Sí', no: 'No', more: (n) => `+${n} más`,
    },
    permissionsExternal: 'Las skills de la comunidad siguen las convenciones de su repositorio original y no traen manifiesto de permisos. Lee su código antes de ejecutarla.',
    provenance: 'De dónde viene',
    author: 'Autor', license: 'Licencia', source: 'Código', commit: 'Commit vendorizado', viewSource: 'Ver código',
    related: 'Más de esta sección',
    demoSoon: 'Demo en camino',
    notTranslated: 'Se muestra en inglés: la traducción está en camino.',
  },
  credits: {
    title: 'Créditos',
    dek: 'Este número lo escriben muchas manos. Estos son los autores originales cuyas skills se incluyen aquí, con sus licencias.',
    builtHere: (n) => `${n} comandos escritos en este repositorio por`,
    skills: (n) => `${n} skills`,
    license: 'Licencia',
  },
  search: {
    open: 'Buscar skills',
    placeholder: (n) => `Busca entre ${n} skills… prueba “contrato” o “subtítulos”`,
    noResults: 'Nada por aquí. Prueba otra palabra.',
    hint: '↑↓ moverte · Enter abrir · Esc cerrar',
    close: 'Cerrar',
    results: 'Resultados',
    loading: 'Cargando…',
  },
  footer: { madeBy: 'Hecho por', license: 'Licencia MIT', source: 'Código en GitHub', llms: 'Para agentes de IA: llms.txt', credits: 'Créditos' },
  md: { web: 'Versión web', install: 'Instalar', howToAsk: 'Cómo pedírselo', permissions: 'Permisos', source: 'Código', section: 'Sección', skills: 'Skills', license: 'Licencia', author: 'Autor' },
  date: (d) => fmtDay('es-ES', d),
};
```

`site/src/lib/i18n/index.ts`:
```ts
import { en, type Dictionary } from './dictionaries/en';
import { es } from './dictionaries/es';
import type { Lang } from './languages';

const DICTIONARIES: Record<Lang, Dictionary> = { en, es };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
export type { Dictionary };
```

- [ ] **Step 4: Root redirect**

`site/src/app/route.ts`:
```ts
import { pickLanguage } from '@/lib/i18n/negotiate';

export const dynamic = 'force-dynamic';

export function GET(request: Request): Response {
  const lang = pickLanguage(request.headers.get('accept-language'));
  return new Response(null, {
    status: 307,
    headers: { Location: `/${lang}`, Vary: 'Accept-Language', 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 5: Layout components**

`site/src/components/layout/LangSwitch.tsx`:
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, type Lang } from '@/lib/i18n/languages';
import { swapLang } from '@/lib/urls';

export function LangSwitch({ current, label }: { current: Lang; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line p-0.5 font-mono text-[11px] font-bold uppercase">
      {LANGS.map((l) =>
        l === current ? (
          <span key={l} aria-current="true" className="rounded-full bg-ink px-2.5 py-1 text-night">{l}</span>
        ) : (
          <Link key={l} href={swapLang(pathname, l)} hrefLang={l} lang={l} className="rounded-full px-2.5 py-1 hover:text-acid">{l}</Link>
        ),
      )}
    </div>
  );
}
```

`site/src/components/layout/Masthead.tsx`:
```tsx
import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';
import { LangSwitch } from './LangSwitch';

export function Masthead({ lang, dict, generatedAt, total }: { lang: Lang; dict: Dictionary; generatedAt: string; total: number }) {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:px-7">
        <Link href={paths.home(lang)} className="font-display text-[22px] font-extrabold tracking-[-0.03em]">
          claude/skills
        </Link>
        <p className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] md:block">
          {dict.masthead.issue(new Date(generatedAt), total)}
        </p>
        <nav aria-label={dict.nav.label} className="flex items-center gap-2">
          <LangSwitch current={lang} label={dict.nav.language} />
          <a href={REPO_URL} className="hidden rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid sm:inline-block">
            {dict.nav.github}
          </a>
        </nav>
      </div>
    </header>
  );
}
```

`site/src/components/layout/Footer.tsx`:
```tsx
import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { AUTHOR, REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';

export function Footer({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const llms = lang === 'en' ? '/llms.txt' : '/es/llms.txt';
  return (
    <footer className="mt-24 border-t-2 border-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 font-mono text-[12px] sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>
          {dict.footer.madeBy}{' '}
          <a href={AUTHOR.url} className="font-bold text-acid hover:underline">{AUTHOR.name}</a> · {dict.footer.license}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink-muted">
          <li><Link href={paths.credits(lang)} className="hover:text-ink">{dict.footer.credits}</Link></li>
          <li><a href={REPO_URL} className="hover:text-ink">{dict.footer.source}</a></li>
          <li><a href={llms} className="hover:text-ink">{dict.footer.llms}</a></li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Replace the layout**

`site/src/app/[lang]/layout.tsx`:
```tsx
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Masthead } from '@/components/layout/Masthead';
import { catalog } from '@/lib/catalog';
import { bricolage, instrument, jetbrains } from '@/lib/fonts';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS } from '@/lib/i18n/languages';
import { AUTHOR, SITE_URL } from '@/lib/site';
import '@/styles/globals.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: '#0d0d0f', colorScheme: 'dark' };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: `%s · ${d.meta.siteName}` },
    applicationName: d.meta.siteName,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <html lang={lang} className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh bg-night text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-acid focus:px-4 focus:py-2 focus:text-night">
          {d.nav.skipToContent}
        </a>
        <Masthead lang={lang} dict={d} generatedAt={catalog.generatedAt} total={catalog.counts.total} />
        <div id="main">{children}</div>
        <Footer lang={lang} dict={d} />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Tests, build and redirect check**

Run: `npx vitest run tests/unit/i18n && npm run typecheck && npm run build`
Expected: tests PASS, typecheck clean, build lists `ƒ /` (dynamic) and `● /[lang]`.

Run `npm run preview` in background, then:
```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H 'Accept-Language: es-MX,es;q=0.9' http://localhost:8787/
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8787/
```
Expected: `307 http://localhost:8787/es`, then `307 http://localhost:8787/en`. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add site/
git commit -m "feat(site): i18n, root language redirect, masthead and footer"
```

---

### Task 8: SEO core (metadata, JSON-LD, truncate) (CORE)

**Files:**
- Create: `site/src/lib/seo/truncate.ts`, `site/src/lib/seo/metadata.ts`, `site/src/lib/seo/jsonld.ts`, `site/src/components/ui/JsonLd.tsx`
- Test: `site/tests/unit/seo/seo.test.ts`

**Interfaces:**
- Consumes: `absolute`, `mdPath`, `paths`, `sourceUrl` and `AUTHOR`/`SITE_URL` (Task 7); `Skill` (Task 2).
- Produces:
  - `truncate(text: string, max: number): string`
  - `pageMetadata(o: { lang: Lang; path: string; title: string; description: string }): Metadata`. Here `path` is **without** the lang prefix (`''`, `/video`, `/s/x`, `/credits`); it sets canonical, `hreflang` alternates, `text/markdown` alternate, Open Graph and Twitter.
  - `serializeJsonLd(data: object): string`
  - `websiteLd(lang)`, `authorLd()`, `skillLd(skill, lang, description)`, `breadcrumbLd(items: { name: string; path: string }[])`, `itemListLd(items: { name: string; path: string }[])`, `faqLd(faq: { q: string; a: string }[])`
  - `<JsonLd data={object | object[]} />`

- [ ] **Step 1: Install and write failing tests**

```bash
npm i -D schema-dts@2.0.0
```

`site/tests/unit/seo/seo.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { breadcrumbLd, serializeJsonLd, skillLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { truncate } from '@/lib/seo/truncate';
import type { CommandSkill, ExternalSkill } from '@/lib/catalog/types';

describe('truncate', () => {
  it('keeps short text', () => expect(truncate('Short text.', 160)).toBe('Short text.'));
  it('cuts at a word boundary and adds an ellipsis', () => {
    const out = truncate('word '.repeat(60).trim(), 30);
    expect(out.length).toBeLessThanOrEqual(30);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/\s…$/);
  });
  it('hard-cuts a single giant token', () => expect(truncate('x'.repeat(500), 20)).toHaveLength(20));
});

describe('serializeJsonLd', () => {
  it('cannot close the script tag', () => {
    const out = serializeJsonLd({ description: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).description).toBe('</script><script>alert(1)</script>');
  });
});

describe('pageMetadata', () => {
  it('sets canonical, hreflang and the markdown alternate', () => {
    const m = pageMetadata({ lang: 'es', path: '/s/x', title: 'T', description: 'D' });
    expect(m.alternates?.canonical).toBe('https://skills.sgomez.dev/es/s/x');
    expect(m.alternates?.languages).toEqual({
      es: 'https://skills.sgomez.dev/es/s/x',
      en: 'https://skills.sgomez.dev/en/s/x',
      'x-default': 'https://skills.sgomez.dev/en/s/x',
    });
    expect(m.alternates?.types).toEqual({ 'text/markdown': 'https://skills.sgomez.dev/es/s/x.md' });
  });
  it('handles the home path', () => {
    expect(pageMetadata({ lang: 'en', path: '', title: 'T', description: 'D' }).alternates?.canonical).toBe('https://skills.sgomez.dev/en');
  });
});

const command = {
  kind: 'command', slug: 'legal--contract-review', name: 'contract-review', updatedAt: '2026-07-10T13:21:22+02:00', sourcePath: 'skills/legal/contract-review.md',
} as CommandSkill;
const external = {
  kind: 'external', slug: 'ffmpeg', name: 'ffmpeg', updatedAt: null, license: 'MIT',
  upstream: { url: 'https://github.com/o/r', owner: 'o', repo: 'o/r', commit: 'abc', path: 'x' },
} as ExternalSkill;

describe('JSON-LD', () => {
  it('credits the author on commands', () => {
    const ld = skillLd(command, 'es', 'desc') as Record<string, unknown>;
    expect(ld['@type']).toBe('SoftwareApplication');
    expect((ld.author as { name: string }).name).toBe('Santiago Gómez de la Torre');
    expect(ld.url).toBe('https://skills.sgomez.dev/es/s/legal--contract-review');
  });
  it('credits upstream on externals instead of claiming authorship', () => {
    const ld = skillLd(external, 'en', 'desc') as Record<string, unknown>;
    expect(ld.author).toBeUndefined();
    expect(ld.isBasedOn).toBe('https://github.com/o/r');
    expect(ld.license).toBe('https://spdx.org/licenses/MIT.html');
  });
  it('builds breadcrumbs with absolute URLs and positions', () => {
    const ld = breadcrumbLd([{ name: 'Home', path: '/en' }, { name: 'Video', path: '/en/video' }]) as { itemListElement: { position: number; item: string }[] };
    expect(ld.itemListElement.map((i) => [i.position, i.item])).toEqual([[1, 'https://skills.sgomez.dev/en'], [2, 'https://skills.sgomez.dev/en/video']]);
  });
  it('exposes a search action', () => {
    expect(JSON.stringify(websiteLd('es'))).toContain('https://skills.sgomez.dev/es?q={search_term_string}');
  });
});
```

Run: `npx vitest run tests/unit/seo` → FAIL.

- [ ] **Step 2: Implement**

`site/src/lib/seo/truncate.ts`:
```ts
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s,.;:–—-]+$/, '')}…`;
}
```

`site/src/lib/seo/metadata.ts`:
```ts
import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n/languages';
import { absolute, mdPath } from '@/lib/urls';
import { truncate } from './truncate';

export function pageMetadata({ lang, path, title, description }: { lang: Lang; path: string; title: string; description: string }): Metadata {
  const url = absolute(`/${lang}${path}`);
  const desc = truncate(description, 160);
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { es: absolute(`/es${path}`), en: absolute(`/en${path}`), 'x-default': absolute(`/en${path}`) },
      types: { 'text/markdown': absolute(mdPath(`/${lang}${path}`)) },
    },
    openGraph: {
      type: 'website', url, title, description: desc, siteName: 'Claude Skills',
      locale: lang === 'es' ? 'es_ES' : 'en_GB', alternateLocale: lang === 'es' ? ['en_GB'] : ['es_ES'],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  };
}
```

`site/src/lib/seo/jsonld.ts`:
```ts
import type { BreadcrumbList, FAQPage, ItemList, Person, SoftwareApplication, WebSite, WithContext } from 'schema-dts';
import type { Skill } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';
import { AUTHOR, SITE_URL } from '@/lib/site';
import { absolute, paths, sourceUrl } from '@/lib/urls';

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function authorLd(): Person {
  return { '@type': 'Person', '@id': `${SITE_URL}/#author`, name: AUTHOR.name, url: AUTHOR.url };
}

export function websiteLd(lang: Lang): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Claude Skills',
    url: absolute(paths.home(lang)),
    inLanguage: lang,
    publisher: authorLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absolute(paths.home(lang))}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    } as never,
  };
}

export function skillLd(skill: Skill, lang: Lang, description: string): WithContext<SoftwareApplication> {
  const base: WithContext<SoftwareApplication> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `/${skill.slug}`,
    alternateName: skill.name,
    description,
    url: absolute(paths.skill(lang, skill.slug)),
    inLanguage: lang,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: authorLd(),
    ...(skill.updatedAt ? { dateModified: skill.updatedAt } : {}),
  };
  if (skill.kind === 'command') {
    return { ...base, author: authorLd(), license: 'https://spdx.org/licenses/MIT.html', sameAs: sourceUrl(skill) };
  }
  const license = skill.license.startsWith('LicenseRef') ? sourceUrl(skill) : `https://spdx.org/licenses/${skill.license}.html`;
  return { ...base, isBasedOn: skill.upstream.url, license, sameAs: sourceUrl(skill) };
}

export function breadcrumbLd(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function itemListLd(items: { name: string; path: string }[]): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absolute(it.path) })),
  };
}

export function faqLd(faq: { q: string; a: string }[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
```

`site/src/components/ui/JsonLd.tsx`:
```tsx
import { serializeJsonLd } from '@/lib/seo/jsonld';

export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(d) }} />
      ))}
    </>
  );
}
```

- [ ] **Step 3: Run tests, typecheck, commit**

Run: `npx vitest run tests/unit/seo && npm run typecheck`
Expected: PASS and clean. (If `schema-dts` rejects `potentialAction`, keep the `as never` cast shown; the emitted JSON is what matters and the test checks it.)

```bash
git add site/
git commit -m "feat(site): SEO metadata and JSON-LD builders"
```

---

### Task 9: Skill page `/{lang}/s/{slug}` (CORE)

**Files:**
- Create: `site/src/lib/install.ts`, `site/src/components/ui/CopyButton.tsx`, `site/src/components/skill/SkillCard.tsx`, `site/src/components/skill/InstallTabs.tsx`, `site/src/components/skill/PermissionManifest.tsx`, `site/src/components/skill/Provenance.tsx`, `site/src/components/skill/HowToAsk.tsx`, `site/src/app/[lang]/s/[slug]/page.tsx`
- Test: `site/tests/unit/install.test.ts`

**Interfaces:**
- Consumes: `catalog`, `getSkill`, `relatedSkills` (Task 3); `getSection` (Task 3); dictionary keys `skill.*` and `nav.home` (Task 7); `pageMetadata`, `skillLd`, `breadcrumbLd` and `JsonLd` (Task 8); `Sticker` (Task 6).
- Produces:
  - `InstallOption { id: 'script-unix' | 'script-windows' | 'plugin'; command: string; bundle?: string }`
  - `installOptions(skill: Skill | null): InstallOption[]` (`null` gives the generic "install everything" set used on home)
  - `<CopyButton text label copiedLabel />` (client)
  - `<SkillCard href slug description descLang? badge accent network? />`, a presentational component usable in server and client trees
  - `<InstallTabs options labels: { tabs: Record<InstallOption['id'], string>; copy: string; copied: string; pluginNote: (b: string) => string } />` (client)
  - `<PermissionManifest permissions dict />`, `<Provenance skill dict lang />`, `<HowToAsk items label copy copied />`

- [ ] **Step 1: Failing test for install options**

`site/tests/unit/install.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { installOptions } from '@/lib/install';
import type { CommandSkill, ExternalSkill } from '@/lib/catalog/types';

describe('installOptions', () => {
  it('offers script installs first and the plugin bundle last for commands', () => {
    const opts = installOptions({ kind: 'command', bundle: 'legal-skills' } as CommandSkill);
    expect(opts.map((o) => o.id)).toEqual(['script-unix', 'script-windows', 'plugin']);
    expect(opts[0]!.command).toBe('curl -fsSL https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.sh | bash');
    expect(opts[1]!.command).toBe('irm https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.ps1 | iex');
    expect(opts[2]).toEqual({
      id: 'plugin',
      bundle: 'legal-skills',
      command: '/plugin marketplace add sgomez-dev/claude-skills\n/plugin install legal-skills@claude-skills-collection',
    });
  });
  it('has no plugin option for externals or bundle-less commands', () => {
    expect(installOptions({ kind: 'external' } as ExternalSkill).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
    expect(installOptions({ kind: 'command', bundle: null } as CommandSkill).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
  });
  it('generic set for the home page', () => {
    expect(installOptions(null).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
  });
});
```

Run: `npx vitest run tests/unit/install.test.ts` → FAIL.

- [ ] **Step 2: Implement install options**

`site/src/lib/install.ts`:
```ts
import type { Skill } from '@/lib/catalog/types';
import { RAW_URL } from '@/lib/site';

export interface InstallOption {
  id: 'script-unix' | 'script-windows' | 'plugin';
  command: string;
  bundle?: string;
}

export function installOptions(skill: Skill | null): InstallOption[] {
  const options: InstallOption[] = [
    { id: 'script-unix', command: `curl -fsSL ${RAW_URL}/install.sh | bash` },
    { id: 'script-windows', command: `irm ${RAW_URL}/install.ps1 | iex` },
  ];
  if (skill?.kind === 'command' && skill.bundle) {
    options.push({
      id: 'plugin',
      bundle: skill.bundle,
      command: `/plugin marketplace add sgomez-dev/claude-skills\n/plugin install ${skill.bundle}@claude-skills-collection`,
    });
  }
  return options;
}
```

Run the test again → PASS.

- [ ] **Step 3: Components**

`site/src/components/ui/CopyButton.tsx`:
```tsx
'use client';
import { useState } from 'react';

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" onClick={copy} className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
```

`site/src/components/skill/SkillCard.tsx`:
```tsx
import Link from 'next/link';
import type { Accent } from '@/content/sections';
import { ACCENT_TEXT } from '@/lib/design/tokens';

export interface SkillCardProps {
  href: string;
  slug: string;
  description: string;
  descLang?: string;
  badge: string;
  accent: Accent;
  network?: boolean;
  networkLabel?: string;
}

export function SkillCard({ href, slug, description, descLang, badge, accent, network, networkLabel }: SkillCardProps) {
  return (
    <Link href={href} className="group flex h-full flex-col gap-3 border-b border-r border-line p-5 transition-colors hover:bg-ink/[0.04] focus-visible:bg-ink/[0.06]">
      <span className={`font-mono text-[13px] font-bold break-all ${ACCENT_TEXT[accent]}`}>/{slug}</span>
      <p lang={descLang} className="line-clamp-3 text-[14px] leading-snug text-ink-muted group-hover:text-ink">{description}</p>
      <span className="mt-auto flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        <span className="rounded-full border border-line px-2 py-0.5">{badge}</span>
        {network ? <span className="rounded-full border border-line px-2 py-0.5">{networkLabel}</span> : null}
      </span>
    </Link>
  );
}
```

`site/src/components/skill/InstallTabs.tsx`:
```tsx
'use client';
import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import type { InstallOption } from '@/lib/install';
import { CopyButton } from '@/components/ui/CopyButton';

interface Labels {
  tabs: Record<InstallOption['id'], string>;
  copy: string;
  copied: string;
  pluginNote: (bundle: string) => string;
}

export function InstallTabs({ options, labels }: { options: InstallOption[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const id = useId();
  useEffect(() => {
    if (/Windows/i.test(navigator.userAgent)) {
      const i = options.findIndex((o) => o.id === 'script-windows');
      if (i >= 0) setActive(i);
    }
  }, [options]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  const current = options[active]!;
  return (
    <div className="rounded-2xl border border-line">
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-line p-1.5">
        {options.map((o, i) => (
          <button
            key={o.id}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ${i === active ? 'bg-ink text-night' : 'text-ink-muted hover:text-ink'}`}
          >
            {labels.tabs[o.id]}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="flex items-start gap-3 p-4">
        <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-relaxed text-acid"><code>{current.command}</code></pre>
        <CopyButton text={current.command} label={labels.copy} copiedLabel={labels.copied} />
      </div>
      {current.bundle ? <p className="px-4 pb-4 text-[13px] text-ink-muted">{labels.pluginNote(current.bundle)}</p> : null}
    </div>
  );
}
```

`site/src/components/skill/PermissionManifest.tsx`:
```tsx
import type { Permissions } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';

const MAX = 6;

function Patterns({ items, dict }: { items: string[]; dict: Dictionary }) {
  if (items.length === 0) return <span className="text-ink-muted">{dict.skill.perm.nothing}</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.slice(0, MAX).map((p) => (
        <code key={p} className="rounded bg-ink/[0.07] px-1.5 py-0.5 font-mono text-[12px]">{p}</code>
      ))}
      {items.length > MAX ? <span className="font-mono text-[12px] text-ink-muted">{dict.skill.perm.more(items.length - MAX)}</span> : null}
    </span>
  );
}

function Flag({ on, dict, danger }: { on: boolean; dict: Dictionary; danger?: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold uppercase ${on ? (danger ? 'bg-pink text-night' : 'bg-sun text-night') : 'border border-line text-ink-muted'}`}>
      {on ? dict.skill.perm.yes : dict.skill.perm.no}
    </span>
  );
}

export function PermissionManifest({ permissions, dict }: { permissions: Permissions; dict: Dictionary }) {
  const rows: [string, React.ReactNode][] = [
    [dict.skill.perm.reads, <Patterns key="r" items={permissions.reads} dict={dict} />],
    [dict.skill.perm.writes, <Patterns key="w" items={permissions.writes} dict={dict} />],
    [dict.skill.perm.commands, <Patterns key="c" items={permissions.commands} dict={dict} />],
    [dict.skill.perm.network, <Flag key="n" on={permissions.network} dict={dict} />],
    [dict.skill.perm.destructive, <Flag key="d" on={permissions.destructive} dict={dict} danger />],
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[7rem_1fr] items-start gap-3 py-3">
          <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
          <dd className="min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

`site/src/components/skill/Provenance.tsx`:
```tsx
import type { ExternalSkill } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';
import { sourceUrl } from '@/lib/urls';

export function Provenance({ skill, dict }: { skill: ExternalSkill; dict: Dictionary }) {
  const rows: [string, React.ReactNode][] = [
    [dict.skill.author, <a key="a" href={`https://github.com/${skill.upstream.owner}`} className="hover:text-acid">{skill.upstream.owner}</a>],
    [dict.skill.license, skill.license.startsWith('LicenseRef') ? <a key="l" href={sourceUrl(skill)} className="hover:text-acid">LICENSE</a> : skill.license],
    [dict.skill.source, <a key="s" href={skill.upstream.url} className="break-all hover:text-acid">{skill.upstream.repo}</a>],
    [dict.skill.commit, <a key="c" href={sourceUrl(skill)} className="font-mono hover:text-acid">{skill.upstream.commit.slice(0, 7)}</a>],
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[7rem_1fr] gap-3 py-3 text-[14px]">
          <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
          <dd className="min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

`site/src/components/skill/HowToAsk.tsx`:
```tsx
import { CopyButton } from '@/components/ui/CopyButton';

export function HowToAsk({ items, copy, copied }: { items: string[]; copy: string; copied: string }) {
  return (
    <ul className="space-y-2">
      {items.map((p) => (
        <li key={p} className="flex items-start gap-3 rounded-xl border border-line p-3">
          <code className="min-w-0 flex-1 font-mono text-[13px] leading-relaxed break-words">{p}</code>
          <CopyButton text={p} label={copy} copiedLabel={copied} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: The page**

`site/src/app/[lang]/s/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HowToAsk } from '@/components/skill/HowToAsk';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { PermissionManifest } from '@/components/skill/PermissionManifest';
import { Provenance } from '@/components/skill/Provenance';
import { SkillCard } from '@/components/skill/SkillCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Sticker } from '@/components/ui/Sticker';
import { getSection } from '@/content/sections';
import { catalog, getSkill, relatedSkills } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { breadcrumbLd, skillLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { REPO_URL } from '@/lib/site';
import { paths, sourceUrl } from '@/lib/urls';

type Params = Promise<{ lang: string; slug: string }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => catalog.skills.map((s) => ({ lang, slug: s.slug })));
}

function load(lang: string, slug: string) {
  const skill = getSkill(slug);
  if (!isLang(lang) || !skill) notFound();
  return { lang: lang as Lang, skill };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const { lang, skill } = load(p.lang, p.slug);
  return pageMetadata({ lang, path: `/s/${skill.slug}`, title: `/${skill.slug}`, description: skill.text[lang].description });
}

export default async function SkillPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, skill } = load(p.lang, p.slug);
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const descLang = text.translated ? undefined : 'en';
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const crumbs = [
    { name: d.nav.home, path: paths.home(lang) },
    { name: section.name[lang], path: paths.section(lang, section.id) },
    { name: `/${skill.slug}`, path: paths.skill(lang, skill.slug) },
  ];

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-7">
      <JsonLd data={[skillLd(skill, lang, text.description), breadcrumbLd(crumbs)]} />
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={paths.home(lang)} className="hover:text-ink">{d.nav.home}</Link> /</li>
          <li><Link href={paths.section(lang, section.id)} className="hover:text-ink">{section.number} — {section.name[lang]}</Link></li>
        </ol>
      </nav>

      <header className="mt-6 border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Sticker color={section.accent} rotate={-2}>{skill.kind === 'command' ? d.skill.builtHere : d.skill.by(skill.upstream.owner)}</Sticker>
          {skill.updatedAt ? <span className="font-mono text-[11px] uppercase text-ink-muted">{d.skill.updated(new Date(skill.updatedAt))}</span> : null}
        </div>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] break-all">/{skill.slug}</h1>
        <p className="mt-6 max-w-3xl text-[19px] leading-relaxed">
          <span>{answer}</span>{' '}
          <span lang={descLang}>{text.description}</span>
        </p>
        {!text.translated ? <p className="mt-2 font-mono text-[11px] text-ink-muted">{d.skill.notTranslated}</p> : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          {text.howToAsk.length ? (
            <section aria-labelledby="how">
              <h2 id="how" className="mb-4 font-display text-2xl font-extrabold">{d.skill.howToAsk}</h2>
              <HowToAsk items={text.howToAsk} copy={d.skill.copy} copied={d.skill.copied} />
            </section>
          ) : null}
          <section aria-labelledby="install">
            <h2 id="install" className="mb-4 font-display text-2xl font-extrabold">{d.skill.install}</h2>
            <InstallTabs options={installOptions(skill)} labels={{ tabs: d.skill.tabs, copy: d.skill.copy, copied: d.skill.copied, pluginNote: d.skill.pluginNote }} />
            <p className="mt-3 text-[14px] text-ink-muted">
              {d.skill.invoke} <code className="font-mono text-ink">/{skill.slug}</code>. {d.skill.otherAgents}{' '}
              <a href={`${REPO_URL}/tree/main/platforms`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-acid">{d.skill.otherAgentsLink}</a>
            </p>
          </section>
          <p><Sticker color="cyan" rotate={2}>{d.skill.demoSoon}</Sticker></p>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="perm" className="rounded-2xl border border-line p-5">
            <h2 id="perm" className="mb-2 font-display text-xl font-extrabold">{skill.kind === 'command' ? d.skill.permissions : d.skill.provenance}</h2>
            {skill.kind === 'command' ? (
              <PermissionManifest permissions={skill.permissions} dict={d} />
            ) : (
              <>
                <Provenance skill={skill} dict={d} />
                <p className="mt-3 text-[13px] text-ink-muted">{d.skill.permissionsExternal}</p>
              </>
            )}
            <a href={sourceUrl(skill)} className="mt-4 inline-block font-mono text-[12px] font-bold uppercase text-acid hover:underline">{d.skill.viewSource} ↗</a>
          </section>
        </aside>
      </div>

      <section aria-labelledby="related" className="mt-16">
        <h2 id="related" className="mb-4 font-display text-2xl font-extrabold">{d.skill.related}</h2>
        <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {relatedSkills(skill).map((r) => (
            <li key={r.slug}>
              <SkillCard
                href={paths.skill(lang, r.slug)}
                slug={r.slug}
                description={r.text[lang].description}
                descLang={r.text[lang].translated ? undefined : 'en'}
                badge={r.kind === 'command' ? d.skill.builtHere : d.skill.by(r.upstream.owner)}
                accent={section.accent}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Build and verify in the browser**

Run: `npm run typecheck && npm run build`
Expected: the build prerenders `/[lang]/s/[slug]` for 2 × total skills.

Run `npm run dev`, open `http://localhost:3000/es/s/legal--contract-review` and `http://localhost:3000/en/s/ffmpeg` at 375 px and 1440 px. Check:
- The h1 shows the slug.
- The answer sentence plus description are visible.
- The permission rows are visible on the command, and provenance on the external.
- The install tabs switch with click and with arrow keys.
- Copy gives the "Copied" feedback.
- The 6 related cards link correctly.
- There is no horizontal scroll at 375 px.
- View source contains one `application/ld+json` with `"SoftwareApplication"`.

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "feat(site): skill page with install, permissions, provenance and related"
```

---

### Task 10: Section page `/{lang}/{section}` with filters

**Files:**
- Create: `site/src/components/section/SkillGrid.tsx`, `site/src/app/[lang]/[section]/page.tsx`
- Test: `site/tests/unit/section/filter.test.ts`

**Interfaces:**
- Consumes: `SkillCard` (Task 9); `SECTIONS` and `getSection` (Task 3); `skillsInSection`; `pageMetadata`, `itemListLd`, `breadcrumbLd` and `JsonLd` (Task 8); `DURATION` and `EASE_OUT` (Task 6); `section.*` dictionary keys.
- Produces:
  - `GridItem { slug: string; href: string; description: string; descLang?: string; kind: 'command' | 'external'; network: boolean; group: string; badge: string }`
  - `filterItems(items: GridItem[], f: { kind: 'all' | 'command' | 'external'; group: string; network: boolean }): GridItem[]`, exported from `SkillGrid.tsx` for tests
  - `<SkillGrid items accent labels />`

- [ ] **Step 1: Install Motion and write the failing filter test**

```bash
npm i motion@13.4.4
```

`site/tests/unit/section/filter.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { filterItems, type GridItem } from '@/components/section/SkillGrid';

const item = (slug: string, kind: GridItem['kind'], group: string, network = false): GridItem => ({
  slug, href: `/en/s/${slug}`, description: slug, kind, group, network, badge: kind,
});
const items = [item('a', 'command', 'legal', true), item('b', 'command', 'finance'), item('c', 'external', 'o/r')];

describe('filterItems', () => {
  it('returns everything by default', () => {
    expect(filterItems(items, { kind: 'all', group: 'all', network: false })).toHaveLength(3);
  });
  it('combines origin, group and network filters', () => {
    expect(filterItems(items, { kind: 'command', group: 'all', network: false }).map((i) => i.slug)).toEqual(['a', 'b']);
    expect(filterItems(items, { kind: 'all', group: 'legal', network: false }).map((i) => i.slug)).toEqual(['a']);
    expect(filterItems(items, { kind: 'all', group: 'all', network: true }).map((i) => i.slug)).toEqual(['a']);
    expect(filterItems(items, { kind: 'external', group: 'legal', network: false })).toEqual([]);
  });
});
```

Run → FAIL.

- [ ] **Step 2: Implement SkillGrid**

`site/src/components/section/SkillGrid.tsx`:
```tsx
'use client';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { SkillCard } from '@/components/skill/SkillCard';
import type { Accent } from '@/content/sections';
import { DURATION, EASE_OUT } from '@/lib/motion';

export interface GridItem {
  slug: string;
  href: string;
  description: string;
  descLang?: string;
  kind: 'command' | 'external';
  network: boolean;
  group: string;
  badge: string;
}

type Kind = 'all' | 'command' | 'external';

export function filterItems(items: GridItem[], f: { kind: Kind; group: string; network: boolean }): GridItem[] {
  return items.filter((i) => (f.kind === 'all' || i.kind === f.kind) && (f.group === 'all' || i.group === f.group) && (!f.network || i.network));
}

interface Labels {
  label: string; origin: string; all: string; command: string; external: string;
  group: string; allGroups: string; network: string; empty: string;
  showing: (v: number, t: number) => string;
}

export function SkillGrid({ items, accent, labels }: { items: GridItem[]; accent: Accent; labels: Labels }) {
  const [kind, setKind] = useState<Kind>('all');
  const [group, setGroup] = useState('all');
  const [network, setNetwork] = useState(false);
  const groups = useMemo(() => [...new Set(items.map((i) => i.group))].sort(), [items]);
  const visible = filterItems(items, { kind, group, network });
  const hasBothKinds = new Set(items.map((i) => i.kind)).size > 1;

  return (
    <MotionConfig reducedMotion="user">
      <div role="group" aria-label={labels.label} className="mb-6 flex flex-wrap items-center gap-3">
        {hasBothKinds ? (
          <div role="group" aria-label={labels.origin} className="flex rounded-full border border-line p-0.5">
            {(['all', 'command', 'external'] as const).map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ${kind === k ? 'bg-ink text-night' : 'text-ink-muted hover:text-ink'}`}>
                {labels[k]}
              </button>
            ))}
          </div>
        ) : null}
        {groups.length > 1 ? (
          <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase text-ink-muted">
            <span className="sr-only">{labels.group}</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-full border border-line bg-night px-3 py-1.5 text-ink">
              <option value="all">{labels.allGroups}</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        ) : null}
        {items.some((i) => i.network) ? (
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] font-bold uppercase text-ink-muted">
            <input type="checkbox" checked={network} onChange={(e) => setNetwork(e.target.checked)} className="accent-[var(--color-acid)]" />
            {labels.network}
          </label>
        ) : null}
        <p aria-live="polite" className="ml-auto font-mono text-[11px] uppercase text-ink-muted">{labels.showing(visible.length, items.length)}</p>
      </div>

      <LayoutGroup>
        <motion.ul layout className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {visible.map((i) => (
              <motion.li key={i.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}>
                <SkillCard href={i.href} slug={i.slug} description={i.description} descLang={i.descLang} badge={i.badge} accent={accent} network={i.network} networkLabel={labels.network} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {visible.length === 0 ? <p className="py-10 text-center text-ink-muted">{labels.empty}</p> : null}
    </MotionConfig>
  );
}
```

Run the filter test → PASS.

- [ ] **Step 3: The page**

`site/src/app/[lang]/[section]/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SkillGrid, type GridItem } from '@/components/section/SkillGrid';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSection, SECTIONS } from '@/content/sections';
import { skillsInSection } from '@/lib/catalog';
import { SECTION_IDS, type SectionId } from '@/lib/catalog/types';
import { ACCENT_BG } from '@/lib/design/tokens';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { breadcrumbLd, itemListLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { paths } from '@/lib/urls';

type Params = Promise<{ lang: string; section: string }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => SECTIONS.map((s) => ({ lang, section: s.id })));
}

function load(lang: string, section: string) {
  if (!isLang(lang) || !(SECTION_IDS as readonly string[]).includes(section)) notFound();
  return { lang: lang as Lang, def: getSection(section as SectionId) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const { lang, def } = load(p.lang, p.section);
  return pageMetadata({ lang, path: `/${def.id}`, title: `${def.name[lang]}: ${def.headline[lang].lead} ${def.headline[lang].accent}`, description: def.dek[lang] });
}

export default async function SectionPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, def } = load(p.lang, p.section);
  const d = getDictionary(lang);
  const skills = skillsInSection(def.id);
  const items: GridItem[] = skills.map((s) => ({
    slug: s.slug,
    href: paths.skill(lang, s.slug),
    description: s.text[lang].description,
    descLang: s.text[lang].translated ? undefined : 'en',
    kind: s.kind,
    network: s.kind === 'command' && s.permissions.network,
    group: s.kind === 'command' ? s.category : s.upstream.repo,
    badge: s.kind === 'command' ? d.skill.builtHere : d.skill.by(s.upstream.owner),
  }));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <JsonLd data={[
        breadcrumbLd([{ name: d.nav.home, path: paths.home(lang) }, { name: def.name[lang], path: paths.section(lang, def.id) }]),
        itemListLd(skills.map((s) => ({ name: `/${s.slug}`, path: paths.skill(lang, s.slug) }))),
      ]} />
      <header className="border-b-2 border-ink pb-10">
        <p className="flex items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.14em]">
          <span>{def.number} — {def.name[lang]}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-night ${ACCENT_BG[def.accent]}`}>{d.section.skills(skills.length)}</span>
        </p>
        <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          {def.headline[lang].lead} <em className="font-serif font-normal italic tracking-[-0.02em]">{def.headline[lang].accent}</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink-muted">{def.dek[lang]}</p>
      </header>
      <section className="mt-8">
        <SkillGrid items={items} accent={def.accent} labels={{ ...d.section.filters, empty: d.section.empty, showing: d.section.showing }} />
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Build and verify in the browser**

Run: `npm run typecheck && npm run build`. The build lists 18 section pages.

With `npm run dev`, open `/es/business` and `/en/video` at 375 px and 1440 px. Check:
- The origin filter animates cards in and out, and the count updates.
- The category select narrows the grid.
- "Uses the network" appears only where some command has `network: true`.
- With OS reduced motion enabled, filtering is instant.
- View source shows every card link in the HTML.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): section pages with animated filters"
```

---

### Task 11: Home and Credits pages

**Files:**
- Create: `site/src/content/featured.ts`, `site/src/components/home/Cover.tsx`, `site/src/components/home/CommandTicker.tsx`, `site/src/components/home/SectionIndex.tsx`, `site/src/components/home/StatsStrip.tsx`, `site/src/components/home/Faq.tsx`, `site/src/app/[lang]/credits/page.tsx`
- Modify (replace): `site/src/app/[lang]/page.tsx`
- Test: `site/tests/unit/content/featured.test.ts`

**Interfaces:**
- Consumes: `catalog`, `skillsInSection`, `SECTIONS`, `Sticker`, `Reveal`, `InstallTabs`, `installOptions(null)`, `JsonLd`, `websiteLd`, `faqLd`, `itemListLd`, `pageMetadata`, `truncate`, and the `home.*` and `credits.*` dictionary keys.
- Produces: `FEATURED: string[]` (slugs); the pages `/{lang}` and `/{lang}/credits`.

- [ ] **Step 1: Failing test — every featured slug exists**

`site/src/content/featured.ts`:
```ts
/** Skills shown in the home ticker, spread across sections. Real slugs only (tested). */
export const FEATURED = [
  'short-form-edit', 'legal--contract-review', 'web--landing-page', 'sales--cold-outreach',
  'finance--burn-runway', 'embedded-captions', 'security--security-audit', 'ads-audit',
  'taste-skill', 'ai--rag-eval', 'data--funnel-analysis', 'shorts',
];
```

`site/tests/unit/content/featured.test.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FEATURED } from '@/content/featured';
import type { Catalog } from '@/lib/catalog/types';

const catalog = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../../.generated/catalog.json'), 'utf8')) as Catalog;

describe('FEATURED', () => {
  it('only lists real skills, from at least 6 sections', () => {
    const bySlug = new Map(catalog.skills.map((s) => [s.slug, s]));
    for (const slug of FEATURED) expect(bySlug.has(slug), slug).toBe(true);
    expect(new Set(FEATURED.map((s) => bySlug.get(s)!.section)).size).toBeGreaterThanOrEqual(6);
  });
});
```

Run: `npm run generate && npx vitest run tests/unit/content` → PASS if every slug is real. (If one was renamed upstream, replace it with another real skill from the same section and rerun.)

- [ ] **Step 2: Home components**

`site/src/components/home/Cover.tsx`:
```tsx
import Link from 'next/link';
import { Sticker } from '@/components/ui/Sticker';
import type { SectionId } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { paths } from '@/lib/urls';
import { CommandTicker, type TickerItem } from './CommandTicker';

export function Cover({ lang, dict, total, ticker }: { lang: Lang; dict: Dictionary; total: number; ticker: TickerItem[] }) {
  const c = dict.home.claim;
  return (
    <section className="relative mx-auto grid max-w-[1440px] gap-10 px-4 pb-14 pt-10 sm:px-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <div>
        <h1 className="font-display text-[clamp(3.25rem,9.5vw,7.25rem)] font-extrabold leading-[0.9] tracking-[-0.035em] [word-spacing:0.06em]">
          {c.lead} <em className="font-serif font-normal italic tracking-[-0.02em]">{c.accent}</em>
          <br />
          <span className="mt-2 inline-block -rotate-2 rounded-[18px] bg-acid px-3.5 pb-1.5 text-night">{c.highlight}</span> {c.tail}
        </h1>
        <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink-muted">{dict.home.dek(total)}</p>
      </div>
      <div className="space-y-6">
        <CommandTicker items={ticker} label={dict.home.tickerLabel} />
        <div>
          <h2 className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.08em]">{dict.home.inThisIssue}</h2>
          <ul className="space-y-1 text-[15px]">
            {dict.home.coverLines.map((l) => (
              <li key={l.section}>
                <Link href={paths.section(lang, l.section as SectionId)} className="underline decoration-line underline-offset-4 hover:decoration-acid">{l.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Sticker color="pink" rotate={8} className="absolute right-[40%] top-6 hidden lg:inline-flex">✦ {dict.home.stickerFree}</Sticker>
      <Sticker color="cyan" rotate={-4} className="absolute -bottom-4 right-7 hidden sm:inline-flex">{dict.home.stickerPlatforms}</Sticker>
    </section>
  );
}
```

`site/src/components/home/CommandTicker.tsx`:
```tsx
import Link from 'next/link';

export interface TickerItem {
  slug: string;
  href: string;
  description: string;
  descLang?: string;
}

function Rows({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((i) => (
        <li key={i.slug} className="border-b border-white/10 py-3">
          <Link href={i.href} className="block">
            <span className="font-mono text-[13px] font-bold text-acid">/{i.slug}</span>
            <span lang={i.descLang} className="mt-1 block text-[14px] leading-snug text-white/80">{i.description}</span>
          </Link>
        </li>
      ))}
    </>
  );
}

/** Real skills scrolling through a gradient frame. Paused on hover/focus, static with reduced motion. */
export function CommandTicker({ items, label }: { items: TickerItem[]; label: string }) {
  return (
    <div className="rounded-[14px] bg-[linear-gradient(160deg,#ff5ea8,#7c5cff_55%,#2af5ff)] p-3.5">
      <div className="ticker relative h-[250px] overflow-hidden rounded-lg bg-black/70 px-4">
        <p className="absolute left-4 top-3 z-10 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/80">● {label}</p>
        <div className="ticker-track pt-10">
          <ul><Rows items={items} /></ul>
          <ul aria-hidden="true" inert><Rows items={items} /></ul>
        </div>
      </div>
    </div>
  );
}
```

`site/src/components/home/SectionIndex.tsx`:
```tsx
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { SECTIONS } from '@/content/sections';
import { ACCENT_BG } from '@/lib/design/tokens';
import type { Lang } from '@/lib/i18n/languages';
import { paths } from '@/lib/urls';

export function SectionIndex({ lang, title, counts }: { lang: Lang; title: string; counts: Record<string, number> }) {
  return (
    <section aria-labelledby="index" className="mx-auto max-w-[1440px] px-4 sm:px-7">
      <h2 id="index" className="sr-only">{title}</h2>
      <ul className="grid border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s, i) => (
          <li key={s.id} className="border-b border-r border-line">
            <Reveal delay={(i % 3) * 60}>
              <Link href={paths.section(lang, s.id)} className="group relative block min-h-[150px] p-5 hover:bg-ink/[0.04]">
                <span className="font-mono text-[11px] font-bold uppercase">{s.number} — {s.name[lang]}</span>
                <span className={`absolute right-4 top-4 rounded-full px-2 py-0.5 font-mono text-[12px] font-extrabold text-night ${ACCENT_BG[s.accent]}`}>{counts[s.id] ?? 0}</span>
                <span className="mt-3 block font-display text-[28px] font-extrabold leading-[0.95] tracking-[-0.03em]">
                  {s.headline[lang].lead} <em className="font-serif text-[30px] font-normal italic">{s.headline[lang].accent}</em>
                </span>
                <span className="mt-2 block text-[14px] text-ink-muted">{s.dek[lang]}</span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`site/src/components/home/StatsStrip.tsx`:
```tsx
import type { Dictionary } from '@/lib/i18n';

export function StatsStrip({ dict, total, declared, commands, updated }: { dict: Dictionary; total: number; declared: number; commands: number; updated: Date }) {
  const stats: [string, string][] = [
    [String(total), dict.home.stats.skills],
    [`${declared}/${commands}`, dict.home.stats.permissionsLabel],
    ['4', dict.home.stats.platforms],
    [dict.date(updated), dict.home.stats.updated],
  ];
  return (
    <section className="mx-auto mt-16 max-w-[1440px] px-4 sm:px-7">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-night p-5">
            <dt className="sr-only">{label}</dt>
            <dd className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">{value}</dd>
            <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

`site/src/components/home/Faq.tsx`:
```tsx
export function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq" className="mx-auto mt-20 max-w-3xl px-4 sm:px-7">
      <h2 id="faq" className="mb-6 font-display text-4xl font-extrabold tracking-[-0.03em]">{title}</h2>
      <div className="divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-extrabold">
              {f.q}
              <span aria-hidden className="font-mono text-acid transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-ink-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Home page**

`site/src/app/[lang]/page.tsx`:
```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cover } from '@/components/home/Cover';
import { Faq } from '@/components/home/Faq';
import { SectionIndex } from '@/components/home/SectionIndex';
import { StatsStrip } from '@/components/home/StatsStrip';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { JsonLd } from '@/components/ui/JsonLd';
import { FEATURED } from '@/content/featured';
import { SECTIONS } from '@/content/sections';
import { catalog, getSkill } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { faqLd, itemListLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { truncate } from '@/lib/seo/truncate';
import { REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return { ...pageMetadata({ lang, path: '', title: d.meta.title, description: d.meta.description(catalog.counts.total) }), title: { absolute: d.meta.title } };
}

export default async function Home({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.id, catalog.skills.filter((k) => k.section === s.id).length]));
  const commands = catalog.skills.filter((s) => s.kind === 'command');
  const ticker = FEATURED.map(getSkill).filter((s) => s !== undefined).map((s) => ({
    slug: s.slug,
    href: paths.skill(lang, s.slug),
    description: truncate(s.text[lang].description, 90),
    descLang: s.text[lang].translated ? undefined : 'en',
  }));

  return (
    <main>
      <JsonLd data={[websiteLd(lang), faqLd(d.home.faq), itemListLd(SECTIONS.map((s) => ({ name: s.name[lang], path: paths.section(lang, s.id) })))]} />
      <Cover lang={lang} dict={d} total={catalog.counts.total} ticker={ticker} />
      <SectionIndex lang={lang} title={d.home.index} counts={counts} />
      <StatsStrip dict={d} total={catalog.counts.total} declared={commands.length} commands={commands.length} updated={new Date(catalog.generatedAt)} />
      <section aria-labelledby="install" className="mx-auto mt-20 grid max-w-[1440px] gap-8 px-4 sm:px-7 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="install" className="font-display text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{d.home.cta.title}</h2>
          <p className="mt-4 max-w-md text-[17px] text-ink-muted">{d.home.cta.body}</p>
          <a href={`${REPO_URL}#every-way-to-install`} className="mt-4 inline-block font-mono text-[12px] font-bold uppercase text-acid hover:underline">{d.home.cta.more} ↗</a>
        </div>
        <InstallTabs options={installOptions(null)} labels={{ tabs: d.skill.tabs, copy: d.skill.copy, copied: d.skill.copied, pluginNote: d.skill.pluginNote }} />
      </section>
      <Faq title={d.home.faqTitle} items={d.home.faq} />
    </main>
  );
}
```

`declared` counts commands that have a parsed permission manifest. `parseCommand` throws without one, so it equals `commands.length` by construction. The number is honest because the build enforces it.

- [ ] **Step 4: Credits page**

`site/src/app/[lang]/credits/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog } from '@/lib/catalog';
import type { ExternalSkill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { pageMetadata } from '@/lib/seo/metadata';
import { AUTHOR } from '@/lib/site';
import { paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: '/credits', title: d.credits.title, description: d.credits.dek });
}

export default async function Credits({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const externals = catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external');
  const groups = [...Map.groupBy(externals, (s) => s.upstream.repo)].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <header className="border-b-2 border-ink pb-10">
        <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">{d.credits.title}</h1>
        <p className="mt-6 max-w-2xl text-[19px] text-ink-muted">{d.credits.dek}</p>
        <p className="mt-4 text-[17px]">
          {d.credits.builtHere(catalog.counts.commands)} <a href={AUTHOR.url} className="font-bold text-acid hover:underline">{AUTHOR.name}</a>.
        </p>
      </header>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {groups.map(([repo, skills]) => (
          <li key={repo} className="bg-night p-5">
            <a href={skills[0]!.upstream.url} className="font-display text-xl font-extrabold hover:text-acid">{repo}</a>
            <p className="mt-1 font-mono text-[11px] uppercase text-ink-muted">
              {d.credits.skills(skills.length)} · {d.credits.license}: {[...new Set(skills.map((s) => s.license))].join(', ')}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {skills.map((s) => (
                <li key={s.slug}><Link href={paths.skill(lang, s.slug)} className="font-mono text-[12px] text-ink-muted hover:text-ink">/{s.slug}</Link></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 5: Build and verify in the browser**

Run: `npm run typecheck && npm run build`.

With `npm run dev`, open `/es` and `/en` at 375 px and 1440 px. Check:
- The h1 renders statically: it is not faded in, because it is the LCP element.
- Stickers "stick" once.
- The ticker scrolls and pauses on hover.
- The index shows 9 sections with counts summing to the total.
- The FAQ expands.
- The install tabs work.
- `/es/credits` lists every upstream group.
- With reduced motion, nothing moves and the ticker is static.

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "feat(site): magazine home (cover, ticker, index, stats, FAQ) and credits"
```

---

### Task 12: Search (⌘K)

**Files:**
- Create: `site/src/lib/search/index.ts`, `site/src/lib/search/searcher.ts`, `site/src/components/search/SearchDialog.tsx`, `site/src/components/search/SearchTrigger.tsx`
- Modify: `site/scripts/generate.ts` (register writer), `site/src/app/[lang]/layout.tsx` (mount dialog), `site/src/components/layout/Masthead.tsx` (trigger)
- Test: `site/tests/unit/search/search.test.ts`

**Interfaces:**
- Consumes: `Catalog`, `getSection`, `paths`, `truncate`, and the `search.*` dictionary keys.
- Produces:
  - `SearchEntry { s: string; d: string; n: string; h: string }` (slug, description, section name, href)
  - `buildSearchIndex(catalog: Catalog, lang: Lang): SearchEntry[]`
  - `writeSearchIndexes: Writer`, which writes `public/search/{es,en}.json`
  - `createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[]`
  - `OPEN_SEARCH_EVENT = 'open-search'`
  - `<SearchDialog lang labels total />`, `<SearchTrigger label />`

- [ ] **Step 1: Install and write failing tests**

```bash
npm i fuse.js@7.5.0
```

`site/tests/unit/search/search.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildSearchIndex, type SearchEntry } from '@/lib/search/index';
import { createSearcher } from '@/lib/search/searcher';
import type { Catalog, CommandSkill } from '@/lib/catalog/types';

const entries: SearchEntry[] = [
  { s: 'legal--contract-review', d: 'Revisa un borrador de contrato y marca cláusulas de riesgo', n: 'Negocio', h: '/es/s/legal--contract-review' },
  { s: 'embedded-captions', d: 'Subtítulos incrustados con estilo karaoke', n: 'Video & Motion', h: '/es/s/embedded-captions' },
  { s: 'git--commit', d: 'Mensajes de commit claros', n: 'Código', h: '/es/s/git--commit' },
];

describe('searcher', () => {
  const search = createSearcher(entries);
  it('finds by Spanish word', () => expect(search('contrato')[0]?.s).toBe('legal--contract-review'));
  it('ignores diacritics', () => {
    expect(search('clausulas')[0]?.s).toBe('legal--contract-review');
    expect(search('subtitulos')[0]?.s).toBe('embedded-captions');
  });
  it('finds by slug fragment', () => expect(search('commit')[0]?.s).toBe('git--commit'));
  it('returns nothing for an empty query', () => expect(search('  ')).toEqual([]));
});

describe('buildSearchIndex', () => {
  it('uses the language text and section name', () => {
    const skill = {
      kind: 'command', slug: 'legal--contract-review', section: 'business',
      text: { en: { description: 'Review a contract', howToAsk: [], translated: true }, es: { description: 'Revisa un contrato', howToAsk: [], translated: true } },
    } as unknown as CommandSkill;
    const catalog = { skills: [skill] } as Catalog;
    expect(buildSearchIndex(catalog, 'es')).toEqual([{ s: 'legal--contract-review', d: 'Revisa un contrato', n: 'Negocio', h: '/es/s/legal--contract-review' }]);
  });
});
```

Run → FAIL.

- [ ] **Step 2: Implement the index writer and the searcher**

`site/src/lib/search/index.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { getSection } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { LANGS, type Lang } from '@/lib/i18n/languages';
import { truncate } from '@/lib/seo/truncate';
import { paths } from '@/lib/urls';

export interface SearchEntry {
  s: string;
  d: string;
  n: string;
  h: string;
}

export function buildSearchIndex(catalog: Catalog, lang: Lang): SearchEntry[] {
  return catalog.skills.map((sk) => ({
    s: sk.slug,
    d: truncate(sk.text[lang].description, 200),
    n: getSection(sk.section).name[lang],
    h: paths.skill(lang, sk.slug),
  }));
}

export function writeSearchIndexes(catalog: Catalog, publicDir: string): void {
  const dir = path.join(publicDir, 'search');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const lang of LANGS) fs.writeFileSync(path.join(dir, `${lang}.json`), JSON.stringify(buildSearchIndex(catalog, lang)));
}
```

`site/src/lib/search/searcher.ts`:
```ts
import Fuse from 'fuse.js';
import type { SearchEntry } from './index';

export function createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[] {
  const fuse = new Fuse(entries, {
    keys: [{ name: 's', weight: 2 }, { name: 'd', weight: 1 }, { name: 'n', weight: 0.5 }],
    ignoreDiacritics: true,
    ignoreLocation: true,
    threshold: 0.35,
    minMatchCharLength: 2,
  });
  return (q: string) => (q.trim() ? fuse.search(q.trim(), { limit: 20 }).map((r) => r.item) : []);
}
```

`searcher.ts` imports the *type* from `./index`, which pulls in `node:fs`. Type-only imports are erased, but to be safe write it as `import type { SearchEntry } from './index';`, as shown.

In `site/scripts/generate.ts`, add the import and register the writer:
```ts
import { writeSearchIndexes } from '../src/lib/search/index';
// …
const WRITERS: Writer[] = [writeSearchIndexes];
```

`scripts/generate.ts` runs under `tsx` and `src/` uses the `@/` alias. `tsx` honours `tsconfig.json` `paths`, so `@/…` imports inside `src/lib/search/index.ts` resolve. Run `npm run generate` and confirm `public/search/es.json` exists.

Run the tests → PASS.

- [ ] **Step 3: Dialog and trigger**

`site/src/components/search/SearchTrigger.tsx`:
```tsx
'use client';
import { useEffect, useState } from 'react';

export const OPEN_SEARCH_EVENT = 'open-search';

export function SearchTrigger({ label }: { label: string }) {
  const [mod, setMod] = useState('Ctrl');
  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) setMod('⌘');
  }, []);
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
      className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      <span>{label}</span>
      <kbd className="hidden rounded border border-line px-1 text-[10px] sm:inline">{mod} K</kbd>
    </button>
  );
}
```

`site/src/components/search/SearchDialog.tsx`:
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n/languages';
import type { SearchEntry } from '@/lib/search/index';
import { OPEN_SEARCH_EVENT } from './SearchTrigger';

interface Labels {
  placeholder: string;
  noResults: string;
  hint: string;
  close: string;
  results: string;
  loading: string;
}

export function SearchDialog({ lang, labels }: { lang: Lang; labels: Labels }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState<((q: string) => SearchEntry[]) | null>(null);

  const open = useCallback(async (initial = '') => {
    ref.current?.showModal();
    setQuery(initial);
    if (!search) {
      const [{ createSearcher }, entries] = await Promise.all([
        import('@/lib/search/searcher'),
        fetch(`/search/${lang}.json`).then((r) => r.json() as Promise<SearchEntry[]>),
      ]);
      setSearch(() => createSearcher(entries));
    }
  }, [lang, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        void open();
      }
    };
    const onOpen = () => void open();
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) void open(q);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    setResults(search ? search(query) : []);
    setActive(0);
  }, [query, search]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    ref.current?.close();
    router.push(entry.h);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
  }

  return (
    <dialog ref={ref} aria-label={labels.results} onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto mt-[10vh] w-[min(640px,calc(100vw-2rem))] rounded-2xl border border-line bg-night p-0 text-ink backdrop:bg-black/70">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <input
          autoFocus
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={results[active] ? `${id}-opt-${active}` : undefined}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={labels.placeholder}
          className="min-w-0 flex-1 bg-transparent font-display text-[18px] outline-none placeholder:text-ink-muted"
        />
        <button type="button" onClick={() => ref.current?.close()} className="font-mono text-[11px] font-bold uppercase text-ink-muted hover:text-ink">{labels.close}</button>
      </div>
      <ul id={`${id}-list`} role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
        {!search && query ? <li className="p-4 text-ink-muted">{labels.loading}</li> : null}
        {search && query.trim() && results.length === 0 ? <li className="p-4 text-ink-muted">{labels.noResults}</li> : null}
        {results.map((r, i) => (
          <li key={r.s} id={`${id}-opt-${i}`} role="option" aria-selected={i === active}
            onMouseEnter={() => setActive(i)} onClick={() => go(r)}
            className={`cursor-pointer rounded-xl p-3 ${i === active ? 'bg-ink/[0.08]' : ''}`}>
            <span className="font-mono text-[13px] font-bold text-acid">/{r.s}</span>
            <span className="ml-2 font-mono text-[10px] uppercase text-ink-muted">{r.n}</span>
            <span className="mt-1 block text-[14px] text-ink-muted">{r.d}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line p-3 font-mono text-[10px] uppercase text-ink-muted">{labels.hint}</p>
    </dialog>
  );
}
```

Mount it. In `site/src/app/[lang]/layout.tsx`, add `import { SearchDialog } from '@/components/search/SearchDialog';` and, right after `<Footer … />`:
```tsx
<SearchDialog lang={lang} labels={{ ...d.search, placeholder: d.search.placeholder(catalog.counts.total) }} />
```
In `Masthead.tsx`, add `import { SearchTrigger } from '@/components/search/SearchTrigger';` and render `<SearchTrigger label={dict.search.open} />` as the first child of `<nav>`.

- [ ] **Step 4: Verify in the browser**

Run `npm run typecheck`, then `npm run dev`, and open `/es`. Check:
- `Ctrl+K` / `⌘K` opens the dialog with focus in the input.
- Typing "contrato" lists `legal--contract-review` first.
- "subtitulos" finds `embedded-captions`.
- ↑↓ and Enter navigate to the skill.
- Esc and backdrop click close it.
- `/es?q=contrato` opens the dialog pre-filled.
- The Network tab shows `search/es.json` and the searcher chunk load **only** after opening.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): ⌘K search with diacritic-insensitive matching"
```

---

### Task 13: GEO files, sitemap and robots

**Files:**
- Create: `site/src/lib/geo/markdown.ts`, `site/src/lib/geo/llms.ts`, `site/src/lib/geo/write.ts`, `site/src/app/sitemap.ts`, `site/src/app/robots.ts`
- Modify: `site/scripts/generate.ts` (register `writeGeoFiles`)
- Test: `site/tests/unit/geo/geo.test.ts`

**Interfaces:**
- Consumes: `Catalog`, `SECTIONS`, `getSection`, `getDictionary`, `paths`, `absolute`, `mdPath`, `sourceUrl`, `installOptions`, `AUTHOR`, `LANGS`.
- Produces:
  - `skillMarkdown(skill, lang)`, `sectionMarkdown(catalog, id, lang)`, `homeMarkdown(catalog, lang)`, `creditsMarkdown(catalog, lang)`, each returning a `string`
  - `llmsTxt(catalog, lang): string`, `llmsFullTxt(catalog, lang): string`
  - `writeGeoFiles: Writer`. For each lang it writes `public/{lang}.md`, `public/{lang}/{section}.md`, `public/{lang}/s/{slug}.md` and `public/{lang}/credits.md`. It also writes `public/llms.txt`, `public/llms-full.txt` (EN), `public/es/llms.txt` and `public/es/llms-full.txt`.
  - `sitemap()` and `robots()` as Next metadata routes

- [ ] **Step 1: Failing tests**

`site/tests/unit/geo/geo.test.ts`:
```ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { llmsTxt } from '@/lib/geo/llms';
import { skillMarkdown } from '@/lib/geo/markdown';
import { writeGeoFiles } from '@/lib/geo/write';
import { catalog } from '@/lib/catalog';

const cmd = catalog.skills.find((s) => s.slug === 'legal--contract-review')!;
const ext = catalog.skills.find((s) => s.kind === 'external')!;

describe('markdown twins', () => {
  it('answers first and carries install, permissions and source', () => {
    const md = skillMarkdown(cmd, 'en');
    expect(md.startsWith('# /legal--contract-review\n')).toBe(true);
    expect(md).toContain(cmd.text.en.description);
    expect(md).toContain('install.sh | bash');
    expect(md).toContain('## Permissions');
    expect(md).toContain('https://skills.sgomez.dev/en/s/legal--contract-review');
    expect(md).toContain('Santiago Gómez de la Torre');
  });
  it('credits upstream for externals', () => {
    const md = skillMarkdown(ext, 'es');
    expect(md).toContain(ext.kind === 'external' ? ext.upstream.repo : '');
    expect(md).not.toContain('## Permisos');
  });
});

describe('llms.txt', () => {
  it('lists every skill exactly once with a .md link', () => {
    const txt = llmsTxt(catalog, 'en');
    for (const s of catalog.skills) {
      const needle = `(https://skills.sgomez.dev/en/s/${s.slug}.md)`;
      expect(txt.split(needle).length - 1, s.slug).toBe(1);
    }
    expect(txt.startsWith('# Claude Skills\n\n> ')).toBe(true);
  });
});

describe('writeGeoFiles', () => {
  it('writes one twin per page and language plus llms files', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-'));
    writeGeoFiles(catalog, dir);
    for (const lang of ['es', 'en']) {
      expect(fs.existsSync(path.join(dir, `${lang}.md`))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'credits.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'video.md'))).toBe(true);
      expect(fs.readdirSync(path.join(dir, lang, 's'))).toHaveLength(catalog.skills.length);
    }
    for (const f of ['llms.txt', 'llms-full.txt', 'es/llms.txt', 'es/llms-full.txt']) expect(fs.existsSync(path.join(dir, f)), f).toBe(true);
  });
});

describe('sitemap and robots', () => {
  it('lists every page in both languages with hreflang alternates', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(2 * (1 + 9 + 1 + catalog.skills.length));
    expect(entries[0]!.alternates?.languages).toHaveProperty('es');
  });
  it('explicitly allows AI crawlers and points at the sitemap', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
      expect(rules.some((x) => [x.userAgent].flat().includes(bot) && x.allow === '/'), bot).toBe(true);
    }
    expect(r.sitemap).toBe('https://skills.sgomez.dev/sitemap.xml');
  });
});
```

Run: `npm run generate && npx vitest run tests/unit/geo` → FAIL.

- [ ] **Step 2: Implement markdown, llms and the writer**

`site/src/lib/geo/markdown.ts`:
```ts
import { getSection, SECTIONS } from '@/content/sections';
import type { Catalog, ExternalSkill, SectionId, Skill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { AUTHOR } from '@/lib/site';
import { absolute, mdPath, paths, sourceUrl } from '@/lib/urls';

const list = (items: string[]) => (items.length ? items.map((i) => `\`${i}\``).join(', ') : '—');

export function skillMarkdown(skill: Skill, lang: Lang): string {
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const out: string[] = [`# /${skill.slug}`, '', `${answer} ${text.description}`, ''];
  out.push(`- ${d.md.web}: ${absolute(paths.skill(lang, skill.slug))}`);
  out.push(`- ${d.md.section}: [${section.name[lang]}](${absolute(mdPath(paths.section(lang, section.id)))})`);
  out.push(`- ${d.md.author}: ${skill.kind === 'command' ? AUTHOR.name : skill.upstream.owner}`);
  out.push(`- ${d.md.license}: ${skill.kind === 'command' ? 'MIT' : skill.license}`);
  out.push(`- ${d.md.source}: ${sourceUrl(skill)}`);
  if (skill.updatedAt) out.push(`- ${d.skill.updated(new Date(skill.updatedAt))}`);
  if (text.howToAsk.length) out.push('', `## ${d.md.howToAsk}`, '', ...text.howToAsk.map((p) => `- \`${p}\``));
  out.push('', `## ${d.md.install}`, '');
  for (const o of installOptions(skill)) out.push(`${d.skill.tabs[o.id]}:`, '', '```', o.command, '```', '');
  if (skill.kind === 'command') {
    const p = skill.permissions;
    out.push(`## ${d.md.permissions}`, '');
    out.push(`- ${d.skill.perm.reads}: ${list(p.reads)}`);
    out.push(`- ${d.skill.perm.writes}: ${list(p.writes)}`);
    out.push(`- ${d.skill.perm.commands}: ${list(p.commands)}`);
    out.push(`- ${d.skill.perm.network}: ${p.network ? d.skill.perm.yes : d.skill.perm.no}`);
    out.push(`- ${d.skill.perm.destructive}: ${p.destructive ? d.skill.perm.yes : d.skill.perm.no}`);
  }
  return `${out.join('\n').trimEnd()}\n`;
}

export function sectionMarkdown(catalog: Catalog, id: SectionId, lang: Lang): string {
  const s = getSection(id);
  const skills = catalog.skills.filter((k) => k.section === id);
  return [
    `# ${s.number} — ${s.name[lang]}: ${s.headline[lang].lead} ${s.headline[lang].accent}`, '', s.dek[lang], '',
    `${getDictionary(lang).md.web}: ${absolute(paths.section(lang, id))}`, '',
    `## ${getDictionary(lang).md.skills} (${skills.length})`, '',
    ...skills.map((k) => `- [/${k.slug}](${absolute(mdPath(paths.skill(lang, k.slug)))}): ${k.text[lang].description}`),
    '',
  ].join('\n');
}

export function homeMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  return [
    `# ${d.meta.title}`, '', d.meta.description(catalog.counts.total), '',
    `## ${d.home.index}`, '',
    ...SECTIONS.map((s) => `- [${s.number} — ${s.name[lang]}](${absolute(mdPath(paths.section(lang, s.id)))}): ${s.dek[lang]}`),
    '', `## ${d.home.faqTitle}`, '',
    ...d.home.faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
  ].join('\n');
}

export function creditsMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const externals = catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external');
  const groups = [...Map.groupBy(externals, (s) => s.upstream.repo)].sort((a, b) => a[0].localeCompare(b[0]));
  return [
    `# ${d.credits.title}`, '', d.credits.dek, '',
    `${d.credits.builtHere(catalog.counts.commands)} ${AUTHOR.name} (${AUTHOR.url}).`, '',
    ...groups.flatMap(([repo, skills]) => [`## ${repo}`, '', `${d.credits.license}: ${[...new Set(skills.map((s) => s.license))].join(', ')} · ${skills[0]!.upstream.url}`, '', ...skills.map((s) => `- /${s.slug}`), '']),
  ].join('\n');
}
```

`site/src/lib/geo/llms.ts`:
```ts
import { SECTIONS } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { absolute, mdPath, paths } from '@/lib/urls';
import { skillMarkdown } from './markdown';

export function llmsTxt(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const other = lang === 'en' ? { label: 'Español', url: absolute('/es/llms.txt') } : { label: 'English', url: absolute('/llms.txt') };
  const out = [`# Claude Skills`, '', `> ${d.meta.description(catalog.counts.total)}`, '', `${other.label}: ${other.url}`, ''];
  for (const s of SECTIONS) {
    out.push(`## ${s.number} — ${s.name[lang]}`, '');
    for (const k of catalog.skills.filter((x) => x.section === s.id)) {
      out.push(`- [/${k.slug}](${absolute(mdPath(paths.skill(lang, k.slug)))}): ${k.text[lang].description}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export function llmsFullTxt(catalog: Catalog, lang: Lang): string {
  return [llmsTxt(catalog, lang), '---', '', ...catalog.skills.map((s) => skillMarkdown(s, lang))].join('\n');
}
```

`site/src/lib/geo/write.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { SECTIONS } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { LANGS } from '@/lib/i18n/languages';
import { creditsMarkdown, homeMarkdown, sectionMarkdown, skillMarkdown } from './markdown';
import { llmsFullTxt, llmsTxt } from './llms';

function put(file: string, content: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function writeGeoFiles(catalog: Catalog, publicDir: string): void {
  for (const lang of LANGS) {
    fs.rmSync(path.join(publicDir, lang), { recursive: true, force: true });
    put(path.join(publicDir, `${lang}.md`), homeMarkdown(catalog, lang));
    put(path.join(publicDir, lang, 'credits.md'), creditsMarkdown(catalog, lang));
    for (const s of SECTIONS) put(path.join(publicDir, lang, `${s.id}.md`), sectionMarkdown(catalog, s.id, lang));
    for (const k of catalog.skills) put(path.join(publicDir, lang, 's', `${k.slug}.md`), skillMarkdown(k, lang));
  }
  put(path.join(publicDir, 'llms.txt'), llmsTxt(catalog, 'en'));
  put(path.join(publicDir, 'llms-full.txt'), llmsFullTxt(catalog, 'en'));
  put(path.join(publicDir, 'es', 'llms.txt'), llmsTxt(catalog, 'es'));
  put(path.join(publicDir, 'es', 'llms-full.txt'), llmsFullTxt(catalog, 'es'));
}
```

Register it in `site/scripts/generate.ts`:
```ts
import { writeGeoFiles } from '../src/lib/geo/write';
// …
const WRITERS: Writer[] = [writeSearchIndexes, writeGeoFiles];
```

`writeGeoFiles` removes `public/{lang}` before writing, and `writeSearchIndexes` owns `public/search`. They do not overlap.

- [ ] **Step 3: Sitemap and robots**

`site/src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
import { SECTIONS } from '@/content/sections';
import { catalog } from '@/lib/catalog';
import { LANGS } from '@/lib/i18n/languages';
import { absolute } from '@/lib/urls';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; lastModified: string }[] = [
    { path: '', lastModified: catalog.generatedAt },
    ...SECTIONS.map((s) => ({ path: `/${s.id}`, lastModified: catalog.generatedAt })),
    { path: '/credits', lastModified: catalog.generatedAt },
    ...catalog.skills.map((s) => ({ path: `/s/${s.slug}`, lastModified: s.updatedAt ?? catalog.generatedAt })),
  ];
  return LANGS.flatMap((lang) =>
    pages.map((p) => ({
      url: absolute(`/${lang}${p.path}`),
      lastModified: p.lastModified,
      alternates: { languages: { es: absolute(`/es${p.path}`), en: absolute(`/en${p.path}`) } },
    })),
  );
}
```

`site/src/app/robots.ts`:
```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: AI_CRAWLERS, allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 4: Run tests, build and check the files are served**

Run: `npx vitest run tests/unit/geo && npm run build`, then `npm run preview` in background, and:
```bash
curl -s http://localhost:8787/es/s/legal--contract-review.md | head -3
curl -s http://localhost:8787/llms.txt | head -3
curl -s http://localhost:8787/robots.txt
curl -s http://localhost:8787/sitemap.xml | grep -c '<url>'
```
Expected:
- The `.md` twin starts `# /legal--contract-review`.
- `llms.txt` starts `# Claude Skills`.
- `robots.txt` lists `GPTBot` under `Allow: /`.
- The sitemap count equals `2 × (11 + total)`.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): GEO markdown twins, llms.txt, sitemap and robots"
```

---

### Task 14: Open Graph images (build time)

**Files:**
- Create: `site/assets/og-fonts/bricolage-800.woff`, `site/assets/og-fonts/instrument-italic.woff`, `site/assets/og-fonts/jetbrains-700.woff`, `site/assets/og-fonts/OFL.txt`, `site/src/lib/og/cover.tsx`, `site/src/app/[lang]/opengraph-image.tsx`, `site/src/app/[lang]/[section]/opengraph-image.tsx`, `site/src/app/[lang]/s/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `COLORS` (Task 6), `getSection`, `getSkill`, `catalog`, `getDictionary`, `truncate`.
- Produces: `OG_SIZE = { width: 1200, height: 630 }`, `renderCover(o: { kicker: string; lead: string; accent: string; body?: string; accentColor: string }): Promise<ImageResponse>`

- [ ] **Step 1: Fetch fonts (OFL, committed; build-time only)**

```bash
mkdir -p assets/og-fonts
curl -fsSL -o assets/og-fonts/bricolage-800.woff https://cdn.jsdelivr.net/fontsource/fonts/bricolage-grotesque@latest/latin-800-normal.woff
curl -fsSL -o assets/og-fonts/instrument-italic.woff https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-italic.woff
curl -fsSL -o assets/og-fonts/jetbrains-700.woff https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.woff
```
Create `assets/og-fonts/OFL.txt` with one line per font: its name, "SIL Open Font License 1.1" and `https://openfontlicense.org`.

- [ ] **Step 2: Shared cover renderer**

`site/src/lib/og/cover.tsx`:
```tsx
import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { COLORS } from '@/lib/design/tokens';

export const OG_SIZE = { width: 1200, height: 630 };

const font = (f: string) => fs.readFile(path.join(process.cwd(), 'assets', 'og-fonts', f));

/** Avoid glyphs outside the latin subset (✦, arrows): satori would draw tofu. */
export async function renderCover({ kicker, lead, accent, body, accentColor }: { kicker: string; lead: string; accent: string; body?: string; accentColor: string }) {
  const [display, serif, mono] = await Promise.all([font('bricolage-800.woff'), font('instrument-italic.woff'), font('jetbrains-700.woff')]);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.night, color: COLORS.ink, padding: 64, fontFamily: 'Display' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `3px solid ${COLORS.ink}`, paddingBottom: 18, fontFamily: 'Mono', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase' }}>
          <span style={{ fontFamily: 'Display', fontSize: 34, letterSpacing: -1, textTransform: 'none' }}>claude/skills</span>
          <span>{kicker}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', marginTop: 56, fontSize: 104, lineHeight: 0.92, letterSpacing: -4 }}>
          <span style={{ marginRight: 24 }}>{lead}</span>
          <span style={{ fontFamily: 'Serif', fontSize: 112, letterSpacing: -2, background: accentColor, color: COLORS.night, padding: '0 18px 8px', borderRadius: 20 }}>{accent}</span>
        </div>
        {body ? <div style={{ marginTop: 'auto', fontSize: 30, lineHeight: 1.3, color: COLORS.inkMuted, maxWidth: 980 }}>{body}</div> : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Display', data: display, weight: 800, style: 'normal' },
        { name: 'Serif', data: serif, weight: 400, style: 'italic' },
        { name: 'Mono', data: mono, weight: 700, style: 'normal' },
      ],
    },
  );
}
```

- [ ] **Step 3: The three image routes**

`site/src/app/[lang]/opengraph-image.tsx`:
```tsx
import { catalog } from '@/lib/catalog';
import { COLORS } from '@/lib/design/tokens';
import { getDictionary } from '@/lib/i18n';
import { isLang } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills';

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = getDictionary(isLang(lang) ? lang : 'en');
  return renderCover({ kicker: `${catalog.counts.total} skills`, lead: d.home.claim.lead, accent: d.home.claim.accent, body: d.home.dek(catalog.counts.total), accentColor: COLORS.acid });
}
```

`site/src/app/[lang]/[section]/opengraph-image.tsx`:
```tsx
import { getSection } from '@/content/sections';
import type { SectionId } from '@/lib/catalog/types';
import { COLORS } from '@/lib/design/tokens';
import { isLang } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills section';

export default async function Image({ params }: { params: Promise<{ lang: string; section: string }> }) {
  const p = await params;
  const lang = isLang(p.lang) ? p.lang : 'en';
  const s = getSection(p.section as SectionId);
  return renderCover({ kicker: `${s.number} ${s.name[lang]}`, lead: s.headline[lang].lead, accent: s.headline[lang].accent, body: s.dek[lang], accentColor: COLORS[s.accent] });
}
```

`site/src/app/[lang]/s/[slug]/opengraph-image.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { getSection } from '@/content/sections';
import { getSkill } from '@/lib/catalog';
import { COLORS } from '@/lib/design/tokens';
import { isLang } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';
import { truncate } from '@/lib/seo/truncate';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills skill';

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  const skill = getSkill(p.slug);
  if (!skill) notFound();
  const lang = isLang(p.lang) ? p.lang : 'en';
  const s = getSection(skill.section);
  const [head, ...rest] = skill.slug.split('--');
  const lead = rest.length ? `/${head}--` : '/';
  const accent = rest.length ? rest.join('--') : skill.slug;
  return renderCover({ kicker: `${s.number} ${s.name[lang]}`, lead, accent, body: truncate(skill.text[lang].description, 140), accentColor: COLORS[s.accent] });
}
```

These images inherit the parent segments' `generateStaticParams`, so every image is prerendered. `fs` runs only at build time.

- [ ] **Step 4: Build and inspect a few images**

Run: `npm run build`. The output lists the `opengraph-image` routes as prerendered.

Run `npm run preview` in background. Get the `og:image` URL from `curl -s http://localhost:8787/es/s/legal--contract-review | grep -o 'og:image" content="[^"]*'`, download that image and open it with the Read tool. Do the same for `/en/video` and `/es`. Check:
- The fonts render (no tofu).
- The long slug `vercel-react-best-practices` does not overflow: check `/en/s/vercel-react-best-practices` too.
- The accent colour matches the section.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): build-time Open Graph covers"
```

---

### Task 15: Verification harness (e2e, Lighthouse, leak scan)

**Files:**
- Create: `site/playwright.config.ts`, `site/tests/e2e/site.spec.ts`, `site/tests/e2e/links.spec.ts`, `site/lighthouserc.json`, `site/scripts/check-no-private.ts`
- Modify: `site/package.json` (scripts `e2e`, `lhci`, `check:private`)

**Interfaces:**
- Consumes: the whole site through `npm run preview` (port 8787); `readPrivateNames` (Task 3).
- Produces: `npm run e2e`, `npm run lhci` and `npm run check:private`, used by CI (Task 16).

- [ ] **Step 1: Install and configure**

```bash
npm i -D @playwright/test@1.63.0 @lhci/cli@0.15.1
npx playwright install chromium
```

`site/playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:8787' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'npm run preview', url: 'http://localhost:8787/en', timeout: 900_000, reuseExistingServer: true },
});
```

Add to `site/package.json` scripts:
```json
    "e2e": "playwright test",
    "lhci": "lhci autorun",
    "check:private": "tsx scripts/check-no-private.ts"
```

- [ ] **Step 2: E2E specs**

`site/tests/e2e/site.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('root redirects by Accept-Language', async ({ request }) => {
  const es = await request.get('/', { headers: { 'Accept-Language': 'es-MX,es;q=0.9' }, maxRedirects: 0 });
  expect(es.status()).toBe(307);
  expect(es.headers().location).toBe('/es');
  const en = await request.get('/', { headers: { 'Accept-Language': 'de-DE' }, maxRedirects: 0 });
  expect(en.headers().location).toBe('/en');
});

test('home renders the claim, nine sections and valid JSON-LD', async ({ page }) => {
  await page.goto('/es');
  await expect(page.locator('h1')).toContainText('Nadie lo sabe');
  await expect(page.locator('#index ~ ul > li')).toHaveCount(9);
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(raw)).not.toThrow();
});

test('language switch keeps the page', async ({ page }) => {
  await page.goto('/es/s/legal--contract-review');
  await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'en' }).click();
  await expect(page).toHaveURL(/\/en\/s\/legal--contract-review$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('skill page shows install, permissions and a working copy button', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/s/legal--contract-review');
  await expect(page.locator('h1')).toHaveText('/legal--contract-review');
  await expect(page.getByRole('heading', { name: 'What it can touch' })).toBeVisible();
  await page.getByRole('tabpanel').getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByRole('tabpanel').getByText('Copied')).toBeVisible();
});

test('search finds a skill by an accentless Spanish word', async ({ page }) => {
  await page.goto('/es');
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('contrato');
  await expect(page.getByRole('option').first()).toContainText('legal--contract-review');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/s\/legal--contract-review$/);
});

test('section filters narrow the grid', async ({ page }) => {
  await page.goto('/en/web');
  const cards = page.locator('main ul li a[href^="/en/s/"]');
  const total = await cards.count();
  await page.getByRole('button', { name: 'Community' }).click();
  await expect.poll(async () => cards.count()).toBeLessThan(total);
});

test('reduced motion: ticker is not animated', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/en');
  const name = await page.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationName);
  expect(name).toBe('none');
  await ctx.close();
});

test('markdown twin and llms.txt are served', async ({ request }) => {
  const md = await request.get('/es/s/legal--contract-review.md');
  expect(md.status()).toBe(200);
  expect(await md.text()).toMatch(/^# \/legal--contract-review/);
  expect((await request.get('/llms.txt')).status()).toBe(200);
});

test('og:image resolves to a PNG', async ({ page, request }) => {
  await page.goto('/en/s/legal--contract-review');
  const src = await page.locator('meta[property="og:image"]').getAttribute('content');
  const res = await request.get(src!.replace('https://skills.sgomez.dev', ''));
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('no horizontal scroll on the longest skill page', async ({ page, request }) => {
  const index = (await (await request.get('/search/en.json')).json()) as { s: string; d: string }[];
  const longest = index.reduce((a, b) => (b.s.length + b.d.length > a.s.length + a.d.length ? b : a));
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`/en/s/${longest.s}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
```

`site/tests/e2e/links.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('every internal link from home and sections resolves', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'desktop', 'run once');
  test.setTimeout(600_000);
  const seen = new Set<string>();
  const queue = ['/en', '/es'];
  for (const root of [...queue]) {
    await page.goto(root);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))) {
      if (!seen.has(href)) { seen.add(href); queue.push(href); }
    }
  }
  const sections = [...seen].filter((h) => /^\/(es|en)\/[a-z]+$/.test(h) && !h.endsWith('/credits'));
  for (const s of sections) {
    await page.goto(s);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))) seen.add(href);
  }
  const broken: string[] = [];
  for (const href of seen) {
    const res = await request.get(href, { maxRedirects: 0 });
    if (res.status() >= 400) broken.push(`${res.status()} ${href}`);
  }
  expect(broken).toEqual([]);
});
```

- [ ] **Step 3: Lighthouse CI config**

`site/lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Ready on",
      "startServerReadyTimeout": 900000,
      "url": ["http://localhost:8787/en", "http://localhost:8787/es/business", "http://localhost:8787/es/s/legal--contract-review"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:seo": ["error", { "minScore": 1 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

Lighthouse on `localhost` may flag `is-crawlable` because the preview server sends no `robots.txt` from the production host. It does serve our `robots.txt`, so SEO should score 1. If it does not, read the failing audit in `.lighthouseci/` and fix the page; do not lower the threshold.

- [ ] **Step 4: Post-build private leak scan**

`site/scripts/check-no-private.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { readPrivateNames } from '../src/lib/catalog/guard';

const siteRoot = path.resolve(import.meta.dirname, '..');
const names = readPrivateNames(path.resolve(siteRoot, '..'));
const roots = ['.open-next', 'public'].map((d) => path.join(siteRoot, d)).filter(fs.existsSync);
const patterns = names.map((n) => ({ n, re: new RegExp(`/s/${n}(?![a-z0-9-])|"s":"${n}"|\\[/${n}\\]`) }));

function* files(dir: string): Generator<string> {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(html|json|md|txt|xml|js|rsc|body)$/.test(e.name)) yield p;
  }
}

const hits: string[] = [];
for (const root of roots) {
  for (const f of files(root)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const { n, re } of patterns) if (re.test(text)) hits.push(`${n} in ${path.relative(siteRoot, f)}`);
  }
}
console.log(`private names checked: ${names.length}; hits: ${hits.length}`);
for (const h of hits) console.error(`LEAK ${h}`);
process.exit(hits.length ? 1 : 0);
```

- [ ] **Step 5: Run the whole harness**

Run: `npm run e2e`
Expected: all specs pass on desktop and mobile (links runs once).

Run: `npm run check:private`
Expected: `hits: 0` (on this machine `names` > 0, because `sources.local.txt` exists).

Run: `npm run lhci`
Expected: all assertions pass. For any failure, fix the cause (image size, contrast, missing label) and rerun. Never relax a budget.

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "test(site): e2e, link check, Lighthouse budgets and private leak scan"
```

---

### Task 16: CI, deploy to `skills.sgomez.dev`, real pass

**Files:**
- Create: `.github/workflows/site.yml`
- Modify: `site/wrangler.jsonc` (custom domain route)

**Interfaces:**
- Consumes: the npm scripts from Tasks 3–15.
- Produces: production at `https://skills.sgomez.dev` and PR previews.

- [ ] **Step 1: Workflow**

`.github/workflows/site.yml`:
```yaml
name: Site

on:
  pull_request:
    paths: ['site/**', 'skills/**', 'external/**', 'pipelines/**', '.claude-plugin/**', '.github/workflows/site.yml']
  push:
    branches: [main]
    paths: ['site/**', 'skills/**', 'external/**', 'pipelines/**', '.claude-plugin/**', '.github/workflows/site.yml']

concurrency:
  group: site-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  site:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: site
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # git dates for "Updated …"
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: site/package-lock.json
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run translations:check
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e # builds with OpenNext via the preview web server
      - run: npm run check:private
      - run: npm run lhci
      - name: Preview (PR)
        if: github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          GH_TOKEN: ${{ github.token }}
        run: |
          out=$(npx wrangler versions upload --preview-alias "pr-${{ github.event.number }}" 2>&1 | tee /dev/stderr)
          url=$(printf '%s' "$out" | grep -oE 'https://pr-[^ ]+\.workers\.dev' | head -1)
          if [ -z "$url" ]; then echo "::error::no preview URL in wrangler output"; exit 1; fi
          gh pr comment ${{ github.event.number }} --body "Preview: $url" --edit-last || gh pr comment ${{ github.event.number }} --body "Preview: $url"
      - name: Deploy (main)
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: npx opennextjs-cloudflare deploy
```

The build is reused: `npm run e2e` runs `npm run preview`, which runs `opennextjs-cloudflare build` and leaves `.open-next/`. Then `wrangler versions upload` and `opennextjs-cloudflare deploy` deploy that same build without rebuilding.

- [ ] **Step 2: Custom domain**

Add to `site/wrangler.jsonc`:
```jsonc
  "routes": [{ "pattern": "skills.sgomez.dev", "custom_domain": true }],
  "preview_urls": true
```

- [ ] **Step 3: One-time Cloudflare setup (human, personal account)**

These steps need the user's **personal** Cloudflare account, the one holding the `sgomez.dev` zone, not a company one. Ask the user to run them, or to confirm before running them:
1. `npx wrangler login` from `site/`, then `npm run deploy`. This creates the Worker and the `skills.sgomez.dev` custom domain on the Workers free plan.
2. Create an API token with **Workers Scripts: Edit** and **Account Settings: Read**, scoped to that account. Add it as the `CLOUDFLARE_API_TOKEN` repo secret, and the account ID as `CLOUDFLARE_ACCOUNT_ID`.
3. In the `sgomez.dev` zone go to **Security → Bots / AI Crawl Control**. Make sure AI crawlers are **allowed** (turn off "Block AI bots" and any managed robots.txt override). Spec §7: otherwise GEO is silently void.
4. Enable **Web Analytics** for the zone (automatic setup, cookieless).

- [ ] **Step 4: Verify production from outside**

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H 'Accept-Language: es' https://skills.sgomez.dev/
for ua in GPTBot ClaudeBot PerplexityBot Google-Extended; do printf '%s ' "$ua"; curl -s -o /dev/null -w '%{http_code}\n' -A "$ua" https://skills.sgomez.dev/en/s/legal--contract-review; done
curl -s https://skills.sgomez.dev/robots.txt
curl -s https://skills.sgomez.dev/llms.txt | head -3
```
Expected: `307 https://skills.sgomez.dev/es`; `200` for every bot (a `403` means step 3.3 is not done); `robots.txt` exactly as generated (no Cloudflare-injected disallow block); `llms.txt` starting `# Claude Skills`.

- [ ] **Step 5: Real browser pass (before calling it done)**

With the Playwright MCP, open production at 375×812 and at 1440×900, and walk: `/es` → click index section 06 → click a skill → switch to EN → ⌘K "captions" → open result → `/en/credits`. Take a screenshot at each stop and look at every one. Check:
- Nothing overflows.
- Fonts load.
- Stickers and the ticker animate.
- Filters animate.
- No console errors: `browser_console_messages` is empty of errors.

Report anything off as a defect with its screenshot. Do not report the phase as done while any defect is open.

- [ ] **Step 6: Commit and open the PR**

```bash
git add .github/workflows/site.yml site/wrangler.jsonc
git commit -m "ci(site): build, test, preview per PR and deploy to skills.sgomez.dev"
```
Open a PR from `feat/skills-site` to `main` only when the user asks.

---

### Task 17: Motion layer (runs AFTER Task 15 and BEFORE Task 16)

Added 2026-09-28 at the user's request (spec §6.1, approved: all five layers). It runs after Task 15 so its e2e and Lighthouse harness exists, and before Task 16 so production ships with it.

**Files:**
- Create: `site/src/lib/motion/gsap.ts`, `site/src/lib/motion/intro-key.ts`, `site/src/components/motion/CoverIntro.tsx`, `site/src/components/motion/KineticHeadline.tsx`, `site/src/components/motion/ScrubNumber.tsx`, `site/src/components/motion/Tilt.tsx`, `site/src/components/motion/VelocityMarquee.tsx`, `site/src/components/motion/CountUp.tsx`, `site/tests/e2e/motion.spec.ts`
- Create only if `@types/react` lacks `ViewTransition`: `site/src/types/react-view-transition.d.ts`
- Modify: `site/src/styles/globals.css` (motion section), `site/src/app/[lang]/layout.tsx` (inline script), `site/src/components/ui/Sticker.tsx` (`intro` prop), `site/src/components/ui/CopyButton.tsx` (burst), `site/src/components/skill/SkillCard.tsx` (Tilt, sweep, ViewTransition), `site/src/components/home/Cover.tsx`, `site/src/components/home/CommandTicker.tsx` (drum), `site/src/components/home/SectionIndex.tsx` (CountUp, ViewTransition), `site/src/components/home/StatsStrip.tsx` (CountUp on the total), `site/src/app/[lang]/page.tsx` (CoverIntro, VelocityMarquee), `site/src/app/[lang]/[section]/page.tsx` (KineticHeadline, ScrubNumber, ViewTransition), `site/src/app/[lang]/s/[slug]/page.tsx` (ViewTransition on h1)

**Interfaces:**
- Consumes: every component from Tasks 6, 9, 10 and 11; `gsap@3.15.0` (core, `gsap/ScrollTrigger` and `gsap/SplitText` are all free in 3.13+); `motion/react` (Task 10).
- Produces:
  - `loadGsap(): Promise<{ gsap; ScrollTrigger; SplitText }>` (idempotent, registers plugins once)
  - `INTRO_KEY = 'cs-intro'`
  - `document.documentElement.dataset.intro` ∈ `'played' | 'skipped'` (used by e2e)
  - class `intro-pending` on `<html>` while the intro is armed

**Reference before coding:** read `external/gsap-core/SKILL.md`, `external/gsap-scrolltrigger/SKILL.md`, `external/gsap-plugins/SKILL.md` (SplitText) and `external/gsap-performance/SKILL.md`, plus `external/emil-design-eng/SKILL.md` for easing and duration taste. Where they disagree with this task on a *value* (duration, ease), this task wins; where they flag a *correctness* issue (cleanup, layout thrash), follow them and note it in the report.

- [ ] **Step 1: Install GSAP**

```bash
npm i --save-exact gsap@3.15.0
```

- [ ] **Step 2: Write the failing e2e spec**

`site/tests/e2e/motion.spec.ts`:
```ts
import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

const introState = (page: import('@playwright/test').Page) => page.evaluate(() => document.documentElement.dataset.intro);

test('intro plays once per session and never hides the claim text', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Nobody knows');
  await expect.poll(() => introState(page), { timeout: 5000 }).toBe('played');
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  await page.reload();
  await expect.poll(() => introState(page)).toBe('skipped');
});

test('reduced motion: no intro, no split text, static marquee', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/en');
  await expect.poll(() => introState(page)).toBe('skipped');
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  expect(await page.locator('.marquee-track').first().evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.goto('/en/video');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  expect(await h1.locator('div, span[style]').count()).toBe(0); // SplitText never ran
  await ctx.close();
});

test('kinetic headline stays accessible and becomes visible', async ({ page }) => {
  await page.goto('/es/business');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible({ timeout: 3000 });
  await expect(h1).toHaveAccessibleName(/Letra\s+pequeña/);
});

test('navigating from a card starts a view transition', async ({ page }) => {
  await page.goto('/en/business');
  await page.evaluate(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) {
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        w.__vt += 1;
        return original(arg);
      }) as typeof document.startViewTransition;
    }
  });
  await page.locator('main a[href^="/en/s/"]').first().click();
  await expect(page).toHaveURL(/\/en\/s\//);
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThan(0);
});

test('copy shows a short burst', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/s/legal--contract-review');
  await page.getByRole('tabpanel').getByRole('button', { name: 'Copy' }).click();
  await expect(page.locator('.burst')).toHaveCount(1);
  await expect(page.locator('.burst')).toHaveCount(0, { timeout: 2000 });
});

test('JS stays within budget with the motion layer loaded', async ({ page, request }) => {
  for (const path of ['/en', '/en/video']) {
    const urls = new Set<string>();
    const onResponse = (r: import('@playwright/test').Response) => {
      if (r.request().resourceType() === 'script') urls.add(r.url());
    };
    page.on('response', onResponse);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    page.off('response', onResponse);
    let total = 0;
    for (const u of urls) total += gzipSync(await (await request.get(u)).body()).length;
    expect(total, `${path} gzip JS bytes`).toBeLessThanOrEqual(165 * 1024);
  }
});
```

Run: `npx playwright test tests/e2e/motion.spec.ts --project=desktop`
Expected: FAIL (no `data-intro`, no `.marquee-track`, no `.burst`).

- [ ] **Step 3: GSAP loader and intro key**

`site/src/lib/motion/intro-key.ts`:
```ts
export const INTRO_KEY = 'cs-intro';
```

`site/src/lib/motion/gsap.ts`:
```ts
let loading: Promise<{
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  SplitText: typeof import('gsap/SplitText').SplitText;
}> | null = null;

/** Lazy, idempotent. Keeps GSAP out of the first-load bundle. */
export function loadGsap() {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([g, st, sp]) => {
    g.gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
  });
  return loading;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 4: Arm the intro before first paint (layout)**

In `site/src/app/[lang]/layout.tsx`, add `import { INTRO_KEY } from '@/lib/motion/intro-key';` and replace the inline script's `__html` with:
```tsx
`(function(){var d=document.documentElement;d.classList.add('js');try{if(/^\\/(es|en)\\/?$/.test(location.pathname)&&!sessionStorage.getItem('${INTRO_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},3000)}}catch(e){}})()`
```
The 3 s timeout is the failsafe: if GSAP never loads, nothing stays hidden.

- [ ] **Step 5: Motion CSS**

Append to `site/src/styles/globals.css` (before the existing reduced-motion block), and extend that block as shown:
```css
/* ---------- Motion layer (spec §6.1) ---------- */

/* 1. Intro: states held only while <html> is intro-pending. */
.intro-pending [data-intro='rule'],
.intro-pending [data-intro='highlight-bg'] { transform: scaleX(0); transform-origin: left center; }
.intro-pending [data-intro='accent'] { clip-path: inset(0 100% 0 0); }
.intro-pending [data-intro='sticker'] { opacity: 0; }
.sticker[data-intro] { animation: none; }

/* 2. Kinetic headline: hidden until split, with a failsafe. */
.js [data-kinetic] { visibility: hidden; animation: kinetic-failsafe 0s 1.2s forwards; }
@keyframes kinetic-failsafe { to { visibility: visible; } }

/* 3. View transitions */
::view-transition-group(*) { animation-duration: 0.45s; animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); }

/* 4. Interaction */
.sticker { transition: transform 0.2s var(--ease-out-soft), box-shadow 0.2s var(--ease-out-soft); }
.sticker:hover { transform: rotate(calc(var(--r, -3deg) + 4deg)) translateY(-3px) scale(1.04); box-shadow: 0 9px 0 rgba(0, 0, 0, 0.35); }
.card-sweep { position: relative; isolation: isolate; }
.card-sweep::before {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(115deg, transparent 38%, color-mix(in srgb, var(--accent) 16%, transparent) 50%, transparent 62%);
  background-size: 260% 100%; background-position: 100% 0;
  transition: background-position 0.6s var(--ease-out-soft);
}
.card-sweep:hover::before, .card-sweep:focus-visible::before { background-position: 0 0; }
.burst { position: absolute; inset: 50% auto auto 50%; pointer-events: none; }
.burst i {
  position: absolute; width: 6px; height: 6px; border-radius: 9999px; background: var(--color-acid);
  animation: burst 0.6s var(--ease-out-soft) forwards;
}
@keyframes burst {
  from { transform: rotate(var(--a)) translateX(0) scale(1); opacity: 1; }
  to { transform: rotate(var(--a)) translateX(26px) scale(0.2); opacity: 0; }
}

/* 5. Living cover */
.marquee-track { animation: marquee 32s linear infinite; }
@keyframes marquee { to { transform: translateX(-100%); } }
.drum { perspective: 700px; }
.drum-viewport { transform: rotateX(9deg); mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent); }
body::after {
  content: ''; position: fixed; inset: -50%; z-index: 70; pointer-events: none; opacity: 0.055;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain 1s steps(6) infinite;
}
@keyframes grain {
  0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); }
  60% { transform: translate(-2%, -1%); } 80% { transform: translate(3%, 3%); } 100% { transform: translate(0, 0); }
}
```
Inside the existing `@media (prefers-reduced-motion: reduce)` block, add:
```css
  .js [data-kinetic] { visibility: visible; animation: none; }
  .marquee-track, body::after { animation: none; }
  .drum-viewport { transform: none; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
  .sticker:hover { transform: rotate(var(--r, -3deg)); }
```

- [ ] **Step 6: Layer 1 — CoverIntro and Cover hooks**

`site/src/components/motion/CoverIntro.tsx`:
```tsx
'use client';
import type { gsap as Gsap } from 'gsap';
import { useEffect } from 'react';
import { loadGsap } from '@/lib/motion/gsap';
import { INTRO_KEY } from '@/lib/motion/intro-key';

const INTERRUPT = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/** ~1.4 s magazine opening. Only animates transforms, clip and backgrounds: h1 text paints immediately. */
export function CoverIntro() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro-pending')) {
      root.dataset.intro = 'skipped';
      return;
    }
    let tl: Gsap.core.Timeline | undefined;
    let cancelled = false;
    const finish = () => tl?.progress(1);
    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const q = (k: string) => gsap.utils.toArray<HTMLElement>(`[data-intro="${k}"]`);
      tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => { root.dataset.intro = 'played'; } });
      tl.fromTo(q('rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: 'left center' })
        .fromTo(q('accent'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.5 }, '-=0.25')
        .fromTo(q('highlight-bg'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, transformOrigin: 'left center' }, '-=0.15')
        .fromTo(q('sticker'), { y: -40, scale: 1.2, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)', clearProps: 'transform,opacity,visibility' }, '-=0.1');
      root.classList.remove('intro-pending');
      try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }
      INTERRUPT.forEach((e) => window.addEventListener(e, finish, { once: true, passive: true }));
    });
    return () => {
      cancelled = true;
      tl?.kill();
      INTERRUPT.forEach((e) => window.removeEventListener(e, finish));
    };
  }, []);
  return null;
}
```

In `Masthead.tsx`, change the header to `<header className="relative">` (drop `border-b-2 border-ink`), and add as its last child:
```tsx
<span aria-hidden data-intro="rule" className="absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-ink" />
```

In `Sticker.tsx`, add an optional `intro?: boolean` prop, rendered as `data-intro={intro ? 'sticker' : undefined}`.

In `Cover.tsx`:
- give the accent `<em>` the attribute `data-intro="accent"`;
- replace the highlight span with:
```tsx
<span className="relative isolate mt-2 inline-block -rotate-2 px-3.5 pb-1.5 text-night">
  <span aria-hidden data-intro="highlight-bg" className="absolute inset-0 -z-10 rounded-[18px] bg-acid" />
  {c.highlight}
</span>
```
- pass `intro` to both `<Sticker>`s.

- [ ] **Step 7: Layer 2 — KineticHeadline and ScrubNumber**

`site/src/components/motion/KineticHeadline.tsx`:
```tsx
'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/motion/gsap';

export function KineticHeadline({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.visibility = 'visible';
      return;
    }
    let split: { revert: () => void } | undefined;
    let cancelled = false;
    void loadGsap().then(({ gsap, SplitText }) => {
      if (cancelled) return;
      const s = SplitText.create(el, { type: 'words,chars', mask: 'chars', aria: 'auto' });
      split = s;
      gsap.set(el, { visibility: 'visible' });
      gsap.from(s.chars, { yPercent: 110, duration: 0.7, stagger: 0.018, ease: 'power4.out' });
    });
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, []);
  return <h1 ref={ref} data-kinetic className={className}>{children}</h1>;
}
```

`site/src/components/motion/ScrubNumber.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/motion/gsap';

/** Giant outline section number that drifts with scroll (scrub, never hijacks scroll). */
export function ScrubNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let kill: (() => void) | undefined;
    let cancelled = false;
    void loadGsap().then(({ gsap }) => {
      if (cancelled || !el.parentElement) return;
      const tween = gsap.to(el, { yPercent: 35, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
      kill = () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => { cancelled = true; kill?.(); };
  }, []);
  return (
    <span ref={ref} aria-hidden className="pointer-events-none absolute -top-6 right-0 -z-10 select-none font-display text-[clamp(8rem,30vw,24rem)] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(244_238_228/0.16)]">
      {value}
    </span>
  );
}
```

In `site/src/app/[lang]/[section]/page.tsx`:
- make the `<header>` `relative isolate overflow-hidden border-b-2 border-ink pb-10`;
- add `<ScrubNumber value={def.number} />` as its first child;
- replace the `<h1 …>` element with `<KineticHeadline className="…same classes…">`, keeping its children;
- wrap that headline in `<ViewTransition name={`section-${def.id}`}>` (Step 8).

- [ ] **Step 8: Layer 3 — View transitions**

Import `ViewTransition` from `'react'` (Next 16 App Router bundles a React build that exports it; no config needed). If `npm run typecheck` reports that `react` has no exported member `ViewTransition`, create `site/src/types/react-view-transition.d.ts`:
```ts
import 'react';

declare module 'react' {
  export const ViewTransition: React.FC<{ name?: string; children: React.ReactNode; default?: string; enter?: string; exit?: string; update?: string; share?: string }>;
}
```
Wrap:
- in `SkillCard.tsx`, the `/{slug}` span: `<ViewTransition name={`skill-${slug}`}>…</ViewTransition>`;
- in the skill page, the `<h1>`: same name `skill-${skill.slug}`;
- in `SectionIndex.tsx`, the headline span: `section-${s.id}`;
- in the section page, the `KineticHeadline`: `section-${def.id}`.
No name may appear twice on one page. The ticker does not use `SkillCard`, so its duplicated rows are safe.

- [ ] **Step 9: Layer 4 — Tilt, sweep, sticker peel, copy burst**

`site/src/components/motion/Tilt.tsx`:
```tsx
'use client';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

/** Magnetic tilt, fine pointers only; plain div otherwise. */
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  const rx = useSpring(0, { stiffness: 260, damping: 22 });
  const ry = useSpring(0, { stiffness: 260, damping: 22 });
  useEffect(() => setFine(window.matchMedia('(pointer: fine)').matches), []);
  if (reduce || !fine) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}
```

In `SkillCard.tsx`: wrap the `<Link>` in `<Tilt className="h-full">`, add `card-sweep` to the Link's classes and `style={{ '--accent': COLORS[accent] } as CSSProperties}` (import `COLORS` from `@/lib/design/tokens`).

In `CopyButton.tsx`: add `relative` to the button classes and a `burst` state. On a successful copy, set `burst` to `Date.now()` and clear it after 700 ms. While it is set, render inside the button:
```tsx
{burst ? (
  <span key={burst} className="burst" aria-hidden>
    {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as CSSProperties} />)}
  </span>
) : null}
```
With reduced motion the global rule collapses the animation to one frame, so no burst is visible.

- [ ] **Step 10: Layer 5 — Marquee, count-up, drum, grain**

`site/src/components/motion/VelocityMarquee.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/motion/gsap';

/** Decorative band (aria-hidden: its text already appears as the "In this issue" list). Skews with scroll velocity. */
export function VelocityMarquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let kill: (() => void) | undefined;
    let cancelled = false;
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' });
      let idle: ReturnType<typeof setTimeout> | undefined;
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -250));
          clearTimeout(idle);
          idle = setTimeout(() => skew(0), 120);
        },
      });
      kill = () => { clearTimeout(idle); st.kill(); };
    });
    return () => { cancelled = true; kill?.(); };
  }, []);
  const text = items.join('  ✦  ');
  const Track = () => (
    <div className="marquee-track flex shrink-0 gap-10 pr-10 font-display text-[clamp(1.5rem,4vw,3rem)] font-extrabold uppercase tracking-[-0.02em]">
      <span>{text}</span><span>{text}</span>
    </div>
  );
  return (
    <div aria-hidden className="mt-4 overflow-hidden border-y-2 border-ink bg-acid py-3 text-night">
      <div ref={ref} className="flex w-max will-change-transform"><Track /><Track /></div>
    </div>
  );
}
```

`site/src/components/motion/CountUp.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion/gsap';

/** Server renders the final number; counts up from 0 only if it starts off-screen. */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.textContent = '0';
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 900);
        el.textContent = String(Math.round(value * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref} className={className}>{value}</span>;
}
```

Wire them:
- In the home page (`[lang]/page.tsx`):
  - render `<CoverIntro />` once inside `<main>`;
  - render `<VelocityMarquee items={d.home.coverLines.map((l) => l.text)} />` right after `<Cover …/>`.
- In `SectionIndex.tsx`, the count chip becomes `<CountUp value={counts[s.id] ?? 0} />`.
- In `StatsStrip.tsx`, the first stat's value (the total) renders `<CountUp value={total} />`. Change the `stats` tuple type to `[React.ReactNode, string][]`.
- In `CommandTicker.tsx`:
  - add `drum` to the outer gradient wrapper's classes;
  - wrap the `.ticker` element's contents in `<div className="drum-viewport">…</div>`.

- [ ] **Step 11: Run the motion spec, the full e2e and Lighthouse**

Run `npm run typecheck`, then `npx playwright test tests/e2e/motion.spec.ts`.
Expected: PASS on both projects. The view-transition test passes on the chromium projects. Skip it only for a browser without `startViewTransition`, and say so in the report.

Run `npm run e2e`. Expected: every spec passes, including Task 15's reduced-motion ticker test.

Run `npm run lhci`. Expected: every Task 15 budget still passes (LCP < 2500 ms, CLS < 0.05, TBT < 200 ms, SEO 1, a11y ≥ 0.95).
- If LCP regresses on section pages because of the hidden kinetic headline, lower the failsafe delay in `globals.css` (1.2 s → 0.6 s) and rerun.
- If the budget still fails, animate only the accent `<em>` with SplitText and keep the lead static.
- Never relax a budget.

- [ ] **Step 12: Real browser pass with screenshots**

With the Playwright MCP browser, on `npm run preview`, at 1440×900 and 375×812:
1. Fresh session on `/es`: screenshots at about 200 ms, 700 ms and 1600 ms after load, to show the intro's phases. Then press a key mid-intro in a new session and confirm it jumps to the end.
2. Scroll the home page: the marquee skews with scroll speed and settles back, the index counters count up, and the drum ticker keeps scrolling.
3. Click an index card: the section headline flies in (a view transition) and its letters rise. Scroll: the giant outline number drifts.
4. Hover a skill card (desktop): it tilts and the colour sweep shows. Click it: the `/slug` morphs into the h1.
5. Copy a command: the burst shows.
6. Repeat 1–3 with reduced motion emulated: everything is static and fully readable.

Save the screenshots under `.playwright-mcp/motion-*.png`, look at every one, and list defects in the report. Fix and re-shoot before reporting DONE.

- [ ] **Step 13: Commit**

```bash
git add site/
git commit -m "feat(site): motion layer — magazine intro, kinetic type, view transitions, living cover"
```

---

## Self-review notes (for the executor)

- Spec coverage for phase 1:
  - Catalog: Tasks 2–3
  - Translations without API: Tasks 4–5
  - Visual system: Task 6
  - i18n: Task 7
  - SEO: Tasks 8 and 14
  - Skill page: Task 9
  - Section page: Task 10
  - Home and credits: Task 11
  - Search: Task 12
  - GEO: Task 13
  - Verification: Task 15
  - CI/CD: Task 16
- Deliberately out of phase 1 (spec §11, phases 2–3): `/empieza`, recipes, pipelines as recipes, reportajes, demo reel, demos and R2.
- Every dictionary key used by Tasks 9–13 is defined in Task 7; `es` is typed `Dictionary`, so a missing key fails `tsc`.
