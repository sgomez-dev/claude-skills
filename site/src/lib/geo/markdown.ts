import { getSection, SECTIONS } from '@/content/sections';
import type { Catalog, ExternalSkill, SectionId, Skill } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { AUTHOR } from '@/lib/site';
import { absolute, mdPath, paths, sourceUrl } from '@/lib/urls';

const list = (items: string[]) => (items.length ? items.map((i) => `\`${i}\``).join(', ') : '—');

export function skillMarkdown(skill: Skill, lang: Lang): string {
  const d = getDictionary(lang);
  const section = getSection(skill.section);
  const text = skill.text[lang];
  const answer = d.skill.answer(skill.slug, section.name[lang]) + (skill.kind === 'external' ? d.skill.answerExternal(skill.upstream.owner, skill.license) : '');
  const out: string[] = [`# /${skill.slug}`, '', `${answer} ${text.description}`, ''];
  out.push(`- ${d.md.web}: ${absolute(paths.skill(lang, skill.slug))}`);
  out.push(`- ${d.md.section}: [${section.name[lang]}](${absolute(mdPath(paths.section(lang, section.id)))})`);
  out.push(`- ${d.md.author}: ${skill.kind === 'command' ? AUTHOR.name : skill.upstream.owner}`);
  out.push(`- ${d.md.license}: ${skill.kind === 'command' ? 'MIT' : skill.license}`);
  out.push(`- ${d.md.source}: ${sourceUrl(skill)}`);
  if (skill.updatedAt) out.push(`- ${d.skill.updated(new Date(skill.updatedAt))}`);
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
  return `${out.join('\n').trimEnd()}\n`;
}

export function sectionMarkdown(catalog: Catalog, id: SectionId, lang: Lang): string {
  const s = getSection(id);
  const skills = catalog.skills.filter((k) => k.section === id);
  return [
    `# ${s.number} — ${s.name[lang]}: ${s.headline[lang].lead} ${s.headline[lang].accent}`, '', s.dek[lang], '',
    `${getDictionary(lang).md.web}: ${absolute(paths.section(lang, id))}`, '',
    `## ${getDictionary(lang).md.skills} (${skills.length})`, '',
    ...skills.map((k) => `- [/${k.slug}](${absolute(mdPath(paths.skill(lang, k.slug)))}): ${k.text[lang].description}`),
    '',
  ].join('\n');
}

export function homeMarkdown(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  return [
    `# ${d.meta.title}`, '', d.meta.description(catalog.counts.total), '',
    `## ${d.home.index}`, '',
    ...SECTIONS.map((s) => `- [${s.number} — ${s.name[lang]}](${absolute(mdPath(paths.section(lang, s.id)))}): ${s.dek[lang]}`),
    '', `## ${d.home.faqTitle}`, '',
    ...d.home.faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
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
