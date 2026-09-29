import data from '../../../.generated/catalog.json';
import { catalogUpdatedAt as catalogUpdatedAtOf, sectionUpdatedAt as sectionUpdatedAtOf } from './dates';
import { pairedSkills as pairedSkillsOf, pipelinesOf as pipelinesOfIn, relatedSkills as relatedSkillsOf } from './related';
import type { Catalog, Pipeline, SectionId, Skill } from './types';

/**
 * The generated catalog and helpers bound to it. Code that also runs inside `scripts/generate.ts` (before this file
 * exists) must use the pure modules (dates, related, figures) with an explicit catalog instead of importing this one.
 */
export const catalog = data as unknown as Catalog;

const bySlug = new Map(catalog.skills.map((s) => [s.slug, s]));

export function getSkill(slug: string): Skill | undefined {
  return bySlug.get(slug);
}

export function skillsInSection(id: SectionId): Skill[] {
  return catalog.skills.filter((s) => s.section === id);
}

export const sectionUpdatedAt = (id: SectionId): string | null => sectionUpdatedAtOf(catalog, id);
export const catalogUpdatedAt = (): string | null => catalogUpdatedAtOf(catalog);
export const relatedSkills = (skill: Skill, n?: number, exclude?: ReadonlySet<string>): Skill[] => relatedSkillsOf(catalog, skill, n, exclude);
export const pairedSkills = (skill: Skill, n?: number): Skill[] => pairedSkillsOf(catalog, skill, n);
export const pipelinesOf = (slug: string): Pipeline[] => pipelinesOfIn(catalog, slug);
