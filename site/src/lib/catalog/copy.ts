import type { Lang } from '@/lib/i18n/languages';
import { truncate } from '@/lib/seo/truncate';
import type { Skill } from './types';

export const SUMMARY_LIMIT = 160;

/** The authored human title (2-5 words), or null while the skill has none. */
export function humanTitle(skill: Skill, lang: Lang): string | null {
  return skill.text[lang].title ?? null;
}

/** What to call the skill wherever a name is needed: its title, else its slug. */
export function displayName(skill: Skill, lang: Lang): string {
  return skill.text[lang].title ?? skill.slug;
}

/**
 * The answer-first summary. Fallback: the (translated) description cut at a word boundary. `lang` is set only when the
 * text shown is not in the page language, so the caller can mark it up.
 */
export function skillSummary(skill: Skill, lang: Lang): { text: string; lang?: string; authored: boolean } {
  const t = skill.text[lang];
  if (t.summary) return { text: t.summary, authored: true };
  return { text: truncate(t.description, SUMMARY_LIMIT), lang: t.translated ? undefined : 'en', authored: false };
}

/** How a skill is named in a link: "Contract review (/legal--contract-review)", or "/legal--contract-review" without a title. */
export function skillLabel(skill: Skill, lang: Lang): string {
  const title = skill.text[lang].title;
  return title ? `${title} (/${skill.slug})` : `/${skill.slug}`;
}
