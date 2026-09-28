import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SkillGrid, type GridItem } from '@/components/section/SkillGrid';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSection, SECTIONS } from '@/content/sections';
import { skillsInSection } from '@/lib/catalog';
import { SECTION_IDS, type SectionId } from '@/lib/catalog/types';
import { ACCENT_BG } from '@/lib/design/tokens';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { breadcrumbLd, itemListLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { paths } from '@/lib/urls';

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
  return pageMetadata({ lang, path: `/${def.id}`, title: `${def.name[lang]}: ${def.headline[lang].lead} ${def.headline[lang].accent}`, description: def.dek[lang] });
}

export default async function SectionPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, def } = load(p.lang, p.section);
  const d = getDictionary(lang);
  const skills = skillsInSection(def.id);
  const items: GridItem[] = skills.map((s) => ({
    slug: s.slug,
    href: paths.skill(lang, s.slug),
    description: s.text[lang].description,
    descLang: s.text[lang].translated ? undefined : 'en',
    kind: s.kind,
    network: s.kind === 'command' && s.permissions.network,
    group: s.kind === 'command' ? s.category : s.upstream.repo,
    badge: s.kind === 'command' ? d.skill.builtHere : d.skill.by(s.upstream.owner),
  }));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-7">
      <JsonLd data={[
        breadcrumbLd([{ name: d.nav.home, path: paths.home(lang) }, { name: def.name[lang], path: paths.section(lang, def.id) }]),
        itemListLd(skills.map((s) => ({ name: `/${s.slug}`, path: paths.skill(lang, s.slug) }))),
      ]} />
      <header className="border-b-2 border-ink pb-10">
        <p className="flex items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.14em]">
          <span>{def.number} — {def.name[lang]}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-night ${ACCENT_BG[def.accent]}`}>{d.section.skills(skills.length)}</span>
        </p>
        <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          {def.headline[lang].lead} <em className="font-serif font-normal italic tracking-[-0.02em]">{def.headline[lang].accent}</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink-muted">{def.dek[lang]}</p>
      </header>
      <section className="mt-8">
        <SkillGrid items={items} accent={def.accent} labels={{ ...d.section.filters, empty: d.section.empty, showing: d.section.showing }} />
      </section>
    </main>
  );
}
