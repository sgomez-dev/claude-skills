import type { Lang } from '@/lib/i18n/languages';

export const SECTION_IDS = ['video', 'web', 'brand', 'ads', 'sales', 'business', 'ai', 'data', 'code'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Permissions {
  reads: string[];
  writes: string[];
  commands: string[];
  network: boolean;
  destructive: boolean;
}

export interface SkillText {
  description: string;
  howToAsk: string[];
  translated: boolean;
}

interface SkillBase {
  slug: string;
  name: string;
  description: string;
  section: SectionId;
  sourcePath: string;
  updatedAt: string | null;
  text: Record<Lang, SkillText>;
}

export interface CommandSkill extends SkillBase {
  kind: 'command';
  category: string;
  bundle: string | null;
  permissions: Permissions;
}

export interface Upstream {
  url: string;
  owner: string;
  repo: string;
  commit: string;
  path: string;
}

export interface ExternalSkill extends SkillBase {
  kind: 'external';
  license: string;
  upstream: Upstream;
}

export type Skill = CommandSkill | ExternalSkill;

export interface PipelineStep {
  name: string;
  skill: string;
  description: string;
}

export interface Pipeline {
  slug: string;
  name: string;
  description: string;
  trigger: string;
  steps: PipelineStep[];
}

export interface Catalog {
  generatedAt: string;
  counts: { commands: number; external: number; total: number };
  skills: Skill[];
  pipelines: Pipeline[];
}

export type RawCommand = Omit<CommandSkill, 'section' | 'text' | 'updatedAt' | 'bundle'>;
export type RawExternal = Omit<ExternalSkill, 'section' | 'text' | 'updatedAt'> & { commitDate: string | null };
