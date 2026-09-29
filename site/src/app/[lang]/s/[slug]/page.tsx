import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HowToAsk } from '@/components/skill/HowToAsk';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { PermissionManifest } from '@/components/skill/PermissionManifest';
import { Provenance } from '@/components/skill/Provenance';
import { SkillCard } from '@/components/skill/SkillCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { Sticker } from '@/components/ui/Sticker';
import { getSection } from '@/content/sections';
import { catalog, getSkill, relatedSkills } from '@/lib/catalog';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { breadcrumbLd, skillLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { REPO_URL } from '@/lib/site';
import { paths, sourceUrl } from '@/lib/urls';

type Params = Promise<{ lang: string; slug: string }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => catalog.skills.map((s) => ({ lang, slug: s.slug })));
}

function load(lang: string, slug: string) {
  const skill = getSkill(slug);
  if (!isLang(lang) || !skill) notFound();
  return { lang: lang as Lang, skill };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const { lang, skill } = load(p.lang, p.slug);
  return pageMetadata({ lang, path: `/s/${skill.slug}`, title: `/${skill.slug}`, description: skill.text[lang].description });
}

export default async function SkillPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, skill } = load(p.lang, p.slug);
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const descLang = text.translated ? undefined : 'en';
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const crumbs = [
    { name: d.nav.home, path: paths.home(lang) },
    { name: section.name[lang], path: paths.section(lang, section.id) },
    { name: `/${skill.slug}`, path: paths.skill(lang, skill.slug) },
  ];

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-7">
      <JsonLd data={[skillLd(skill, lang, text.description), breadcrumbLd(crumbs)]} />
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          <li><Link prefetch={false} href={paths.home(lang)} className="hover:text-ink">{d.nav.home}</Link> /</li>
          <li><Link prefetch={false} href={paths.section(lang, section.id)} className="hover:text-ink">{section.number} — {section.name[lang]}</Link></li>
        </ol>
      </nav>

      <header className="mt-6 border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Sticker color={section.accent} rotate={-2}>{skill.kind === 'command' ? d.skill.builtHere : d.skill.by(skill.upstream.owner)}</Sticker>
          {skill.updatedAt ? <span className="font-mono text-[11px] uppercase text-ink-muted">{d.skill.updated(new Date(skill.updatedAt))}</span> : null}
        </div>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] break-all">/{skill.slug}</h1>
        <p className="mt-6 max-w-3xl text-[19px] leading-relaxed">
          <span>{answer}</span>{' '}
          <span lang={descLang}>{text.description}</span>
        </p>
        {!text.translated ? <p className="mt-2 font-mono text-[11px] text-ink-muted">{d.skill.notTranslated}</p> : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-10">
          {text.howToAsk.length ? (
            <section aria-labelledby="how">
              <h2 id="how" className="mb-4 font-display text-2xl font-extrabold">{d.skill.howToAsk}</h2>
              <HowToAsk items={text.howToAsk} copy={d.skill.copy} copied={d.skill.copied} />
            </section>
          ) : null}
          <section aria-labelledby="install">
            <h2 id="install" className="mb-4 font-display text-2xl font-extrabold">{d.skill.install}</h2>
            <InstallTabs options={installOptions(skill)} labels={{ tabs: d.skill.tabs, copy: d.skill.copy, copied: d.skill.copied, pluginNote: d.skill.pluginNote }} />
            <p className="mt-3 text-[14px] text-ink-muted">
              {d.skill.invoke} <code className="font-mono text-ink">/{skill.slug}</code>. {d.skill.otherAgents}{' '}
              <a href={`${REPO_URL}/tree/main/platforms`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-acid">{d.skill.otherAgentsLink}</a>
            </p>
          </section>
          <p><Sticker color="cyan" rotate={2}>{d.skill.demoSoon}</Sticker></p>
        </div>

        <aside className="min-w-0 space-y-8">
          <section aria-labelledby="perm" className="rounded-2xl border border-line p-5">
            <h2 id="perm" className="mb-2 font-display text-xl font-extrabold">{skill.kind === 'command' ? d.skill.permissions : d.skill.provenance}</h2>
            {skill.kind === 'command' ? (
              <PermissionManifest permissions={skill.permissions} dict={d} />
            ) : (
              <>
                <Provenance skill={skill} dict={d} />
                <p className="mt-3 text-[13px] text-ink-muted">{d.skill.permissionsExternal}</p>
              </>
            )}
            <a href={sourceUrl(skill)} className="mt-4 inline-block font-mono text-[12px] font-bold uppercase text-acid hover:underline">{d.skill.viewSource} ↗</a>
          </section>
        </aside>
      </div>

      <section aria-labelledby="related" className="mt-16">
        <h2 id="related" className="mb-4 font-display text-2xl font-extrabold">{d.skill.related}</h2>
        <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {relatedSkills(skill).map((r) => (
            <li key={r.slug}>
              <SkillCard
                href={paths.skill(lang, r.slug)}
                slug={r.slug}
                description={r.text[lang].description}
                descLang={r.text[lang].translated ? undefined : 'en'}
                badge={r.kind === 'command' ? d.skill.builtHere : d.skill.by(r.upstream.owner)}
                accent={section.accent}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
