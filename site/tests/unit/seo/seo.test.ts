import { describe, expect, it } from 'vitest';
import { authorLd, breadcrumbLd, graph, serializeJsonLd, skillLd, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { skillPageTitle, TITLE_BUDGET } from '@/lib/seo/titles';
import { truncate } from '@/lib/seo/truncate';
import { AUTHOR } from '@/lib/site';
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
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  const hostile = { description: `</script><script>alert(1)</script> & <b>x</b> ${LS} ${PS} "quoted" \\ back` };

  it('cannot close the script tag', () => {
    const out = serializeJsonLd({ description: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).description).toBe('</script><script>alert(1)</script>');
  });
  it('emits none of < > & U+2028 U+2029 and round-trips to the original data', () => {
    const out = serializeJsonLd(hostile);
    for (const ch of ['<', '>', '&', LS, PS]) expect(out.includes(ch), `contains U+${ch.charCodeAt(0).toString(16)}`).toBe(false);
    expect(JSON.parse(out)).toEqual(hostile);
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
  it('uses the whole title, without the layout template, when asked; og:title matches', () => {
    const m = pageMetadata({ lang: 'en', path: '/s/x', title: 'Whole title', description: 'D', absoluteTitle: true });
    expect(m.title).toEqual({ absolute: 'Whole title' });
    expect(m.openGraph?.title).toBe('Whole title');
    expect(pageMetadata({ lang: 'en', path: '/x', title: 'Plain', description: 'D' }).title).toBe('Plain');
  });
});

describe('pageMetadata og:image', () => {
  it('names the page image explicitly, with the alt from the dictionaries and a URL that changes with the content', () => {
    const a = pageMetadata({ lang: 'es', path: '/s/x', title: 'T', description: 'D', image: { alt: 'Alt en español', seed: 'one' } });
    const b = pageMetadata({ lang: 'es', path: '/s/x', title: 'T', description: 'D', image: { alt: 'Alt en español', seed: 'two' } });
    const img = (m: typeof a) => (m.openGraph as { images: { url: string; alt: string; width: number; height: number }[] }).images[0]!;
    expect(img(a)).toMatchObject({ alt: 'Alt en español', width: 1200, height: 630 });
    expect(img(a).url).toMatch(/^https:\/\/skills\.sgomez\.dev\/es\/s\/x\/opengraph-image\?v=[0-9a-z]+$/);
    expect(img(a).url).not.toBe(img(b).url);
    expect(img(a).url).toBe(img(pageMetadata({ lang: 'es', path: '/s/x', title: 'T', description: 'D', image: { alt: 'x', seed: 'one' } })).url);
    expect((a.twitter as { images: { alt: string }[] }).images[0]!.alt).toBe('Alt en español');
  });
  it('adds no image when none is given', () => {
    expect(pageMetadata({ lang: 'en', path: '/credits', title: 'T', description: 'D' }).openGraph).not.toHaveProperty('images');
  });
});

describe('skillPageTitle', () => {
  it('formats "{title}: {suffix} (/{slug})" in both languages', () => {
    expect(skillPageTitle('Claude Code skill', 'Contract review', 'legal--contract-review')).toBe('Contract review: Claude Code skill (/legal--contract-review)');
    expect(skillPageTitle('skill de Claude Code', 'Cortar silencios', 'cut-silences')).toBe('Cortar silencios: skill de Claude Code (/cut-silences)');
  });
  it('drops the slug when the title would pass 60 characters', () => {
    const t = skillPageTitle('skill de Claude Code', 'Subtítulos karaoke para vídeo', 'embedded-captions');
    expect(t).toBe('Subtítulos karaoke para vídeo: skill de Claude Code');
    expect(t.length).toBeLessThanOrEqual(TITLE_BUDGET);
  });
  it('names a skill without a title by its slug', () => {
    expect(skillPageTitle('Claude Code skill', null, 'shorts')).toBe('/shorts: Claude Code skill');
  });
});

const command = {
  kind: 'command', slug: 'legal--contract-review', name: 'contract-review', section: 'business', updatedAt: '2026-07-10T13:21:22+02:00', sourcePath: 'skills/legal/contract-review.md',
} as CommandSkill;
const external = {
  kind: 'external', slug: 'ffmpeg', name: 'ffmpeg', section: 'video', updatedAt: null, license: 'MIT',
  upstream: { url: 'https://github.com/o/r', owner: 'o', repo: 'o/r', commit: 'abc', path: 'x' },
} as ExternalSkill;

describe('JSON-LD graph', () => {
  const ld = (o: unknown) => o as Record<string, unknown>;

  it('credits the author on commands by reference to the Person node', () => {
    const n = ld(skillLd(command, 'es', { name: 'Revisión de contratos', description: 'desc' }));
    expect(n['@type']).toBe('SoftwareApplication');
    expect(n['@id']).toBe('https://skills.sgomez.dev/es/s/legal--contract-review#skill');
    expect(n.name).toBe('Revisión de contratos');
    expect(n.alternateName).toBe('/legal--contract-review');
    expect(n.author).toEqual({ '@id': 'https://skills.sgomez.dev/#author' });
    expect(n.publisher).toEqual({ '@id': 'https://skills.sgomez.dev/#author' });
    expect(n.url).toBe('https://skills.sgomez.dev/es/s/legal--contract-review');
    expect(n.softwareRequirements).toBe('Claude Code');
    expect(n.applicationCategory).toBe('BusinessApplication');
    expect(n.dateModified).toBe('2026-07-10T13:21:22+02:00');
  });
  it('credits upstream on externals instead of claiming authorship', () => {
    const n = ld(skillLd(external, 'en', { name: 'ffmpeg', description: 'desc' }));
    expect(n.author).toEqual({ '@type': 'Person', name: 'o', url: 'https://github.com/o' });
    expect(n.publisher).toBeUndefined();
    expect(n.isBasedOn).toMatchObject({ '@type': 'SoftwareSourceCode', codeRepository: 'https://github.com/o/r' });
    expect(n.license).toBe('https://spdx.org/licenses/MIT.html');
    expect(n.dateModified).toBeUndefined();
  });
  it('names organisation owners as Organization and people as Person', () => {
    const org = { ...external, upstream: { ...external.upstream, owner: 'vercel-labs' } } as ExternalSkill;
    expect(ld(skillLd(org, 'en', { name: 'n', description: 'd' })).author).toEqual({ '@type': 'Organization', name: 'vercel-labs', url: 'https://github.com/vercel-labs' });
    expect(ld(skillLd(external, 'en', { name: 'n', description: 'd' })).author).toMatchObject({ '@type': 'Person' });
  });
  it('gives installUrl (the install script for commands, the upstream repo for externals) and keywords only when authored', () => {
    expect(ld(skillLd(command, 'en', { name: 'n', description: 'd' })).installUrl).toBe('https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.sh');
    expect(ld(skillLd(external, 'en', { name: 'n', description: 'd' })).installUrl).toBe('https://github.com/o/r');
    expect(ld(skillLd(command, 'en', { name: 'n', description: 'd' }))).not.toHaveProperty('keywords');
    const kw = { ...command, text: { en: { keywords: ['contract review', 'clauses', 'legal'] } } } as unknown as CommandSkill;
    expect(ld(skillLd(kw, 'en', { name: 'n', description: 'd' })).keywords).toEqual(['contract review', 'clauses', 'legal']);
  });
  it('never points sameAs at the source file and never invents ratings', () => {
    for (const s of [command, external]) {
      const json = JSON.stringify(skillLd(s, 'en', { name: 'n', description: 'd' }));
      expect(json).not.toContain('sameAs');
      expect(json).not.toMatch(/aggregateRating|"review"|ratingValue/);
    }
  });
  it('the Person carries every profile from AUTHOR.sameAs, in order', () => {
    const p = ld(authorLd());
    expect(p['@id']).toBe('https://skills.sgomez.dev/#author');
    expect(p.sameAs).toEqual([...AUTHOR.sameAs]);
    expect(p.sameAs).toEqual([
      'https://sgomez.dev', 'https://github.com/sgomez-dev', 'https://www.linkedin.com/in/sgomez-dev/', 'https://www.instagram.com/santigt1503/',
    ]);
    expect(p.knowsAbout).toEqual(['Claude Code', 'Agent Skills']);
  });
  it('wraps nodes in one @graph and links the page to its breadcrumb and main entity', () => {
    const g = graph([websiteLd('es'), authorLd(), webPageLd({ lang: 'es', path: '/es/s/x', name: 'N', description: 'D', dateModified: '2026-07-10T13:21:22+02:00', mainEntity: 'https://skills.sgomez.dev/es/s/x#skill' })]);
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(3);
    const page = ld(g['@graph'][2]);
    expect(page.isPartOf).toEqual({ '@id': 'https://skills.sgomez.dev/es#website' });
    expect(page.breadcrumb).toEqual({ '@id': 'https://skills.sgomez.dev/es/s/x#breadcrumb' });
    expect(page.mainEntity).toEqual({ '@id': 'https://skills.sgomez.dev/es/s/x#skill' });
    expect(page.dateModified).toBe('2026-07-10T13:21:22+02:00');
  });
  it('builds breadcrumbs with absolute URLs and positions', () => {
    const b = breadcrumbLd('https://skills.sgomez.dev/en/video', [{ name: 'Home', path: '/en' }, { name: 'Video', path: '/en/video' }]) as { '@id': string; itemListElement: { position: number; item: string }[] };
    expect(b['@id']).toBe('https://skills.sgomez.dev/en/video#breadcrumb');
    expect(b.itemListElement.map((i) => [i.position, i.item])).toEqual([[1, 'https://skills.sgomez.dev/en'], [2, 'https://skills.sgomez.dev/en/video']]);
  });
  it('exposes a search action', () => {
    expect(JSON.stringify(websiteLd('es'))).toContain('https://skills.sgomez.dev/es?q={search_term_string}');
  });
});
