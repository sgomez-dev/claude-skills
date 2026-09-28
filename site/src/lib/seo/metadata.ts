import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n/languages';
import { absolute, mdPath } from '@/lib/urls';
import { truncate } from './truncate';

export function pageMetadata({ lang, path, title, description }: { lang: Lang; path: string; title: string; description: string }): Metadata {
  const url = absolute(`/${lang}${path}`);
  const desc = truncate(description, 160);
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { es: absolute(`/es${path}`), en: absolute(`/en${path}`), 'x-default': absolute(`/en${path}`) },
      types: { 'text/markdown': absolute(mdPath(`/${lang}${path}`)) },
    },
    openGraph: {
      type: 'website', url, title, description: desc, siteName: 'Claude Skills',
      locale: lang === 'es' ? 'es_ES' : 'en_GB', alternateLocale: lang === 'es' ? ['en_GB'] : ['es_ES'],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  };
}
