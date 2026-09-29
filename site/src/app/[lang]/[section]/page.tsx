import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { KineticHeadline } from '@/components/motion/KineticHeadline';
import { ScrubNumber } from '@/components/motion/ScrubNumber';
import { SectionIntro } from '@/components/section/SectionIntro';
import { SkillGrid, type GridItem } from '@/components/section/SkillGrid';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSection, SECTIONS } from '@/content/sections';
import { sectionUpdatedAt, skillsInSection } from '@/lib/catalog';
import { displayName, humanTitle, skillSummary } from '@/lib/catalog/copy';
import { isoDay } from '@/lib/catalog/dates';
import { SECTION_IDS, type SectionId } from '@/lib/catalog/types';
import { ACCENT_BG } from '@/lib/design/tokens';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { authorLd, breadcrumbLd, graph, itemListLd, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { absolute, paths } from '@/lib/urls';

type Params = Promise<{ lang: string; section: string }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => SECTIONS.map((s) => ({ lang, section: s.id })));
}

function load(lang: string, section: string) {
  if (!isLang(lang) || !(SECTION_IDS as readonly string[]).includes(section)) notFound();
  return { lang: lang as Lang, def: getSection(section as SectionId) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const { lang, def } = load(p.lang, p.section);
  return pageMetadata({
    image: { alt: getDictionary(lang).og.section(def.name[lang]), seed: def.description?.[lang] ?? def.dek[lang] },
    lang, path: `/${def.id}`, absoluteTitle: def.seoTitle !== undefined,
    title: def.seoTitle?.[lang] ?? `${def.name[lang]}: ${def.headline[lang].lead} ${def.headline[lang].accent}`,
    description: def.description?.[lang] ?? def.dek[lang],
  });
}

export default async function SectionPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, def } = load(p.lang, p.section);
  const d = getDictionary(lang);
  const skills = skillsInSection(def.id);
  const updated = sectionUpdatedAt(def.id);
  const url = paths.section(lang, def.id);
  const items: GridItem[] = skills.map((s) => ({
    slug: s.slug,
    href: paths.skill(lang, s.slug),
    title: humanTitle(s, lang) ?? undefined,
    description: skillSummary(s, lang).text,
    descLang: skillSummary(s, lang).lang,
    kind: s.kind,
    network: s.kind === 'command' && s.permissions.network,
    group: s.kind === 'command' ? s.category : s.upstream.repo,
    badge: s.kind === 'command' ? d.skill.builtHere : d.skill.by(s.upstream.owner),
  }));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <JsonLd data={graph([
        websiteLd(lang),
        authorLd(),
        webPageLd({
          lang, path: url, type: 'CollectionPage', name: def.seoTitle?.[lang] ?? def.name[lang],
          description: def.description?.[lang] ?? def.dek[lang], dateModified: updated, mainEntity: `${absolute(url)}#list`,
        }),
        breadcrumbLd(absolute(url), [{ name: d.nav.home, path: paths.home(lang) }, { name: def.name[lang], path: url }]),
        itemListLd(`${absolute(url)}#list`, skills.map((s) => ({ name: displayName(s, lang), path: paths.skill(lang, s.slug) }))),
      ])} />
      <header className="scrub-host relative isolate overflow-hidden border-b-2 border-ink pb-10">
        <ScrubNumber value={def.number} />
        <p className="flex items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.14em]">
          <span>{def.number} — {def.name[lang]}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-night ${ACCENT_BG[def.accent]}`}>{d.section.skills(skills.length)}</span>
        </p>
        <ViewTransition name={`section-${def.id}`} share="morph" default="none">
          <KineticHeadline key={`${lang}-${def.id}`} lead={def.headline[lang].lead} accent={def.headline[lang].accent}
            className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]"
            accentClassName="font-serif font-normal italic tracking-[-0.02em]" />
        </ViewTransition>
        <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink-muted">{def.dek[lang]}</p>
        {updated ? (
          <p className="mt-3 font-mono text-[11px] uppercase text-ink-muted"><time dateTime={isoDay(updated)}>{d.section.updated(new Date(updated))}</time></p>
        ) : null}
      </header>
      {def.intro?.[lang]?.length ? <SectionIntro lang={lang} paragraphs={def.intro[lang]} label={def.name[lang]} /> : null}
      <section className="mt-8">
        <SkillGrid items={items} accent={def.accent} labels={{ ...d.section.filters, empty: d.section.empty, showing: d.section.showing }} />
      </section>
    </main>
  );
}
