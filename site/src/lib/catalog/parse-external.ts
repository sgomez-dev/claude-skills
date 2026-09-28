import fs from 'node:fs';
import path from 'node:path';
import { cleanDescription, parseFrontmatter, toPosix } from './clean';
import { detectLicense } from './license';
import type { RawExternal, Upstream } from './types';

export function listExternalDirs(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'external');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && fs.existsSync(path.join(base, d.name, 'SKILL.md')))
    .map((d) => path.join(base, d.name))
    .sort((a, b) => a.localeCompare(b));
}

function parseUpstream(md: string, rel: string): { upstream: Upstream; commitDate: string | null } {
  const repo = md.match(/^- Source repo: <(https:\/\/github\.com\/([^/>]+)\/([^/>]+))>/m);
  const commit = md.match(/^- Vendored commit: `([0-9a-f]+)`/m);
  const upath = md.match(/^- Upstream path: `([^`]+)`/m);
  const date = md.match(/^- Commit date: (\S+)/m);
  if (!repo || !commit || !upath) throw new Error(`${rel}/UPSTREAM.md: unrecognised format`);
  return {
    upstream: { url: repo[1]!, owner: repo[2]!, repo: `${repo[2]}/${repo[3]}`, commit: commit[1]!, path: upath[1]! },
    commitDate: date?.[1] ?? null,
  };
}

export function parseExternal(dir: string, repoRoot: string): RawExternal {
  const rel = toPosix(path.relative(repoRoot, dir));
  const slug = path.basename(dir);
  const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
  const description = cleanDescription(data.description);
  if (!description) throw new Error(`${rel}/SKILL.md: missing description`);
  const licensePath = path.join(dir, 'LICENSE');
  if (!fs.existsSync(licensePath)) throw new Error(`${rel}: missing LICENSE`);
  const upstreamPath = path.join(dir, 'UPSTREAM.md');
  if (!fs.existsSync(upstreamPath)) throw new Error(`${rel}: missing UPSTREAM.md`);
  const { upstream, commitDate } = parseUpstream(fs.readFileSync(upstreamPath, 'utf8'), rel);
  const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : slug;
  return {
    kind: 'external',
    slug,
    name,
    description,
    sourcePath: rel,
    license: detectLicense(fs.readFileSync(licensePath, 'utf8')),
    upstream,
    commitDate,
  };
}
