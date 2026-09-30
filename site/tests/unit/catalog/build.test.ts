import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalog } from '@/lib/catalog/build';
import { assertNoPrivate, readPrivateNames } from '@/lib/catalog/guard';
import { sectionFor } from '@/lib/catalog/sections-map';
import { hashDescription, resolveText, TranslationEntrySchema } from '@/lib/catalog/text';
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

  it('carries authored title, summary and A14 blocks, only the ones that exist', () => {
    const faq = [{ q: 'Q?', a: 'A.' }];
    const rich = {
      ...entry,
      es: { ...entry.es, title: 'Revisión de contratos', summary: 'Resumen.', useWhen: ['a'], faq },
      en: { ...entry.en, title: 'Contract review', output: 'A report.' },
    };
    const t = resolveText(description, rich);
    expect(t.es).toEqual({ description: 'Revisa un borrador de contrato', howToAsk: ['a', 'b', 'c'], translated: true, title: 'Revisión de contratos', summary: 'Resumen.', useWhen: ['a'], faq });
    expect(t.en).toEqual({ description, howToAsk: ['x', 'y', 'z'], translated: true, title: 'Contract review', output: 'A report.' });
    expect(Object.keys(t.en)).not.toContain('summary');
  });

  it('a changed description stales only the translated description: the authored copy stays', () => {
    const t = resolveText('A changed description', { ...entry, es: { ...entry.es, title: 'Dos palabras', keywords: ['a', 'b', 'c'] }, en: { ...entry.en, title: 'Two words' } });
    expect(t.es).toEqual({ description: 'A changed description', howToAsk: [], translated: false, title: 'Dos palabras', keywords: ['a', 'b', 'c'] });
    expect(t.en).toEqual({ description: 'A changed description', howToAsk: [], translated: true, title: 'Two words' });
  });

  it('hashes the whole skill source file, the same for LF and CRLF checkouts', () => {
    const c = buildCatalog({ repoRoot: FIX, translationsDir: emptyDir() });
    for (const s of c.skills) expect(s.copyHash, s.slug).toMatch(/^[0-9a-f]{16}$/);
    expect(new Set(c.skills.map((s) => s.copyHash)).size).toBe(c.skills.length);
    const again = buildCatalog({ repoRoot: FIX, translationsDir: emptyDir() });
    expect(again.skills.map((s) => s.copyHash)).toEqual(c.skills.map((s) => s.copyHash));
  });

  it('still accepts entries written before the new fields existed', () => {
    expect(TranslationEntrySchema.safeParse(entry).success).toBe(true);
    expect(TranslationEntrySchema.safeParse({ ...entry, en: { ...entry.en, title: 'ok', faq: [{ q: 'q', a: 'a', extra: 1 }] } }).success).toBe(false);
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
