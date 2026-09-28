import { DEFAULT_LANG, isLang, type Lang } from './languages';

export function pickLanguage(header: string | null | undefined): Lang {
  if (!header) return DEFAULT_LANG;
  const ranked = header
    .split(',')
    .map((part, i) => {
      const [tag = '', ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { base: tag.trim().toLowerCase().split('-')[0] ?? '', q, i };
    })
    .filter((x) => x.base && Number.isFinite(x.q) && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const r of ranked) if (isLang(r.base)) return r.base;
  return DEFAULT_LANG;
}
