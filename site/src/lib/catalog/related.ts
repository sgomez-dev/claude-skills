import type { Catalog, Pipeline, Skill } from './types';

function groupOf(s: Skill): string {
  return s.kind === 'command' ? s.category : s.upstream.repo;
}

export const RELATED_COUNT = 6;

/**
 * The next skills after this one in a circular order of its section (grouped by category or upstream, then by slug).
 * Group mates come first, and because the order is a ring every skill is listed by exactly the RELATED_COUNT skills
 * before it: nothing is left without inbound links. Deterministic.
 */
export function relatedSkills(c: Catalog, skill: Skill, n = RELATED_COUNT, exclude: ReadonlySet<string> = new Set()): Skill[] {
  const ring = c.skills.filter((s) => s.section === skill.section).sort((a, b) => groupOf(a).localeCompare(groupOf(b)) || a.slug.localeCompare(b.slug));
  const at = ring.findIndex((s) => s.slug === skill.slug);
  const out: Skill[] = [];
  for (let i = 1; i < ring.length && out.length < n; i++) {
    const next = ring[(at + i) % ring.length]!;
    if (!exclude.has(next.slug)) out.push(next);
  }
  return out;
}

/** Recipes (pipelines) that use this skill. */
export function pipelinesOf(c: Catalog, slug: string): Pipeline[] {
  return c.pipelines.filter((p) => p.steps.some((s) => s.skill === slug));
}

/**
 * "Pairs well with": the other skills of the recipes this one belongs to, those from other sections first.
 * Only slugs that exist in the (public) catalog are ever returned.
 */
export function pairedSkills(c: Catalog, skill: Skill, n = RELATED_COUNT): Skill[] {
  const bySlug = new Map(c.skills.map((s) => [s.slug, s]));
  const seen = new Set<string>([skill.slug]);
  const mates: Skill[] = [];
  for (const p of pipelinesOf(c, skill.slug)) {
    for (const step of p.steps) {
      const s = bySlug.get(step.skill);
      if (s && !seen.has(s.slug)) {
        seen.add(s.slug);
        mates.push(s);
      }
    }
  }
  return [...mates.filter((s) => s.section !== skill.section), ...mates.filter((s) => s.section === skill.section)].slice(0, n);
}
