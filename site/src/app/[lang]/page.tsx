import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cover } from '@/components/home/Cover';
import { Faq } from '@/components/home/Faq';
import { Figures } from '@/components/home/Figures';
import { CoverIntro } from '@/components/motion/CoverIntro';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { SectionIndex } from '@/components/home/SectionIndex';
import { StatsStrip } from '@/components/home/StatsStrip';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { JsonLd } from '@/components/ui/JsonLd';
import { FEATURED } from '@/content/featured';
import { SECTIONS } from '@/content/sections';
import { catalog, getSkill } from '@/lib/catalog';
import { skillSummary } from '@/lib/catalog/copy';
import { catalogFigures } from '@/lib/catalog/figures';
import { getDictionary } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { authorLd, faqLd, graph, itemListLd, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { truncate } from '@/lib/seo/truncate';
import { REPO_URL } from '@/lib/site';
import { absolute, paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  const f = catalogFigures(catalog);
  return pageMetadata({ lang, path: '', absoluteTitle: true, title: d.meta.title(f.total), description: d.meta.description(f.total, f.commands), image: { alt: d.og.home(f.total), seed: d.home.dek(f.total) } });
}

export default async function Home({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const f = catalogFigures(catalog);
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.id, catalog.skills.filter((k) => k.section === s.id).length]));
  const ticker = FEATURED.map(getSkill).filter((s) => s !== undefined).map((s) => {
    const summary = skillSummary(s, lang);
    return { slug: s.slug, href: paths.skill(lang, s.slug), description: truncate(summary.text, 90), descLang: summary.lang };
  });
  const faq = d.home.faq(f);
  const home = paths.home(lang);

  return (
    <main>
      <JsonLd data={graph([
        websiteLd(lang),
        authorLd(),
        webPageLd({ lang, path: home, name: d.meta.title(f.total), description: d.meta.description(f.total, f.commands), dateModified: f.updatedAt, breadcrumb: false }),
        faqLd(`${absolute(home)}#faq`, faq),
        itemListLd(`${absolute(home)}#sections`, SECTIONS.map((s) => ({ name: s.name[lang], path: paths.section(lang, s.id) }))),
      ])} />
      <CoverIntro />
      <Cover lang={lang} dict={d} total={f.total} ticker={ticker} />
      <VelocityMarquee items={d.home.coverLines.map((l) => l.text)} />
      <SectionIndex lang={lang} title={d.home.index} counts={counts} />
      <StatsStrip dict={d} total={f.total} declared={f.commands} commands={f.commands} updated={f.updatedAt ? new Date(f.updatedAt) : null} />
      <Figures dict={d} figures={f} />
      <section aria-labelledby="install" className="mx-auto mt-20 grid max-w-[1440px] gap-8 px-4 sm:px-7 lg:grid-cols-2 lg:items-center">
        <div className="min-w-0">
          <h2 id="install" className="font-display text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{d.home.cta.title}</h2>
          <p className="mt-4 max-w-md text-[17px] text-ink-muted">{d.home.cta.body}</p>
          <a href={`${REPO_URL}#every-way-to-install`} className="mt-4 inline-block font-mono text-[12px] font-bold uppercase text-acid hover:underline">{d.home.cta.more} ↗</a>
        </div>
        <div className="min-w-0">
          <InstallTabs options={installOptions(null)} labels={{ tabs: d.skill.tabs, copy: d.skill.copy, copied: d.skill.copied, pluginNote: d.skill.pluginNote }} />
        </div>
      </section>
      <Faq title={d.home.faqTitle} items={faq} />
    </main>
  );
}
