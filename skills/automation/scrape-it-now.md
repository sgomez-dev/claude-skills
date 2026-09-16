---
description: Run a site-wide markdown crawl with scrape-it-now — job config, local vs Azure, indexing
permissions:
  reads: ["pyproject.toml", "requirements.txt", "uv.lock", ".env", ".env.example", "*.py", "Makefile"]
  writes: [".scrape-it-now/**", "data/**", "scrape/**", ".env.example", "Makefile", "*.sh"]
  commands: ["python", "pip", "uv", "pipx", "scrape-it-now", "playwright", "pandoc"]
  network: true
  destructive: false
---

Drive **scrape-it-now** (`clemlesne/scrape-it-now`), a CLI that crawls a whole site and emits
clean markdown built for LLM consumption, optionally indexing it into Azure AI Search. It is a
*job runner*, not a library: you configure a job, launch it, poll its status, and read the output
off blob storage. That shape is the whole reason to pick it — and the reason it is wrong for
small, targeted extractions.

Steps:

1. **Clear the same ethics gate as any scraper** (before anything else)
   - Check `robots.txt` and the ToS for the paths in scope; if disallowed, **stop and tell the user**
   - Prefer an official API, `sitemap.xml`, or a data export; never crawl behind auth, never bypass CAPTCHAs or anti-bot systems
   - This tool crawls *broadly* by design — depth-first link discovery across a domain. The blast radius on someone else's server is much larger than a single-page scrape, so the politeness question is proportionally more serious. Set `--max-depth` and `--whitelist` before the first run, not after

2. **Confirm it's the right tool** (do not skip — it is a heavy dependency)
   - **Good fit**: crawl an entire domain or docs site, get markdown for a RAG corpus, resumable/parallel runs, repeated re-crawls where unchanged pages should be skipped, output that must live in blob storage
   - **Wrong fit**: a handful of known URLs, specific fields out of specific pages, anything needing structured records rather than prose. Hand those to `/automation--web-scraper` (selectors) or `/automation--scrapegraph-scraper` (LLM extraction) and say why
   - It returns **markdown documents plus page metadata**, not typed rows. If the user wants a table, this tool is the first half of the pipeline at best
   - Requires Python 3.13+, plus Playwright/Chromium and Pandoc pulled in at first run

3. **Install it as a standalone CLI, not a project dependency**
   - `pipx install scrape-it-now` (or `uv tool install scrape-it-now`) keeps its heavy, pinned tree out of the project's environment — this is a tool you *invoke*, not a library you import
   - Plain `python3 -m pip install scrape-it-now` is fine inside a dedicated venv; adding it to an app's `requirements.txt` is not — say so if the user asks for that
   - Verify with `scrape-it-now --help` before configuring anything
   - First `scrape run` self-installs browser and Pandoc dependencies and takes minutes; warn the user instead of letting it look hung

4. **Pick the backend — default to local disk**
   - Local (no cloud account, everything under the working directory):
     ```bash
     export BLOB_PROVIDER=local_disk
     export QUEUE_PROVIDER=local_disk
     ```
   - Azure (parallel workers across machines, durable queue):
     `AZURE_STORAGE_ACCOUNT_NAME` + `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING` for `scrape status`
   - **Only reach for Azure when the run actually needs it** — a multi-machine crawl or storage the team shares. A one-off corpus build does not; local disk is the same tool with none of the setup
   - Every option has both a flag and an environment variable. Put secrets in `.env`, add the *names* to `.env.example`, never the values

5. **Configure the job before launching it**
   ```bash
   scrape-it-now scrape run \
     --job-name my-docs \
     --max-depth 3 \
     --whitelist 'docs.example.com' \
     https://docs.example.com
   ```
   - `--job-name` is the handle for `scrape status` and for the indexer — always set it explicitly; a generated name is unusable in a script
   - `--max-depth` is the single most important guard. Unbounded depth on a large site is an open-ended crawl of someone else's infrastructure
   - `--whitelist` keeps discovered links from wandering off-domain
   - `--save-images` / `--save-screenshot` multiply storage; enable only if something downstream consumes them
   - Jobs are idempotent and resumable: re-running skips unchanged pages, so a killed run is restarted, not restarted from scratch
   - Run `scrape-it-now scrape run --help` for the full option set rather than guessing flag names

6. **Poll the job instead of blocking on it**
   - `scrape-it-now scrape status <job-name>` returns JSON: `processed`, `queued`, `network_used_mb`, timestamps
   - `queued` climbing far faster than `processed` means link discovery is outrunning the crawl — stop, lower `--max-depth` or tighten `--whitelist`, and restart
   - `network_used_mb` is the politeness check and the cost check at once; watch it on the first run of any new target
   - Never wrap the run in a blind wait. Report progress from `status` so the user can call it off

7. **Index only if the corpus is actually going to be searched**
   - `scrape-it-now index run <job-name>` chunks the markdown, embeds it with Azure OpenAI, and creates the Azure AI Search index automatically
   - Needs the full Azure OpenAI + Azure Search variable set (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME`, `AZURE_OPENAI_EMBEDDING_MODEL_NAME`, `AZURE_OPENAI_EMBEDDING_DIMENSIONS`, `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_API_KEY`)
   - This half is **Azure-only** — there is no local equivalent. If the user is not on Azure, stop after scraping and feed the markdown into their own pipeline; `/ai--rag-pipeline` covers chunking and embedding on any stack
   - Embedding cost scales with corpus size. Estimate it from the scrape's page count before running, not after

8. **Verify the output before declaring success**
   - Open several scraped documents and read them. Pandoc conversion on JavaScript-heavy pages can yield navigation chrome, empty bodies, or cookie banners instead of content
   - Spot-check that dynamic content actually rendered — an empty markdown body with correct metadata means Playwright returned before the page settled
   - Confirm the page count against the site's own sitemap; a crawl that ends at 12 pages on a 400-page site hit a depth limit or a whitelist that is too narrow

**Notes:**
- Depth and whitelist are the two settings that separate a considerate crawl from an accidental load test. Decide both with the user before the first run
- Re-crawls are cheap by design (unchanged pages are skipped), so schedule refreshes rather than re-running full crawls by hand — `/automation--scheduled-tasks`
- Output is markdown prose. Structured records → `/automation--web-scraper`; LLM field extraction → `/automation--scrapegraph-scraper`; browser interaction like logins or clicks → `/automation--browser-automation`
- Ad/tracker blocking is on by default via The Block List Project, which downloads a large list on first run — expect the startup delay and the network spike in `network_used_mb`
- Crawling pages containing personal data triggers GDPR/CCPA obligations. Warn the user, keep the crawl narrow, and do not index what the use case does not need
- The project pins Python 3.13+; on an older interpreter the install fails outright. Check `python3 --version` before diagnosing anything else

$ARGUMENTS
