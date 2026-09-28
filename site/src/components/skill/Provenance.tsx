import type { ExternalSkill } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';
import { sourceUrl } from '@/lib/urls';

export function Provenance({ skill, dict }: { skill: ExternalSkill; dict: Dictionary }) {
  const rows: [string, React.ReactNode][] = [
    [dict.skill.author, <a key="a" href={`https://github.com/${skill.upstream.owner}`} className="hover:text-acid">{skill.upstream.owner}</a>],
    [dict.skill.license, skill.license.startsWith('LicenseRef') ? <a key="l" href={sourceUrl(skill)} className="hover:text-acid">LICENSE</a> : skill.license],
    [dict.skill.source, <a key="s" href={skill.upstream.url} className="break-all hover:text-acid">{skill.upstream.repo}</a>],
    [dict.skill.commit, <a key="c" href={sourceUrl(skill)} className="font-mono hover:text-acid">{skill.upstream.commit.slice(0, 7)}</a>],
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[7rem_1fr] gap-3 py-3 text-[14px]">
          <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
          <dd className="min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
