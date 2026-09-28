import { en, type Dictionary } from './dictionaries/en';
import { es } from './dictionaries/es';
import type { Lang } from './languages';

const DICTIONARIES: Record<Lang, Dictionary> = { en, es };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
export type { Dictionary };
