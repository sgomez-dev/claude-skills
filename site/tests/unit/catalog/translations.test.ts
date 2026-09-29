import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashDescription, type TranslationEntry } from '@/lib/catalog/text';
import { checkTranslations, copyProblems, planTranslations } from '@/lib/catalog/translations';
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

describe('copyProblems (title and summary rules)', () => {
  const ok = 'Revisa un borrador de contrato y devuelve las cláusulas de riesgo, los términos que faltan y las obligaciones desequilibradas.';
  const withCopy = (es: Record<string, unknown>, en: Record<string, unknown> = {}) => ({
    ...entry('A'), es: { ...entry('A').es, ...es }, en: { ...entry('A').en, ...en },
  }) as TranslationEntry;

  it('accepts missing fields and well-formed ones', () => {
    expect(copyProblems(withCopy({}))).toEqual([]);
    expect(copyProblems(withCopy({ title: 'Revisión de contratos', summary: ok }, { title: 'Contract review', summary: ok }))).toEqual([]);
  });
  it('bounds the title to 60 characters', () => {
    expect(copyProblems(withCopy({ title: 'x'.repeat(61) }))).toEqual(['es.title must be 1-60 characters (is 61)']);
    expect(copyProblems(withCopy({ title: 'x'.repeat(60) }))).toEqual([]);
  });
  it('bounds the summary to 60-160 characters', () => {
    expect(copyProblems(withCopy({}, { summary: 'too short' }))).toEqual(['en.summary must be 60-160 characters (is 9)']);
    expect(copyProblems(withCopy({}, { summary: 'y'.repeat(161) }))).toEqual(['en.summary must be 60-160 characters (is 161)']);
  });
  it('rejects router phrasing in a summary', () => {
    for (const bad of ['Use when you need to review a contract draft and flag risky clauses before you sign it.', 'Triggers include contract review, redlines and clause checks for any agreement you have.', 'Úsala cuando el usuario quiera revisar un contrato y detectar las cláusulas de riesgo antes de firmar.']) {
      expect(copyProblems(withCopy({ summary: bad })).some((p) => p.includes('router text')), bad).toBe(true);
    }
  });
  it('is reported by checkTranslations as an error, never as a failure for missing fields', () => {
    const dir = dirWith({ 'fresh.json': withCopy({ title: 'x'.repeat(70) }), 'plain.json': entry('B') });
    const r = checkTranslations([skill('fresh', 'A'), skill('plain', 'B')], dir);
    expect(r.errors).toEqual(['fresh.json: es.title must be 1-60 characters (is 70)']);
    expect(r.warnings).toEqual([]);
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
