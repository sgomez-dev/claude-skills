---
description: Structure a fundraising deck: narrative, slide-by-slide content, data room
permissions:
  reads: ["*.csv", "*.json", "*.md"]
  writes: ["fundraising_deck_*.md"]
  commands: []
  network: false
  destructive: false
---

Structure a fundraising deck from the user's actual business: define the narrative arc first, then
write slide-by-slide content (headline, key points, and what data/visual each slide needs), and
finish with a data room checklist so the company is ready for the diligence that follows a good
meeting. The output is a complete written skeleton the user turns into slides — substance over
design.

Steps:

1. **Establish context** (`$ARGUMENTS`)
   - If not given, ask: currency, business model, stage and round (pre-seed/seed/A/bridge), amount raising, and the audience (VCs, angels, strategics — the emphasis differs)
   - Gather the raw material: traction numbers (revenue/users/growth), team backgrounds, what the product does, market focus, and what the money is for
   - Mark every metric the user cannot provide as a **gap to close before pitching** — a deck with holes is a diligence red flag; never paper over gaps with invented figures

2. **Define the narrative arc**
   - Draft the one-sentence story: "why this, why now, why us" — and the single most impressive, defensible fact the deck should be built around
   - Choose the arc that fits the company's strongest asset: traction-led (numbers first), insight-led (unique market understanding first), or team-led (earned secret first)
   - Confirm the arc with the user before writing slides — every slide must serve it

3. **Write the slide-by-slide skeleton**
   For each slide output: **headline** (a full assertion, not a label — "Revenue tripled in 12 months with zero paid spend", never just "Traction"), 2-4 supporting points using the user's real data, and the visual/data element needed. Standard sequence (adapt to the arc, target 10-14 slides):
   - Title & one-liner → Problem → Solution/Product → Why now → Market (bottoms-up sizing from the user's own unit numbers — flag pure top-down TAM claims as weak) → Traction → Business model & unit economics → Go-to-market → Competition (honest positioning, no empty 2×2 corners) → Team → Financial ask & use of funds → Roadmap/vision
   - For the ask slide: amount, what it buys (milestones, not just spend categories), and the runway it creates — pull from `/finance--burn-runway` if the user has run it

4. **Pressure-test the numbers slides**
   - Traction, unit economics, and projections must be internally consistent (growth rate on slide 6 must reproduce the forecast on slide 11); check and flag contradictions
   - For each numeric claim, note the backup an investor will ask for — this seeds the data room list
   - Recommend `/finance--unit-economics` and `/finance--financial-model` for any economics or projection slide that is currently hand-waved

5. **Build the data room checklist**
   - Corporate: incorporation docs, cap table (see `/finance--cap-table`), board minutes, prior round docs
   - Financial: historical P&L and cash, financial model, key metric definitions and raw exports
   - Commercial: top customer contracts, pipeline snapshot, churn/cohort data
   - Team & IP: founder agreements, IP assignments, key employment contracts, option grants
   - Mark each item ready / needs work / missing based on what the user has said

6. **Deliver results**
   - Write `fundraising_deck_[YYYY-MM].md`: narrative summary, full slide-by-slide content, gaps to close, and the data room checklist
   - Show the slide sequence with headlines as a markdown table in the conversation
   - List the 3 weakest points an investor will push on, with a suggested honest answer for each

**Notes:**
- This is fundraising preparation assistance, not financial/investment or legal advice — round terms and securities questions belong with the user's lawyer
- Never fabricate metrics, market sizes, or logos; every number in the deck must trace to the user's input, and any cited convention (deck length, raise timelines) is labeled approximate
- Headlines carry the deck: an investor skimming only the headlines should get the whole story
- Tailor claims to stage — a pre-seed deck sells the insight and team; a Series A deck must sell repeatable economics
- Keep the market slide honest: bottoms-up beats a giant top-down TAM at every stage

$ARGUMENTS
