import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';
import { LangSwitch } from './LangSwitch';

export function Masthead({ lang, dict, generatedAt, total }: { lang: Lang; dict: Dictionary; generatedAt: string; total: number }) {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:px-7">
        <Link href={paths.home(lang)} className="font-display text-[22px] font-extrabold tracking-[-0.03em]">
          claude/skills
        </Link>
        <p className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] md:block">
          {dict.masthead.issue(new Date(generatedAt), total)}
        </p>
        <nav aria-label={dict.nav.label} className="flex items-center gap-2">
          <LangSwitch current={lang} label={dict.nav.language} />
          <a href={REPO_URL} className="hidden rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid sm:inline-block">
            {dict.nav.github}
          </a>
        </nav>
      </div>
    </header>
  );
}
