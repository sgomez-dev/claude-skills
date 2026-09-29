import Fuse from 'fuse.js';
import type { SearchEntry } from './index';

export function createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[] {
  const fuse = new Fuse(entries, {
    keys: [{ name: 's', weight: 2 }, { name: 'd', weight: 1 }, { name: 'n', weight: 0.5 }],
    ignoreDiacritics: true,
    ignoreLocation: true,
    threshold: 0.35,
    minMatchCharLength: 2,
  });
  return (q: string) => (q.trim() ? fuse.search(q.trim(), { limit: 20 }).map((r) => r.item) : []);
}
