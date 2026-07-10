---
description: Segment a market into territories and tiers with balanced coverage per rep
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["territory_plan_*.md", "territories_*.csv"]
  commands: []
  network: true
  destructive: false
---

Segment a market or account list into rep territories with tiered accounts and a concrete
coverage plan. The goal is balanced **opportunity**, not balanced account counts — a fair
territory design is the difference between a motivated team and a comp-plan mutiny.

Steps:

1. **Gather the planning inputs** (`$ARGUMENTS`)
   - Required: an account list (CSV) or a market definition (ICP/segment description), and the number of reps (or "just tier it" for a single-rep plan)
   - Useful if available: rep names/locations/language skills, existing account ownership, revenue or size data per account, sales capacity assumptions (accounts a rep can actively work — default 50 active, confirm)
   - If no account list exists, offer to build the universe first via `/sales--lead-finder`, or research rough segment sizes from public directories and industry lists to plan top-down

2. **Choose the segmentation model — don't default to geography**
   - Present the trade-offs and pick with the user:
     - **Geographic**: best when selling requires local presence, language, or time-zone overlap
     - **Vertical/industry**: best when the pitch and proof points differ sharply by industry
     - **Size band** (SMB / mid-market / enterprise): best when deal motion differs (velocity vs complexity)
     - **Hybrid**: size bands split geographically — the common mature choice
   - State the chosen model and why in one paragraph

3. **Tier every account by potential**
   - Score each account on `potential` (deal size proxy: employee range, revenue band, or expansion room) and `fit` (ICP match)
   - Tier: **A** (top ~15%, named accounts, proactive multi-touch plays), **B** (next ~35%, sequenced outbound), **C** (remainder, marketing-touch only / inbound response)
   - Show the tiering rubric explicitly so it's defensible when a rep challenges it

4. **Cut territories and balance them**
   - Distribute accounts by the chosen model, then check balance on **weighted opportunity** (sum of tier-weighted account values, e.g. A=5, B=2, C=1), not raw counts
   - Show the balance math in a table: per territory — total accounts, A/B/C split, weighted opportunity, variance from mean
   - Iterate until no territory deviates more than ±15% from the mean weighted opportunity; where a trade-off is unavoidable, state it and why

5. **Write the coverage plan per territory**
   - Per territory: named tier-A accounts with a first-play suggestion each, touch cadence by tier (e.g., A: weekly multi-channel, B: bi-weekly sequence, C: quarterly check), and a 90-day activity target (meetings booked, accounts touched)
   - Flag whitespace: segments inside the territory with few known accounts where `/sales--lead-finder` should run

6. **Deliver the plan**
   - Write `territory_plan_[YYYY-MM-DD].md` (model rationale, balance table, per-territory plans) and `territories_[YYYY-MM-DD].csv` (account, tier, potential_score, fit_score, territory, owner)
   - Summarize: territory count, balance quality, the single biggest risk in the design (e.g., one territory depends on 3 whale accounts), and the review cadence (re-balance quarterly)

**Notes:**
- Never silently reassign accounts a rep already owns and has active deals in — flag ownership conflicts as decisions for the sales leader, with a recommendation
- If account revenue/size data is missing for most rows, say the tiering is low-confidence and suggest `/sales--lead-enrichment` first
- Balanced ≠ identical: a hunter territory of whitespace and a farmer territory of customers can both be fair — measure against the rep's actual goal
- Adapt output language to the user's market

$ARGUMENTS
