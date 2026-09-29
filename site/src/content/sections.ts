import type { SectionId } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';

export type Accent = 'acid' | 'pink' | 'cyan' | 'sun' | 'terra';

export interface SectionDef {
  id: SectionId;
  number: string;
  accent: Accent;
  name: Record<Lang, string>;
  headline: Record<Lang, { lead: string; accent: string }>;
  dek: Record<Lang, string>;
  /**
   * Search-facing copy, all optional (Task 20 writes it). Fallbacks: the headline for the title, the dek for the description,
   * no intro block. `intro` is a list of paragraphs; a link to a skill is written `[text](slug)` (see lib/intro.ts).
   */
  seoTitle?: Record<Lang, string>;
  description?: Record<Lang, string>;
  intro?: Record<Lang, string[]>;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'video', number: '01', accent: 'acid',
    name: { es: 'Video & Motion', en: 'Video & Motion' },
    headline: { es: { lead: 'Edita como un', accent: 'estudio' }, en: { lead: 'Edit like a', accent: 'studio' } },
    dek: { es: 'Cortes, subtítulos karaoke, motion graphics y sonido. Del bruto al reel.', en: 'Cuts, karaoke captions, motion graphics and sound. From raw footage to reel.' },
  },
  {
    id: 'web', number: '02', accent: 'pink',
    name: { es: 'Web y Diseño', en: 'Web & Design' },
    headline: { es: { lead: 'Webs con', accent: 'oficio' }, en: { lead: 'Websites with', accent: 'craft' } },
    dek: { es: 'Landings, animación con GSAP, interfaces con criterio y accesibilidad.', en: 'Landing pages, GSAP animation, interfaces with taste, and accessibility.' },
  },
  {
    id: 'brand', number: '03', accent: 'sun',
    name: { es: 'Marca y Contenido', en: 'Brand & Content' },
    headline: { es: { lead: 'Una marca con', accent: 'voz propia' }, en: { lead: 'A brand with', accent: 'its own voice' } },
    dek: { es: 'Identidad, textos que no suenan a IA, imágenes, presentaciones y traducción.', en: 'Identity, copy that does not sound like AI, images, slides and translation.' },
  },
  {
    id: 'ads', number: '04', accent: 'cyan',
    name: { es: 'Ads y Redes', en: 'Ads & Social' },
    headline: { es: { lead: 'Contenido que', accent: 'vende' }, en: { lead: 'Content that', accent: 'sells' } },
    dek: { es: 'Instagram, Meta, TikTok, Google Ads y auditorías de campañas.', en: 'Instagram, Meta, TikTok, Google Ads and campaign audits.' },
  },
  {
    id: 'sales', number: '05', accent: 'acid',
    name: { es: 'Ventas', en: 'Sales' },
    headline: { es: { lead: 'Ventas en', accent: 'piloto automático' }, en: { lead: 'Sales on', accent: 'autopilot' } },
    dek: { es: 'Leads, cold outreach, propuestas, objeciones y tienda online.', en: 'Leads, cold outreach, proposals, objections and online stores.' },
  },
  {
    id: 'business', number: '06', accent: 'sun',
    name: { es: 'Negocio', en: 'Business' },
    headline: { es: { lead: 'Negocio', accent: 'en orden' }, en: { lead: 'Business,', accent: 'in order' } },
    dek: { es: 'Contratos, GDPR, finanzas, pricing y producto.', en: 'Contracts, GDPR, finance, pricing and product.' },
  },
  {
    id: 'ai', number: '07', accent: 'cyan',
    name: { es: 'IA y Agentes', en: 'AI & Agents' },
    headline: { es: { lead: 'Agentes que', accent: 'trabajan' }, en: { lead: 'Agents that', accent: 'get to work' } },
    dek: { es: 'Agentes, RAG, evals, MCP y machine learning.', en: 'Agents, RAG, evals, MCP and machine learning.' },
  },
  {
    id: 'data', number: '08', accent: 'pink',
    name: { es: 'Datos', en: 'Data' },
    headline: { es: { lead: 'Números', accent: 'claros' }, en: { lead: 'Numbers, made', accent: 'clear' } },
    dek: { es: 'SQL, embudos, cohortes, modelos de datos y bases de datos.', en: 'SQL, funnels, cohorts, data models and databases.' },
  },
  {
    id: 'code', number: '09', accent: 'terra',
    name: { es: 'Código', en: 'Code' },
    headline: { es: { lead: 'Código', accent: 'sin drama' }, en: { lead: 'Code,', accent: 'minus the drama' } },
    dek: { es: 'Testing, devops, seguridad, git, cloud y depuración.', en: 'Testing, devops, security, git, cloud and debugging.' },
  },
];

export function getSection(id: SectionId): SectionDef {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown section ${id}`);
  return s;
}
