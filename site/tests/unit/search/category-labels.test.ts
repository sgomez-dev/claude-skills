import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalog } from '@/lib/catalog/build';
import { CATEGORY_LABELS } from '@/content/category-labels';

const REPO = path.resolve(import.meta.dirname, '../../../..');

describe('CATEGORY_LABELS', () => {
  it('has an entry for every category in the real catalog', () => {
    const catalog = buildCatalog({ repoRoot: REPO, translationsDir: fs.mkdtempSync(path.join(os.tmpdir(), 'tr-')) });
    const cats = new Set(catalog.skills.flatMap((s) => (s.kind === 'command' ? [s.category] : [])));
    const missing = [...cats].filter((c) => !CATEGORY_LABELS[c]?.es || !CATEGORY_LABELS[c]?.en);
    expect(missing).toEqual([]);
  });
});
