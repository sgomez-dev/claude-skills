import fs from 'node:fs';
import path from 'node:path';
import { hashDescription, TranslationEntrySchema } from './text';
import type { Skill } from './types';

export interface WorkItem {
  slug: string;
  kind: 'command' | 'external';
  description: string;
  sourceHash: string;
  reason: 'missing' | 'stale' | 'invalid';
}

function readEntry(dir: string, slug: string): { state: 'missing' } | { state: 'invalid' } | { state: 'ok'; sourceHash: string } {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return { state: 'missing' };
  try {
    const parsed = TranslationEntrySchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    return parsed.success ? { state: 'ok', sourceHash: parsed.data.sourceHash } : { state: 'invalid' };
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

export function checkTranslations(skills: Skill[], dir: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set(skills.map((s) => s.slug));
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const f of files) {
    const slug = f.slice(0, -'.json'.length);
    if (!slugs.has(slug)) errors.push(`${f}: no such skill`);
    else if (readEntry(dir, slug).state === 'invalid') errors.push(`${f}: invalid`);
  }
  for (const s of skills) {
    const e = readEntry(dir, s.slug);
    if (e.state === 'missing') warnings.push(`${s.slug}: no translation`);
    else if (e.state === 'ok' && e.sourceHash !== hashDescription(s.description)) warnings.push(`${s.slug}: stale (description changed)`);
  }
  return { errors, warnings };
}
