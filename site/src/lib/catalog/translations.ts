import fs from 'node:fs';
import path from 'node:path';
import { SECTIONS, type SectionDef } from '@/content/sections';
import { LANGS } from '@/lib/i18n/languages';
import { blockProblems, sectionProblems, summaryProblems, titleProblems } from './copy-rules';
import { hashDescription, TranslationEntrySchema, type TranslationEntry } from './text';
import type { SectionId, Skill } from './types';

export { ROUTER_PHRASING, SUMMARY_MAX, SUMMARY_MIN } from './copy-rules';

export interface WorkItem {
  slug: string;
  kind: 'command' | 'external';
  description: string;
  sourceHash: string;
  reason: 'missing' | 'stale' | 'invalid';
}

type Read = { state: 'missing' } | { state: 'invalid' } | { state: 'ok'; sourceHash: string; entry: TranslationEntry };

function readEntry(dir: string, slug: string): Read {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return { state: 'missing' };
  try {
    const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    return parsed.success ? { state: 'ok', sourceHash: parsed.data.sourceHash, entry: parsed.data } : { state: 'invalid' };
  } catch {
    return { state: 'invalid' };
  }
}

export function planTranslations(skills: Skill[], dir: string): WorkItem[] {
  const items: WorkItem[] = [];
  for (const s of skills) {
    const sourceHash = hashDescription(s.description);
    const e = readEntry(dir, s.slug);
    const reason = e.state === 'missing' ? 'missing' : e.state === 'invalid' ? 'invalid' : e.sourceHash !== sourceHash ? 'stale' : null;
    if (reason) items.push({ slug: s.slug, kind: s.kind, description: s.description, sourceHash, reason });
  }
  return items;
}

export interface CopyItem {
  slug: string;
  kind: 'command' | 'external';
  section: SectionId;
  sourcePath: string;
  description: string;
  sourceHash: string;
  copyHash: string;
  reason: 'missing' | 'stale';
  /** Which authored fields are absent, e.g. `es.title`. */
  missing: string[];
}

/**
 * Skills whose authored copy needs a session: title or summary absent in either language, or written against a different
 * version of the skill file (`copyHash` differs, or was never recorded). A refresh keeps every authored field and rewrites
 * only what the new file contradicts, then stores the `copyHash` from the work item.
 */
export function planCopy(skills: Skill[], dir: string): CopyItem[] {
  const items: CopyItem[] = [];
  for (const s of skills) {
    const e = readEntry(dir, s.slug);
    const missing: string[] = [];
    if (e.state !== 'ok') missing.push(...LANGS.flatMap((l) => [`${l}.title`, `${l}.summary`]));
    else for (const l of LANGS) for (const f of ['title', 'summary'] as const) if (!e.entry[l][f]) missing.push(`${l}.${f}`);
    const stale = e.state === 'ok' && e.entry.copyHash !== s.copyHash;
    if (!missing.length && !stale) continue;
    items.push({
      slug: s.slug, kind: s.kind, section: s.section, sourcePath: s.sourcePath, description: s.description,
      sourceHash: hashDescription(s.description), copyHash: s.copyHash, reason: missing.length ? 'missing' : 'stale', missing,
    });
  }
  return items;
}

export function copyProblems(entry: TranslationEntry): string[] {
  const problems: string[] = [];
  for (const lang of LANGS) {
    const { title, summary } = entry[lang];
    if (title !== undefined) problems.push(...titleProblems(lang, title));
    if (summary !== undefined) problems.push(...summaryProblems(lang, summary));
  }
  return problems;
}

/** A14 blocks and keywords, for the fields that exist. */
export function extraProblems(entry: TranslationEntry): string[] {
  return LANGS.flatMap((lang) => blockProblems(lang, entry[lang]));
}

/**
 * Invalid or orphan files and malformed present title/summary are errors. Missing fields are not, until `strictCopy`:
 * then missing or stale copy, and every A7/A14 rule, are errors too (Task 20 turns it on in CI once the content exists).
 * Outside strict mode the A7/A14 rules are warnings.
 */
export function checkTranslations(
  skills: Skill[],
  dir: string,
  { strictCopy = false, sections = SECTIONS }: { strictCopy?: boolean; sections?: readonly SectionDef[] } = {},
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const soft = strictCopy ? errors : warnings;
  const slugs = new Set(skills.map((s) => s.slug));
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const f of files) {
    const slug = f.slice(0, -'.json'.length);
    if (!slugs.has(slug)) errors.push(`${f}: no such skill`);
    else {
      const e = readEntry(dir, slug);
      if (e.state === 'invalid') errors.push(`${f}: invalid`);
      else if (e.state === 'ok') {
        for (const p of copyProblems(e.entry)) errors.push(`${f}: ${p}`);
        for (const p of extraProblems(e.entry)) soft.push(`${f}: ${p}`);
      }
    }
  }
  for (const s of skills) {
    const e = readEntry(dir, s.slug);
    if (e.state === 'missing') warnings.push(`${s.slug}: no translation`);
    else if (e.state === 'ok' && e.sourceHash !== hashDescription(s.description)) warnings.push(`${s.slug}: stale (description changed)`);
  }
  for (const p of sectionProblems(slugs, sections)) soft.push(p);
  if (strictCopy) {
    for (const i of planCopy(skills, dir)) errors.push(i.reason === 'missing' ? `${i.slug}: authored copy missing (${i.missing.join(', ')})` : `${i.slug}: authored copy is stale (copyHash differs from the skill file)`);
  }
  return { errors, warnings };
}
