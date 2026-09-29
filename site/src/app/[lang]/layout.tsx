import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Masthead } from '@/components/layout/Masthead';
import { SearchDialog } from '@/components/search/SearchDialog';
import { catalog } from '@/lib/catalog';
import { bricolage, instrument, jetbrains } from '@/lib/fonts';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS } from '@/lib/i18n/languages';
import { INTRO_KEY } from '@/lib/motion/intro-key';
import { AUTHOR, SITE_URL } from '@/lib/site';
import '@/styles/globals.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: '#0d0d0f', colorScheme: 'dark' };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: `%s · ${d.meta.siteName}` },
    applicationName: d.meta.siteName,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <html lang={lang} className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="author" type="text/plain" href="/humans.txt" />
        {/* Arms the cover intro before first paint. The 1.5 s timeout is the failsafe: if the intro never starts, nothing stays hidden. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;d.classList.add('js');try{if(/^\\/(es|en)\\/?$/.test(location.pathname)&&!sessionStorage.getItem('${INTRO_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-pending');setTimeout(function(){d.classList.remove('intro-pending')},1500)}}catch(e){}})()` }} />
      </head>
      <body className="min-h-dvh bg-night text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-acid focus:px-4 focus:py-2 focus:text-night">
          {d.nav.skipToContent}
        </a>
        <Masthead lang={lang} dict={d} generatedAt={catalog.generatedAt} total={catalog.counts.total} />
        <div id="main">{children}</div>
        <Footer lang={lang} dict={d} />
        <SearchDialog lang={lang} labels={{ ...d.search, placeholder: d.search.placeholder(catalog.counts.total) }} />
      </body>
    </html>
  );
}
