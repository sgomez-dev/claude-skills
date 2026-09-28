import type { RawCommand, RawExternal, SectionId } from './types';

export const CATEGORY_SECTION: Record<string, SectionId> = {
  accessibility: 'web', ai: 'ai', api: 'code', automation: 'code', cloud: 'code', 'code-quality': 'code',
  content: 'brand', data: 'data', database: 'data', debugging: 'code', devops: 'code', docs: 'code',
  ecommerce: 'sales', finance: 'business', fullstack: 'code', git: 'code', i18n: 'brand', legal: 'business',
  marketing: 'ads', meta: 'ai', ml: 'ai', mobile: 'code', networking: 'code', observability: 'code',
  performance: 'code', product: 'business', sales: 'sales', scaffold: 'code', security: 'code',
  testing: 'code', utils: 'code', web: 'web',
};

export const REPO_SECTION: Record<string, SectionId> = {
  'heygen-com/hyperframes': 'video',
  'digitalsamba/claude-code-video-toolkit': 'video',
  'nateherkai/hyperframes-student-kit': 'video',
  'haidrrrry/claude-remotion-skill': 'video',
  'AgriciDaniel/claude-shorts': 'video',
  'browser-use/video-use': 'video',
  'emilkowalski/skills': 'web',
  'Leonxlnx/taste-skill': 'web',
  'nextlevelbuilder/ui-ux-pro-max-skill': 'web',
  'pbakaus/impeccable': 'web',
  'kylezantos/design-motion-principles': 'web',
  'greensock/gsap-skills': 'web',
  'oso95/scroll-world': 'web',
  'Hainrixz/claude-webkit': 'web',
  'higgsfield-ai/skills': 'brand',
  'AgriciDaniel/banana-claude': 'brand',
  'AgriciDaniel/claude-ads': 'ads',
  'Jakeschincariol/instagram-agent-skill': 'ads',
  'Panniantong/Agent-Reach': 'ai',
  'vercel-labs/agent-browser': 'code',
};

/** Per-skill exceptions. Keys must be real slugs: real-repo.test.ts checks them. */
export const SKILL_OVERRIDES: Record<string, SectionId> = {
  'content--video-script': 'video',
  'docs--video-spec': 'video',
  'scaffold--remotion': 'video',
  'scaffold--create-video': 'video',
  'utils--ffmpeg': 'video',
  'higgsfield-video-explainer': 'video',
  'higgsfield-websites': 'web',
  brand: 'brand',
  'banner-design': 'brand',
  slides: 'brand',
  brandkit: 'brand',
  humanizer: 'brand',
  'write-swift': 'code',
  'deep-research': 'ai',
  'web-reader': 'data',
  'playwright-cli': 'code',
  'chrome-bridge-automation': 'code',
  'seo-audit': 'code',
};

type SectionInput = Pick<RawCommand, 'kind' | 'slug' | 'category'> | Pick<RawExternal, 'kind' | 'slug' | 'upstream'>;

export function sectionFor(skill: SectionInput): SectionId {
  const override = SKILL_OVERRIDES[skill.slug];
  if (override) return override;
  const section = skill.kind === 'command' ? CATEGORY_SECTION[skill.category] : REPO_SECTION[skill.upstream.repo];
  if (!section) {
    const where = skill.kind === 'command' ? `category "${skill.category}"` : `upstream "${skill.upstream.repo}"`;
    throw new Error(`no section for ${skill.slug} (${where}): add it to site/src/lib/catalog/sections-map.ts`);
  }
  return section;
}
