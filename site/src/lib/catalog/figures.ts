import { catalogUpdatedAt } from './dates';
import type { Catalog } from './types';

export interface Figures {
  total: number;
  /** Written in this repository: MIT. */
  commands: number;
  /** Vendored from upstream: each keeps its own license. */
  external: number;
  repos: number;
  /** Licenses of the external skills, most common first. */
  licenses: { id: string; count: number }[];
  /** ISO timestamp of the newest skill change; null if no date is known. */
  updatedAt: string | null;
}

/** Every number the site states about the catalog is derived here, so copy can never drift from the data. */
export function catalogFigures(c: Catalog): Figures {
  const externals = c.skills.filter((s) => s.kind === 'external');
  const byLicense = new Map<string, number>();
  for (const s of externals) if (s.kind === 'external') byLicense.set(s.license, (byLicense.get(s.license) ?? 0) + 1);
  return {
    total: c.counts.total,
    commands: c.counts.commands,
    external: c.counts.external,
    repos: new Set(externals.map((s) => (s.kind === 'external' ? s.upstream.repo : ''))).size,
    licenses: [...byLicense].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id)),
    updatedAt: catalogUpdatedAt(c),
  };
}
