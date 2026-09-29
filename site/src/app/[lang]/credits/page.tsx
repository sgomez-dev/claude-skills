import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/ui/JsonLd';
import { catalog } from '@/lib/catalog';
import { latestDate } from '@/lib/catalog/dates';
import type { ExternalSkill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { authorLd, breadcrumbLd, graph, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { AUTHOR } from '@/lib/site';
import { absolute, paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: '/credits', title: d.credits.title, description: d.credits.dek });
}

export default async function Credits({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const externals = catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external');
  const groups = [...Map.groupBy(externals, (s) => s.upstream.repo)].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <JsonLd data={graph([
        websiteLd(lang),
        authorLd(),
        webPageLd({ lang, path: paths.credits(lang), name: d.credits.title, description: d.credits.dek, dateModified: latestDate(externals.map((s) => s.updatedAt)) }),
        breadcrumbLd(absolute(paths.credits(lang)), [{ name: d.nav.home, path: paths.home(lang) }, { name: d.credits.title, path: paths.credits(lang) }]),
      ])} />
      <header className="border-b-2 border-ink pb-10">
        <h1 className="font-display text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">{d.credits.title}</h1>
        <p className="mt-6 max-w-2xl text-[19px] text-ink-muted">{d.credits.dek}</p>
        <p className="mt-4 text-[17px]">
          {d.credits.builtHere(catalog.counts.commands)} <a href={AUTHOR.url} className="font-bold text-acid hover:underline">{AUTHOR.name}</a>.
        </p>
      </header>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {groups.map(([repo, skills]) => (
          <li key={repo} className="bg-night p-5">
            <a href={skills[0]!.upstream.url} className="font-display text-xl font-extrabold hover:text-acid">{repo}</a>
            <p className="mt-1 font-mono text-[11px] uppercase text-ink-muted">
              {d.credits.skills(skills.length)} · {d.credits.license}: {[...new Set(skills.map((s) => s.license))].join(', ')}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {skills.map((s) => (
                <li key={s.slug}><Link prefetch={false} href={paths.skill(lang, s.slug)} className="font-mono text-[12px] text-ink-muted hover:text-ink">/{s.slug}</Link></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
