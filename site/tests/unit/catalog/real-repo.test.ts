import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalog } from '@/lib/catalog/build';
import { readPrivateNames } from '@/lib/catalog/guard';
import { listCommandFiles } from '@/lib/catalog/parse-command';
import { listExternalDirs } from '@/lib/catalog/parse-external';
import { SKILL_OVERRIDES } from '@/lib/catalog/sections-map';
import { SECTION_IDS } from '@/lib/catalog/types';

const REPO = path.resolve(import.meta.dirname, '../../../..');
const catalog = buildCatalog({ repoRoot: REPO, translationsDir: fs.mkdtempSync(path.join(os.tmpdir(), 'tr-')) });
const slugs = new Set(catalog.skills.map((s) => s.slug));

describe('real repository', () => {
  it('catalogs every public command and external skill', () => {
    expect(catalog.counts.commands).toBe(listCommandFiles(REPO).length);
    expect(catalog.counts.external).toBe(listExternalDirs(REPO).length);
    expect(catalog.counts.commands).toBeGreaterThanOrEqual(327);
    expect(catalog.counts.external).toBeGreaterThanOrEqual(151);
  });

  it('has no dangling section overrides', () => {
    for (const slug of Object.keys(SKILL_OVERRIDES)) expect(slugs, slug).toContain(slug);
  });

  it('puts at least one skill in every section', () => {
    for (const id of SECTION_IDS) expect(catalog.skills.some((s) => s.section === id), id).toBe(true);
  });

  it('never includes a private skill', () => {
    for (const name of readPrivateNames(REPO)) expect(slugs.has(name), name).toBe(false);
  });
});
