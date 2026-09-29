import { describe, expect, it } from 'vitest';
import { SECTIONS } from '@/content/sections';
import { catalog } from '@/lib/catalog';
import { displayName, humanTitle, skillLabel, skillSummary, SUMMARY_LIMIT } from '@/lib/catalog/copy';
import { catalogUpdatedAt, isoDay, latestDate, sectionUpdatedAt } from '@/lib/catalog/dates';
import { catalogFigures } from '@/lib/catalog/figures';
import { pairedSkills, pipelinesOf, relatedSkills } from '@/lib/catalog/related';
import type { Skill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import { LANGS } from '@/lib/i18n/languages';
import { introPlain, introSlugs, parseIntro } from '@/lib/intro';

const withText = (s: Skill, lang: 'es' | 'en', patch: Record<string, unknown>): Skill => ({ ...s, text: { ...s.text, [lang]: { ...s.text[lang], ...patch } } }) as Skill;
const sample = catalog.skills.find((s) => s.slug === 'legal--contract-review')!;

describe('figures: every stated number comes from the catalog', () => {
  const f = catalogFigures(catalog);

  it('matches the catalog counts and licenses', () => {
    expect(f.total).toBe(catalog.skills.length);
    expect(f.commands).toBe(catalog.skills.filter((s) => s.kind === 'command').length);
    expect(f.external).toBe(catalog.skills.filter((s) => s.kind === 'external').length);
    expect(f.commands + f.external).toBe(f.total);
    expect(f.repos).toBe(new Set(catalog.skills.flatMap((s) => (s.kind === 'external' ? [s.upstream.repo] : []))).size);
    expect(f.licenses.reduce((n, l) => n + l.count, 0)).toBe(f.external);
    for (const l of f.licenses) expect(catalog.skills.filter((s) => s.kind === 'external' && s.license === l.id)).toHaveLength(l.count);
  });

  for (const lang of LANGS) {
    const d = getDictionary(lang);
    it(`${lang}: the cost answer states the real counts and license breakdown`, () => {
      const cost = d.home.faq(f).find((q) => /cost|cuesta/i.test(q.q))!.a;
      expect(cost).toContain(String(f.commands));
      expect(cost).toContain(String(f.external));
      for (const l of f.licenses) expect(cost).toContain(`${l.count} ${l.id}`);
      expect(cost).toMatch(/MIT/);
    });
    it(`${lang}: the meta description says how many declare permissions, not that everything does`, () => {
      const desc = d.meta.description(f.total, f.commands);
      expect(desc).toContain(String(f.total));
      expect(desc).toContain(String(f.commands));
      expect(desc.length).toBeLessThanOrEqual(160);
      expect(desc).not.toMatch(/every permission|todos sus permisos/i);
    });
    it(`${lang}: the figures line and the title carry the counts`, () => {
      expect(d.home.figures.line(f)).toContain(`${f.total}`);
      expect(d.home.figures.line(f)).toContain(`${f.external}`);
      expect(d.home.figures.line(f)).toContain(`${f.repos}`);
      expect(d.meta.title(f.total)).toContain(String(f.total));
      expect(d.meta.title(f.total).length).toBeLessThanOrEqual(60);
    });
    it(`${lang}: no copy claims what is false`, () => {
      const all = JSON.stringify([d.home.faq(f), d.footer, d.meta.description(1, 1), d.methodology.sections(f)]);
      expect(all).not.toMatch(/MIT licensed|every permission|todos sus permisos/i);
    });
  }

  it('the methodology page names the real numbers', () => {
    const text = JSON.stringify(getDictionary('en').methodology.sections(f));
    expect(text).toContain(`${f.commands}`);
    expect(text).toContain(`${f.external}`);
    expect(text).toContain(`${f.repos}`);
  });
});

describe('dates', () => {
  it('picks the newest instant even across UTC offsets', () => {
    expect(latestDate(['2026-07-10T13:21:22+02:00', '2026-07-10T11:30:00Z', null])).toBe('2026-07-10T11:30:00Z'); // a string compare would pick the +02:00 one
    expect(latestDate([null, undefined])).toBeNull();
  });
  it('section and catalog dates are the max of their skills, not the build time', () => {
    for (const s of SECTIONS) {
      const max = Math.max(...catalog.skills.filter((k) => k.section === s.id).map((k) => Date.parse(k.updatedAt!)));
      expect(Date.parse(sectionUpdatedAt(catalog, s.id)!)).toBe(max);
    }
    expect(Date.parse(catalogUpdatedAt(catalog)!)).toBe(Math.max(...catalog.skills.map((k) => Date.parse(k.updatedAt!))));
    expect(catalogUpdatedAt({ ...catalog, generatedAt: '2040-01-01T00:00:00Z' })).toBe(catalogUpdatedAt(catalog));
  });
  it('isoDay is the UTC day, matching the UTC date shown to readers', () => {
    expect(isoDay('2026-07-10T23:30:00-05:00')).toBe('2026-07-11');
    expect(isoDay('2026-07-10T01:00:00+02:00')).toBe('2026-07-09');
  });
});

describe('copy fallbacks', () => {
  it('title falls back to the slug, summary to the description cut at a word boundary', () => {
    const long = { ...sample.text.en, description: 'word '.repeat(80).trim() };
    const s = { ...sample, text: { ...sample.text, en: long } } as Skill;
    expect(humanTitle(s, 'en')).toBeNull();
    expect(displayName(s, 'en')).toBe('legal--contract-review');
    expect(skillLabel(s, 'en')).toBe('/legal--contract-review');
    const summary = skillSummary(s, 'en');
    expect(summary.authored).toBe(false);
    expect(summary.text.length).toBeLessThanOrEqual(SUMMARY_LIMIT);
    expect(summary.text.endsWith('…')).toBe(true);
    expect(summary.text).not.toMatch(/\swor…$|\s…$/);
  });
  it('authored title and summary win, and the label carries both title and slug', () => {
    const s = withText(withText(sample, 'en', { title: 'Contract review', summary: 'Reviews a contract.' }), 'es', { title: 'Revisión de contratos' });
    expect(displayName(s, 'en')).toBe('Contract review');
    expect(skillLabel(s, 'es')).toBe('Revisión de contratos (/legal--contract-review)');
    expect(skillSummary(s, 'en')).toEqual({ text: 'Reviews a contract.', authored: true });
  });
  it('marks a fallback summary in English on a page that is not translated yet', () => {
    const s = withText(sample, 'es', { translated: false });
    expect(skillSummary(s, 'es').lang).toBe('en');
    expect(skillSummary(sample, 'es').lang).toBeUndefined();
  });
});

describe('internal links between skills', () => {
  const slugs = new Set(catalog.skills.map((s) => s.slug));

  it('every skill is listed by at least 3 other skills of its section (ring of related links)', () => {
    const inbound = new Map<string, number>();
    for (const s of catalog.skills) for (const r of relatedSkills(catalog, s)) inbound.set(r.slug, (inbound.get(r.slug) ?? 0) + 1);
    const lowest = [...slugs].map((slug) => [slug, inbound.get(slug) ?? 0] as const).sort((a, b) => a[1] - b[1])[0]!;
    expect(lowest[1], lowest[0]).toBeGreaterThanOrEqual(3);
  });
  it('related skills exclude the skill itself, stay in the section and are deterministic', () => {
    for (const s of catalog.skills.slice(0, 60)) {
      const a = relatedSkills(catalog, s);
      expect(a.map((x) => x.slug)).toEqual(relatedSkills(catalog, s).map((x) => x.slug));
      expect(a.length).toBeGreaterThan(0);
      for (const r of a) {
        expect(r.slug).not.toBe(s.slug);
        expect(r.section).toBe(s.section);
      }
    }
  });
  it('related skips what "pairs well with" already shows', () => {
    const s = catalog.skills.find((x) => x.slug === 'code-quality--dry')!;
    const paired = pairedSkills(catalog, s);
    expect(paired.length).toBeGreaterThan(0);
    const related = relatedSkills(catalog, s, 6, new Set(paired.map((p) => p.slug)));
    for (const r of related) expect(paired.map((p) => p.slug)).not.toContain(r.slug);
  });
  it('pairs come from shared recipes, other sections first, and only from public skills', () => {
    const s = catalog.skills.find((x) => x.slug === 'sales--cold-outreach')!;
    expect(pipelinesOf(catalog, s.slug).map((p) => p.slug)).toEqual(['sales-outbound']);
    const pairs = pairedSkills(catalog, s);
    expect(pairs.map((p) => p.slug)).toContain('sales--icp-builder');
    for (const p of pairs) expect(slugs.has(p.slug)).toBe(true);
    const otherFirst = pairs.map((p) => p.section !== s.section);
    expect(otherFirst).toEqual([...otherFirst].sort((a, b) => Number(b) - Number(a)));
    expect(pairedSkills(catalog, catalog.skills.find((x) => pipelinesOf(catalog, x.slug).length === 0)!)).toEqual([]);
  });
});

describe('section intro links', () => {
  it('splits text and [text](slug) links, and interprets nothing else', () => {
    expect(parseIntro('Start with [contract review](legal--contract-review) and <b>x</b>.')).toEqual([
      { kind: 'text', text: 'Start with ' },
      { kind: 'link', text: 'contract review', slug: 'legal--contract-review' },
      { kind: 'text', text: ' and <b>x</b>.' },
    ]);
    expect(introPlain('a [b](c-d) e')).toBe('a b e');
    expect(introSlugs('[x](a) [y](b--c)')).toEqual(['a', 'b--c']);
    expect(parseIntro('[javascript](javascript:alert(1))')).toEqual([{ kind: 'text', text: '[javascript](javascript:alert(1))' }]);
  });
  it('every link in an authored intro points at a real skill; every authored field is well-formed', () => {
    const slugs = new Set(catalog.skills.map((s) => s.slug));
    for (const s of SECTIONS) {
      for (const lang of LANGS) {
        for (const para of s.intro?.[lang] ?? []) for (const slug of introSlugs(para)) expect(slugs.has(slug), `${s.id}/${lang}: ${slug}`).toBe(true);
        const desc = s.description?.[lang];
        if (desc) expect(desc.length, `${s.id}/${lang} description`).toBeLessThanOrEqual(160);
      }
    }
  });
});
