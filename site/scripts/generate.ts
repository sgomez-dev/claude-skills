import fs from 'node:fs';
import path from 'node:path';
import { buildCatalog } from '../src/lib/catalog/build';
import { readGitDates } from '../src/lib/catalog/git-dates';
import type { Catalog } from '../src/lib/catalog/types';
import { writeGeoFiles } from '../src/lib/geo/write';
import { writeSearchIndexes } from '../src/lib/search/index';

export type Writer = (catalog: Catalog, publicDir: string) => void;

/** Later tasks register their writers here. */
const WRITERS: Writer[] = [writeSearchIndexes, writeGeoFiles];

const siteRoot = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(siteRoot, '..');
const publicDir = path.join(siteRoot, 'public');

const catalog = buildCatalog({
  repoRoot,
  translationsDir: path.join(siteRoot, 'content', 'i18n', 'skills'),
  gitDates: readGitDates(repoRoot, ['skills']),
});

fs.mkdirSync(path.join(siteRoot, '.generated'), { recursive: true });
fs.writeFileSync(path.join(siteRoot, '.generated', 'catalog.json'), JSON.stringify(catalog));
for (const write of WRITERS) write(catalog, publicDir);

const pendingEs = catalog.skills.filter((s) => !s.text.es.translated).length;
console.log(`catalog: ${catalog.counts.commands} commands + ${catalog.counts.external} external = ${catalog.counts.total}; ES pending: ${pendingEs}`);
