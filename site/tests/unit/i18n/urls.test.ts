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
