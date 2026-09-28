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
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'video', number: '01', accent: 'acid',
    name: { es: 'Video & Motion', en: 'Video & Motion' },
    headline: { es: { lead: 'Edita como', accent: 'estudio' }, en: { lead: 'Edit like a', accent: 'studio' } },
    dek: { es: 'Cortes, subtítulos karaoke, motion graphics y sonido. Del bruto al reel.', en: 'Cuts, karaoke captions, motion graphics and sound. From raw footage to reel.' },
  },
  {
    id: 'web', number: '02', accent: 'pink',
    name: { es: 'Web y Diseño', en: 'Web & Design' },
    headline: { es: { lead: 'Webs de', accent: 'premio' }, en: { lead: 'Websites that win', accent: 'awards' } },
    dek: { es: 'Landings, animación con GSAP, interfaces con criterio y accesibilidad.', en: 'Landing pages, GSAP animation, interfaces with taste, and accessibility.' },
  },
  {
    id: 'brand', number: '03', accent: 'sun',
    name: { es: 'Marca y Contenido', en: 'Brand & Content' },
    headline: { es: { lead: 'Una marca con', accent: 'voz propia' }, en: { lead: 'A brand with', accent: 'a voice' } },
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
    headline: { es: { lead: 'Pipeline en', accent: 'piloto' }, en: { lead: 'Pipeline on', accent: 'autopilot' } },
    dek: { es: 'Leads, cold outreach, propuestas, objeciones y tienda online.', en: 'Leads, cold outreach, proposals, objections and online stores.' },
  },
  {
    id: 'business', number: '06', accent: 'sun',
    name: { es: 'Negocio', en: 'Business' },
    headline: { es: { lead: 'Letra', accent: 'pequeña' }, en: { lead: 'The fine', accent: 'print' } },
    dek: { es: 'Contratos, GDPR, finanzas, pricing y producto.', en: 'Contracts, GDPR, finance, pricing and product.' },
  },
  {
    id: 'ai', number: '07', accent: 'cyan',
    name: { es: 'IA y Agentes', en: 'AI & Agents' },
    headline: { es: { lead: 'Máquinas que', accent: 'piensan' }, en: { lead: 'Machines that', accent: 'think' } },
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
    headline: { es: { lead: 'Para los', accent: 'devs' }, en: { lead: 'For the', accent: 'devs' } },
    dek: { es: 'Testing, devops, seguridad, git, cloud y depuración.', en: 'Testing, devops, security, git, cloud and debugging.' },
  },
];

export function getSection(id: SectionId): SectionDef {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown section ${id}`);
  return s;
}
