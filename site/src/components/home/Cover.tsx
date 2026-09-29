import Link from 'next/link';
import { Sticker } from '@/components/ui/Sticker';
import type { SectionId } from '@/lib/catalog/types';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { paths } from '@/lib/urls';
import { CommandTicker, type TickerItem } from './CommandTicker';

export function Cover({ lang, dict, total, ticker }: { lang: Lang; dict: Dictionary; total: number; ticker: TickerItem[] }) {
  const c = dict.home.claim;
  return (
    <section className="relative mx-auto grid max-w-[1440px] gap-10 px-4 pb-14 pt-10 sm:px-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <div>
        <h1 className="font-display text-[clamp(3.25rem,9.5vw,7.25rem)] font-extrabold leading-[0.9] tracking-[-0.035em] [word-spacing:0.06em]">
          {c.lead} <em data-intro="accent" className="font-serif font-normal italic tracking-[-0.02em]">{c.accent}</em>
          <br />
          <span className="relative isolate mt-2 inline-block -rotate-2 px-3.5 pb-1.5 text-night">
            <span aria-hidden data-intro="highlight-bg" className="absolute inset-0 -z-10 origin-left rounded-[18px] bg-acid" />
            {c.highlight}
          </span>{' '}
          {c.tail}
        </h1>
        <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink-muted">{dict.home.dek(total)}</p>
      </div>
      <div className="space-y-6">
        <CommandTicker items={ticker} label={dict.home.inThisIssue} />
        <div>
          <h2 className="mb-2 font-mono text-[13px] font-bold uppercase tracking-[0.08em]">{dict.home.inThisIssue}</h2>
          <ul className="space-y-1 text-[15px]">
            {dict.home.coverLines.map((l) => (
              <li key={l.section}>
                <Link prefetch={false} href={paths.section(lang, l.section as SectionId)} className="underline decoration-line underline-offset-4 hover:decoration-acid">{l.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Wrappers hide the stickers: Sticker's own inline-flex would otherwise win over a `hidden` class. */}
      <div className="hidden lg:contents">
        <Sticker intro color="pink" rotate={8} className="absolute right-[40%] top-6">✦ {dict.home.stickerFree}</Sticker>
      </div>
      <div className="hidden sm:contents">
        <Sticker intro color="cyan" rotate={-4} className="absolute -bottom-4 right-7">{dict.home.stickerPlatforms}</Sticker>
      </div>
    </section>
  );
}
