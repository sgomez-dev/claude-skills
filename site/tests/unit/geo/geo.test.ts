import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { catalog } from '@/lib/catalog';
import type { Catalog, Skill } from '@/lib/catalog/types';
import { humansTxt } from '@/lib/geo/humans';
import { LLMS_MAX_BYTES, llmsFullTxt, llmsTxt } from '@/lib/geo/llms';
import { homeMarkdown, methodologyMarkdown, sectionMarkdown, skillMarkdown } from '@/lib/geo/markdown';
import { writeGeoFiles } from '@/lib/geo/write';
import { AI_CRAWLERS, CONTENT_SIGNAL, robotsTxt } from '@/lib/seo/robots';
import { buildSitemap } from '@/lib/seo/sitemap';

const cmd = catalog.skills.find((s) => s.slug === 'legal--contract-review')!;
const ext = catalog.skills.find((s) => s.kind === 'external')!;

/** A copy of the catalog in which one skill has authored copy (the real one has none yet). */
function withCopy(slug: string, es: Record<string, unknown>, en: Record<string, unknown>): { catalog: Catalog; skill: Skill } {
  const skills = catalog.skills.map((s) => (s.slug === slug ? { ...s, text: { es: { ...s.text.es, ...es }, en: { ...s.text.en, ...en } } } : s)) as Skill[];
  return { catalog: { ...catalog, skills }, skill: skills.find((s) => s.slug === slug)! };
}

describe('markdown twins', () => {
  it('answers first and carries install, permissions and source', () => {
    const md = skillMarkdown(cmd, 'en');
    expect(md.startsWith('# /legal--contract-review\n') || md.startsWith('# Contract review (/legal--contract-review)\n')).toBe(true);
    expect(md).toContain('install.sh | bash');
    expect(md).toContain('## Permissions');
    expect(md).toContain('https://skills.sgomez.dev/en/s/legal--contract-review');
    expect(md).toContain('Santiago Gómez de la Torre');
    expect(md).toContain('https://skills.sgomez.dev/en/methodology.md');
  });
  it('starts with the human title and slug, then the summary, once a title is authored', () => {
    const { skill } = withCopy('legal--contract-review', {}, { title: 'Contract review', summary: 'Reviews a contract draft and returns risky clauses, missing terms and one-sided duties, quoting each clause.' });
    const md = skillMarkdown(skill, 'en');
    expect(md.split('\n')[0]).toBe('# Contract review (/legal--contract-review)');
    expect(md).toContain('Reviews a contract draft and returns risky clauses');
    // The author's own text stays, under its own heading.
    expect(md).toContain("## Author's description");
    expect(md).toContain(skill.text.en.description);
  });
  it('renders the A14 blocks when present, and only then', () => {
    expect(skillMarkdown(cmd, 'en')).not.toContain('## Use it when');
    const { skill } = withCopy('legal--contract-review', {}, { useWhen: ['You have a draft to check'], notFor: ['Legal advice'], output: 'A report.', faq: [{ q: 'Does it replace a lawyer?', a: 'No.' }] });
    const md = skillMarkdown(skill, 'en');
    for (const h of ['## Use it when', '## Not for', '## What you get', '## Questions about this skill', '### Does it replace a lawyer?']) expect(md).toContain(h);
  });
  it('credits upstream for externals', () => {
    const md = skillMarkdown(ext, 'es');
    expect(md).toContain(ext.kind === 'external' ? ext.upstream.repo : '');
    expect(md).not.toContain('## Permisos');
  });
  it('lists pipeline mates under "Pairs well with" and the recipe itself', () => {
    const md = skillMarkdown(catalog.skills.find((s) => s.slug === 'sales--cold-outreach')!, 'en', catalog);
    expect(md).toContain('## Pairs well with');
    expect(md).toContain('/sales--icp-builder');
    expect(md).toContain('/pipeline--sales-outbound');
  });
  it('the section twin uses the authored title, description and intro (links become .md links)', () => {
    const md = sectionMarkdown(catalog, 'business', 'en');
    expect(md).toContain('## Skills (');
    expect(md).toContain('https://skills.sgomez.dev/en/business');
  });
  it('the home and methodology twins state the catalog figures', () => {
    const home = homeMarkdown(catalog, 'en');
    expect(home).toContain(`${catalog.counts.total} skills`);
    expect(home).toContain('### How much does it cost?');
    const m = methodologyMarkdown(catalog, 'es');
    expect(m.startsWith('# Cómo elegimos y revisamos las skills')).toBe(true);
    expect(m).toContain('Santiago Gómez de la Torre');
  });
});

