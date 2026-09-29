import type { MetadataRoute } from 'next';
import { catalog } from '@/lib/catalog';
import { buildSitemap } from '@/lib/seo/sitemap';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(catalog);
}
