import { describe, expect, it } from 'vitest';
import { fill } from '@/lib/i18n/format';
import { en } from '@/lib/i18n/dictionaries/en';
import { es } from '@/lib/i18n/dictionaries/es';

describe('fill', () => {
  it('replaces a basic placeholder', () => {
    expect(fill('Hello {name}', { name: 'world' })).toBe('Hello world');
  });

  it('replaces the same key appearing twice', () => {
    expect(fill('{x} and {x}', { x: 'a' })).toBe('a and a');
  });

  it('stringifies a numeric value', () => {
    expect(fill('{n} items', { n: 3 })).toBe('3 items');
  });

  it('leaves an unknown placeholder untouched', () => {
    expect(fill('{known} {unknown}', { known: 'x' })).toBe('x {unknown}');
  });

  it('fills the real dictionary templates', () => {
    expect(fill(en.section.showing, { v: 3, t: 10 })).toBe('Showing 3 of 10');
    expect(fill(es.skill.pluginNote, { bundle: 'legal-skills' })).toBe('Instala el paquete legal-skills completo.');
  });
});
