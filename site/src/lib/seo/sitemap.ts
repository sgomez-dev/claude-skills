import type { MetadataRoute } from 'next';
import { SECTIONS } from '@/content/sections';
import { catalogUpdatedAt, latestDate, sectionUpdatedAt } from '@/lib/catalog/dates';
import type { Catalog } from '@/lib/catalog/types';
import { LANGS } from '@/lib/i18n/languages';
import { absolute } from '@/lib/urls';

/**
 * `lastModified` is always a date the content really changed on (newest skill date), never the build time:
 * two builds of the same catalog give a byte-identical sitemap, and Google keeps trusting the field.
 * A page with no known date has no `lastModified` at all.
 */
export function buildSitemap(catalog: Catalog): MetadataRoute.Sitemap {
  const pages: { path: string; lastModified: string | null }[] = [
    { path: '', lastModified: catalogUpdatedAt(catalog) },
    ...SECTIONS.map((s) => ({ path: `/${s.id}`, lastModified: sectionUpdatedAt(catalog, s.id) })),
    { path: '/credits', lastModified: latestDate(catalog.skills.filter((s) => s.kind === 'external').map((s) => s.updatedAt)) },
    { path: '/methodology', lastModified: null },
    ...catalog.skills.map((s) => ({ path: `/s/${s.slug}`, lastModified: s.updatedAt })),
  ];
  return LANGS.flatMap((lang) =>
    pages.map((p) => ({
      url: absolute(`/${lang}${p.path}`),
      ...(p.lastModified ? { lastModified: p.lastModified } : {}),
      alternates: { languages: { es: absolute(`/es${p.path}`), en: absolute(`/en${p.path}`), 'x-default': absolute(`/en${p.path}`) } },
    })),
  );
}
