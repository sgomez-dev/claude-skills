---
description: LLM guardrails - input/output filters, injection defense, PII, jailbreak tests
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project test/eval runners"]
  network: false
  destructive: false
---

Add defense-in-depth guardrails around an LLM feature: input filtering, prompt-injection
resistance, output filtering, PII handling, and action-level containment — then prove they hold
with an adversarial test suite. Guardrails without red-team tests are decoration.

Steps:

1. **Threat-model the feature** (`$ARGUMENTS`)
   - Map the data flow: who supplies input (end users? documents? tool results? other systems?), what the model can do (just text, or tools/actions?), and what the output feeds (UI, code, DB, emails)
   - Rank the real risks for this feature: prompt injection via untrusted content, PII leakage, harmful/off-brand content, excessive agency (tools misused), denial-of-wallet (token abuse)
   - Detect provider/SDK from the repo; note any provider-side safety features already in play

2. **Input layer**
   - Validate mechanically first: length caps, type/encoding checks, rate limits per user — before any model call
   - Detect and handle PII on the way in per policy: redact/pseudonymize before the call where feasible (regex + NER for emails, phones, IDs; map tokens back after the response)
   - Classify clearly out-of-scope or abusive requests with a cheap fast model (e.g. `claude-haiku-4-5`; equivalents exist on other providers) or a rules pass, and refuse early — cheaper and safer than letting the main prompt handle it

3. **Prompt-injection defense (structural, not just filters)**
   - Separate trust levels structurally: system prompt for policy, user turn for the request, and untrusted content (retrieved docs, web pages, tool output) clearly delimited and labeled as data — with an explicit instruction that content inside those delimiters is never instructions
   - Assume injection will sometimes succeed anyway: the real defense is limiting blast radius — least-privilege tools, no secrets in prompts, human confirmation for irreversible actions (send, delete, pay, exfiltrate)
   - Never eval/execute model output directly; treat it as untrusted in downstream code (encode for HTML, parameterize for SQL)

4. **Output layer**
   - Scan responses before delivery: PII that shouldn't leave, system-prompt leakage (canary string check), policy violations, malformed/oversized output
   - Decide the failure action per check: block with a safe message, redact, or flag-and-log — and make it consistent
   - For tool-using features, gate the *actions*, not just the text: allowlist tools per context, validate arguments against policy (amount limits, recipient allowlists)

5. **Build the jailbreak/red-team suite**
   - Assemble 50+ adversarial cases: direct injections ("ignore previous instructions"), indirect injections planted in retrieved/quoted content, role-play jailbreaks, encoding tricks (base64, other languages), PII-extraction attempts, system-prompt extraction, and tool-abuse attempts relevant to your tool set
   - Include an equal set of benign look-alikes (security questions, quoted injection text in legitimate contexts) to measure over-blocking
   - Automate it: run the suite through the full guarded pipeline; score attack success rate and false-positive rate; a canary token in the system prompt makes leakage machine-checkable

6. **Gate, monitor, iterate**
   - CI gate on the suite: no known attack class succeeds; false-positive rate under an agreed cap (see /ai--llm-eval for harness patterns)
   - Log every triggered guardrail with category and hashed input; alert on spikes; review flagged traffic weekly and fold new attacks into the suite
   - Re-run the full suite on every prompt, model, or tool change — model swaps silently change jailbreak resistance

**Notes:**
- Layered independent checks beat one clever mega-prompt; each layer catches what the previous missed
- Over-blocking erodes trust as fast as under-blocking harms — always measure both sides
- Keep guardrail prompts/rules out of the main system prompt where possible so attackers can't read the rulebook
- PII handling must match the org's actual compliance requirements (GDPR/CCPA) — confirm policy, don't invent it

$ARGUMENTS
