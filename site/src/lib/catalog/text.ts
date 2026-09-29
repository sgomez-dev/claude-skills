import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import type { Lang } from '@/lib/i18n/languages';
import type { SkillText } from './types';

/**
 * Authored copy, per skill and per language. Every field is optional: entries written before these fields existed stay
 * valid and the site falls back deterministically (title -> slug, summary -> the description cut at a word boundary).
 * Length and wording rules are enforced by `translations:check`, not here, so a slightly long summary never makes the
 * whole entry "invalid" (which would throw away the translation too).
 */
const copyFields = {
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  useWhen: z.array(z.string().min(1)).optional(),
  notFor: z.array(z.string().min(1)).optional(),
  output: z.string().min(1).optional(),
  faq: z.array(z.strictObject({ q: z.string().min(1), a: z.string().min(1) })).optional(),
};

export const TranslationEntrySchema = z.strictObject({
  sourceHash: z.string().regex(/^[0-9a-f]{16}$/),
  es: z.strictObject({ description: z.string().min(1), howToAsk: z.array(z.string().min(1)).length(3), ...copyFields }),
  en: z.strictObject({ howToAsk: z.array(z.string().min(1)).length(3), ...copyFields }),
});
export type TranslationEntry = z.infer<typeof TranslationEntrySchema>;

export function hashDescription(description: string): string {
  return createHash('sha256').update(description).digest('hex').slice(0, 16);
}

type Authored = Pick<SkillText, 'title' | 'summary' | 'useWhen' | 'notFor' | 'output' | 'faq'>;

/** Only the fields that exist: an absent field stays absent (the catalog is JSON, so undefined would vanish anyway). */
function authored(src: Authored): Authored {
  const out: Authored = {};
  if (src.title) out.title = src.title;
  if (src.summary) out.summary = src.summary;
  if (src.useWhen?.length) out.useWhen = src.useWhen;
  if (src.notFor?.length) out.notFor = src.notFor;
  if (src.output) out.output = src.output;
  if (src.faq?.length) out.faq = src.faq;
  return out;
}

export function resolveText(description: string, entry: TranslationEntry | null): Record<Lang, SkillText> {
  const fresh = entry !== null && entry.sourceHash === hashDescription(description);
  return {
    en: { description, howToAsk: fresh ? entry.en.howToAsk : [], translated: true, ...(fresh ? authored(entry.en) : {}) },
    es: fresh
      ? { description: entry.es.description, howToAsk: entry.es.howToAsk, translated: true, ...authored(entry.es) }
      : { description, howToAsk: [], translated: false },
  };
}

export function loadTranslation(dir: string, slug: string): TranslationEntry | null {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  return parsed.success ? parsed.data : null;
}
