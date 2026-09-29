import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createSearcher } from '@/lib/search/searcher';
import type { SearchEntry } from '@/lib/search/index';

describe('real search index', () => {
  const indexPath = path.resolve(import.meta.dirname, '../../../public/search/es.json');
  const entries: SearchEntry[] = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const search = createSearcher(entries);

  it('contrato returns legal--contract-review first', () => {
    const results = search('contrato');
    expect(results[0]?.s).toBe('legal--contract-review');
  });

  it('subtitulos contains embedded-captions in top 2', () => {
    const results = search('subtitulos').slice(0, 2);
    const slugs = results.map(r => r.s);
    expect(slugs).toContain('embedded-captions');
  });

  it('revision contains code-quality--review in top 3', () => {
    const results = search('revision').slice(0, 3);
    const slugs = results.map(r => r.s);
    expect(slugs).toContain('code-quality--review');
  });
});
