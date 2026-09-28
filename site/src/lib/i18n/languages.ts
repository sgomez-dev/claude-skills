export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
export function isLang(v: string | undefined): v is Lang {
  return v !== undefined && (LANGS as readonly string[]).includes(v);
}
