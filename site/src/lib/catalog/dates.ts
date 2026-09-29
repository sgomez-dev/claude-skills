import type { Catalog, SectionId } from './types';

/** The latest of some ISO timestamps (they carry different UTC offsets, so compare instants, not strings). */
export function latestDate(dates: (string | null | undefined)[]): string | null {
  let best: string | null = null;
  for (const d of dates) if (d && (best === null || Date.parse(d) > Date.parse(best))) best = d;
  return best;
}

/** When the section last changed: the newest `updatedAt` of its skills. Never the build time. */
export function sectionUpdatedAt(c: Catalog, id: SectionId): string | null {
  return latestDate(c.skills.filter((s) => s.section === id).map((s) => s.updatedAt));
}

/** When anything last changed: the newest `updatedAt` in the catalog. Never the build time. */
export function catalogUpdatedAt(c: Catalog): string | null {
  return latestDate(c.skills.map((s) => s.updatedAt));
}

/** The calendar day (UTC) of an instant: `<time datetime>` and the visible date must agree, and the visible one is UTC. */
export function isoDay(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
