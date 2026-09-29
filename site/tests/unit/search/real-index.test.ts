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

  it('subtitulos returns embedded-captions first', () => {
    expect(search('subtitulos')[0]?.s).toBe('embedded-captions');
  });

  it('revision returns code-quality--review first', () => {
    expect(search('revision')[0]?.s).toBe('code-quality--review');
  });

  it.each(['node(', 'test[', 'test\\','docker)', 'c++', '(', 'git*', 'a|b'])('does not throw on %j', (q) => {
    expect(() => search(q)).not.toThrow();
  });

  it('base de datos has a database-- skill in the top 3', () => {
    const slugs = search('base de datos').slice(0, 3).map((r) => r.s);
    expect(slugs.some((s) => s.startsWith('database--'))).toBe(true);
  });

  it('seguridad top 3 are all security-- skills', () => {
    const slugs = search('seguridad').slice(0, 3).map((r) => r.s);
    expect(slugs.every((s) => s.startsWith('security--'))).toBe(true);
  });
});
