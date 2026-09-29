import { getSection, SECTIONS } from '@/content/sections';
import type { SectionId } from '@/lib/catalog/types';
import { COLORS } from '@/lib/design/tokens';
import { isLang, LANGS } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills section';
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => SECTIONS.map((s) => ({ lang, section: s.id })));
}


export default async function Image({ params }: { params: Promise<{ lang: string; section: string }> }) {
  const p = await params;
  const lang = isLang(p.lang) ? p.lang : 'en';
  const s = getSection(p.section as SectionId);
  return renderCover({ kicker: `${s.number} ${s.name[lang]}`, lead: s.headline[lang].lead, accent: s.headline[lang].accent, body: s.dek[lang], accentColor: COLORS[s.accent] });
}
