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
