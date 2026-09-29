import { catalogUpdatedAt } from '@/lib/catalog/dates';
import type { Catalog, ExternalSkill } from '@/lib/catalog/types';
import { AUTHOR } from '@/lib/site';

const PROFILE_LABELS: Record<string, string> = { 'github.com': 'GitHub', 'linkedin.com': 'LinkedIn', 'instagram.com': 'Instagram' };

/** "https://www.linkedin.com/in/x/" -> "LinkedIn". Unknown hosts are named by their domain. */
function profileLabel(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return PROFILE_LABELS[host] ?? host;
}

/** humanstxt.org: credits the author and every upstream owner whose skills are vendored. */
export function humansTxt(catalog: Catalog): string {
  const owners = [...new Set(catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external').map((s) => s.upstream.owner))].sort((a, b) => a.localeCompare(b));
  const updated = catalogUpdatedAt(catalog);
  return [
    '/* TEAM */',
    `  Author: ${AUTHOR.name}`,
    `  Site: ${AUTHOR.url}`,
    // The author's own site is the `Site:` line above; every other profile in `sameAs` gets its own.
    ...AUTHOR.sameAs.filter((u) => u !== AUTHOR.url).map((u) => `  ${profileLabel(u)}: ${u}`),
    '',
    '/* THANKS */',
    ...owners.flatMap((o) => [`  Name: ${o}`, `  GitHub: https://github.com/${o}`, '']),
    '/* SITE */',
    // The newest skill change, not the build time: the file is identical between builds of the same catalog.
    ...(updated ? [`  Last update: ${updated.slice(0, 10).replaceAll('-', '/')}`] : []),
    '  Language: Español, English',
    '  Doctype: HTML5',
    '  Standards: HTML5, CSS3, WAI-ARIA, schema.org',
    '  Components: Next.js, React, Tailwind CSS, Motion, Fuse.js',
    '  Software: Claude Code',
    `  Skills: ${catalog.counts.total}`,
    '',
  ].join('\n');
}
