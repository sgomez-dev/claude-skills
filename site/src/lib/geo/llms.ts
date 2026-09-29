import { SECTIONS } from '@/content/sections';
import { catalogFigures } from '@/lib/catalog/figures';
import type { Catalog } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { installOptions } from '@/lib/install';
import { AUTHOR } from '@/lib/site';
import { absolute, mdPath, paths } from '@/lib/urls';
import { skillListLine, skillMarkdown } from './markdown';

/** llmstxt.org asks for a concise index; this is the hard ceiling we hold ourselves to (bytes). */
export const LLMS_MAX_BYTES = 100_000;
/** Summary caps tried in order until the file fits: authored summaries are 60-160 characters, so this rarely bites. */
const SUMMARY_CAPS = [160, 130, 110, 90, 70];

const bytes = (s: string) => Buffer.byteLength(s, 'utf8');

const T = {
  en: {
    other: 'Español', install: 'Install (macOS, Linux)', windows: 'Windows', invoke: 'Invoke a skill by typing its name in Claude Code, for example',
    credits: 'Credits: who wrote the community skills, with their licenses', humans: 'Author and credits (humans.txt)', full: 'Full text of every skill in one file (llms-full.txt)',
    curator: 'Curated by', sectionPage: 'section overview', home: 'Home',
  },
  es: {
    other: 'English', install: 'Instalar (macOS, Linux)', windows: 'Windows', invoke: 'Se invoca escribiendo su nombre en Claude Code, por ejemplo',
    credits: 'Créditos: quién escribió las skills de la comunidad, con sus licencias', humans: 'Autor y créditos (humans.txt)', full: 'Texto completo de cada skill en un solo fichero (llms-full.txt)',
    curator: 'Curado por', sectionPage: 'resumen de la sección', home: 'Portada',
  },
} as const;

function build(catalog: Catalog, lang: Lang, cap: number): string {
  const d = getDictionary(lang);
  const t = T[lang];
  const f = catalogFigures(catalog);
  const other = lang === 'en' ? absolute('/es/llms.txt') : absolute('/llms.txt');
  const [unix, windows] = installOptions(null);
  const dated = f.updatedAt ? ` (${d.home.figures.updated} ${d.date(new Date(f.updatedAt))})` : '';
  const out = [
    '# Claude Skills', '',
    `> ${d.meta.description(f.total, f.commands)} ${d.home.figures.line(f)}${dated}. ${t.curator} ${AUTHOR.name} (${AUTHOR.url}).`, '',
    `${t.install}: \`${unix!.command}\`. ${t.windows}: \`${windows!.command}\`. ${t.invoke} \`/legal--contract-review\`.`, '',
    `${t.other}: ${other}`, '',
  ];
  for (const s of SECTIONS) {
    out.push(`## ${s.number} — ${s.name[lang]}`, '');
    out.push(`- [${s.name[lang]}: ${t.sectionPage}](${absolute(mdPath(paths.section(lang, s.id)))}): ${s.description?.[lang] ?? s.dek[lang]}`);
    for (const k of catalog.skills.filter((x) => x.section === s.id)) out.push(skillListLine(k, lang, cap));
    out.push('');
  }
  out.push(
    '## Optional', '',
    `- [${d.nav.methodology}](${absolute(mdPath(paths.methodology(lang)))}): ${d.methodology.dek}`,
    `- [${t.home}](${absolute(mdPath(paths.home(lang)))}): ${d.meta.description(f.total, f.commands)}`,
    `- [${d.nav.credits}](${absolute(mdPath(paths.credits(lang)))}): ${t.credits}`,
    `- [${t.humans}](${absolute('/humans.txt')})`,
    `- [${t.full}](${absolute(lang === 'en' ? '/llms-full.txt' : '/es/llms-full.txt')})`,
    '',
  );
  return out.join('\n');
}

/** llmstxt.org: H1, blockquote, an install paragraph, one H2 per section with a link list, and `## Optional` last. */
export function llmsTxt(catalog: Catalog, lang: Lang): string {
  let text = '';
  for (const cap of SUMMARY_CAPS) {
    text = build(catalog, lang, cap);
    if (bytes(text) <= LLMS_MAX_BYTES) return text;
  }
  return text;
}

export function llmsFullTxt(catalog: Catalog, lang: Lang): string {
  return [llmsTxt(catalog, lang), '---', '', ...catalog.skills.map((s) => skillMarkdown(s, lang, catalog))].join('\n');
}
