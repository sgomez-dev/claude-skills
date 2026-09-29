import { describe, expect, it } from 'vitest';
import { buildSearchIndex, type SearchEntry } from '@/lib/search/index';
import { createSearcher } from '@/lib/search/searcher';
import type { Catalog, CommandSkill } from '@/lib/catalog/types';

const entries: SearchEntry[] = [
  { s: 'legal--contract-review', d: 'Revisa un borrador de contrato y marca cláusulas de riesgo', n: 'Negocio', h: '/es/s/legal--contract-review', k: 'legal contratos' },
  { s: 'embedded-captions', d: 'Subtítulos incrustados con estilo karaoke', n: 'Video & Motion', h: '/es/s/embedded-captions', k: 'Video & Motion' },
  { s: 'git--commit', d: 'Mensajes de commit claros', n: 'Código', h: '/es/s/git--commit', k: 'git control de versiones' },
];

describe('searcher', () => {
  const search = createSearcher(entries);
  it('finds by Spanish word', () => expect(search('contrato')[0]?.s).toBe('legal--contract-review'));
  it('ignores diacritics', () => {
    expect(search('clausulas')[0]?.s).toBe('legal--contract-review');
    expect(search('subtitulos')[0]?.s).toBe('embedded-captions');
  });
  it('finds by slug fragment', () => expect(search('commit')[0]?.s).toBe('git--commit'));
  it('returns nothing for an empty query', () => expect(search('  ')).toEqual([]));
});

describe('buildSearchIndex', () => {
  it('uses the language text and section name', () => {
    const skill = {
      kind: 'command', slug: 'legal--contract-review', section: 'business', category: 'legal',
      text: { en: { description: 'Review a contract', howToAsk: [], translated: true }, es: { description: 'Revisa un contrato', howToAsk: [], translated: true } },
    } as unknown as CommandSkill;
    const catalog = { skills: [skill] } as Catalog;
    expect(buildSearchIndex(catalog, 'es')).toEqual([{ s: 'legal--contract-review', d: 'Revisa un contrato', n: 'Negocio', h: '/es/s/legal--contract-review', k: 'legal contratos' }]);
  });
});
