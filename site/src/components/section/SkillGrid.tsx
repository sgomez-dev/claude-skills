'use client';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { SkillCard } from '@/components/skill/SkillCard';
import type { Accent } from '@/content/sections';
import { fill } from '@/lib/i18n/format';
import { DURATION, EASE_OUT } from '@/lib/motion';

export interface GridItem {
  slug: string;
  href: string;
  description: string;
  descLang?: string;
  kind: 'command' | 'external';
  network: boolean;
  group: string;
  badge: string;
}

type Kind = 'all' | 'command' | 'external';

export function filterItems(items: GridItem[], f: { kind: Kind; group: string; network: boolean }): GridItem[] {
  return items.filter((i) => (f.kind === 'all' || i.kind === f.kind) && (f.group === 'all' || i.group === f.group) && (!f.network || i.network));
}

interface Labels {
  label: string; origin: string; all: string; command: string; external: string;
  group: string; allGroups: string; network: string; empty: string;
  showing: string;
}

export function SkillGrid({ items, accent, labels }: { items: GridItem[]; accent: Accent; labels: Labels }) {
  const [kind, setKind] = useState<Kind>('all');
  const [group, setGroup] = useState('all');
  const [network, setNetwork] = useState(false);
  const groups = useMemo(() => [...new Set(items.map((i) => i.group))].sort(), [items]);
  const visible = filterItems(items, { kind, group, network });
  const hasBothKinds = new Set(items.map((i) => i.kind)).size > 1;

  return (
    <MotionConfig reducedMotion="user">
      <div role="group" aria-label={labels.label} className="mb-6 flex flex-wrap items-center gap-3">
        {hasBothKinds ? (
          <div role="group" aria-label={labels.origin} className="flex rounded-full border border-line p-0.5">
            {(['all', 'command', 'external'] as const).map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ${kind === k ? 'bg-ink text-night' : 'text-ink-muted hover:text-ink'}`}>
                {labels[k]}
              </button>
            ))}
          </div>
        ) : null}
        {groups.length > 1 ? (
          <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase text-ink-muted">
            <span className="sr-only">{labels.group}</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-full border border-line bg-night px-3 py-1.5 text-ink">
              <option value="all">{labels.allGroups}</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        ) : null}
        {items.some((i) => i.network) ? (
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] font-bold uppercase text-ink-muted">
            <input type="checkbox" checked={network} onChange={(e) => setNetwork(e.target.checked)} className="accent-[var(--color-acid)]" />
            {labels.network}
          </label>
        ) : null}
        <p aria-live="polite" className="ml-auto font-mono text-[11px] uppercase text-ink-muted">{fill(labels.showing, { v: visible.length, t: items.length })}</p>
      </div>

      <LayoutGroup>
        <motion.ul layout className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {visible.map((i) => (
              <motion.li key={i.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }} className="min-w-0">
                <SkillCard href={i.href} slug={i.slug} description={i.description} descLang={i.descLang} badge={i.badge} accent={accent} network={i.network} networkLabel={labels.network} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {visible.length === 0 ? <p className="py-10 text-center text-ink-muted">{labels.empty}</p> : null}
    </MotionConfig>
  );
}
