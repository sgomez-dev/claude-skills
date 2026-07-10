---
description: Draft Terms of Service tailored to the product's actual business model
permissions:
  reads: ["README*", "docs/**", "package.json", "*.md", "src/**"]
  writes: ["legal/**", "TERMS*.md"]
  commands: []
  network: false
  destructive: false
---

Draft Terms of Service that fit the product as it actually works — subscription vs. one-time
purchase, user-generated content or not, API access, free tiers, refunds — by inspecting the
repo (README, docs, pricing/billing code, feature surface) and interviewing the user for the
business facts the code can't reveal. No generic clickwrap boilerplate that promises the wrong things.

Steps:

1. **Gather context** (`$ARGUMENTS` may contain some of this — ask for the rest)
   - Jurisdiction and governing law preference (EU/US state/other) and whether users are consumers, businesses, or both — consumer law heavily constrains what terms can say
   - Company legal name, registered address, contact email
   - Business model: pricing (subscription/usage/one-time/free), trials, refund policy intent, minimum age

2. **Inspect the product to ground the terms**
   - README, docs, and landing copy: what the product promises to do
   - Billing/payments code or config (Stripe, Paddle, in-app purchases): actual charge model, trial logic, cancellation behavior
   - Feature surface that changes the terms: user-generated content (needs content/IP and moderation clauses), public API (needs API terms and rate limits), file uploads, teams/seats, AI-generated output (ownership and disclaimer language), integrations acting on user accounts
   - Note what does NOT exist — don't draft clauses for features the product lacks

3. **Confirm the deal terms with the user**
   - Present a short checklist and get answers before drafting: refund window, acceptable-use red lines, uptime commitment (if any — or point to `/legal--sla-gen`), termination rights on both sides, liability cap appetite (common default: fees paid in last 12 months), dispute resolution preference (courts vs. arbitration — note arbitration clauses are largely unenforceable against EU consumers)

4. **Draft the Terms**
   - Write `legal/TERMS_OF_SERVICE.md` with sections matched to the findings: acceptance, the service description (from step 2, accurate), accounts, pricing/billing/refunds, acceptable use, user content and IP (only if applicable), our IP and license to use the service, third-party services, disclaimers, limitation of liability, indemnity (B2B only — avoid against consumers), termination, changes to terms, governing law and disputes, contact
   - Plain language over legalese where possible; `[PLACEHOLDER: ...]` for every unconfirmed business fact
   - Keep obligations symmetric enough to survive a fairness review — flag any clause you drafted that a consumer regulator would likely challenge

5. **Deliver and cross-check**
   - Show the draft plus a one-screen summary table: clause → what it commits you to → source (code finding or user answer)
   - List mismatches between code and terms (e.g., "terms say cancel anytime, but billing code has no self-serve cancellation")
   - Suggest pairing with `/legal--privacy-policy` (referenced from the terms) and `/legal--sla-gen` if uptime commitments came up

**Notes:**
- This is a starting draft, not legal advice — have it reviewed by qualified counsel before use.
- Terms must describe the real product — an accurate modest promise beats an impressive false one
- Consumer vs. B2B changes almost everything (refunds, liability, arbitration, unilateral changes); never draft one-size-fits-both without marking the differences
- Do not import clauses from famous companies' ToS — they are written for their business model and legal exposure, not this one
- If the product is open source or free with no account, say so and produce a minimal terms/disclaimer document instead

$ARGUMENTS
