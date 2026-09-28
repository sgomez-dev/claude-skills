import fs from 'node:fs';
import path from 'node:path';
import type { Catalog } from './types';

/** Names only. Never reads the content of private skills. */
export function readPrivateNames(repoRoot: string): string[] {
  const names = new Set<string>();
  const manifest = path.join(repoRoot, 'external', 'sources.local.txt');
  if (fs.existsSync(manifest)) {
    for (const line of fs.readFileSync(manifest, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const name = t.split('|')[0]?.trim();
      if (name) names.add(name);
    }
  }
  const localDir = path.join(repoRoot, 'external', '.local');
  if (fs.existsSync(localDir)) {
    for (const d of fs.readdirSync(localDir, { withFileTypes: true })) if (d.isDirectory()) names.add(d.name);
  }
  return [...names].sort();
}

export function assertNoPrivate(catalog: Catalog, privateNames: string[]): void {
  const priv = new Set(privateNames);
  const leaks = catalog.skills.filter((s) => priv.has(s.slug) || priv.has(s.name) || s.sourcePath.includes('/.local/'));
  if (leaks.length) throw new Error(`private skill(s) in catalog: ${leaks.map((s) => s.slug).join(', ')}`);
}
