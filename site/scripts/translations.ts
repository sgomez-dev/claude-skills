import fs from 'node:fs';
import path from 'node:path';
import { checkTranslations, planCopy, planTranslations } from '../src/lib/catalog/translations';
import type { Catalog } from '../src/lib/catalog/types';

const siteRoot = path.resolve(import.meta.dirname, '..');
const dir = path.join(siteRoot, 'content', 'i18n', 'skills');
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, '.generated', 'catalog.json'), 'utf8')) as Catalog;
const [command, ...flags] = process.argv.slice(2);

if (command === 'plan' && flags.includes('--copy')) {
  const items = planCopy(catalog.skills, dir);
  const bySection: Record<string, typeof items> = {};
  for (const i of items) (bySection[i.section] ??= []).push(i);
  const out = path.join(siteRoot, '.generated', 'copy-worklist.json');
  fs.writeFileSync(out, JSON.stringify(bySection, null, 2));
  console.log(`${items.length} skills need authored copy -> ${path.relative(siteRoot, out)}`);
  for (const [section, list] of Object.entries(bySection)) console.log(`  ${section}: ${list.length} (${list.filter((i) => i.reason === 'stale').length} stale)`);
} else if (command === 'plan') {
  const work = planTranslations(catalog.skills, dir);
  const out = path.join(siteRoot, '.generated', 'translation-worklist.json');
  fs.writeFileSync(out, JSON.stringify(work, null, 2));
  console.log(`${work.length} entries to write → ${path.relative(siteRoot, out)}`);
} else if (command === 'check') {
  const strictCopy = flags.includes('--strict-copy');
  const { errors, warnings } = checkTranslations(catalog.skills, dir, { strictCopy });
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`error ${e}`);
  if (!strictCopy) {
    const pending = planCopy(catalog.skills, dir).length;
    if (pending) console.warn(`warn  ${pending} skills lack authored copy or have stale copy (see: npm run translations:plan -- --copy; enforced by: translations:check -- --strict-copy)`);
  }
  console.log(`${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
} else {
  console.error('usage: tsx scripts/translations.ts <plan [--copy]|check [--strict-copy]>');
  process.exit(2);
}
