---
description: Draft RFP/RFI responses from a requirements matrix with compliance tracking
permissions:
  reads: ["*.md", "*.txt", "*.csv", "*.xlsx", "*.json", "*.pdf", "*.docx"]
  writes: ["rfp_*.md", "rfp_*.csv"]
  commands: []
  network: false
  destructive: false
---

Turn an RFP/RFI document or requirements list into a structured, compliant response draft: a
requirement-by-requirement compliance matrix, drafted answers where the input supports them, and a
tracked list of gaps that need human input. The compliance matrix is the backbone — nothing gets
answered that isn't first classified.

Steps:

1. **Parse the RFP** (`$ARGUMENTS`)
   - Accept the RFP text, a file path, or a pasted requirements list; also accept any supporting
     material the user provides (capability docs, past responses, product docs)
   - Extract the skeleton: issuer, deadline, submission format/rules, evaluation criteria and
     weights, mandatory vs. desirable requirements, and required attachments/certifications
   - Number every discrete requirement — split compound requirements ("must do X and Y") into
     separate line items; ambiguous ones get a `clarify` flag for the Q&A round

2. **Run a bid/no-bid sanity check**
   - Before drafting, score qualification quickly: can we meet the mandatory requirements, is the
     timeline feasible, do evaluation weights favor our strengths, is there evidence of a
     pre-wired incumbent (overly specific requirements)?
   - Report a bid/no-bid recommendation with reasons; proceed on the user's call

3. **Build the compliance matrix**
   - CSV/table with one row per requirement:
     | req_id | section | requirement | mandatory (Y/N) | compliance | evidence/source | answer_status | owner_needed |
   - `compliance` values: **Fully Compliant / Partially Compliant / Non-Compliant / Compliant with
     Clarification** — based strictly on the supporting material provided, never on optimism
   - If no supporting material exists for a requirement, compliance is `Unknown`, not `Fully
     Compliant`

4. **Draft the answers**
   - For each requirement with sufficient evidence, draft a response using the pattern:
     **direct compliance statement first** ("Yes, fully compliant."), then how (2-4 sentences),
     then proof (reference to the user's material) — evaluators score, they don't read prose
   - Mirror the RFP's own numbering and terminology exactly; answer what was asked, not what we
     wish they had asked
   - For `Unknown`/gap requirements, insert `[INPUT NEEDED: <specific question for the team>]` —
     precise questions get answered; "please review" doesn't
   - Draft the executive summary last: lead with the issuer's stated objectives and the 2-3
     highest-weighted evaluation criteria

5. **Compliance and quality pass**
   - Verify every requirement row has a corresponding answer section (matrix ↔ document
     cross-check); list any orphans
   - Check submission rules: page/word limits, required sections order, mandatory attachments —
     produce a submission checklist with deadline and format rules at the top
   - Flag risky language: unverifiable superlatives, commitments beyond the evidence,
     accidental scope expansion

6. **Deliver**
   - Write `rfp_[issuer-slug]_matrix_[YYYY-MM-DD].csv` (the compliance matrix) and
     `rfp_[issuer-slug]_response_[YYYY-MM-DD].md` (the response draft)
   - Show in conversation: compliance summary (X fully / Y partial / Z non-compliant / N unknown),
     the list of `[INPUT NEEDED]` items grouped by likely owner (technical, legal, finance), and
     the submission checklist

**Notes:**
- Never claim compliance without evidence in the provided material — a false "Fully Compliant" in
  a public tender can disqualify or worse; `Partially Compliant` with a roadmap is a legitimate
  answer
- Mandatory requirements with `Non-Compliant` status are a bid-killer: surface them immediately,
  not at the end
- Keep answers self-contained; evaluators often score sections independently and won't hunt for
  context
- Adapt response language and formality to the issuer's market and sector (public tenders are
  stricter than private RFPs)
- Use `/sales--proposal-generator` instead when there is no formal requirements structure to
  respond to

$ARGUMENTS
