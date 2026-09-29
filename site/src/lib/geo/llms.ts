import { SECTIONS } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { getDictionary } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/languages';
import { absolute, mdPath, paths } from '@/lib/urls';
import { skillMarkdown } from './markdown';

export function llmsTxt(catalog: Catalog, lang: Lang): string {
  const d = getDictionary(lang);
  const other = lang === 'en' ? { label: 'Español', url: absolute('/es/llms.txt') } : { label: 'English', url: absolute('/llms.txt') };
  const out = [`# Claude Skills`, '', `> ${d.meta.description(catalog.counts.total)}`, '', `${other.label}: ${other.url}`, ''];
  for (const s of SECTIONS) {
    out.push(`## ${s.number} — ${s.name[lang]}`, '');
    for (const k of catalog.skills.filter((x) => x.section === s.id)) {
      out.push(`- [/${k.slug}](${absolute(mdPath(paths.skill(lang, k.slug)))}): ${k.text[lang].description}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export function llmsFullTxt(catalog: Catalog, lang: Lang): string {
  return [llmsTxt(catalog, lang), '---', '', ...catalog.skills.map((s) => skillMarkdown(s, lang))].join('\n');
}
