import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { SECTIONS } from '@/content/sections';
import { ACCENT_BG } from '@/lib/design/tokens';
import type { Lang } from '@/lib/i18n/languages';
import { paths } from '@/lib/urls';

export function SectionIndex({ lang, title, counts }: { lang: Lang; title: string; counts: Record<string, number> }) {
  return (
    <section aria-labelledby="index" className="mx-auto max-w-[1440px] px-4 sm:px-7">
      <h2 id="index" className="sr-only">{title}</h2>
      <ul className="grid border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s, i) => (
          <li key={s.id} className="border-b border-r border-line">
            <Reveal delay={(i % 3) * 60}>
              <Link prefetch={false} href={paths.section(lang, s.id)} className="group relative block min-h-[150px] p-5 hover:bg-ink/[0.04]">
                <span className="font-mono text-[11px] font-bold uppercase">{s.number} — {s.name[lang]}</span>
                <span className={`absolute right-4 top-4 rounded-full px-2 py-0.5 font-mono text-[12px] font-extrabold text-night ${ACCENT_BG[s.accent]}`}>{counts[s.id] ?? 0}</span>
                <span className="mt-3 block font-display text-[28px] font-extrabold leading-[0.95] tracking-[-0.03em]">
                  {s.headline[lang].lead} <em className="font-serif text-[30px] font-normal italic">{s.headline[lang].accent}</em>
                </span>
                <span className="mt-2 block text-[14px] text-ink-muted">{s.dek[lang]}</span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
