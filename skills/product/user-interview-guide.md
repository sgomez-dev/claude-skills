---
description: Create a discovery interview script — screener, non-leading questions, probes
permissions:
  reads: ["*.md", "*.txt", "docs/**", "research/**", "README*"]
  writes: ["interview_guide_*.md", "docs/research/*.md"]
  commands: []
  network: false
  destructive: false
---

Build a discovery interview guide that gets at what users actually do and struggle with — not what
they politely predict they would use. The craft is in the questions: past-behavior over hypotheticals,
open over closed, and zero pitching. Every question is checked against the leading-question test
before it makes the guide.

Steps:

1. **Frame the study** (`$ARGUMENTS`)
   - Read the research topic from the input; if file paths are given (PRD, hypothesis doc, prior synthesis), read them
   - Detect product context from the repo (README, docs/) to infer the product and domain
   - Ask for anything missing: the decision this research informs, the 2-4 learning goals (phrased as "we need to learn whether/how…"), the target participant profile, interview length (default 30-45 min), and how many interviews are planned (recommend 5-8 per segment)
   - Convert learning goals into research questions — questions *about the user's world*, never questions you will ask verbatim ("Do users value X?" is a research question; asking it aloud is a leading question)

2. **Write the screener** (5-8 questions)
   - Behavioral qualifiers, not self-assessment: "How many times in the past month did you [relevant activity]?" with answer buckets, instead of "Are you an experienced X?"
   - Include one disqualifier for professional respondents ("Have you participated in a paid study in the last 3 months?") and quota fields for the segments that matter
   - Mark each question with its purpose and the qualifying answers: `| question | type (qualify/quota/disqualify) | qualifies if |`
   - Never reveal the study topic in a way that lets respondents fake the right answers

3. **Draft the interview script**
   - **Opening** (2-3 min): consent to record, "no wrong answers, we're studying the problem not testing you," and one warm-up question about their role/context
   - **Context block** (5-10 min): map their world — "Walk me through the last time you [did the job]" as the anchor question; capture tools, frequency, who else is involved
   - **Deep-dive blocks** (one per learning goal, 8-12 min each): 3-5 main questions per block, each targeting a specific past event, plus 2-3 **follow-up probes** attached to each main question: "What did you do next?", "What did you expect to happen?", "How did you work around it?", "Who else was involved?", "What did that cost you?"
   - **Closing** (3-5 min): "What should I have asked that I didn't?", permission to follow up, referral ask
   - Annotate the script: time budget per block, which research question each block serves, and interviewer cues in italics (*let silence sit; don't fill it*)

4. **Run the leading-question audit**
   - Check every main question against the rules and rewrite violations, showing before → after for each fix:
     - No hypotheticals or futures: "Would you use…?" → "Tell me about the last time you needed…"
     - No embedded assumptions: "What frustrates you about X?" → "How do you feel about X?" (only if they've mentioned X)
     - No binary/closed questions as mains: "Do you find this hard?" → "How does this usually go?"
     - No solution pitching anywhere in a discovery interview — if stakeholders demand a concept test, put it in a clearly-separated final section *after* all discovery blocks
     - No "why didn't you…" phrasing (triggers justification) → "What led you to…"

5. **Deliver the guide**
   - Write `interview_guide_[topic-slug].md` with sections: Study goal & research questions, Participant profile & screener, Interview script (timed blocks with probes), Question-to-research-question map, Note-taking template (`| timestamp | observation | quote | research question |`), Logistics checklist (recording consent, incentive, scheduling)
   - Show the research questions, screener table, and the anchor questions per block in the conversation
   - Suggest next steps: after the interviews, run `/product--user-research-synthesis` on the notes; if findings validate the problem, `/product--prd`

**Notes:**
- Past behavior beats stated preference: every main question should be answerable with a story about something that actually happened
- The best follow-up is often silence or "tell me more" — build probes into the script so interviewers don't improvise leading ones under pressure
- Timebox honestly: a 30-minute slot fits at most 2 deep-dive blocks; cut learning goals rather than rushing all of them
- The guide is a guide, not a survey — instruct interviewers to follow interesting threads and return to the script, and mark which questions are must-ask vs. nice-to-ask
- Match the guide language to the language the interviews will be conducted in

$ARGUMENTS
