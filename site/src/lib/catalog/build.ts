import fs from 'node:fs';
import path from 'node:path';
import { assertNoPrivate, readPrivateNames } from './guard';
import { listCommandFiles, parseCommand } from './parse-command';
import { listExternalDirs, parseExternal } from './parse-external';
import { listPipelineFiles, parsePipeline } from './parse-pipeline';
import { CatalogSchema } from './schema';
import { sectionFor } from './sections-map';
import { loadTranslation, resolveText } from './text';
import type { Catalog, CommandSkill, ExternalSkill, Skill } from './types';

export interface BuildOptions {
  repoRoot: string;
  translationsDir: string;
  gitDates?: Map<string, string>;
  now?: Date;
}

function readBundles(repoRoot: string): Map<string, string> {
  const file = path.join(repoRoot, '.claude-plugin', 'marketplace.json');
  const bundles = new Map<string, string>();
  if (!fs.existsSync(file)) return bundles;
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { plugins?: { name: string; source?: { path?: string } }[] };
  for (const p of data.plugins ?? []) {
    const m = p.source?.path?.match(/^skills\/([^/]+)$/);
    if (m?.[1]) bundles.set(m[1], p.name);
  }
  return bundles;
}

function assertUniqueSlugs(skills: Skill[]): void {
  const seen = new Set<string>();
  for (const s of skills) {
    if (seen.has(s.slug)) throw new Error(`duplicate slug ${s.slug}`);
    seen.add(s.slug);
  }
}

export function buildCatalog({ repoRoot, translationsDir, gitDates = new Map(), now = new Date() }: BuildOptions): Catalog {
  const bundles = readBundles(repoRoot);

  const commands: CommandSkill[] = listCommandFiles(repoRoot)
    .map((f) => parseCommand(f, repoRoot))
    .map((raw) => ({
      ...raw,
      bundle: bundles.get(raw.category) ?? null,
      section: sectionFor(raw),
      updatedAt: gitDates.get(raw.sourcePath) ?? null,
      text: resolveText(raw.description, loadTranslation(translationsDir, raw.slug)),
    }));

  const externals: ExternalSkill[] = listExternalDirs(repoRoot)
    .map((d) => parseExternal(d, repoRoot))
    .map(({ commitDate, ...raw }) => ({
      ...raw,
      section: sectionFor(raw),
      updatedAt: commitDate,
      text: resolveText(raw.description, loadTranslation(translationsDir, raw.slug)),
    }));

  const skills: Skill[] = [...commands, ...externals].sort((a, b) => a.slug.localeCompare(b.slug));
  assertUniqueSlugs(skills);

  const catalog = CatalogSchema.parse({
    generatedAt: now.toISOString(),
    counts: { commands: commands.length, external: externals.length, total: skills.length },
    skills,
    pipelines: listPipelineFiles(repoRoot).map(parsePipeline),
  }) as Catalog;

  assertNoPrivate(catalog, readPrivateNames(repoRoot));
  return catalog;
}
