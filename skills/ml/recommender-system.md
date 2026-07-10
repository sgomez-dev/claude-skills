---
description: Build a recommender: collaborative/content/hybrid choice, cold start, evaluation
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Build a recommender system that measurably beats a popularity baseline — choosing an approach that fits the
data you actually have, handling cold start, and evaluating offline before anything ships.

Steps:

1. **Frame the problem and inspect the data** (`$ARGUMENTS`)
   - Detect the Python/ML stack from the repo
   - Clarify the goal (what to recommend, to whom, where it appears) and the feedback type: explicit ratings vs
     implicit signals (clicks, views, purchases)
   - Profile the interaction data: users, items, sparsity, and how much per-item/per-user metadata exists

2. **Set a baseline first**
   Implement a trivial baseline (most-popular, or recently-popular per segment). Everything you build must beat
   this, or it isn't worth the complexity.

3. **Choose the approach**
   Pick and justify: content-based (rich item features, cold catalog), collaborative filtering (dense
   interactions — matrix factorization / ALS / implicit), or hybrid. Note the data requirement each has.

4. **Handle cold start**
   Plan explicitly for new users (onboarding signals, popularity fallback) and new items (content features,
   exploration). Cold start is where most recommenders quietly fail.

5. **Evaluate offline with the right metrics**
   Use a time-based train/test split (never random for temporal data — it leaks the future). Report ranking
   metrics that match the goal: precision@k, recall@k, NDCG, plus coverage and diversity so it doesn't just
   recommend the same 10 items. Compare against the baseline.

6. **Plan the online path**
   Recommend an A/B test design (`/product--ab-test-design`) with the business metric that matters
   (CTR, conversion, retention) before trusting offline gains, and hand deployment to `/ml--model-deployment`.

**Notes:**
- Offline metrics don't guarantee online lift — always validate with a live experiment
- A time-aware split is critical; random splits leak future interactions and inflate scores
- Watch for popularity bias and filter bubbles; measure coverage and diversity, not just accuracy

$ARGUMENTS
