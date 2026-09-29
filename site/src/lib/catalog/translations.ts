import fs from 'node:fs';
import path from 'node:path';
import { hashDescription, TranslationEntrySchema, type TranslationEntry } from './text';
import type { Skill } from './types';

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

export const TITLE_MAX = 60;
export const SUMMARY_MIN = 60;
export const SUMMARY_MAX = 160;
/** Router-style phrasing from the author's frontmatter: it is written for the agent, not for a reader. */
export const ROUTER_PHRASING = /use when|triggers? include|úsala cuando el usuario/i;

/** Rules for the authored title and summary. Missing fields are fine for now; a field that is present must be right. */
export function copyProblems(entry: TranslationEntry): string[] {
  const problems: string[] = [];
  for (const lang of ['es', 'en'] as const) {
    const { title, summary } = entry[lang];
    if (title !== undefined && (title.trim().length < 1 || title.length > TITLE_MAX)) problems.push(`${lang}.title must be 1-${TITLE_MAX} characters (is ${title.length})`);
    if (summary !== undefined) {
      if (summary.length < SUMMARY_MIN || summary.length > SUMMARY_MAX) problems.push(`${lang}.summary must be ${SUMMARY_MIN}-${SUMMARY_MAX} characters (is ${summary.length})`);
      if (ROUTER_PHRASING.test(summary)) problems.push(`${lang}.summary reads like router text (use when / triggers include)`);
    }
  }
  return problems;
}

export function checkTranslations(skills: Skill[], dir: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set(skills.map((s) => s.slug));
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const f of files) {
    const slug = f.slice(0, -'.json'.length);
    if (!slugs.has(slug)) errors.push(`${f}: no such skill`);
    else {
      const e = readEntry(dir, slug);
      if (e.state === 'invalid') errors.push(`${f}: invalid`);
      else if (e.state === 'ok') for (const p of copyProblems(e.entry)) errors.push(`${f}: ${p}`);
    }
  }
  for (const s of skills) {
    const e = readEntry(dir, s.slug);
    if (e.state === 'missing') warnings.push(`${s.slug}: no translation`);
    else if (e.state === 'ok' && e.sourceHash !== hashDescription(s.description)) warnings.push(`${s.slug}: stale (description changed)`);
  }
  return { errors, warnings };
}
