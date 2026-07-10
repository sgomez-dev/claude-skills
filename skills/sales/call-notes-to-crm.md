---
description: Turn messy sales call notes into structured CRM fields, tasks, and follow-ups
permissions:
  reads: ["*.txt", "*.md", "*.json"]
  writes: ["crm_*.md", "crm_*.json"]
  commands: []
  network: false
  destructive: false
---

Convert raw, unstructured call notes into a clean CRM-ready record: qualification fields, action items,
and a drafted follow-up — so nothing from the conversation is lost between the call and the pipeline.

Steps:

1. **Ingest the notes** (`$ARGUMENTS`)
   - Accept pasted notes, a file path, or a transcript
   - If nothing is provided, ask the user to paste the call notes and name the account/contact
   - Detect the CRM if hinted (HubSpot, Salesforce, Pipedrive) to match field names; otherwise use generic fields

2. **Extract structured fields**
   Parse the notes into: account, contact(s) + role, date, call type, and a concise summary (3-4 sentences).
   Never invent details not present in the notes — mark anything unclear as `unconfirmed`.

3. **Map to a qualification framework**
   Fill a MEDDIC (or BANT if the deal is early/transactional) table from what was actually said:
   Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion.
   For each field, quote or paraphrase the supporting line; leave gaps explicit as `not covered — ask next call`.

4. **Derive next steps**
   - Action items with owner (rep vs prospect) and due date
   - Open questions to resolve
   - Recommended deal stage change with a one-line justification
   - Risk flags (single-threaded, no timeline, no budget signal) — link to `/sales--deal-risk-analyzer`

5. **Draft the follow-up**
   Write a short recap email the rep can send: thanks, recap of agreed points, action items, next meeting ask.
   Match the prospect's tone from the notes; adapt language to the prospect's market.

6. **Deliver**
   - Output a markdown record (and a `crm_[account]_[date].json` if the user wants to import it)
   - Show the MEDDIC/BANT table, action items, and the follow-up draft inline
   - End with the single most important next action

**Notes:**
- Fidelity over completeness — never fabricate metrics, budgets, or commitments the prospect didn't state
- Keep the summary skimmable; a busy rep should grasp the call in 15 seconds
- If notes are too sparse to qualify, say so and list the questions to ask on the next call
- Pairs well with `/sales--follow-up-sequencer` for the full cadence after the recap

$ARGUMENTS
