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
        <li key={i.slug} className="border-b border-ink/15 py-3">
          <Link href={i.href} className="block">
            <span className="font-mono text-[13px] font-bold text-acid">/{i.slug}</span>
            <span lang={i.descLang} className="mt-1 block text-[14px] leading-snug text-white/80">{i.description}</span>
          </Link>
        </li>
      ))}
    </>
  );
}

/** Real skills scrolling in an ink frame with a hard acid shadow. Paused on hover/focus, static with reduced motion. */
export function CommandTicker({ items, label }: { items: TickerItem[]; label: string }) {
  return (
    <div role="region" aria-label={label} className="ticker relative h-[250px] overflow-hidden rounded-[14px] border-2 border-ink bg-night px-4 shadow-[6px_6px_0_#c6ff3d]">
      <div className="ticker-track">
        <ul><Rows items={items} /></ul>
        <ul aria-hidden="true" inert><Rows items={items} /></ul>
      </div>
    </div>
  );
}
