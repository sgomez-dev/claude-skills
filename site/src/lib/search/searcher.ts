import Fuse from 'fuse.js';
import type { SearchEntry } from './index';

/** Normalize text for whole-word matching: NFD decomposition + diacritic removal */
function normalizeForMatch(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function createSearcher(entries: SearchEntry[]): (q: string) => SearchEntry[] {
  const fuse = new Fuse(entries, {
    keys: [{ name: 'd', weight: 2 }, { name: 's', weight: 1 }, { name: 'n', weight: 0.3 }],
    ignoreDiacritics: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
  });
  return (q: string) => {
    if (!q.trim()) return [];
    const normalized = normalizeForMatch(q.trim());
    const results = fuse.search(q.trim(), { limit: 20 });

    // Post-rank: prioritize entries with normalized query as exact word in description
    const resultsWithBoost = results.map((r, idx) => {
      const descNorm = normalizeForMatch(r.item.d);
      const slugNorm = normalizeForMatch(r.item.s);

      // Tier 1: exact word match in description (highest boost)
      const descWords = descNorm.split(/\s+/);
      const hasDescWord = descWords.some(w => w === normalized);

      // Tier 2: whole-word in description (partial word ok)
      const hasDescWholeWord = descWords.some(w => w.includes(normalized)) && !hasDescWord;

      // Tier 3: whole-word in slug
      const slugWords = slugNorm.split(/[-_]/);
      const hasSlugWord = slugWords.some(w => w.includes(normalized));

      let tier = 3;
      if (hasDescWord) tier = 1;
      else if (hasDescWholeWord) tier = 2;
      else if (hasSlugWord) tier = 3;
      else tier = 4;

      // Tie-breaker within tier: count how many times query appears in description
      const descMatches = (descNorm.match(new RegExp(normalized, 'g')) || []).length;

      // Another tie-breaker: skill category (part before first dash)
      const slugCategory = (r.item.s.split('-')[0] || '').toLowerCase();

      // Compute a category relevance score: prefer domain-specific categories
      const categoryRelevanceOrder = ['legal', 'sales', 'product', 'marketing', 'business', 'finance', 'code-quality', 'security', 'testing', 'web', 'mobile', 'api'];
      const categoryRelevance = categoryRelevanceOrder.indexOf(slugCategory) >= 0 ? categoryRelevanceOrder.indexOf(slugCategory) : 999;

      return { result: r, originalIdx: idx, tier, descMatches, categoryRelevance, fuseScore: r.score ?? 0 };
    });

    resultsWithBoost.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      // Within same tier: prioritize by desc match count (higher is better)
      if (a.descMatches !== b.descMatches) return b.descMatches - a.descMatches;
      // Then by category relevance (lower is better - earlier in the order)
      if (a.categoryRelevance !== b.categoryRelevance) return a.categoryRelevance - b.categoryRelevance;
      // Then by Fuse score (lower is better)
      if (a.fuseScore !== b.fuseScore) return a.fuseScore - b.fuseScore;
      return a.originalIdx - b.originalIdx;
    });

    return resultsWithBoost.map(x => x.result.item);
  };
}
