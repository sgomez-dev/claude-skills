import type { SectionId, Skill } from '@/lib/catalog/types';
import { isLang, type Lang } from '@/lib/i18n/languages';
import { REPO_URL, SITE_URL } from '@/lib/site';

export const paths = {
  home: (lang: Lang) => `/${lang}`,
  section: (lang: Lang, id: SectionId) => `/${lang}/${id}`,
  skill: (lang: Lang, slug: string) => `/${lang}/s/${slug}`,
  credits: (lang: Lang) => `/${lang}/credits`,
  methodology: (lang: Lang) => `/${lang}/methodology`,
};

export function absolute(p: string): string {
  return new URL(p, SITE_URL).toString().replace(/\/$/, '');
}

export function mdPath(htmlPath: string): string {
  return `${htmlPath}.md`;
}

export function swapLang(pathname: string, to: Lang): string {
  const parts = pathname.split('/');
  if (!isLang(parts[1])) return `/${to}`;
  parts[1] = to;
  return parts.join('/');
}

export function sourceUrl(skill: Skill): string {
  if (skill.kind === 'command') return `${REPO_URL}/blob/main/${skill.sourcePath}`;
  const { url, commit, path } = skill.upstream;
  return path === '.' ? `${url}/tree/${commit}` : `${url}/tree/${commit}/${path}`;
}

/** A recipe has no page of its own yet: it links to its definition in the repository. */
export function pipelineUrl(slug: string): string {
  return `${REPO_URL}/blob/main/pipelines/${slug}.yaml`;
}
