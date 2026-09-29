export type IntroPart = { kind: 'text'; text: string } | { kind: 'link'; text: string; slug: string };

const LINK = /\[([^\]\n]+)\]\(([a-z0-9]+(?:--?[a-z0-9]+)*)\)/g;

/**
 * Section intros are authored as plain text with `[text](skill-slug)` links. This splits one paragraph into parts; the page
 * turns each link into an internal <Link>. Nothing else is interpreted, so authored text can never inject markup.
 */
export function parseIntro(paragraph: string): IntroPart[] {
  const parts: IntroPart[] = [];
  let last = 0;
  for (const m of paragraph.matchAll(LINK)) {
    if (m.index > last) parts.push({ kind: 'text', text: paragraph.slice(last, m.index) });
    parts.push({ kind: 'link', text: m[1]!, slug: m[2]! });
    last = m.index + m[0].length;
  }
  if (last < paragraph.length) parts.push({ kind: 'text', text: paragraph.slice(last) });
  return parts;
}

/** Plain text of a paragraph (links reduced to their text). */
export function introPlain(paragraph: string): string {
  return parseIntro(paragraph).map((p) => p.text).join('');
}

/** Slugs a paragraph links to. */
export function introSlugs(paragraph: string): string[] {
  return parseIntro(paragraph).flatMap((p) => (p.kind === 'link' ? [p.slug] : []));
}
