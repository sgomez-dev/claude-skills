import { describe, expect, it } from 'vitest';
import { filterItems, type GridItem } from '@/components/section/SkillGrid';

const item = (slug: string, kind: GridItem['kind'], group: string, network = false): GridItem => ({
  slug, href: `/en/s/${slug}`, description: slug, kind, group, network, badge: kind,
});
const items = [item('a', 'command', 'legal', true), item('b', 'command', 'finance'), item('c', 'external', 'o/r')];

describe('filterItems', () => {
  it('returns everything by default', () => {
    expect(filterItems(items, { kind: 'all', group: 'all', network: false })).toHaveLength(3);
  });
  it('combines origin, group and network filters', () => {
    expect(filterItems(items, { kind: 'command', group: 'all', network: false }).map((i) => i.slug)).toEqual(['a', 'b']);
    expect(filterItems(items, { kind: 'all', group: 'legal', network: false }).map((i) => i.slug)).toEqual(['a']);
    expect(filterItems(items, { kind: 'all', group: 'all', network: true }).map((i) => i.slug)).toEqual(['a']);
    expect(filterItems(items, { kind: 'external', group: 'legal', network: false })).toEqual([]);
  });
});
