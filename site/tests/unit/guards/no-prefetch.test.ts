import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// On OpenNext for Cloudflare, Next's segment prefetch is answered with full RSC payloads and retried forever.
// Every <Link> must therefore opt out with prefetch={false}.
const SRC = path.resolve(import.meta.dirname, '../../../src');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return tsxFiles(p);
    return e.name.endsWith('.tsx') ? [p] : [];
  });
}

/** Comments may mention `<Link>` in prose. `https://` survives: its `//` follows a colon. */
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/** Opening `<Link …>` tags, spanning lines, with `>` inside `{…}` expressions or strings ignored. */
export function linkOpeningTags(raw: string): string[] {
  const source = stripComments(raw);
  const tags: string[] = [];
  const re = /<Link(?=[\s>/])/g;
  for (let m = re.exec(source); m; m = re.exec(source)) {
    let depth = 0;
    let quote: string | null = null;
    let i = m.index + 5;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === quote && source[i - 1] !== '\\') quote = null;
      } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === '>' && depth === 0) break;
    }
    tags.push(source.slice(m.index, i + 1));
  }
  return tags;
}

describe('no <Link> prefetches', () => {
  it('the tag scanner handles multi-line tags and arrow functions in props', () => {
    const src = `// a <Link> in a comment\n{/* and <Link> here */}<Link\n  href="https://x.dev/a"\n  onClick={() => a > b}\n  prefetch={false}\n>x</Link><Link href="/b">y</Link>`;
    const tags = linkOpeningTags(src);
    expect(tags).toHaveLength(2);
    expect(tags[0]).toContain('prefetch={false}');
    expect(tags[1]).not.toContain('prefetch={false}');
  });

  it('every <Link> under src/ passes prefetch={false}', () => {
    const offenders: string[] = [];
    let seen = 0;
    for (const file of tsxFiles(SRC)) {
      for (const tag of linkOpeningTags(readFileSync(file, 'utf8'))) {
        seen++;
        if (!/\bprefetch=\{false\}/.test(tag)) offenders.push(`${path.relative(SRC, file)}: ${tag.replace(/\s+/g, ' ').slice(0, 120)}`);
      }
    }
    expect(seen, 'the scan found no <Link> at all: is the path right?').toBeGreaterThan(5);
    expect(offenders).toEqual([]);
  });
});
