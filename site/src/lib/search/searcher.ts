import Fuse from 'fuse.js';
import type { SearchEntry } from './index';

/** NFD decomposition + diacritic stripping + lowercase. */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Normalized words, split on anything that is not a letter or digit. */
function words(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
}

interface Prepared {
  entry: SearchEntry;
  wordSet: Set<string>;
  haystack: string;
}

export function createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[] {
  const fuse = new Fuse(entries, {
    keys: [{ name: 'd', weight: 2 }, { name: 's', weight: 1 }, { name: 'n', weight: 0.3 }],
    includeScore: true,
    ignoreFieldNorm: true,
    ignoreDiacritics: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
  });
  const prepared = new Map<SearchEntry, Prepared>();
  for (const entry of entries) {
    prepared.set(entry, {
      entry,
      wordSet: new Set([...words(entry.d), ...words(entry.s)]),
      haystack: `${normalize(entry.d)} ${normalize(entry.s)}`,
    });
  }

  return (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    const qWords = words(trimmed);
    const hits = fuse.search(trimmed, { limit: 50 });

    const ranked = hits.map((r, idx) => {
      const p = prepared.get(r.item)!;
      let whole = 0;
      let partial = 0;
      for (const w of qWords) {
        if (p.wordSet.has(w)) whole++;
        else if (p.haystack.indexOf(w) !== -1) partial++;
      }
      // 1: whole-word match, 2: partial (substring) match, 3: fuzzy only
      const tier = whole > 0 ? 1 : partial > 0 ? 2 : 3;
      return { item: r.item, idx, tier, whole, score: r.score ?? 0 };
    });

    ranked.sort((a, b) =>
      a.tier - b.tier ||
      b.whole - a.whole ||
      a.score - b.score ||
      a.idx - b.idx,
    );
    return ranked.slice(0, 20).map((x) => x.item);
  };
}
