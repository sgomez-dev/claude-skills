import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/ui/JsonLd';
import { catalog, catalogUpdatedAt } from '@/lib/catalog';
import { isoDay } from '@/lib/catalog/dates';
import { catalogFigures } from '@/lib/catalog/figures';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { authorLd, breadcrumbLd, graph, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { AUTHOR, REPO_URL } from '@/lib/site';
import { absolute, paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

// The path is /{lang}/methodology in both languages, like /credits and /s/: a per-language slug would need a
// path table in swapLang, the hreflang alternates, the sitemap and the .md twins, for no ranking gain.
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: '/methodology', absoluteTitle: true, title: d.methodology.seoTitle, description: d.methodology.description });
}

export default async function Methodology({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const m = d.methodology;
  const sections = m.sections(catalogFigures(catalog));
  const updated = catalogUpdatedAt();
  const url = paths.methodology(lang);

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <JsonLd data={graph([
        websiteLd(lang),
        authorLd(),
        webPageLd({ lang, path: url, type: 'AboutPage', name: m.seoTitle, description: m.description, dateModified: updated }),
        breadcrumbLd(absolute(url), [{ name: d.nav.home, path: paths.home(lang) }, { name: m.title, path: url }]),
      ])} />
      <header className="border-b-2 border-ink pb-10">
        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{m.title}</h1>
        <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink-muted">{m.dek}</p>
        {updated ? (
          <p className="mt-3 font-mono text-[11px] uppercase text-ink-muted">{m.updated} <time dateTime={isoDay(updated)}>{d.date(new Date(updated))}</time></p>
        ) : null}
      </header>
      <div className="mt-10 max-w-3xl space-y-10">
        {sections.map((s, i) => (
          <section key={s.h} aria-labelledby={`m${i}`}>
            <h2 id={`m${i}`} className="mb-3 font-display text-2xl font-extrabold">{s.h}</h2>
            {s.p?.map((p) => <p key={p} className="mt-3 text-[17px] leading-relaxed">{p}</p>)}
            {s.bullets ? <ul className="mt-3 list-disc space-y-2 pl-5 text-[17px] leading-relaxed">{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul> : null}
            {i === 0 ? (
              <p className="mt-3 text-[17px]">
                <a href={AUTHOR.url} className="font-bold text-acid hover:underline">{AUTHOR.name}</a>
                {AUTHOR.sameAs.filter((u) => u !== AUTHOR.url).map((u) => (
                  <span key={u}>{' · '}<a href={u} rel="me" className="text-ink-muted underline decoration-line underline-offset-4 hover:text-ink">{new URL(u).hostname.replace(/^www\./, '')}</a></span>
                ))}
              </p>
            ) : null}
            {i === sections.length - 1 ? (
              <p className="mt-3 text-[17px]"><a href={`${REPO_URL}/issues`} className="font-bold text-acid hover:underline">{m.reportLabel} ↗</a></p>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
