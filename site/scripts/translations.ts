import fs from 'node:fs';
import path from 'node:path';
import { checkTranslations, planTranslations } from '../src/lib/catalog/translations';
import type { Catalog } from '../src/lib/catalog/types';

const siteRoot = path.resolve(import.meta.dirname, '..');
const dir = path.join(siteRoot, 'content', 'i18n', 'skills');
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, '.generated', 'catalog.json'), 'utf8')) as Catalog;
const command = process.argv[2];

if (command === 'plan') {
  const work = planTranslations(catalog.skills, dir);
  const out = path.join(siteRoot, '.generated', 'translation-worklist.json');
  fs.writeFileSync(out, JSON.stringify(work, null, 2));
  console.log(`${work.length} entries to write → ${path.relative(siteRoot, out)}`);
} else if (command === 'check') {
  const { errors, warnings } = checkTranslations(catalog.skills, dir);
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`error ${e}`);
  console.log(`${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
} else {
  console.error('usage: tsx scripts/translations.ts <plan|check>');
  process.exit(2);
}
