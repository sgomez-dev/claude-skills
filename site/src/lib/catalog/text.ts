import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import type { Lang } from '@/lib/i18n/languages';
import type { SkillText } from './types';

export const TranslationEntrySchema = z.strictObject({
  sourceHash: z.string().regex(/^[0-9a-f]{16}$/),
  es: z.strictObject({ description: z.string().min(1), howToAsk: z.array(z.string().min(1)).length(3) }),
  en: z.strictObject({ howToAsk: z.array(z.string().min(1)).length(3) }),
});
export type TranslationEntry = z.infer<typeof TranslationEntrySchema>;

export function hashDescription(description: string): string {
  return createHash('sha256').update(description).digest('hex').slice(0, 16);
}

export function resolveText(description: string, entry: TranslationEntry | null): Record<Lang, SkillText> {
  const fresh = entry !== null && entry.sourceHash === hashDescription(description);
  return {
    en: { description, howToAsk: fresh ? entry.en.howToAsk : [], translated: true },
    es: fresh
      ? { description: entry.es.description, howToAsk: entry.es.howToAsk, translated: true }
      : { description, howToAsk: [], translated: false },
  };
}

export function loadTranslation(dir: string, slug: string): TranslationEntry | null {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  return parsed.success ? parsed.data : null;
}
