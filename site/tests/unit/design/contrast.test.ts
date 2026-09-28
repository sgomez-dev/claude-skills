import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/design/contrast';
import { COLORS } from '@/lib/design/tokens';

describe('colour tokens', () => {
  it.each(['ink', 'inkMuted', 'acid', 'pink', 'cyan', 'sun', 'terra'] as const)('%s on night meets WCAG AA', (k) => {
    expect(contrastRatio(COLORS[k], COLORS.night)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['acid', 'pink', 'cyan', 'sun', 'terra', 'ink'] as const)('night text on %s chip meets AA', (k) => {
    expect(contrastRatio(COLORS.night, COLORS[k])).toBeGreaterThanOrEqual(4.5);
  });

  it('globals.css declares the same hex values', () => {
    const css = fs.readFileSync(path.resolve(import.meta.dirname, '../../../src/styles/globals.css'), 'utf8').toLowerCase();
    for (const hex of Object.values(COLORS)) expect(css).toContain(hex.toLowerCase());
  });

  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });
});
