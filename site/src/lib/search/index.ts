import fs from 'node:fs';
import path from 'node:path';
import { getSection } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { LANGS, type Lang } from '@/lib/i18n/languages';
import { truncate } from '@/lib/seo/truncate';
import { paths } from '@/lib/urls';

export interface SearchEntry {
  s: string;
  d: string;
  n: string;
  h: string;
}

export function buildSearchIndex(catalog: Catalog, lang: Lang): SearchEntry[] {
  return catalog.skills.map((sk) => ({
    s: sk.slug,
    d: truncate(sk.text[lang].description, 200),
    n: getSection(sk.section).name[lang],
    h: paths.skill(lang, sk.slug),
  }));
}

export function writeSearchIndexes(catalog: Catalog, publicDir: string): void {
  const dir = path.join(publicDir, 'search');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const lang of LANGS) fs.writeFileSync(path.join(dir, `${lang}.json`), JSON.stringify(buildSearchIndex(catalog, lang)));
}
