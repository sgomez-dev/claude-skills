---
description: Detect buying signals for target accounts - hiring, funding, tech changes, news
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["signals_*.csv", "signals_*.md"]
  commands: []
  network: true
  destructive: false
---

Sweep public sources for buying signals across a set of target accounts — hiring spikes, funding
rounds, leadership changes, tech migrations, expansion news — and rank accounts by how strongly
and how recently they signal intent. Timing beats targeting: the same account is worth 10x more
in the two months after a trigger event.

Steps:

1. **Establish accounts and relevance** (`$ARGUMENTS`)
   - Accept a CSV/list of target accounts, or a single account name for a deep single-account scan
   - If missing, ask: "Which accounts should I scan, and what does your product solve? Signals only mean something relative to what you sell."
   - One line on the product is mandatory — a DevOps tool and an HR platform read the same hiring page completely differently

2. **Build the signal taxonomy, weighted for this product**
   - Standard signal classes with default weights (adjust per product):
     - **Hiring signals** (weight 30): job posts for roles that feel the problem, sudden volume spikes, first-ever hire of a role
     - **Money signals** (25): funding rounds, M&A, new office/market announcements
     - **Leadership signals** (15): new exec in the buying function (new leaders change vendors in their first 90 days)
     - **Tech signals** (20): public adoption/sunset of a tool you integrate with or replace (job posts, engineering blogs, case studies)
     - **Pressure signals** (10): regulation deadlines, publicized incidents, competitor moves in their market
   - Confirm the weighting with the user before scanning

3. **Sweep public sources per account**
   - Per account: careers page + public job boards, news search (last 6 months), press/newsroom page, LinkedIn public company posts, engineering/product blog, funding announcements
   - Run accounts in parallel (use subagents if available); record for every signal: what, where (URL), and when (date)
   - No signal is a finding too — "quiet" accounts are honest data, not failure

4. **Score signal strength with recency decay**
   - Per signal: `strength` (weight × specificity — a job post naming the exact problem beats a generic one) × `recency multiplier` (< 1 month: 1.0, 1-3 months: 0.7, 3-6 months: 0.4, older: 0.1)
   - Account `intent_score` (0-100) = normalized sum of its decayed signals; cap so one huge signal doesn't drown a pattern of medium ones

5. **Tier and prescribe timing**
   - **Act now** (score ≥ 60): reach out within days — include the specific signal to reference as the opener
   - **Warm** (30-59): add to nurture, re-scan in 2-4 weeks
   - **No signal** (< 30): monitor quarterly; don't burn outreach on them
   - For each act-now account, write the one-sentence hook connecting the signal to the product

6. **Deliver the radar**
   - Write `signals_[YYYY-MM-DD].csv`: account, signal_type, signal_detail, signal_date, source_url, strength, intent_score, tier, suggested_hook
   - Show a markdown brief: act-now accounts with their hooks, notable patterns across the list, and a suggested re-scan cadence
   - Recommend next step: `/sales--cold-outreach` for act-now accounts, `/sales--discovery-prep` if a meeting is already booked

**Notes:**
- Every signal must carry a source URL and date — an undated signal is worthless for timing
- Public, free sources only; no paid intent-data providers, no scraping behind logins
- Distinguish signal from noise: a company hiring 50 roles of every kind is growing, not signaling for you specifically — specificity to the problem is what scores
- Adapt output language to the user's market (hooks in the language of the outreach)

$ARGUMENTS
