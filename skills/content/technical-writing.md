---
description: Turn engineering work into a technical article with narrative, diagrams, and code
permissions:
  reads: ["src/**", "lib/**", "*.md", "*.txt", "docs/**", "**/*.py", "**/*.ts", "**/*.js", "**/*.go", "**/*.rs", "**/*.java"]
  writes: ["article_*.md", "drafts/*.md"]
  commands: ["git log", "git diff", "git show"]
  network: false
  destructive: false
---

Turn real engineering work — a migration, an incident, a performance win, a build-vs-buy decision —
into a technical article other engineers actually finish. The raw material is in the repo and the
user's memory; the job is finding the narrative in it, backing every claim with real code and
diagrams, and writing it without the tutorial monotone.

Steps:

1. **Identify the work and the reader** (`$ARGUMENTS`)
   - Locate the engineering work: a described project, a branch or PR, a directory, or recent history — use `git log`/`git diff`/`git show` and read the relevant source to understand what actually changed and why
   - Ask (or extract from context): who is the reader — engineers at what level, in what stack? Would they read this to solve the same problem, or to learn how someone else thinks?
   - Establish voice: first-person war story, team engineering-blog register, or neutral deep-dive? If the company has an engineering blog, ask for a sample post and extract 3-4 concrete traits to match
   - Write in the audience's language; keep code, error messages, and identifiers in their original form regardless

2. **Find the narrative — the article is a story, not a changelog**
   - Extract the arc: what was the problem and why did it matter (with numbers if they exist) → what was tried, including what failed → what worked and why → what it cost and what the numbers are now
   - The failed attempts are the most valuable part; an article where the first idea works teaches nothing. Ask the user what went wrong along the way if the repo doesn't show it
   - State the one-sentence takeaway a reader leaves with; if there isn't one, this is documentation, not an article

3. **Outline with artifact placements**
   - Title (working), hook (open in the middle of the problem — an error message, a graph going wrong, a number that hurt), 4-7 H2 sections each with its point and its artifact
   - Mark where each artifact goes: **code** (real snippets from the repo, trimmed to the relevant lines), **diagram** (architecture before/after, sequence, data flow — as Mermaid or ASCII so it lives in markdown), **numbers** (benchmarks, latency, cost — real ones or `[verify]`)
   - Every technical claim needs an artifact; every artifact needs a sentence saying what to notice in it

4. **Draft**
   - Write the full article. Code snippets come from the actual repo — trimmed and lightly annotated, never pseudo-code passed off as real. Include language tags on every fence; note the versions/tools that matter for reproducibility
   - Diagrams as Mermaid blocks (flow, sequence, or architecture) with a one-line caption each
   - Anti-AI prose rules: no throat-clearing openers ("In today's fast-paced world…", "In the ever-evolving landscape of software…"); banned words: delve, leverage (verb), unlock, unleash, robust, seamless, game-changer, elevate; vary sentence length — a short sentence after a dense technical paragraph gives the reader air; concrete over abstract: quote the actual error, name the actual library version, show the actual flame graph description
   - Explain decisions, not just mechanics — "we chose X over Y because Z" is what makes it worth reading over the docs

5. **Accuracy pass**
   - Re-check every snippet against the repo: does the code shown actually exist or accurately represent what shipped? Do the numbers match what the user stated? Mark anything unconfirmed as `[verify]`
   - Check the failure narrative doesn't leak anything sensitive: credentials, internal hostnames, customer names, security details — flag anything borderline for the user to clear

6. **Deliver**
   - Write `article_[slug].md` with frontmatter (title, description, slug, date, tags), then one edit pass: cut 10-15%, kill any paragraph that could appear in any article about any technology
   - Show the hook, the takeaway sentence, and the list of artifacts used in conversation for quick review

**Notes:**
- Respect scale honesty: "we handle 200 req/s" told truthfully teaches more than vague "high scale" claims
- If the work isn't finished or the results aren't in yet, say so — "part 1: the plan" is a legitimate article; inflated results are not
- For non-narrative business or opinion posts use `/content--blog-post`; if the goal is reference documentation rather than an article, use `/content--docs-site`
- Repurpose the finished article with `/content--social-posts` — engineering war stories perform well as threads

$ARGUMENTS
