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

export interface SkillFaq {
  q: string;
  a: string;
}

/**
 * Per-language copy. `title`, `summary` and the A14 blocks are authored in the translation cache and are all optional:
 * a skill without them falls back deterministically (see lib/catalog/copy.ts). Absent fields are omitted, never null.
 */
export interface SkillText {
  description: string;
  howToAsk: string[];
  translated: boolean;
  title?: string;
  summary?: string;
  useWhen?: string[];
  keywords?: string[];
  notFor?: string[];
  output?: string;
  faq?: SkillFaq[];
}

interface SkillBase {
  slug: string;
  name: string;
  description: string;
  section: SectionId;
  sourcePath: string;
  /** Hash of the whole skill source file (SKILL.md or the command .md): what the authored copy was written against. */
  copyHash: string;
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

export type RawCommand = Omit<CommandSkill, 'section' | 'text' | 'updatedAt' | 'bundle' | 'copyHash'>;
export type RawExternal = Omit<ExternalSkill, 'section' | 'text' | 'updatedAt' | 'copyHash'> & { commitDate: string | null };
