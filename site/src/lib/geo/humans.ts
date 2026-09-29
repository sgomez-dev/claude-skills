import type { Catalog, ExternalSkill } from '@/lib/catalog/types';
import { AUTHOR } from '@/lib/site';

/** humanstxt.org: credits the author and every upstream owner whose skills are vendored. */
export function humansTxt(catalog: Catalog): string {
  const owners = [...new Set(catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external').map((s) => s.upstream.owner))].sort((a, b) => a.localeCompare(b));
  return [
    '/* TEAM */',
    `  Author: ${AUTHOR.name}`,
    `  Site: ${AUTHOR.url}`,
    '  GitHub: https://github.com/sgomez-dev',
    '',
    '/* THANKS */',
    ...owners.flatMap((o) => [`  Name: ${o}`, `  GitHub: https://github.com/${o}`, '']),
    '/* SITE */',
    `  Last update: ${catalog.generatedAt.slice(0, 10).replaceAll('-', '/')}`,
    '  Language: Español, English',
    '  Doctype: HTML5',
    '  Standards: HTML5, CSS3, WAI-ARIA, schema.org',
    '  Components: Next.js, React, Tailwind CSS, Motion, Fuse.js',
    '  Software: Claude Code',
    `  Skills: ${catalog.counts.total}`,
    '',
  ].join('\n');
}
