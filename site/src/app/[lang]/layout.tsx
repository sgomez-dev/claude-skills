import type { ReactNode } from 'react';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
