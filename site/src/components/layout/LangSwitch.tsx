'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, type Lang } from '@/lib/i18n/languages';
import { swapLang } from '@/lib/urls';

export function LangSwitch({ current, label }: { current: Lang; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line p-0.5 font-mono text-[11px] font-bold uppercase">
      {LANGS.map((l) =>
        l === current ? (
          <span key={l} aria-current="true" className="rounded-full bg-ink px-2.5 py-1 text-night">{l}</span>
        ) : (
          <Link prefetch={false} key={l} href={swapLang(pathname, l)} hrefLang={l} lang={l} className="rounded-full px-2.5 py-1 hover:text-acid">{l}</Link>
        ),
      )}
    </div>
  );
}