describe('llms.txt (llmstxt.org)', () => {
  for (const lang of ['en', 'es'] as const) {
    const txt = llmsTxt(catalog, lang);
    const lines = txt.split('\n');

    it(`${lang}: H1, then a blockquote, then H2 sections with link lists, and "## Optional" last`, () => {
      expect(lines[0]).toBe('# Claude Skills');
      expect(lines[1]).toBe('');
      expect(lines[2]!.startsWith('> ')).toBe(true);
      const h2 = lines.filter((l) => l.startsWith('## '));
      expect(h2).toHaveLength(9 + 1);
      expect(h2.at(-1)).toBe('## Optional');
      // Nothing between an H2 and the next one except link bullets and blank lines.
      let inSection = false;
      for (const l of lines) {
        if (l.startsWith('## ')) inSection = true;
        else if (inSection && l !== '') expect(l, l).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)/);
      }
    });
    it(`${lang}: lists every skill exactly once with a .md link`, () => {
      for (const s of catalog.skills) {
        const needle = `(https://skills.sgomez.dev/${lang}/s/${s.slug}.md)`;
        expect(txt.split(needle).length - 1, s.slug).toBe(1);
      }
    });
    it(`${lang}: stays under 100 KB and names the figures, the author and the methodology`, () => {
      expect(Buffer.byteLength(txt, 'utf8')).toBeLessThan(LLMS_MAX_BYTES);
      expect(lines[2]).toContain(`${catalog.counts.total} skills`);
      expect(lines[2]).toContain('Santiago Gómez de la Torre');
      expect(txt).toContain(`https://skills.sgomez.dev/${lang}/methodology.md`);
    });
    it(`${lang}: no router phrasing leaks into the index once summaries exist`, () => {
      const { catalog: c } = withCopy('legal--contract-review', { summary: 'Revisa un borrador de contrato y devuelve las cláusulas de riesgo, los términos que faltan y las obligaciones.' }, { summary: 'Reviews a contract draft and returns risky clauses, missing terms and one-sided duties, quoting each one.' });
      const line = llmsTxt(c, lang).split('\n').find((l) => l.includes('/s/legal--contract-review.md'))!;
      expect(line).not.toMatch(/use when|triggers? include/i);
    });
  }

  it('shrinks summaries, never drops skills, when the index would pass 100 KB', () => {
    const long = 'palabra '.repeat(30).trim().slice(0, 160);
    const skills = catalog.skills.map((s) => ({ ...s, text: { es: { ...s.text.es, summary: long }, en: { ...s.text.en, summary: long } } })) as Skill[];
    const txt = llmsTxt({ ...catalog, skills }, 'es');
    expect(Buffer.byteLength(txt, 'utf8')).toBeLessThan(LLMS_MAX_BYTES);
    for (const s of catalog.skills) expect(txt).toContain(`/es/s/${s.slug}.md)`);
  });
  it('llms-full.txt carries the index and every skill twin', () => {
    expect(llmsFullTxt(catalog, 'en').startsWith(llmsTxt(catalog, 'en'))).toBe(true);
  });
});

describe('writeGeoFiles', () => {
  it('writes one twin per page and language plus llms files', { timeout: 60_000 }, () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-'));
    writeGeoFiles(catalog, dir);
    for (const lang of ['es', 'en']) {
      expect(fs.existsSync(path.join(dir, `${lang}.md`))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'credits.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'methodology.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'video.md'))).toBe(true);
      expect(fs.readdirSync(path.join(dir, lang, 's'))).toHaveLength(catalog.skills.length);
    }
    for (const f of ['llms.txt', 'llms-full.txt', 'es/llms.txt', 'es/llms-full.txt', 'humans.txt']) expect(fs.existsSync(path.join(dir, f)), f).toBe(true);
  });
  it('two runs over the same catalog write identical files, whatever the build time', () => {
    const a = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-a-'));
    const b = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-b-'));
    writeGeoFiles(catalog, a);
    writeGeoFiles({ ...catalog, generatedAt: '2031-01-01T00:00:00.000Z' }, b);
    for (const f of ['humans.txt', 'llms.txt', 'es/llms.txt', 'en.md', 'es/business.md', 'es/methodology.md']) {
      expect(fs.readFileSync(path.join(b, f), 'utf8'), f).toBe(fs.readFileSync(path.join(a, f), 'utf8'));
    }
  }, 60_000);
});

