import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { HowToAsk } from '@/components/skill/HowToAsk';
import { InstallTabs } from '@/components/skill/InstallTabs';
import { PermissionManifest } from '@/components/skill/PermissionManifest';
import { Provenance } from '@/components/skill/Provenance';
import { SkillCard } from '@/components/skill/SkillCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { SlugText } from '@/components/ui/SlugText';
import { Sticker } from '@/components/ui/Sticker';
import { getSection } from '@/content/sections';
import { catalog, getSkill, pairedSkills, pipelinesOf, relatedSkills } from '@/lib/catalog';
import { displayName, humanTitle, skillSummary } from '@/lib/catalog/copy';
import { isoDay } from '@/lib/catalog/dates';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS, type Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { breadcrumbLd, faqLd, graph, authorLd, skillLd, skillNodeId, webPageLd, websiteLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { skillPageTitle } from '@/lib/seo/titles';
import { REPO_URL } from '@/lib/site';
import { absolute, paths, pipelineUrl, sourceUrl } from '@/lib/urls';

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
  const d = getDictionary(lang);
  return pageMetadata({
    lang, path: `/s/${skill.slug}`, absoluteTitle: true,
    title: skillPageTitle(d.skill.titleSuffix, humanTitle(skill, lang), skill.slug),
    description: skillSummary(skill, lang).text,
    image: { alt: d.og.skill(displayName(skill, lang), getSection(skill.section).name[lang]), seed: `${skill.slug}|${skillSummary(skill, lang).text}` },
  });
}

