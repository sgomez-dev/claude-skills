---
description: Build a polite web scraper — robots.txt, rate limits, selectors, pagination, storage
permissions:
  reads: ["package.json", "requirements.txt", "pyproject.toml", "*.py", "*.js", "*.ts", ".env.example"]
  writes: ["scraper/**", "scrape_*.py", "scrape_*.js", "scrape_*.ts", "data/**", ".env.example"]
  commands: ["node", "npm", "npx", "python", "pip", "uv"]
  network: true
  destructive: false
---

Build a polite, production-quality web scraper for a target site: verify the site allows it,
extract data with stable selectors, handle pagination, throttle requests, and persist results in a
clean, resumable format. Ethics and site rules come first — a scraper that gets blocked or violates
terms is worthless.

Steps:

1. **Verify you are allowed to scrape** (do this before writing any code)
   - Fetch `https://<target>/robots.txt` and check the paths you need against `Disallow` rules and `Crawl-delay`; if the paths are disallowed, **stop and tell the user** — do not proceed
   - Check the site's Terms of Service for scraping prohibitions; if scraping is prohibited, refuse and suggest alternatives (official API, data export, licensed dataset)
   - Look for an **official API or sitemap.xml first** — an API is always preferable to scraping HTML
   - Never scrape behind a login/paywall, never bypass CAPTCHAs or anti-bot systems, never spoof a browser to evade blocks. If the site actively blocks bots, that is the site's answer — respect it

2. **Detect the stack and pick libraries**
   - Inspect the project: `package.json` → Node, `requirements.txt`/`pyproject.toml` → Python; if neither exists, ask which the user prefers
   - **Static HTML** — Node: `got`/`undici` + `cheerio`; Python: `httpx` + `BeautifulSoup` (or `selectolax` for speed)
   - **JavaScript-rendered pages** — Playwright in either stack; but first check DevTools Network tab for the underlying JSON/XHR endpoint — fetching that directly is faster and more stable than rendering
   - Sample one target page and confirm the chosen approach actually returns the data before building more

3. **Design the extraction**
   - Write selectors from stable attributes (ids, `data-*`, semantic structure) — avoid brittle auto-generated class names; note 2-3 fallback selectors for key fields
   - Map the **pagination pattern**: query param (`?page=N`), next-link (`rel="next"`), cursor/offset in an API, or infinite scroll (find the XHR it triggers)
   - Define the output schema up front: field names, types, and which field is the unique key for dedup

4. **Be a polite client**
   - Set a **descriptive User-Agent** identifying the scraper and a contact (e.g., `my-scraper/1.0 (+mailto:you@example.com)`) — never impersonate a real browser to evade detection
   - Rate-limit: honor `Crawl-delay` if present, otherwise 1 request per 1-2 seconds, concurrency of 1-2 max; add jitter
   - Retry with exponential backoff on 429/5xx (respect `Retry-After`); on repeated 403/429, back off hard or stop — do not rotate IPs or headers to evade
   - Cache raw responses locally during development so re-runs don't re-hit the site

5. **Store results cleanly**
   - Small runs → CSV or JSONL; larger/incremental → SQLite with a unique index on the key field for idempotent upserts
   - Record `scraped_at` and `source_url` per row; write incrementally (crash mid-run loses nothing) and support resume by skipping already-stored keys
   - Keep secrets/config (base URL, output path, delay) in env vars or a config block — never hardcode credentials (there should be none: no auth walls)

6. **Test small, then document**
   - Run against 2-3 pages first, verify field completeness and types, then the full run
   - Add logging (pages fetched, rows written, errors) and a summary line at the end
   - Document in a header comment: what it scrapes, robots.txt check date, rate limit used, how to resume
   - For recurring runs, point the user to `/automation--scheduled-tasks`; if the flow needs real browser interaction, see `/automation--browser-automation`

**Notes:**
- Legality check is non-negotiable: robots.txt + ToS + no auth walls + no CAPTCHA bypass. When in doubt, don't scrape
- Personal data (names, emails, profiles) triggers GDPR/CCPA obligations — warn the user and minimize collection
- Prefer APIs > sitemaps > HTML scraping > headless browser, in that order of stability and cost
- Selectors rot: build in a validation step that fails loudly when expected fields come back empty
- Scraper output feeding reports? Chain with `/automation--report-automation`

$ARGUMENTS
