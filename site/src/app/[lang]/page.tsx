import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cover } from '@/components/home/Cover';
import { Faq } from '@/components/home/Faq';
import { SectionIndex } from '@/components/home/SectionIndex';
import { StatsStrip } from '@/components/home/StatsStrip';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { JsonLd } from '@/components/ui/JsonLd';
import { FEATURED } from '@/content/featured';
import { SECTIONS } from '@/content/sections';
import { catalog, getSkill } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { faqLd, itemListLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { truncate } from '@/lib/seo/truncate';
import { REPO_URL } from '@/lib/site';
import { paths } from '@/lib/urls';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return { ...pageMetadata({ lang, path: '', title: d.meta.title, description: d.meta.description(catalog.counts.total) }), title: { absolute: d.meta.title } };
}

export default async function Home({ params }: { params: Params }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const d = getDictionary(lang);
  const counts = Object.fromEntries(SECTIONS.map((s) => [s.id, catalog.skills.filter((k) => k.section === s.id).length]));
  const commands = catalog.skills.filter((s) => s.kind === 'command');
  const ticker = FEATURED.map(getSkill).filter((s) => s !== undefined).map((s) => ({
    slug: s.slug,
    href: paths.skill(lang, s.slug),
    description: truncate(s.text[lang].description, 90),
    descLang: s.text[lang].translated ? undefined : 'en',
  }));

  return (
    <main>
      <JsonLd data={[websiteLd(lang), faqLd(d.home.faq), itemListLd(SECTIONS.map((s) => ({ name: s.name[lang], path: paths.section(lang, s.id) })))]} />
      <Cover lang={lang} dict={d} total={catalog.counts.total} ticker={ticker} />
      <SectionIndex lang={lang} title={d.home.index} counts={counts} />
      <StatsStrip dict={d} total={catalog.counts.total} declared={commands.length} commands={commands.length} updated={new Date(catalog.generatedAt)} />
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
      <Faq title={d.home.faqTitle} items={d.home.faq} />
    </main>
  );
}
