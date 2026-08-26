---
description: Build an LLM-powered scraper with scrapegraph-ai — graph choice, Pydantic schemas, token cost
permissions:
  reads: ["pyproject.toml", "requirements.txt", "uv.lock", "*.py", ".env", ".env.example", "package.json"]
  writes: ["scraper/**", "scrape_*.py", "schemas/*.py", "data/**", ".env.example", "requirements.txt", "pyproject.toml"]
  commands: ["python", "pip", "uv", "playwright"]
  network: true
  destructive: false
---

Build a scraper on **scrapegraph-ai**, where an LLM does the extraction instead of CSS selectors.
The library turns a natural-language prompt plus a URL into structured data via node graphs
(fetch → parse → generate). That flexibility costs tokens on every page, so the first job is
deciding whether it's the right tool at all, then constraining it so cost and correctness stay
predictable.

Steps:

1. **Clear the same ethics gate as any scraper** (before any code)
   - Check `robots.txt` and ToS for the target paths; if disallowed, **stop and tell the user**
   - Prefer an official API or `sitemap.xml`; never scrape behind auth, never bypass CAPTCHAs or anti-bot systems
   - Full politeness engineering (rate limits, User-Agent, backoff) lives in `/automation--web-scraper` — this skill assumes it and does not repeat it. scrapegraph-ai will not rate-limit for you

2. **Decide if LLM extraction is justified** (the highest-leverage step — do not skip)
   - Fetch one target page and look at the markup. **Stable layout + consistent fields → use selectors instead** and hand off to `/automation--web-scraper`. A selector scraper costs ~0 per page; an LLM one costs tokens on every page, forever
   - LLM extraction earns its cost when: layouts differ per page (many sites, marketplace listings), markup churns and selectors keep breaking, fields are buried in prose, or the run is one-off/exploratory where dev time dominates
   - Say the trade-off out loud with a rough number (pages × tokens/page × price) before building. If the site is one stable template scraped daily, recommend selectors even though the user asked for this skill

3. **Detect the stack and install**
   - Python project? Read `pyproject.toml`/`requirements.txt` for the package manager (`uv`, `pip`, `poetry`) and add `scrapegraphai`
   - Playwright is a hard dependency of the fetch node — also run `playwright install chromium`, or fetching fails at runtime with a browser-not-found error
   - **Node/other-stack project**: the library is Python-only. Do not bolt a Python runtime into a JS app — build the scraper as a standalone CLI or small service with its own venv, and integrate over a file/queue/HTTP boundary. Say so explicitly rather than half-installing it
   - Check `.env` for an existing provider key (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, …) and reuse it; add the key name to `.env.example`, never the value

4. **Pick the graph that matches the job**

   | Situation | Graph |
   |---|---|
   | One page, one prompt | `SmartScraperGraph(prompt, source, config, schema=None)` |
   | Many known URLs, same prompt | `SmartScraperMultiGraph` |
   | No URL list — search first | `SearchGraph(prompt, config, schema=None)` (no `source`; `max_results` in config) |
   | Fetch + parse only, no LLM answer | `SmartScraperLiteGraph` — cheapest, returns parsed content |
   | Crawl deeper from a seed | `DepthSearchGraph` |
   | Local CSV / JSON / XML / PDF & docs | `CSVScraperGraph`, `JSONScraperGraph`, `XMLScraperGraph`, `DocumentScraperGraph` |
   | Collect links, not content | `SearchLinkGraph` |
   | Emit a reusable scraper script | `ScriptCreatorGraph` (or `CodeGeneratorGraph`) |

   - `source` accepts a URL or a local path; multi-graphs take a list of sources
   - `ScriptCreatorGraph` is the cost escape hatch: pay tokens once to generate a selector-based script, then run that script for free. Offer it when the target is one stable template

5. **Define a Pydantic schema — do not ship prompt-only extraction**
   - Pass `schema=YourModel` (a `pydantic.BaseModel` subclass); every graph constructor accepts it as the last argument
   - Without a schema the output is a free-form dict whose keys drift between runs and pages — unusable downstream. With one you get typed, validated fields and a loud failure instead of a silent rename
   - Use `Optional[...]` for genuinely optional fields and lists of nested models for repeated blocks; keep field names identical to what you want in storage

6. **Configure the graph explicitly**
   - `config["llm"]` is required and raises `KeyError` if absent: `{"model": "openai/gpt-4o-mini", "api_key": ..., "model_tokens": 128000}`. Model strings are `provider/model`
   - Set `model_tokens` — omitted, the library defaults it and warns, and a wrong context size causes silent truncation of page content mid-extraction
   - Already have a configured LangChain model? Pass `{"model_instance": llm, "model_tokens": N}` instead of a model string
   - Useful keys: `headless` (True in CI), `verbose` (development only), `timeout`, `loader_kwargs` (passed to the fetch node), `cache_path` (**set it** — re-runs during development stop re-fetching *and* re-paying for the same pages), `storage_state` for a Playwright session file
   - Start with the cheapest capable model. Extraction quality is usually bounded by page fetching and prompt clarity, not model tier

7. **Validate against ground truth, then scale**
   - Run 3–5 pages first. Hand-check every field against the rendered page — **LLM extraction fails differently from selectors**: instead of returning empty, it returns confident, plausible, wrong values, or hallucinates a field that isn't on the page
   - Add a post-validation pass: required fields non-null, types/ranges sane, values actually present in the fetched HTML. Quarantine failures to a `needs_review` file instead of dropping or trusting them
   - Log `graph.get_execution_info()` per run — it carries token counts and cost, which is your only early warning before a full crawl surprises you
   - Persist as the sibling skill does: JSONL/SQLite, `scraped_at` + `source_url` per row, unique key for idempotent upserts, incremental writes so a crash mid-run loses nothing
   - Then scale up, and re-check cost against the step-2 estimate

**Notes:**
- The cheapest scraper is the one that doesn't call an LLM per page. Revisit step 2 whenever the target turns out to be one stable template
- Cost scales with *page size*, not field count: a bloated page burns context. Narrow the fetch (`loader_kwargs`) before blaming the model
- An empty or garbage result is usually a fetch failure, not a model failure — confirm the page rendered (`headless=False` locally, or dump the fetched content) before touching prompts
- Extraction over personal data (names, emails, profiles) triggers GDPR/CCPA obligations; warn the user and minimize collection
- Recurring runs → `/automation--scheduled-tasks`. Real browser interaction (login flows, clicks) → `/automation--browser-automation`. Prompt/model tuning for the extraction step → `/ai--prompt-engineer`. Feeding reports → `/automation--report-automation`
- Upstream moves fast and graph names change between releases; pin the version and check the installed package's `scrapegraphai.graphs` exports if an import fails

$ARGUMENTS
