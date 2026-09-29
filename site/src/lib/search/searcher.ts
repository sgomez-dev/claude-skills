import Fuse from 'fuse.js';
import type { SearchEntry } from './index';

/** NFD decomposition + diacritic stripping + lowercase. */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Light plural folding so "contrato" matches "contratos" (and "test" matches "tests"). */
function stem(word: string): string {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

/** Normalized, plural-folded words, split on anything that is not a letter or digit. */
function words(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean).map(stem);
}

/** Whole words of a text mapped to the character index of their first occurrence. */
function wordIndex(text: string): Map<string, number> {
  const map = new Map<string, number>();
  const norm = normalize(text);
  const re = /[a-z0-9]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(norm)) !== null) {
    const w = stem(m[0]);
    if (!map.has(w)) map.set(w, m.index);
  }
  return map;
}

interface Prepared {
  /** Whole words of slug and keywords. */
  metaWords: Set<string>;
  descWords: Map<string, number>;
  haystack: string;
}

export function createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[] {
  const fuse = new Fuse(entries, {
    keys: [
      { name: 'd', weight: 2 },
      { name: 's', weight: 1 },
      { name: 'k', weight: 1 },
      { name: 'n', weight: 0.3 },
    ],
    includeScore: true,
    ignoreFieldNorm: true,
    ignoreDiacritics: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
  });
  const prepared = new Map<SearchEntry, Prepared>();
  for (const entry of entries) {
    const k = entry.k ?? '';
    prepared.set(entry, {
      metaWords: new Set([...words(entry.s), ...words(k)]),
      descWords: wordIndex(entry.d),
      haystack: `${normalize(entry.d)} ${normalize(entry.s)} ${normalize(k)}`,
    });
  }

  return (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    const qWords = words(trimmed);
    const hits = fuse.search(trimmed, { limit: 50 });

    const ranked = hits.map((r, idx) => {
      const p = prepared.get(r.item)!;
      let meta = 0;
      let desc = 0;
      let partial = 0;
      let firstPos = Infinity;
      for (const w of qWords) {
        const pos = p.descWords.get(w);
        if (p.metaWords.has(w)) meta++;
        else if (pos !== undefined) desc++;
        else if (p.haystack.indexOf(w) !== -1) partial++;
        if (pos !== undefined && pos < firstPos) firstPos = pos;
      }
      // 1: whole-word hit in slug/keywords, 2: whole-word hit only in description,
      // 3: substring hit, 4: fuzzy only
      const tier = meta > 0 ? 1 : desc > 0 ? 2 : partial > 0 ? 3 : 4;
      return { item: r.item, idx, tier, whole: meta + desc, firstPos, score: r.score ?? 0 };
    });

    ranked.sort(
      (a, b) =>
        a.tier - b.tier ||
        b.whole - a.whole ||
        (a.firstPos === b.firstPos ? 0 : a.firstPos < b.firstPos ? -1 : 1) ||
        a.score - b.score ||
        a.idx - b.idx,
    );
    return ranked.slice(0, 20).map((x) => x.item);
  };
}
