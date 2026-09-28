import type { Permissions } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';

const MAX = 6;

function Patterns({ items, dict }: { items: string[]; dict: Dictionary }) {
  if (items.length === 0) return <span className="text-ink-muted">{dict.skill.perm.nothing}</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.slice(0, MAX).map((p) => (
        <code key={p} className="rounded bg-ink/[0.07] px-1.5 py-0.5 font-mono text-[12px]">{p}</code>
      ))}
      {items.length > MAX ? <span className="font-mono text-[12px] text-ink-muted">{dict.skill.perm.more(items.length - MAX)}</span> : null}
    </span>
  );
}

function Flag({ on, dict, danger }: { on: boolean; dict: Dictionary; danger?: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold uppercase ${on ? (danger ? 'bg-pink text-night' : 'bg-sun text-night') : 'border border-line text-ink-muted'}`}>
      {on ? dict.skill.perm.yes : dict.skill.perm.no}
    </span>
  );
}

export function PermissionManifest({ permissions, dict }: { permissions: Permissions; dict: Dictionary }) {
  const rows: [string, React.ReactNode][] = [
    [dict.skill.perm.reads, <Patterns key="r" items={permissions.reads} dict={dict} />],
    [dict.skill.perm.writes, <Patterns key="w" items={permissions.writes} dict={dict} />],
    [dict.skill.perm.commands, <Patterns key="c" items={permissions.commands} dict={dict} />],
    [dict.skill.perm.network, <Flag key="n" on={permissions.network} dict={dict} />],
    [dict.skill.perm.destructive, <Flag key="d" on={permissions.destructive} dict={dict} danger />],
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[7rem_1fr] items-start gap-3 py-3">
          <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
          <dd className="min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
