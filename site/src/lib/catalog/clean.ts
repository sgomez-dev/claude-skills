import matter from 'gray-matter';

export function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

export function cleanDescription(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
}

/**
 * Some real-world frontmatter (first-party and vendored) writes an unquoted
 * `description: ...` plain scalar that itself contains a `: ` sequence, which is
 * invalid YAML (a colon+space is a mapping-value indicator, even mid-scalar) and
 * throws in js-yaml. Rather than hand-edit content — especially vendored
 * `external/` directories, which get overwritten on next sync — quote the value
 * here before handing the frontmatter block to the YAML parser. Leaves already-quoted
 * or block-scalar (`>`, `|`) descriptions untouched.
 *
 * This is a blunt, syntactic fix (it does not understand YAML comments, so a line
 * like `description: value # note: x` would be misquoted if run through this
 * unconditionally). Callers must only use it as a fallback after a real parse
 * attempt has thrown — see `parseFrontmatter` below — never unconditionally.
 */
export function normalizeFrontmatter(raw: string): string {
  const lines = raw.split('\n');
  if (lines[0]?.trim() !== '---') return raw;
  for (let i = 1; i < lines.length; i++) {
    const hasCr = lines[i]!.endsWith('\r');
    const line = hasCr ? lines[i]!.slice(0, -1) : lines[i]!;
    if (line.trim() === '---') break;
    const m = line.match(/^description:\s*(.*)$/);
    if (!m) continue;
    const body = m[1] ?? '';
    if (body === '' || /^["'>|]/.test(body) || !/: /.test(body)) break;
    const escaped = body.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    lines[i] = `description: "${escaped}"${hasCr ? '\r' : ''}`;
    break;
  }
  return lines.join('\n');
}

/**
 * Parse frontmatter, tolerating the real-world `description: ...: ...` shape above.
 * Tries a real parse first; only on an actual YAML parse failure does it retry once
 * against `normalizeFrontmatter(raw)`. A file whose frontmatter is already valid YAML
 * (including one with a trailing ` # comment`) is never touched by the normalizer.
 *
 * Always passes an explicit (empty) options object to `gray-matter`: `gray-matter`
 * only caches results when called with no options, keyed by the exact input string —
 * and it stores that cache entry *before* parsing, so a thrown error still leaves a
 * broken, partial entry behind. A later call with the same raw string would then
 * silently return that stale, dataless object instead of throwing again. Passing `{}`
 * opts out of that cache for both the first attempt and the fallback.
 */
export function parseFrontmatter(raw: string): matter.GrayMatterFile<string> {
  try {
    return matter(raw, {});
  } catch (err) {
    if (err instanceof Error && err.name === 'YAMLException') {
      return matter(normalizeFrontmatter(raw), {});
    }
    throw err;
  }
}
