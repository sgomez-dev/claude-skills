import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { humansTxt } from '@/lib/geo/humans';
import { llmsTxt } from '@/lib/geo/llms';
import { skillMarkdown } from '@/lib/geo/markdown';
import { writeGeoFiles } from '@/lib/geo/write';
import { catalog } from '@/lib/catalog';

const cmd = catalog.skills.find((s) => s.slug === 'legal--contract-review')!;
const ext = catalog.skills.find((s) => s.kind === 'external')!;

describe('markdown twins', () => {
  it('answers first and carries install, permissions and source', () => {
    const md = skillMarkdown(cmd, 'en');
    expect(md.startsWith('# /legal--contract-review\n')).toBe(true);
    expect(md).toContain(cmd.text.en.description);
    expect(md).toContain('install.sh | bash');
    expect(md).toContain('## Permissions');
    expect(md).toContain('https://skills.sgomez.dev/en/s/legal--contract-review');
    expect(md).toContain('Santiago Gómez de la Torre');
  });
  it('credits upstream for externals', () => {
    const md = skillMarkdown(ext, 'es');
    expect(md).toContain(ext.kind === 'external' ? ext.upstream.repo : '');
    expect(md).not.toContain('## Permisos');
  });
});

describe('llms.txt', () => {
  it('lists every skill exactly once with a .md link', () => {
    const txt = llmsTxt(catalog, 'en');
    for (const s of catalog.skills) {
      const needle = `(https://skills.sgomez.dev/en/s/${s.slug}.md)`;
      expect(txt.split(needle).length - 1, s.slug).toBe(1);
    }
    expect(txt.startsWith('# Claude Skills\n\n> ')).toBe(true);
  });
});

describe('writeGeoFiles', () => {
  it('writes one twin per page and language plus llms files', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-'));
    writeGeoFiles(catalog, dir);
    for (const lang of ['es', 'en']) {
      expect(fs.existsSync(path.join(dir, `${lang}.md`))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'credits.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, lang, 'video.md'))).toBe(true);
      expect(fs.readdirSync(path.join(dir, lang, 's'))).toHaveLength(catalog.skills.length);
    }
    for (const f of ['llms.txt', 'llms-full.txt', 'es/llms.txt', 'es/llms-full.txt', 'humans.txt']) expect(fs.existsSync(path.join(dir, f)), f).toBe(true);
  });
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
});

describe('sitemap and robots', () => {
  it('lists every page in both languages with hreflang alternates', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(2 * (1 + 9 + 1 + catalog.skills.length));
    expect(entries[0]!.alternates?.languages).toHaveProperty('es');
  });
  it('explicitly allows AI crawlers and points at the sitemap', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
      expect(rules.some((x) => [x.userAgent].flat().includes(bot) && x.allow === '/'), bot).toBe(true);
    }
    expect(r.sitemap).toBe('https://skills.sgomez.dev/sitemap.xml');
  });
});
