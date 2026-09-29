import { notFound } from 'next/navigation';
import { getSection } from '@/content/sections';
import { catalog, getSkill } from '@/lib/catalog';
import { COLORS } from '@/lib/design/tokens';
import { isLang, LANGS } from '@/lib/i18n/languages';
import { OG_SIZE, renderCover } from '@/lib/og/cover';
import { truncate } from '@/lib/seo/truncate';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Claude Skills skill';
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => catalog.skills.map((s) => ({ lang, slug: s.slug })));
}


export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  const skill = getSkill(p.slug);
  if (!skill) notFound();
  const lang = isLang(p.lang) ? p.lang : 'en';
  const s = getSection(skill.section);
  const [head, ...rest] = skill.slug.split('--');
  const lead = rest.length ? `/${head}--` : '/';
  const accent = rest.length ? rest.join('--') : skill.slug;
  return renderCover({ kicker: `${s.number} ${s.name[lang]}`, lead, accent, body: truncate(skill.text[lang].description, 140), accentColor: COLORS[s.accent] });
}
