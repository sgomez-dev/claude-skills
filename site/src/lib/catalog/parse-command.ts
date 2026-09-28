import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cleanDescription, toPosix } from './clean';
import type { Permissions, RawCommand } from './types';

export function listCommandFiles(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'skills');
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      fs
        .readdirSync(path.join(base, d.name))
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.join(base, d.name, f)),
    )
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function list(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function parsePermissions(p: unknown, rel: string): Permissions {
  if (p == null || typeof p !== 'object') throw new Error(`${rel}: missing permissions`);
  const o = p as Record<string, unknown>;
  return {
    reads: list(o.reads),
    writes: list(o.writes),
    commands: list(o.commands),
    network: o.network === true,
    destructive: o.destructive === true,
  };
}

export function parseCommand(file: string, repoRoot: string): RawCommand {
  const rel = toPosix(path.relative(repoRoot, file));
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  const description = cleanDescription(data.description);
  if (!description) throw new Error(`${rel}: missing description`);
  const category = path.basename(path.dirname(file));
  const name = path.basename(file, '.md');
  return {
    kind: 'command',
    slug: `${category}--${name}`,
    name,
    category,
    description,
    sourcePath: rel,
    permissions: parsePermissions(data.permissions, rel),
  };
}
