---
description: Generate a commercial proposal or SOW from discovery notes, with pricing options
permissions:
  reads: ["*.md", "*.txt", "*.csv", "*.json", "*.docx"]
  writes: ["proposal_*.md", "sow_*.md"]
  commands: []
  network: false
  destructive: false
---

Turn discovery notes, call transcripts, or a rough deal brief into a client-ready commercial
proposal or Statement of Work: scope, deliverables, timeline, pricing options, and terms. The
output is a polished markdown document the user can send after a light review — every claim in it
must trace back to something the user actually said or provided.

Steps:

1. **Ingest the input** (`$ARGUMENTS`)
   - Accept discovery notes, a call transcript, a file path, or a short deal description
   - Extract: client name, problem/pain, desired outcome, scope hints, budget signals, timeline
     constraints, stakeholders, and any commitments already made
   - If critical facts are missing (what is being sold, to whom, rough scope), ask up to 3 targeted
     questions before drafting — never invent client-specific facts to fill gaps

2. **Choose document type and structure**
   - **Proposal**: persuasion-forward — executive summary, understanding of the problem, proposed
     solution, why us, pricing, next steps
   - **SOW**: precision-forward — objectives, in-scope/out-of-scope, deliverables, acceptance
     criteria, timeline, assumptions, change control, commercial terms
   - Default to proposal for early-stage deals, SOW when the input mentions a verbal agreement or
     signed proposal; confirm the choice with the user in one line

3. **Define scope and deliverables**
   - Write a deliverables table: | # | Deliverable | Description | Acceptance criterion | Owner |
   - Add an explicit **Out of scope** list (3-6 items) — infer likely scope-creep vectors from the
     project type and name them; this is where most disputes are prevented
   - List **Assumptions & client dependencies** (access, data, decision SLAs, environments) — each
     one paired with what happens if it slips

4. **Build the timeline**
   - Phase the work (e.g., Discovery → Build → Validate → Launch) with a table:
     | Phase | Duration | Key activities | Milestone/gate |
   - Use relative durations ("Weeks 1-2") unless the user gave a start date
   - Flag the critical path and any dependency on client-side actions

5. **Construct pricing options**
   - Present **three options** (Good-Better-Best anchoring): a core option that matches the stated
     scope, a reduced/phased option, and an expanded option with clearly higher value — the middle
     option should be the one you expect them to pick
   - Table: | Option | Scope delta | Price | Payment schedule | Best for |
   - If the user gave no pricing input, insert `[PRICE]` placeholders with a bracketed rationale of
     what should drive each number — never invent figures
   - State pricing model explicitly (fixed fee, T&M with cap, retainer) and payment milestones
   - For deeper pricing work, suggest running `/sales--pricing-strategy` first

6. **Add terms and next steps**
   - Include a lightweight commercial terms section: validity period (default 30 days), payment
     terms, change-request process, IP/ownership summary, termination notice — marked as
     "subject to legal review", this is not legal advice
   - Close with a concrete next-steps block: who signs, how (name the mechanism generically), and
     the proposed kickoff date

7. **Deliver**
   - Write `proposal_[client-slug]_[YYYY-MM-DD].md` (or `sow_...`) — clean headings, tables, no
     filler; executive summary under 150 words
   - In the conversation, show the pricing options table and a checklist of `[PLACEHOLDER]` items
     the user must fill or verify before sending

**Notes:**
- Never fabricate client facts, metrics, references, or prices — placeholders with rationale beat
  confident inventions
- Mirror the client's vocabulary from the notes (their words for the problem outperform yours)
- Keep the executive summary outcome-focused: what changes for them, not what you will do
- Adapt document language, currency, and tone conventions to the user's market (e.g., Spanish
  client → Spanish proposal, EUR, usted/tú per the notes' register)
- Pairs well with `/sales--discovery-prep` (before the call) and `/sales--follow-up-sequencer`
  (after sending)

$ARGUMENTS
