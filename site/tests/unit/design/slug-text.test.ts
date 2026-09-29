import { describe, expect, it } from 'vitest';
import { splitDoubleHyphens } from '@/lib/slug-text';

describe('splitDoubleHyphens', () => {
  it('round-trips, so rendered and copied text keep both hyphens', () => {
    for (const s of ['/finance--budget-planner', 'a--b--c', 'no-pair', '--', '']) expect(splitDoubleHyphens(s).join('--')).toBe(s);
  });
  it('splits at each pair only', () => {
    expect(splitDoubleHyphens('/legal--contract-review')).toEqual(['/legal', 'contract-review']);
  });
});
