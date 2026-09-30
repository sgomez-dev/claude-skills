import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashDescription, type TranslationEntry } from '@/lib/catalog/text';
import { SECTIONS, type SectionDef } from '@/content/sections';
import { maxTitleLength, sectionProblems } from '@/lib/catalog/copy-rules';
import { checkTranslations, copyProblems, extraProblems, planCopy, planTranslations } from '@/lib/catalog/translations';
import { skillPageTitle } from '@/lib/seo/titles';
import type { Skill } from '@/lib/catalog/types';

const skill = (slug: string, description: string): Skill => ({
  kind: 'command', slug, name: slug, category: 'legal', bundle: null, description, section: 'business',
  sourcePath: `skills/legal/${slug}.md`, copyHash: '0123456789abcdef', updatedAt: null,
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

describe('copyProblems (title and summary rules)', () => {
  const ok = 'Revisa un borrador de contrato y devuelve las cláusulas de riesgo, los términos que faltan y las obligaciones desequilibradas.';
  const withCopy = (es: Record<string, unknown>, en: Record<string, unknown> = {}) => ({
    ...entry('A'), es: { ...entry('A').es, ...es }, en: { ...entry('A').en, ...en },
  }) as TranslationEntry;

  it('accepts missing fields and well-formed ones', () => {
    expect(copyProblems(withCopy({}))).toEqual([]);
    expect(copyProblems(withCopy({ title: 'Revisión de contratos', summary: ok }, { title: 'Contract review', summary: ok }))).toEqual([]);
  });
  it('bounds the bare title by the RENDERED page title: 38 characters in Spanish, 41 in English', () => {
    expect(maxTitleLength('es')).toBe(38);
    expect(maxTitleLength('en')).toBe(41);
    expect(copyProblems(withCopy({ title: 'Revisión legal de contratos comerciales' }))).toEqual([expect.stringContaining('es.title is 39 characters')]);
    expect(copyProblems(withCopy({ title: 'Revisión de contratos de negocio' }))).toEqual([]);
    expect(copyProblems(withCopy({}, { title: 'Comprehensive contract review for businesses' }))).toEqual([expect.stringContaining('en.title is 44 characters')]);
    // The rendered title really fits the budget at the limit.
    expect(skillPageTitle('skill de Claude Code', 'Revisión de contratos de negocio', 'x').length).toBeLessThanOrEqual(60);
  });
  it('wants 2-5 words, and no brackets or line breaks in a title or summary', () => {
    expect(copyProblems(withCopy({ title: 'Contratos' }))).toEqual(['es.title must be 2-5 words (is 1)']);
    expect(copyProblems(withCopy({ title: 'Uno dos tres cuatro cinco seis' })).some((p) => p.includes('2-5 words'))).toBe(true);
    expect(copyProblems(withCopy({ title: 'Contratos [rápido]' })).some((p) => p.includes('[ ]'))).toBe(true);
    expect(copyProblems(withCopy({}, { summary: `${ok}\nsegunda línea` })).some((p) => p.includes('[ ]'))).toBe(true);
    expect(copyProblems(withCopy({}, { summary: `${ok} [x](y)` })).some((p) => p.includes('[ ]'))).toBe(true);
  });
  it('rejects router phrasing in a title and in a summary', () => {
    expect(copyProblems(withCopy({ title: 'Use when contracts' })).some((p) => p.includes('router text'))).toBe(true);
    for (const bad of ['Use when you need to review a contract draft and flag risky clauses before you sign it.', 'Triggers include contract review, redlines and clause checks for any agreement you have.', 'Úsala cuando el usuario quiera revisar un contrato y detectar las cláusulas de riesgo antes de firmar.']) {
      expect(copyProblems(withCopy({ summary: bad })).some((p) => p.includes('router text')), bad).toBe(true);
    }
  });
  it('bounds the summary to 60-160 characters', () => {
    expect(copyProblems(withCopy({}, { summary: 'too short' }))).toEqual(['en.summary must be 60-160 characters (is 9)']);
    expect(copyProblems(withCopy({}, { summary: 'y'.repeat(161) }))).toEqual(['en.summary must be 60-160 characters (is 161)']);
  });
  it('is reported by checkTranslations as an error, never as a failure for missing fields', () => {
    const dir = dirWith({ 'fresh.json': withCopy({ title: 'Uno dos tres cuatro cinco seis' }), 'plain.json': entry('B') });
    const r = checkTranslations([skill('fresh', 'A'), skill('plain', 'B')], dir, { sections: [] });
    expect(r.errors).toEqual(['fresh.json: es.title must be 2-5 words (is 6)']);
    expect(r.warnings).toEqual([]);
  });
});

describe('A14 blocks, keywords and section copy (warnings now, errors under strictCopy)', () => {
  const blocks = (es: Record<string, unknown>) => ({ ...entry('A'), es: { ...entry('A').es, ...es }, en: entry('A').en }) as TranslationEntry;

  it('checks the blocks only when present', () => {
    expect(extraProblems(blocks({}))).toEqual([]);
    expect(extraProblems(blocks({ useWhen: ['a', 'b', 'c'], notFor: ['a'], keywords: ['a', 'b', 'c'], faq: [{ q: 'q', a: 'a' }, { q: 'q2', a: 'a2' }] }))).toEqual([]);
    const bad = extraProblems(blocks({ useWhen: ['a'], notFor: ['a', 'b', 'c'], keywords: ['a'], faq: [{ q: 'x'.repeat(121), a: 'y'.repeat(401) }] }));
    expect(bad).toEqual([
      'es.useWhen must have 3 items (has 1)',
      'es.notFor must have 1-2 items (has 3)',
      'es.keywords must have 3-5 items (has 1)',
      'es.faq must have 2-3 items (has 1)',
      'es.faq[0].q is 121 characters (max 120)',
      'es.faq[0].a is 401 characters (max 400)',
    ]);
  });
  it('are warnings by default and errors with strictCopy', () => {
    const dir = dirWith({ 'a.json': { ...blocks({ useWhen: ['only one'] }), copyHash: 'a'.repeat(16) } });
    const s = skill('a', 'A');
    const soft = checkTranslations([s], dir);
    expect(soft.errors).toEqual([]);
    expect(soft.warnings).toContain('a.json: es.useWhen must have 3 items (has 1)');
    const strict = checkTranslations([s], dir, { strictCopy: true });
    expect(strict.errors).toContain('a.json: es.useWhen must have 3 items (has 1)');
  });
  it('checks present section copy: seoTitle, description length and at least 5 valid intro links', () => {
    const slugs = new Set(['a', 'b', 'c', 'd', 'e']);
    const plain: SectionDef = { ...SECTIONS[0]!, seoTitle: undefined, description: undefined, intro: undefined };
    expect(sectionProblems(slugs, [plain])).toEqual([]);
    const s: SectionDef = {
      ...plain,
      seoTitle: { es: 'x'.repeat(61), en: 'ok title' },
      description: { es: 'too short', en: 'y'.repeat(130) },
      intro: { es: ['[a](a) [b](b) [c](c) [d](d)'], en: ['[a](a) [b](b) [c](c) [d](d) [e](e) [z](zz)'] },
    };
    expect(sectionProblems(slugs, [s])).toEqual([
      'section video/es: seoTitle is 61 characters (max 60)',
      'section video/es: description must be 120-160 characters (is 9)',
      'section video/es: intro needs at least 5 valid skill links (has 4)',
      'section video/en: intro links to unknown skills: zz',
    ]);
    expect(checkTranslations([], dirWith({}), { sections: [s] }).warnings).toContain('section video/es: seoTitle is 61 characters (max 60)');
    expect(checkTranslations([], dirWith({}), { sections: [s], strictCopy: true }).errors).toContain('section video/es: seoTitle is 61 characters (max 60)');
  });
});

describe('copy freshness (copyHash)', () => {
  const ok = 'Revisa un borrador de contrato y devuelve las cláusulas de riesgo, los términos que faltan y las obligaciones desequilibradas.';
  const full = (copyHash?: string) => ({
    ...entry('A'),
    ...(copyHash ? { copyHash } : {}),
    es: { ...entry('A').es, title: 'Revisión de contratos', summary: ok },
    en: { ...entry('A').en, title: 'Contract review', summary: ok.replace('Revisa', 'Reviews') },
  });

  it('a skill with no entry, or an entry without title or summary, is missing; a different copyHash is stale', () => {
    const dir = dirWith({ 'done.json': full('c'.repeat(16)), 'old.json': full('d'.repeat(16)), 'nohash.json': full(), 'bare.json': entry('A') });
    const skills = [skill('done', 'A'), skill('old', 'A'), skill('nohash', 'A'), skill('bare', 'A'), skill('none', 'A')];
    const hashes: Record<string, string> = { done: 'c', old: 'c', nohash: 'c', bare: 'c', none: 'c' };
    const items = planCopy(skills.map((s) => ({ ...s, copyHash: hashes[s.slug]!.repeat(16) })), dir);
    expect(items.map((i) => [i.slug, i.reason])).toEqual([['old', 'stale'], ['nohash', 'stale'], ['bare', 'missing'], ['none', 'missing']]);
    expect(items.find((i) => i.slug === 'bare')!.missing).toEqual(['es.title', 'es.summary', 'en.title', 'en.summary']);
    expect(items[0]).toMatchObject({ kind: 'command', section: 'business', sourcePath: 'skills/legal/old.md', description: 'A', sourceHash: hashDescription('A'), copyHash: 'c'.repeat(16) });
  });
  it('strictCopy turns missing and stale copy into errors; the default stays quiet', () => {
    const dir = dirWith({ 'old.json': full('d'.repeat(16)), 'bare.json': entry('A') });
    const skills = [skill('old', 'A'), skill('bare', 'A')].map((s) => ({ ...s, copyHash: 'c'.repeat(16) }));
    expect(checkTranslations(skills, dir, { sections: [] }).errors).toEqual([]);
    expect(checkTranslations(skills, dir, { sections: [], strictCopy: true }).errors).toEqual([
      'old: authored copy is stale (copyHash differs from the skill file)',
      'bare: authored copy missing (es.title, es.summary, en.title, en.summary)',
    ]);
  });
});

describe('checkTranslations', () => {
  it('errors on invalid files and on orphans; warns on missing or stale', () => {
    const dir = dirWith({ 'fresh.json': entry('A'), 'stale.json': entry('old'), 'broken.json': '{', 'orphan.json': entry('Z') });
    const r = checkTranslations([skill('fresh', 'A'), skill('stale', 'B'), skill('broken', 'C'), skill('missing', 'D')], dir, { sections: [] });
    expect(r.errors.sort()).toEqual(['broken.json: invalid', 'orphan.json: no such skill']);
    expect(r.warnings.sort()).toEqual(['missing: no translation', 'stale: stale (description changed)']);
  });
});