export default async function SkillPage({ params }: { params: Params }) {
  const p = await params;
  const { lang, skill } = load(p.lang, p.slug);
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const title = humanTitle(skill, lang);
  const summary = skillSummary(skill, lang);
  const descLang = text.translated ? undefined : 'en';
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const url = paths.skill(lang, skill.slug);
  const crumbs = [
    { name: d.nav.home, path: paths.home(lang) },
    { name: section.name[lang], path: paths.section(lang, section.id) },
    { name: displayName(skill, lang), path: url },
  ];
  const paired = pairedSkills(skill);
  const recipes = pipelinesOf(skill.slug);
  const related = relatedSkills(skill, undefined, new Set(paired.map((s) => s.slug)));
  const card = (r: (typeof related)[number]) => (
    <li key={r.slug}>
      <SkillCard
        href={paths.skill(lang, r.slug)}
        slug={r.slug}
        title={humanTitle(r, lang) ?? undefined}
        description={skillSummary(r, lang).text}
        descLang={skillSummary(r, lang).lang}
        badge={r.kind === 'command' ? d.skill.builtHere : d.skill.by(r.upstream.owner)}
        accent={getSection(r.section).accent}
      />
    </li>
  );

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-7">
      <JsonLd data={graph([
        websiteLd(lang),
        authorLd(),
        webPageLd({
          lang, path: url, name: skillPageTitle(d.skill.titleSuffix, title, skill.slug), description: summary.text,
          dateModified: skill.updatedAt, mainEntity: skillNodeId(lang, skill.slug),
        }),
        breadcrumbLd(absolute(url), crumbs),
        skillLd(skill, lang, { name: displayName(skill, lang), description: summary.text }),
        ...(text.faq?.length ? [faqLd(`${absolute(url)}#faq`, text.faq)] : []),
      ])} />
      <nav aria-label={d.nav.breadcrumb} className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          <li><Link prefetch={false} href={paths.home(lang)} className="hover:text-ink">{d.nav.home}</Link> /</li>
          <li><Link prefetch={false} href={paths.section(lang, section.id)} className="hover:text-ink">{section.number} — {section.name[lang]}</Link></li>
        </ol>
      </nav>

      <header className="mt-6 border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Sticker color={section.accent} rotate={-2}>{skill.kind === 'command' ? d.skill.builtHere : d.skill.by(skill.upstream.owner)}</Sticker>
          {skill.updatedAt ? (
            <span className="font-mono text-[11px] uppercase text-ink-muted">
              <time dateTime={isoDay(skill.updatedAt)}>{d.skill.updated(new Date(skill.updatedAt))}</time>
            </span>
          ) : null}
        </div>
        {/* The slug stays the h1 (it is the skill's identity); the human title is real text right above it. */}
        {title ? <p className="mt-5 font-display text-[clamp(1.25rem,3vw,1.75rem)] font-extrabold leading-tight tracking-[-0.01em] text-acid">{title}</p> : null}
        <ViewTransition name={`skill-${skill.slug}`} share="morph" default="none">
          <h1 className={`${title ? 'mt-2' : 'mt-5'} font-display text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] [overflow-wrap:anywhere] slug-text`}><SlugText text={`/${skill.slug}`} /></h1>
        </ViewTransition>
        <p className="mt-6 max-w-3xl text-[19px] leading-relaxed">
          <span className="slug-text"><SlugText text={answer} /></span>{' '}
          <span lang={summary.lang}>{summary.text}</span>
        </p>
        {!text.translated ? <p className="mt-2 font-mono text-[11px] text-ink-muted">{d.skill.notTranslated}</p> : null}
        {summary.text !== text.description ? (
          <section aria-labelledby="author-desc" className="mt-6 max-w-3xl border-l-2 border-line pl-4">
            <h2 id="author-desc" className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink-muted">{d.skill.authorDescription}</h2>
            <p lang={descLang} className="mt-1 text-[15px] leading-relaxed text-ink-muted">{text.description}</p>
          </section>
        ) : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-10">
          {text.useWhen?.length || text.notFor?.length || text.output ? (
            <section aria-label={d.skill.useWhen} className="space-y-6">
              {text.useWhen?.length ? (
                <div>
                  <h2 className="mb-3 font-display text-2xl font-extrabold">{d.skill.useWhen}</h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed">{text.useWhen.map((u) => <li key={u}>{u}</li>)}</ul>
                </div>
              ) : null}
              {text.notFor?.length ? (
                <div>
                  <h2 className="mb-3 font-display text-2xl font-extrabold">{d.skill.notFor}</h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed">{text.notFor.map((u) => <li key={u}>{u}</li>)}</ul>
                </div>
              ) : null}
              {text.output ? (
                <div>
                  <h2 className="mb-3 font-display text-2xl font-extrabold">{d.skill.output}</h2>
                  <p className="text-[16px] leading-relaxed">{text.output}</p>
                </div>
              ) : null}
            </section>
          ) : null}
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
          {text.faq?.length ? (
            <section aria-labelledby="faq">
              <h2 id="faq" className="mb-4 font-display text-2xl font-extrabold">{d.skill.faqTitle}</h2>
              <dl className="space-y-4">
                {text.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-bold">{f.q}</dt>
                    <dd className="mt-1 leading-relaxed text-ink-muted">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
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
            <Link prefetch={false} href={paths.methodology(lang)} className="mt-3 block font-mono text-[12px] font-bold uppercase text-ink underline decoration-line underline-offset-4 hover:decoration-acid">{d.skill.methodology}</Link>
          </section>
        </aside>
      </div>

      {paired.length || recipes.length ? (
        <section aria-labelledby="pairs" className="mt-16">
          <h2 id="pairs" className="mb-4 font-display text-2xl font-extrabold">{d.skill.pairsWith}</h2>
          {paired.length ? <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">{paired.map(card)}</ul> : null}
          {recipes.length ? (
            <ul className="mt-4 space-y-1 text-[15px]">
              {recipes.map((r) => (
                <li key={r.slug}>
                  {d.skill.recipe}: <a href={pipelineUrl(r.slug)} className="font-mono font-bold text-acid hover:underline">{r.trigger}</a> <span className="text-ink-muted">{r.name}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="related" className="mt-16">
        <h2 id="related" className="mb-4 font-display text-2xl font-extrabold">{d.skill.related}</h2>
        <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {related.map(card)}
        </ul>
      </section>
    </main>
  );
}
