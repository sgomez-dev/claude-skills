import type { ReactNode } from 'react';
import { CountUp } from '@/components/motion/CountUp';
import type { Dictionary } from '@/lib/i18n';

export function StatsStrip({ dict, total, declared, commands, updated }: { dict: Dictionary; total: number; declared: number; commands: number; updated: Date }) {
  const stats: [ReactNode, string][] = [
    [<CountUp key="total" value={total} />, dict.home.stats.skills],
    [`${declared}/${commands}`, dict.home.stats.permissionsLabel],
    ['4', dict.home.stats.platforms],
    [dict.date(updated), dict.home.stats.updated],
  ];
  return (
    <section className="mx-auto mt-16 max-w-[1440px] px-4 sm:px-7">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-night p-5">
            <dt className="sr-only">{label}</dt>
            <dd className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">{value}</dd>
            <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
