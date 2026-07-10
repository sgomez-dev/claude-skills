---
description: Scaffold a production chatbot - streaming UI, history, RAG hookup, feedback loop
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["project package manager, test/eval runners"]
  network: false
  destructive: false
---

Scaffold a production-grade chatbot: streaming responses, persistent conversation history,
optional RAG grounding, and a feedback loop that improves it after launch. Builds on the
project's existing stack instead of imposing one. Complements /ai--agent-builder (when the bot
needs tools), /ai--rag-eval (grounding quality), and /ai--guardrails (safety).

Steps:

1. **Detect stack and pin down scope** (`$ARGUMENTS`)
   - Detect frontend framework, backend language, database, and any existing LLM SDK; reuse all of them — never introduce a parallel stack
   - Clarify with the user if unstated: what the bot is for, what it must refuse, whether it needs RAG over project/company data, and auth requirements
   - Pick models: a capable default for answers (e.g. `claude-sonnet-5`), a cheap one (e.g. `claude-haiku-4-5`) for title generation and summarization — equivalents exist on other providers; keep model IDs in config

2. **Build the streaming backend**
   - One chat endpoint that streams tokens (SSE or the framework's idiomatic streaming) — time-to-first-token is the UX metric that matters
   - Server owns the system prompt, model choice, and history assembly; the client only ever sends the new user message and a conversation ID — never trust a client-supplied message history or system prompt
   - Handle mid-stream errors and client disconnects: persist whatever was generated, surface a retry affordance, make retries idempotent

3. **Persist conversation history properly**
   - Schema: conversations (id, user, title, created/updated) and messages (id, conversation, role, content, model, token counts, created) — token counts per message make cost and truncation decisions cheap later
   - On each turn, rebuild the model context from the DB: system prompt + as many recent messages as fit the budget; summarize or drop the oldest turns when over budget (see /ai--context-engineering)
   - Keep the system prompt byte-stable across turns to benefit from provider prompt caching; auto-generate conversation titles with the cheap model

4. **Hook up RAG if the bot must answer from project/company data**
   - Reuse an existing pipeline if the repo has one; otherwise build the minimal loop (see /ai--embeddings): retrieve top-k for the user query, inject as clearly-delimited context with source IDs
   - Instruct the model to answer only from provided context and to say so when the context doesn't cover the question; render citations in the UI
   - Gate this with a retrieval eval before trusting it — /ai--rag-eval

5. **Build the frontend essentials**
   - Streaming message rendering (markdown-safe, no re-render thrash), stop-generation button, retry, copy, auto-scroll that yields when the user scrolls up
   - Conversation list with rename/delete; optimistic send with reconcile-on-ack
   - Empty state that shows 3-4 example prompts — it doubles as scope documentation for users

6. **Wire the feedback loop and safety rails**
   - Thumbs up/down (with optional comment) on every assistant message, stored with the message and trace ID; log traces per /ai--llm-observability
   - Apply input/output guardrails appropriate to the domain (/ai--guardrails); rate-limit per user; cap tokens per conversation and per day
   - Flagged and thumbs-down exchanges are triaged into the eval set — this is where post-launch quality comes from

7. **Evaluate before shipping**
   - Build a 20-50 case eval set: representative questions, adversarial/off-topic probes, and (if RAG) questions the corpus can't answer — assert on behavior (grounded, refuses correctly, stays in scope), run via /ai--llm-eval
   - Measure time-to-first-token and cost per conversation on the eval run; set the regression gate before the first prompt tweak, not after

**Notes:**
- Ship the smallest scope that's useful; a bot that does one thing well beats a general assistant that embarrasses you
- The system prompt is a product artifact: version it in the repo, and every change goes through the eval gate
- Streaming, history truncation, and retries interact — test the long-conversation path (50+ turns) explicitly before launch
- Budget for moderation of user feedback and flagged content from day one; the feedback loop only works if someone reads it

$ARGUMENTS
