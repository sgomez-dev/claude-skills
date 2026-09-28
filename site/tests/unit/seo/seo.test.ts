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
    const ld = skillLd(command, 'es', 'desc') as unknown as Record<string, unknown>;
    expect(ld['@type']).toBe('SoftwareApplication');
    expect((ld.author as { name: string }).name).toBe('Santiago Gómez de la Torre');
    expect(ld.url).toBe('https://skills.sgomez.dev/es/s/legal--contract-review');
  });
  it('credits upstream on externals instead of claiming authorship', () => {
    const ld = skillLd(external, 'en', 'desc') as unknown as Record<string, unknown>;
    expect(ld.author).toBeUndefined();
    expect(ld.isBasedOn).toBe('https://github.com/o/r');
    expect(ld.license).toBe('https://spdx.org/licenses/MIT.html');
  });
  it('builds breadcrumbs with absolute URLs and positions', () => {
    const ld = breadcrumbLd([{ name: 'Home', path: '/en' }, { name: 'Video', path: '/en/video' }]) as unknown as { itemListElement: { position: number; item: string }[] };
    expect(ld.itemListElement.map((i) => [i.position, i.item])).toEqual([[1, 'https://skills.sgomez.dev/en'], [2, 'https://skills.sgomez.dev/en/video']]);
  });
  it('exposes a search action', () => {
    expect(JSON.stringify(websiteLd('es'))).toContain('https://skills.sgomez.dev/es?q={search_term_string}');
  });
});
