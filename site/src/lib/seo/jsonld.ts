import type { BreadcrumbList, FAQPage, ItemList, Person, SoftwareApplication, WebSite, WithContext } from 'schema-dts';
import type { Skill } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';
import { AUTHOR, SITE_URL } from '@/lib/site';
import { absolute, paths, sourceUrl } from '@/lib/urls';

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function authorLd(): Person {
  return { '@type': 'Person', '@id': `${SITE_URL}/#author`, name: AUTHOR.name, url: AUTHOR.url };
}

export function websiteLd(lang: Lang): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Claude Skills',
    url: absolute(paths.home(lang)),
    inLanguage: lang,
    publisher: authorLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absolute(paths.home(lang))}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    } as never,
  };
}

export function skillLd(skill: Skill, lang: Lang, description: string): WithContext<SoftwareApplication> {
  const base: WithContext<SoftwareApplication> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `/${skill.slug}`,
    alternateName: skill.name,
    description,
    url: absolute(paths.skill(lang, skill.slug)),
    inLanguage: lang,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    ...(skill.updatedAt ? { dateModified: skill.updatedAt } : {}),
  };
  if (skill.kind === 'command') {
    return { ...base, author: authorLd(), publisher: authorLd(), license: 'https://spdx.org/licenses/MIT.html', sameAs: sourceUrl(skill) };
  }
  const license = skill.license.startsWith('LicenseRef') ? sourceUrl(skill) : `https://spdx.org/licenses/${skill.license}.html`;
  // Externals are credited to their upstream owner; this site neither authored nor publishes them.
  const owner = skill.upstream.owner;
  return { ...base, author: { '@type': 'Person', name: owner, url: `https://github.com/${owner}` }, isBasedOn: skill.upstream.url, license, sameAs: sourceUrl(skill) };
}

export function breadcrumbLd(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function itemListLd(items: { name: string; path: string }[]): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absolute(it.path) })),
  };
}

export function faqLd(faq: { q: string; a: string }[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
