import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n/languages';
import { absolute, mdPath } from '@/lib/urls';
import { contentHash } from './hash';
import { truncate } from './truncate';

/**
 * `absoluteTitle` skips the layout's "%s · Claude Skills" template: for pages whose title is written as a whole
 * (skills, home, sections with an authored title).
 */
export interface OgImage {
  /** From the dictionaries, in the page's language. */
  alt: string;
  /** What the image shows: a change in it changes the URL, so shared links refresh their preview. */
  seed: string;
}

export function pageMetadata({ lang, path, title, description, absoluteTitle = false, image }: { lang: Lang; path: string; title: string; description: string; absoluteTitle?: boolean; image?: OgImage }): Metadata {
  const url = absolute(`/${lang}${path}`);
  const desc = truncate(description, 160);
  // The page's own opengraph-image route, named explicitly so the alt text can come from the dictionaries.
  const og = image ? { url: absolute(`/${lang}${path}/opengraph-image?v=${contentHash(image.seed)}`), width: 1200, height: 630, type: 'image/png', alt: image.alt } : null;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { es: absolute(`/es${path}`), en: absolute(`/en${path}`), 'x-default': absolute(`/en${path}`) },
      types: { 'text/markdown': absolute(mdPath(`/${lang}${path}`)) },
    },
    openGraph: {
      type: 'website', url, title, description: desc, siteName: 'Claude Skills',
      locale: lang === 'es' ? 'es_ES' : 'en_GB', alternateLocale: lang === 'es' ? ['en_GB'] : ['es_ES'],
      ...(og ? { images: [og] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description: desc, ...(og ? { images: [{ url: og.url, alt: og.alt }] } : {}) },
  };
}
