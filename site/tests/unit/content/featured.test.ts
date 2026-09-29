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
