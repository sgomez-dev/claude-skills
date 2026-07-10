---
description: Build a battlecard vs a competitor with traps, counters, proofs, landmines
permissions:
  reads: ["*.md", "*.csv", "*.txt"]
  writes: ["battlecard_*.md"]
  commands: []
  network: true
  destructive: false
---

Build a one-page battlecard reps can use mid-deal against a specific competitor: how to win, where
you honestly lose, landmine questions to plant, and counters to the traps they set for you. Works
from an existing intel report or runs condensed public research itself.

Steps:

1. **Gather input** (`$ARGUMENTS`)
   - Required: the competitor's name and your product. Ask what you sell and to whom if unclear — never assume the industry
   - Accept an existing intel report (e.g., output of `/sales--competitor-intel`) or win/loss notes; ask if any exist

2. **Establish the evidence base**
   - If intel was provided, extract the relevant claims; otherwise run condensed public research: competitor's messaging, pricing page, docs/changelog, and public review-site pages — cite a URL per claim
   - For a deeper foundation, suggest running `/sales--competitor-intel` first

3. **Draft the battlecard sections**
   - **Quick take** (30 seconds): who they are, who they win with, when you should worry
   - **Why we win** (3-5 points): each with a proof point, labeled `verified (source)` or `internal validation needed`
   - **Why we lose** (honest, 2-3 points): where they are genuinely stronger and how to reframe or requalify
   - **Landmines**: questions the rep plants that expose the competitor's weaknesses without naming them ("Ask the vendor how they handle X at Y scale")
   - **Their traps → our counters**: claims or evaluation criteria they push, and the response to each
   - **Objection responses**: the 3 most likely "we're also looking at [competitor]" objections with Acknowledge → Reframe → Proof → Advance answers
   - **Pricing posture**: how they price vs you and how to frame the difference (value, not discount)

4. **Evidence pass**
   - Walk every claim: tie it to a source URL or user-provided win/loss data, or mark it `needs evidence` — an inflated battlecard loses deals and rep trust
   - Remove anything that disparages untruthfully; stick to verifiable contrasts

5. **Deliver**
   - Write `battlecard_[competitor-slug]_[YYYY-MM-DD].md` — hard limit one page, tables over prose
   - Show the Quick take and Why we win sections in the conversation; note the review cadence (refresh quarterly or on competitor releases)

**Notes:**
- Honesty is the quality bar: reps abandon battlecards after the first claim a prospect disproves
- Landmines must be fair questions about real weaknesses, not FUD
- Public, free sources only; no fake trials or pretexting
- Pair with `/sales--objection-handler` for the full objection playbook beyond this competitor
- Adapt deliverable language to the user's market

$ARGUMENTS
