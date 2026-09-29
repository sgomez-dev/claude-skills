import type { MetadataRoute } from 'next';
import { SECTIONS } from '@/content/sections';
import { catalog } from '@/lib/catalog';
import { LANGS } from '@/lib/i18n/languages';
import { absolute } from '@/lib/urls';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; lastModified: string }[] = [
    { path: '', lastModified: catalog.generatedAt },
    ...SECTIONS.map((s) => ({ path: `/${s.id}`, lastModified: catalog.generatedAt })),
    { path: '/credits', lastModified: catalog.generatedAt },
    ...catalog.skills.map((s) => ({ path: `/s/${s.slug}`, lastModified: s.updatedAt ?? catalog.generatedAt })),
  ];
  return LANGS.flatMap((lang) =>
    pages.map((p) => ({
      url: absolute(`/${lang}${p.path}`),
      lastModified: p.lastModified,
      alternates: { languages: { es: absolute(`/es${p.path}`), en: absolute(`/en${p.path}`) } },
    })),
  );
}
