import { isOrgOwner } from '@/lib/catalog/owners';
import type { SectionId, Skill } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';
import { AUTHOR, RAW_URL, REPO_URL, SITE_URL } from '@/lib/site';
import { absolute, paths, sourceUrl } from '@/lib/urls';

/** One JSON-LD node. The types live in schema.org, not here: this file only builds and links them. */
export type LdNode = Record<string, unknown>;

export function serializeJsonLd(data: object): string {
  // The output goes inside a <script>: nothing in it may close the tag or be read as HTML, and U+2028/2029 are line breaks to old parsers.
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const ref = (id: string) => ({ '@id': id });

export const AUTHOR_ID = `${SITE_URL}/#author`;
const websiteId = (lang: Lang) => `${absolute(paths.home(lang))}#website`;

/** Every page ships exactly one script: a @graph whose nodes point at each other by @id. */
export function graph(nodes: LdNode[]): { '@context': 'https://schema.org'; '@graph': LdNode[] } {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function authorLd(): LdNode {
  return {
    '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR.name, url: AUTHOR.url,
    sameAs: [...AUTHOR.sameAs], knowsAbout: ['Claude Code', 'Agent Skills'],
  };
}

export function websiteLd(lang: Lang): LdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(lang),
    name: 'Claude Skills',
    url: absolute(paths.home(lang)),
    inLanguage: lang,
    publisher: ref(AUTHOR_ID),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absolute(paths.home(lang))}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(pageUrl: string, items: { name: string; path: string }[]): LdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function webPageLd({ lang, path, name, description, type = 'WebPage', dateModified, mainEntity, breadcrumb = true }: {
  lang: Lang; path: string; name: string; description: string; type?: 'WebPage' | 'CollectionPage' | 'AboutPage';
  dateModified?: string | null; mainEntity?: string; breadcrumb?: boolean;
}): LdNode {
  const url = absolute(path);
  return {
    '@type': type, '@id': url, url, name, description, inLanguage: lang,
    isPartOf: ref(websiteId(lang)),
    ...(dateModified ? { dateModified } : {}),
    ...(breadcrumb ? { breadcrumb: ref(`${url}#breadcrumb`) } : {}),
    ...(mainEntity ? { mainEntity: ref(mainEntity) } : {}),
  };
}

const CATEGORY: Record<SectionId, string> = {
  video: 'MultimediaApplication', web: 'DesignApplication', brand: 'DesignApplication', ads: 'BusinessApplication',
  sales: 'BusinessApplication', business: 'BusinessApplication', ai: 'DeveloperApplication', data: 'DeveloperApplication', code: 'DeveloperApplication',
};

/** The id of a skill page's SoftwareApplication node. */
export const skillNodeId = (lang: Lang, slug: string) => `${absolute(paths.skill(lang, slug))}#skill`;

/** `name` is the human title (or the slug while it has none); the slug is always `alternateName`. */
export function skillLd(skill: Skill, lang: Lang, { name, description }: { name: string; description: string }): LdNode {
  const url = absolute(paths.skill(lang, skill.slug));
  const external = skill.kind === 'external';
  const license = !external
    ? 'https://spdx.org/licenses/MIT.html'
    : skill.license.startsWith('LicenseRef') ? sourceUrl(skill) : `https://spdx.org/licenses/${skill.license}.html`;
  return {
    '@type': 'SoftwareApplication',
    '@id': skillNodeId(lang, skill.slug),
    name,
    alternateName: `/${skill.slug}`,
    description,
    url,
    mainEntityOfPage: ref(url),
    inLanguage: lang,
    applicationCategory: CATEGORY[skill.section],
    operatingSystem: 'macOS, Linux, Windows',
    softwareRequirements: 'Claude Code',
    // Commands install with the repo's script; a community skill installs from its upstream repository.
    installUrl: external ? skill.upstream.url : `${RAW_URL}/install.sh`,
    ...(skill.text?.[lang]?.keywords?.length ? { keywords: skill.text[lang].keywords } : {}),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    ...(skill.updatedAt ? { dateModified: skill.updatedAt } : {}),
    license,
    isBasedOn: { '@type': 'SoftwareSourceCode', codeRepository: external ? skill.upstream.url : REPO_URL, url: sourceUrl(skill) },
    // Externals are credited to their upstream owner; this site neither authored nor publishes them.
    ...(external
      ? { author: { '@type': isOrgOwner(skill.upstream.owner) ? 'Organization' : 'Person', name: skill.upstream.owner, url: `https://github.com/${skill.upstream.owner}` } }
      : { author: ref(AUTHOR_ID), publisher: ref(AUTHOR_ID) }),
  };
}

export function itemListLd(id: string, items: { name: string; path: string }[]): LdNode {
  return {
    '@type': 'ItemList',
    '@id': id,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absolute(it.path) })),
  };
}

export function faqLd(id: string, faq: { q: string; a: string }[]): LdNode {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
