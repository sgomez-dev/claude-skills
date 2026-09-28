import { execFileSync } from 'node:child_process';

/** Latest commit date (ISO) per repo-relative path. Empty map when git is unavailable. */
export function readGitDates(repoRoot: string, pathspecs: string[]): Map<string, string> {
  let out: string;
  try {
    out = execFileSync('git', ['log', '--format=__%cI', '--name-only', '--', ...pathspecs], {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 512 * 1024 * 1024,
    });
  } catch {
    return new Map();
  }
  const dates = new Map<string, string>();
  let current = '';
  for (const line of out.split('\n')) {
    if (line.startsWith('__')) current = line.slice(2).trim();
    else if (line.trim() && !dates.has(line.trim())) dates.set(line.trim(), current);
  }
  return dates;
}
