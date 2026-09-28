'use client';
import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import type { InstallOption } from '@/lib/install';
import { CopyButton } from '@/components/ui/CopyButton';
import { fill } from '@/lib/i18n/format';

interface Labels {
  tabs: Record<InstallOption['id'], string>;
  copy: string;
  copied: string;
  pluginNote: string;
}

export function InstallTabs({ options, labels }: { options: InstallOption[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const id = useId();
  useEffect(() => {
    if (/Windows/i.test(navigator.userAgent)) {
      const i = options.findIndex((o) => o.id === 'script-windows');
      if (i >= 0) setActive(i);
    }
  }, [options]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  const current = options[active]!;
  return (
    <div className="rounded-2xl border border-line">
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-line p-1.5">
        {options.map((o, i) => (
          <button
            key={o.id}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ${i === active ? 'bg-ink text-night' : 'text-ink-muted hover:text-ink'}`}
          >
            {labels.tabs[o.id]}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="flex items-start gap-3 p-4">
        <pre tabIndex={0} aria-label={labels.tabs[current.id]} className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-relaxed text-acid"><code>{current.command}</code></pre>
        <CopyButton text={current.command} label={labels.copy} copiedLabel={labels.copied} />
      </div>
      {current.bundle ? <p className="px-4 pb-4 text-[13px] text-ink-muted">{fill(labels.pluginNote, { bundle: current.bundle })}</p> : null}
    </div>
  );
}
