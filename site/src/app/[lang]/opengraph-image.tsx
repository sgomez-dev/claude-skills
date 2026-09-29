import { catalog } from '@/lib/catalog';
import { COLORS } from '@/lib/design/tokens';
import { getDictionary } from '@/lib/i18n';
import { isLang, LANGS } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills';
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}


export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = getDictionary(isLang(lang) ? lang : 'en');
  return renderCover({ kicker: `${catalog.counts.total} skills`, lead: d.home.claim.lead, accent: d.home.claim.accent, body: d.home.dek(catalog.counts.total), accentColor: COLORS.acid });
}
