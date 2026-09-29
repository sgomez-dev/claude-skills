import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { AUTHOR, REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';

export function Footer({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const llms = lang === 'en' ? '/llms.txt' : '/es/llms.txt';
  return (
    <footer className="mt-24 border-t-2 border-ink">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 font-mono text-[12px] sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>
          {dict.footer.madeBy}{' '}
          <a href={AUTHOR.url} className="font-bold text-acid hover:underline">{AUTHOR.name}</a> · {dict.footer.license}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink-muted">
          <li><Link prefetch={false} href={paths.methodology(lang)} className="hover:text-ink">{dict.footer.methodology}</Link></li>
          <li><Link prefetch={false} href={paths.credits(lang)} className="hover:text-ink">{dict.footer.credits}</Link></li>
          <li><a href={REPO_URL} className="hover:text-ink">{dict.footer.source}</a></li>
          <li><a href={llms} className="hover:text-ink">{dict.footer.llms}</a></li>
        </ul>
      </div>
    </footer>
  );
}
