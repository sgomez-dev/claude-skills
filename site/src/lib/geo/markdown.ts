import { getSection, SECTIONS } from '@/content/sections';
import { skillLabel, skillSummary } from '@/lib/catalog/copy';
import { sectionUpdatedAt } from '@/lib/catalog/dates';
import { catalogFigures } from '@/lib/catalog/figures';
import { pairedSkills, pipelinesOf } from '@/lib/catalog/related';
import type { Catalog, ExternalSkill, SectionId, Skill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { parseIntro } from '@/lib/intro';
import { AUTHOR, METHODOLOGY_UPDATED, REPO_URL } from '@/lib/site';
import { absolute, mdPath, paths, pipelineUrl, sourceUrl } from '@/lib/urls';

const list = (items: string[]) => (items.length ? items.map((i) => `\`${i}\``).join(', ') : '—');
const skillMd = (lang: Lang, slug: string) => absolute(mdPath(paths.skill(lang, slug)));

/** One skill in a list: label as the link text, the summary as the note. */
export function skillListLine(skill: Skill, lang: Lang, maxSummary?: number): string {
  let summary = skillSummary(skill, lang).text;
  if (maxSummary && summary.length > maxSummary) summary = `${summary.slice(0, maxSummary - 1).replace(/\s+\S*$/, '')}…`;
  return `- [${skillLabel(skill, lang)}](${skillMd(lang, skill.slug)}): ${summary}`;
}

export function skillMarkdown(skill: Skill, lang: Lang, catalog?: Catalog): string {
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const summary = skillSummary(skill, lang);
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const out: string[] = [`# ${skillLabel(skill, lang)}`, '', `${answer} ${summary.text}`, ''];
  out.push(`- ${d.md.web}: ${absolute(paths.skill(lang, skill.slug))}`);
  out.push(`- ${d.md.section}: [${section.name[lang]}](${absolute(mdPath(paths.section(lang, section.id)))})`);
  out.push(`- ${d.md.author}: ${skill.kind === 'command' ? AUTHOR.name : skill.upstream.owner}`);
  out.push(`- ${d.md.license}: ${skill.kind === 'command' ? 'MIT' : skill.license}`);
  out.push(`- ${d.md.source}: ${sourceUrl(skill)}`);
  if (skill.updatedAt) out.push(`- ${d.skill.updated(new Date(skill.updatedAt))}`);
  if (text.useWhen?.length) out.push('', `## ${d.skill.useWhen}`, '', ...text.useWhen.map((u) => `- ${u}`));
  if (text.notFor?.length) out.push('', `## ${d.skill.notFor}`, '', ...text.notFor.map((u) => `- ${u}`));
  if (text.output) out.push('', `## ${d.skill.output}`, '', text.output);
  if (text.howToAsk.length) out.push('', `## ${d.md.howToAsk}`, '', ...text.howToAsk.map((p) => `- \`${p}\``));
  out.push('', `## ${d.md.install}`, '');
  for (const o of installOptions(skill)) out.push(`${d.skill.tabs[o.id]}:`, '', '```', o.command, '```', '');
  if (skill.kind === 'command') {
    const p = skill.permissions;
    out.push(`## ${d.md.permissions}`, '');
    out.push(`- ${d.skill.perm.reads}: ${list(p.reads)}`);
    out.push(`- ${d.skill.perm.writes}: ${list(p.writes)}`);
    out.push(`- ${d.skill.perm.commands}: ${list(p.commands)}`);
    out.push(`- ${d.skill.perm.network}: ${p.network ? d.skill.perm.yes : d.skill.perm.no}`);
    out.push(`- ${d.skill.perm.destructive}: ${p.destructive ? d.skill.perm.yes : d.skill.perm.no}`);
  }
  if (summary.authored) out.push('', `## ${lang === 'es' && text.translated ? d.skill.authorDescriptionTranslated : d.skill.authorDescription}`, '', text.description);
  if (catalog) {
    const paired = pairedSkills(catalog, skill);
    const recipes = pipelinesOf(catalog, skill.slug);
    if (paired.length || recipes.length) {
      out.push('', `## ${d.skill.pairsWith}`, '');
      for (const p of paired) out.push(skillListLine(p, lang));
      for (const r of recipes) out.push(`- ${d.skill.recipe}: [${r.trigger}](${pipelineUrl(r.slug)}): ${r.name}`);
    }
  }
  if (text.faq?.length) out.push('', `## ${d.skill.faqTitle}`, '', ...text.faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']));
  out.push('', `- [${d.skill.methodology}](${absolute(mdPath(paths.methodology(lang)))})`);
  return `${out.join('\n').trimEnd()}\n`;
}

export function sectionMarkdown(catalog: Catalog, id: SectionId, lang: Lang): string {
  const s = getSection(id);
  const d = getDictionary(lang);
  const skills = catalog.skills.filter((k) => k.section === id);
  const updated = sectionUpdatedAt(catalog, id);
  const intro = (s.intro?.[lang] ?? []).map((para) =>
    parseIntro(para).map((p) => (p.kind === 'text' ? p.text : `[${p.text}](${skillMd(lang, p.slug)})`)).join(''),
  );
  return [
    `# ${s.seoTitle?.[lang] ?? `${s.number} — ${s.name[lang]}: ${s.headline[lang].lead} ${s.headline[lang].accent}`}`, '',
    s.description?.[lang] ?? s.dek[lang], '',
    ...intro.flatMap((p) => [p, '']),
    `${d.md.web}: ${absolute(paths.section(lang, id))}`,
    ...(updated ? [d.section.updated(new Date(updated))] : []),
    '',
    `## ${d.md.skills} (${skills.length})`, '',
    ...skills.map((k) => skillListLine(k, lang)),
    '',
  ].join('\n');
}

export function homeMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const f = catalogFigures(catalog);
  return [
    `# ${d.meta.title(f.total)}`, '', d.meta.description(f.total, f.commands), '',
    `${d.home.figures.line(f)}${f.updatedAt ? ` · ${d.home.figures.updated} ${d.date(new Date(f.updatedAt))}` : ''}`, '',
    `## ${d.home.index}`, '',
    ...SECTIONS.map((s) => `- [${s.number} — ${s.name[lang]}](${absolute(mdPath(paths.section(lang, s.id)))}): ${s.description?.[lang] ?? s.dek[lang]}`),
    `- [${d.nav.methodology}](${absolute(mdPath(paths.methodology(lang)))}): ${d.methodology.dek}`,
    '', `## ${d.home.faqTitle}`, '',
    ...d.home.faq(f).flatMap((q) => [`### ${q.q}`, '', q.a, '']),
  ].join('\n');
}

export function creditsMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const externals = catalog.skills.filter((s): s is ExternalSkill => s.kind === 'external');
  const groups = [...Map.groupBy(externals, (s) => s.upstream.repo)].sort((a, b) => a[0].localeCompare(b[0]));
  return [
    `# ${d.credits.title}`, '', d.credits.dek, '',
    `${d.credits.builtHere(catalog.counts.commands)} ${AUTHOR.name} (${AUTHOR.url}).`, '',
    ...groups.flatMap(([repo, skills]) => [`## ${repo}`, '', `${d.credits.license}: ${[...new Set(skills.map((s) => s.license))].join(', ')} · ${skills[0]!.upstream.url}`, '', ...skills.map((s) => `- /${s.slug}`), '']),
  ].join('\n');
}

export function methodologyMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const f = catalogFigures(catalog);
  const updated = METHODOLOGY_UPDATED;
  return [
    `# ${d.methodology.title}`, '', d.methodology.dek, '',
    `${d.md.web}: ${absolute(paths.methodology(lang))}`,
    `${d.methodology.updated} ${d.date(new Date(updated))}`,
    '',
    ...d.methodology.sections(f).flatMap((s) => [`## ${s.h}`, '', ...(s.p ?? []).flatMap((p) => [p, '']), ...(s.bullets ? [...s.bullets.map((b) => `- ${b}`), ''] : [])]),
    `- ${d.methodology.reportLabel}: ${REPO_URL}/issues`, '',
  ].join('\n');
}
