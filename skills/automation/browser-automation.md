---
description: Automate a browser task — login flows, form filling, downloads, scheduled runs
permissions:
  reads: ["package.json", "requirements.txt", "pyproject.toml", "*.py", "*.js", "*.ts", ".env.example"]
  writes: ["automation/**", "*.spec.ts", "*.py", "*.js", "*.ts", "downloads/**", ".env.example"]
  commands: ["node", "npm", "npx", "python", "pip", "playwright"]
  network: true
  destructive: false
---

Automate a repetitive browser task — logging into a portal, filling forms, downloading files,
clicking through a flow — with a resilient, headless-capable script. This is for **task automation**
on sites you have legitimate access to; for testing your own web app, use `/testing--playwright-mcp`
instead.

Steps:

1. **Clarify the task and check it's allowed**
   - Restate the flow as a numbered sequence: start URL → actions → expected end state (file downloaded, form submitted, data read)
   - Check the target site's Terms of Service for automation prohibitions (many SaaS ToS forbid bots); if automation is prohibited, **refuse and suggest alternatives**: official API, integrations, or `/automation--workflow-automation` with a supported connector
   - Only automate **the user's own accounts** with credentials they legitimately hold. Never bypass CAPTCHAs, 2FA challenges, or anti-bot walls — if the site presents one, pause for a human or stop
   - Always check for an official API first: an API call beats a fragile browser script

2. **Detect the stack and set up Playwright**
   - `package.json` → Node/TypeScript Playwright (`npm i -D playwright`); `requirements.txt`/`pyproject.toml` → `playwright` for Python (`pip install playwright && playwright install chromium`); no project → ask, default to Python for standalone scripts
   - Install only the browser needed (usually chromium); use a real, honest User-Agent — never spoof to evade bot detection

3. **Build the flow step by step**
   - **Credentials via env vars only** (`PORTAL_USER`, `PORTAL_PASS` read from the environment or a git-ignored `.env`); write an `.env.example` with placeholder values; never hardcode or log secrets
   - **Login once, reuse the session**: after a successful login, save `storageState` (cookies/localStorage) to a git-ignored file and reuse it on later runs — fewer logins, fewer 2FA prompts
   - Use resilient locators in priority order: `getByRole`/`getByLabel` > `data-testid`/`data-*` > CSS ids > text; avoid brittle auto-generated classes and XPath
   - Forms: fill field by field, verify values before submit; downloads: use the `waitForEvent("download")` pattern and save to a known path; extraction: prefer reading the page's XHR/JSON over screen-scraping the DOM

4. **Make it resilient**
   - Rely on Playwright auto-waiting and explicit `expect`/wait-for-selector conditions — never fixed `sleep`s
   - On failure: capture a screenshot + page URL to a `failures/` folder, then exit non-zero so schedulers detect it
   - Wrap the whole flow with 1-2 retries for transient issues; make the script **idempotent** (safe to re-run: check if the form was already submitted / file already downloaded before acting)
   - Pace actions like a human would (small delays between steps) — don't hammer the site

5. **Test headed, run headless**
   - Develop with `headless: false` (and Playwright Inspector / `page.pause()`) to watch the flow; switch to headless for real runs
   - Test the unhappy paths: wrong password, expired session, element not found — each should fail with a clear message, not hang
   - Log each step's outcome and print a one-line summary (what was done, where output landed)

6. **Schedule and hand off**
   - For recurring runs, wire it up via `/automation--scheduled-tasks` (cron/Task Scheduler/CI), passing credentials through the scheduler's secret store — never in the crontab line
   - Document: prerequisites, env vars needed, how to refresh the saved session when it expires, and the site pages the script depends on (so breakage is easy to diagnose when the UI changes)

**Notes:**
- Hard ethical lines: no CAPTCHA/2FA bypass, no scraping other users' data, no automation against sites that prohibit it, no credential sharing — credentials live in env vars/secret stores only
- Browser automation is the most fragile integration there is — always prefer an official API, and expect selectors to break when the site redeploys
- Saved session files (`storageState.json`) are credentials — add them to `.gitignore` immediately
- Need to scrape many pages of data rather than perform a task? Use `/automation--web-scraper`
- Multi-app workflows (browser step + email + spreadsheet) often fit better in `/automation--workflow-automation`

$ARGUMENTS
