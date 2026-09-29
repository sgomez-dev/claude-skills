import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalog } from '@/lib/catalog';
import { writeGeoFiles } from '@/lib/geo/write';
import { SITE_URL } from '@/lib/site';

const FILE = path.resolve(import.meta.dirname, '../../../public/_headers');

interface Rule { pattern: string; headers: [string, string][] }

/** The `_headers` format of Workers Static Assets: a path line, then indented `Name: value` lines. */
function parse(text: string): Rule[] {
  const rules: Rule[] = [];
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) rules.push({ pattern: raw.trim(), headers: [] });
    else {
      const i = raw.indexOf(':');
      rules.at(-1)!.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    }
  }
  return rules;
}

/** The matching Cloudflare applies (miniflare's assets worker): `*` is a splat, `:name` matches one path segment. */
function matcher(pattern: string): RegExp {
  const escaped = pattern.split('*').map((s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('(?<splat>.*)');
  return new RegExp(`^${escaped.replace(/:([A-Za-z]\w*)/g, '(?<$1>[^/]+)')}$`);
}

function headersFor(rules: Rule[], pathname: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const r of rules) {
    const m = matcher(r.pattern).exec(pathname);
    if (!m) continue;
    for (const [k, v] of r.headers) {
      let value = v;
      for (const [name, captured] of Object.entries(m.groups ?? {})) value = value.replaceAll(`:${name}`, captured);
      out.set(k.toLowerCase(), out.has(k.toLowerCase()) ? `${out.get(k.toLowerCase())}, ${value}` : value);
    }
  }
  return out;
}

describe('public/_headers', () => {
  const text = fs.readFileSync(FILE, 'utf8');
  const rules = parse(text);

  it('stays inside the Workers Static Assets limits: 100 rules, 2000 characters a line', () => {
    expect(rules.length).toBeLessThanOrEqual(100);
    for (const line of text.split(/\r?\n/)) expect(line.length).toBeLessThanOrEqual(2000);
  });

  it('serves the text files as UTF-8', () => {
    for (const p of ['/llms.txt', '/llms-full.txt', '/es/llms.txt', '/es/llms-full.txt', '/humans.txt']) {
      expect(headersFor(rules, p).get('content-type'), p).toBe('text/plain; charset=utf-8');
    }
  });

  it('gives every generated .md twin UTF-8 and a canonical Link to its own HTML page', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdr-'));
    writeGeoFiles(catalog, dir);
    const twins: string[] = [];
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.md')) twins.push(`/${path.relative(dir, p).split(path.sep).join('/')}`);
      }
    };
    walk(dir);
    expect(twins.length).toBe(2 * (1 + 9 + 2 + catalog.skills.length));
    for (const t of twins) {
      const h = headersFor(rules, t);
      expect(h.get('content-type'), t).toBe('text/markdown; charset=utf-8');
      expect(h.get('link'), t).toBe(`<${SITE_URL}${t.slice(0, -'.md'.length)}>; rel="canonical"`);
    }
  }, 60_000);

  it('adds no canonical Link to the HTML pages', () => {
    for (const p of ['/es/s/legal--contract-review', '/en', '/en/business', '/en/methodology']) expect(headersFor(rules, p).has('link'), p).toBe(false);
  });
});