describe('humans.txt', () => {
  it('credits the author and each upstream owner exactly once', () => {
    const txt = humansTxt(catalog);
    expect(txt).toContain('Author: Santiago Gómez de la Torre');
    const owners = new Set(catalog.skills.flatMap((s) => (s.kind === 'external' ? [s.upstream.owner] : [])));
    expect(owners.size).toBeGreaterThan(0);
    for (const o of owners) expect(txt.split(`  Name: ${o}\n`).length - 1, o).toBe(1);
    expect(txt).toContain(`Skills: ${catalog.counts.total}`);
  });
  it('lists the author profiles under TEAM', () => {
    const team = humansTxt(catalog).split('/* THANKS */')[0]!;
    expect(team).toContain('  Site: https://sgomez.dev');
    expect(team).toContain('  GitHub: https://github.com/sgomez-dev');
    expect(team).toContain('  LinkedIn: https://www.linkedin.com/in/sgomez-dev/');
    expect(team).toContain('  Instagram: https://www.instagram.com/santigt1503/');
  });
});

describe('sitemap', () => {
  const entries = sitemap();
  it('lists every page in both languages with es, en and x-default alternates', () => {
    expect(entries).toHaveLength(2 * (1 + 9 + 1 + 1 + catalog.skills.length));
    for (const e of entries) expect(Object.keys(e.alternates!.languages!).sort()).toEqual(['en', 'es', 'x-default']);
    expect(entries.map((e) => e.url)).toContain('https://skills.sgomez.dev/en/methodology');
  });
  it('lastmod is a real content date, never the build time', () => {
    const generatedAt = Date.parse(catalog.generatedAt);
    const dates = entries.flatMap((e) => (e.lastModified ? [Date.parse(String(e.lastModified))] : []));
    expect(dates.length).toBeGreaterThan(0);
    for (const d of dates) expect(d).not.toBe(generatedAt);
    const home = entries.find((e) => e.url === 'https://skills.sgomez.dev/en')!;
    const newest = Math.max(...catalog.skills.map((s) => Date.parse(s.updatedAt!)));
    expect(Date.parse(String(home.lastModified))).toBe(newest);
  });
});

describe('sitemap determinism', () => {
  it('two builds of the same catalog give a byte-identical sitemap, whatever the build time', () => {
    const a = JSON.stringify(buildSitemap(catalog));
    const b = JSON.stringify(buildSitemap({ ...catalog, generatedAt: '2031-01-01T00:00:00.000Z' }));
    expect(b).toBe(a);
    expect(a).not.toContain(catalog.generatedAt);
  });
});

describe('robots.txt', () => {
  const txt = robotsTxt();
  const groups = txt.trim().split('\n\n');

  it('carries the content signal in every group, and no Host line', () => {
    expect(CONTENT_SIGNAL).toBe('search=yes, ai-input=yes, ai-train=yes');
    expect(groups.filter((g) => g.includes('User-Agent')).length).toBe(2);
    for (const g of groups.filter((x) => x.includes('User-Agent'))) expect(g).toContain(`Content-Signal: ${CONTENT_SIGNAL}`);
    expect(txt).not.toMatch(/^Host:/im);
  });
  it('explicitly allows the AI crawlers, including the ones added for launch', () => {
    const named = groups.find((g) => g.includes('User-Agent: GPTBot'))!;
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'Bingbot']) {
      expect(AI_CRAWLERS).toContain(bot);
      expect(named, bot).toContain(`User-Agent: ${bot}\n`);
    }
    expect(named).toContain('Allow: /');
    expect(groups[0]).toContain('User-Agent: *\nAllow: /');
  });
  it('points at the sitemap', () => {
    expect(txt).toContain('Sitemap: https://skills.sgomez.dev/sitemap.xml');
  });
});
