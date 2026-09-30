import { SECTIONS, type SectionDef } from '@/content/sections';
import { getDictionary } from '@/lib/i18n';
import { LANGS, type Lang } from '@/lib/i18n/languages';
import { introSlugs } from '@/lib/intro';
import { TITLE_BUDGET } from '@/lib/seo/titles';
import type { SkillText } from './types';

export const SUMMARY_MIN = 60;
export const SUMMARY_MAX = 160;
/** Router-style phrasing from the author's frontmatter: it is written for the agent, not for a reader. */
export const ROUTER_PHRASING = /use when|triggers? include|úsala cuando el usuario/i;
/** Link syntax of the .md twins and llms.txt is `[text](url)`: a bracket or a line break in a title or summary breaks it. */
const LINK_BREAKERS = /[[\]\r\n]/;

/** The longest bare title whose rendered page title ("{title}: {suffix}", the form that drops the slug) still fits the budget. */
export function maxTitleLength(lang: Lang): number {
  return TITLE_BUDGET - `: ${getDictionary(lang).skill.titleSuffix}`.length;
}

export function titleProblems(lang: Lang, title: string): string[] {
  const p: string[] = [];
  const words = title.trim().split(/\s+/).filter(Boolean).length;
  if (words < 2 || words > 5) p.push(`${lang}.title must be 2-5 words (is ${words})`);
  const max = maxTitleLength(lang);
  if (title.length > max) p.push(`${lang}.title is ${title.length} characters; the rendered <title> may not pass ${TITLE_BUDGET}, so the bare title is at most ${max}`);
  if (ROUTER_PHRASING.test(title)) p.push(`${lang}.title reads like router text (use when / triggers include)`);
  if (LINK_BREAKERS.test(title)) p.push(`${lang}.title may not contain [ ] or a line break`);
  return p;
}

export function summaryProblems(lang: Lang, summary: string): string[] {
  const p: string[] = [];
  if (summary.length < SUMMARY_MIN || summary.length > SUMMARY_MAX) p.push(`${lang}.summary must be ${SUMMARY_MIN}-${SUMMARY_MAX} characters (is ${summary.length})`);
  if (ROUTER_PHRASING.test(summary)) p.push(`${lang}.summary reads like router text (use when / triggers include)`);
  if (LINK_BREAKERS.test(summary)) p.push(`${lang}.summary may not contain [ ] or a line break`);
  return p;
}

type Blocks = Pick<SkillText, 'useWhen' | 'notFor' | 'faq' | 'keywords'>;

/** A14 blocks and keywords: checked only when present. */
export function blockProblems(lang: Lang, t: Blocks): string[] {
  const p: string[] = [];
  if (t.useWhen && t.useWhen.length !== 3) p.push(`${lang}.useWhen must have 3 items (has ${t.useWhen.length})`);
  if (t.notFor && (t.notFor.length < 1 || t.notFor.length > 2)) p.push(`${lang}.notFor must have 1-2 items (has ${t.notFor.length})`);
  if (t.keywords && (t.keywords.length < 3 || t.keywords.length > 5)) p.push(`${lang}.keywords must have 3-5 items (has ${t.keywords.length})`);
  if (t.faq) {
    if (t.faq.length < 2 || t.faq.length > 3) p.push(`${lang}.faq must have 2-3 items (has ${t.faq.length})`);
    t.faq.forEach((f, i) => {
      if (f.q.length > 120) p.push(`${lang}.faq[${i}].q is ${f.q.length} characters (max 120)`);
      if (f.a.length > 400) p.push(`${lang}.faq[${i}].a is ${f.a.length} characters (max 400)`);
    });
  }
  return p;
}

/** Section copy (A7): checked only for the fields that exist. */
export function sectionProblems(skillSlugs: ReadonlySet<string>, sections: readonly SectionDef[] = SECTIONS): string[] {
  const p: string[] = [];
  for (const s of sections) {
    for (const lang of LANGS) {
      const at = `section ${s.id}/${lang}`;
      const seo = s.seoTitle?.[lang];
      if (seo !== undefined && seo.length > TITLE_BUDGET) p.push(`${at}: seoTitle is ${seo.length} characters (max ${TITLE_BUDGET})`);
      const d = s.description?.[lang];
      if (d !== undefined && (d.length < 120 || d.length > 160)) p.push(`${at}: description must be 120-160 characters (is ${d.length})`);
      const intro = s.intro?.[lang];
      if (intro !== undefined) {
        const slugs = intro.flatMap(introSlugs);
        const bad = slugs.filter((x) => !skillSlugs.has(x));
        if (bad.length) p.push(`${at}: intro links to unknown skills: ${bad.join(', ')}`);
        if (slugs.length - bad.length < 5) p.push(`${at}: intro needs at least 5 valid skill links (has ${slugs.length - bad.length})`);
      }
    }
  }
  return p;
}
