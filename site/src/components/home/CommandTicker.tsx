import Link from 'next/link';

export interface TickerItem {
  slug: string;
  href: string;
  description: string;
  descLang?: string;
}

function Rows({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((i) => (
        <li key={i.slug} className="border-b border-line py-3">
          <Link prefetch={false} href={i.href} className="block">
            <span className="font-mono text-[13px] font-bold text-acid">/{i.slug}</span>
            <span lang={i.descLang} className="mt-1 block text-[14px] leading-snug text-ink-muted">{i.description}</span>
          </Link>
        </li>
      ))}
    </>
  );
}

/** Real skills scrolling in an ink frame with a hard acid shadow. Paused on hover/focus, static with reduced motion. */
export function CommandTicker({ items, label }: { items: TickerItem[]; label: string }) {
  return (
    <div role="region" aria-label={label} className="rounded-[14px] border-2 border-ink bg-[#131316] shadow-[6px_6px_0_var(--color-acid)]">
      <div className="ticker relative h-[250px] overflow-hidden rounded-[12px] px-4">
        <div className="ticker-track pt-2">
          <ul><Rows items={items} /></ul>
          <ul aria-hidden="true" inert><Rows items={items} /></ul>
        </div>
      </div>
    </div>
  );
}
