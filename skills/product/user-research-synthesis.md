---
description: Synthesize interview notes and feedback into themes, insights, opportunities
permissions:
  reads: ["*.md", "*.txt", "*.csv", "*.json", "docs/**", "research/**", "notes/**"]
  writes: ["research_synthesis_*.md", "docs/research/*.md"]
  commands: []
  network: false
  destructive: false
---

Turn raw user research — interview notes, transcripts, survey answers, support tickets, app-store
reviews — into a rigorous synthesis: evidence-backed themes, insights that explain *why*, and
opportunities a team can act on. Keep an unbroken chain from every insight back to a real quote;
synthesis without traceable evidence is just opinion with formatting.

Steps:

1. **Gather the raw material** (`$ARGUMENTS`)
   - Read notes/transcripts from the input; if file paths or a directory are given, read all of them
   - Ask for anything missing: the research question the study set out to answer, who was interviewed (segments, how recruited, sample size), and any prior hypotheses the team held
   - Record the source inventory: `| source | participant/segment | date | type (interview/survey/ticket/review) |` — flag if the sample is skewed (e.g., all power users) so findings carry the right caveat

2. **Extract atomic observations**
   - Break every source into single observations: one participant, one statement or behavior, tagged with participant ID (P1, P2…) and a verbatim quote where available
   - Separate three kinds and never mix them: **facts** (what they did), **statements** (what they said), **interpretations** (what you infer) — interpretations get an explicit "inference" tag
   - Discard solution requests as-is but keep the underlying need ("I want a dashboard" → observe what they're trying to monitor and why)

3. **Cluster into themes**
   - Group observations by underlying need or behavior, not by feature area or question asked
   - Each theme needs: a name phrased as a finding ("Users don't trust auto-save", not "Saving"), the count of distinct participants supporting it (e.g., 6/8), 2-3 representative quotes, and counter-evidence if any participant contradicted it
   - Keep an **outliers** section — single-participant observations that don't cluster but might matter; don't force them into themes or silently drop them

4. **Derive insights and opportunities**
   - For each major theme write an insight that explains the *why* behind the pattern: *[users] do/feel [behavior] because [motivation/obstacle], which means [implication for the product]*
   - Rate each insight's confidence: **strong** (majority of participants, consistent, behavioral evidence), **moderate** (several participants, some said-vs-did gap), **weak** (few participants or self-reported only)
   - Translate insights into opportunities as "How might we…" statements — problem-framed, not solution-framed — and note which strategic goal each serves
   - List hypotheses that were **contradicted** by the data; killed assumptions are a first-class result

5. **Deliver the synthesis**
   - Write `research_synthesis_[topic-slug].md` with sections: TL;DR (3-5 findings in one line each), Research question & method, Participant summary, Themes (with quotes and counts), Insights (with confidence), Opportunities (HMW list), Contradicted assumptions, Outliers, Open questions for the next study
   - Show the themes table in the conversation: `| theme | participants | confidence | key quote |`
   - Suggest next steps: `/product--user-interview-guide` if key questions remain open, `/product--prd` or `/product--rice-prioritization` to act on the top opportunities

**Notes:**
- Count participants, not mentions — one person saying something five times is still n=1
- Quotes are sacred: never paraphrase inside quotation marks; trim with […] only
- Watch for the said-did gap: weight observed behavior over stated preference, and label which is which
- If the input is fewer than ~3 participants, say so plainly and frame everything as hypotheses to test, not findings
- Anonymize participants in the output (P1, P2…) unless the user explicitly says names may be kept
- Match the document language to the user's working language

$ARGUMENTS
