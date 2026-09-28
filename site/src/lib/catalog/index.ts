import data from '../../../.generated/catalog.json';
import type { Catalog, SectionId, Skill } from './types';

export const catalog = data as unknown as Catalog;

const bySlug = new Map(catalog.skills.map((s) => [s.slug, s]));

export function getSkill(slug: string): Skill | undefined {
  return bySlug.get(slug);
}

export function skillsInSection(id: SectionId): Skill[] {
  return catalog.skills.filter((s) => s.section === id);
}

function groupOf(s: Skill): string {
  return s.kind === 'command' ? s.category : s.upstream.repo;
}

/** Same section; same category or upstream first, then the rest, alphabetically. Deterministic. */
export function relatedSkills(skill: Skill, n = 6): Skill[] {
  const pool = skillsInSection(skill.section).filter((s) => s.slug !== skill.slug);
  const same = pool.filter((s) => groupOf(s) === groupOf(skill));
  const rest = pool.filter((s) => groupOf(s) !== groupOf(skill));
  return [...same, ...rest].slice(0, n);
}
