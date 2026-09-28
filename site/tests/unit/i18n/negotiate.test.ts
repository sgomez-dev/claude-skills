import { describe, expect, it } from 'vitest';
import { pickLanguage } from '@/lib/i18n/negotiate';

describe('pickLanguage', () => {
  it.each([
    [null, 'en'],
    ['', 'en'],
    ['*', 'en'],
    ['es', 'es'],
    ['es-MX', 'es'],
    ['en-US,es;q=0.9', 'en'],
    ['fr-FR,fr;q=0.9,es;q=0.8,en;q=0.7', 'es'],
    ['es;q=0,en;q=0.5', 'en'],
    ['de-DE,de;q=0.9', 'en'],
    ['ES-es', 'es'],
    [';;;,,q=abc', 'en'],
  ])('%j → %s', (header, lang) => expect(pickLanguage(header)).toBe(lang));
});
