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
