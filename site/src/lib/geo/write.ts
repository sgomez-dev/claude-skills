import fs from 'node:fs';
import path from 'node:path';
import { SECTIONS } from '@/content/sections';
import type { Catalog } from '@/lib/catalog/types';
import { LANGS } from '@/lib/i18n/languages';
import { creditsMarkdown, homeMarkdown, methodologyMarkdown, sectionMarkdown, skillMarkdown } from './markdown';
import { humansTxt } from './humans';
import { llmsFullTxt, llmsTxt } from './llms';

function put(file: string, content: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function writeGeoFiles(catalog: Catalog, publicDir: string): void {
  for (const lang of LANGS) {
    fs.rmSync(path.join(publicDir, lang), { recursive: true, force: true });
    put(path.join(publicDir, `${lang}.md`), homeMarkdown(catalog, lang));
    put(path.join(publicDir, lang, 'credits.md'), creditsMarkdown(catalog, lang));
    put(path.join(publicDir, lang, 'methodology.md'), methodologyMarkdown(catalog, lang));
    for (const s of SECTIONS) put(path.join(publicDir, lang, `${s.id}.md`), sectionMarkdown(catalog, s.id, lang));
    for (const k of catalog.skills) put(path.join(publicDir, lang, 's', `${k.slug}.md`), skillMarkdown(k, lang, catalog));
  }
  put(path.join(publicDir, 'humans.txt'), humansTxt(catalog));
  put(path.join(publicDir, 'llms.txt'), llmsTxt(catalog, 'en'));
  put(path.join(publicDir, 'llms-full.txt'), llmsFullTxt(catalog, 'en'));
  put(path.join(publicDir, 'es', 'llms.txt'), llmsTxt(catalog, 'es'));
  put(path.join(publicDir, 'es', 'llms-full.txt'), llmsFullTxt(catalog, 'es'));
}
