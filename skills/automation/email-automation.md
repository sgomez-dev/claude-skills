---
description: Build email automations — parse inbound mail, templated sending, sequences, unsubscribe
permissions:
  reads: ["package.json", "requirements.txt", "pyproject.toml", "*.py", "*.js", "*.ts", "templates/**", ".env.example"]
  writes: ["email/**", "templates/**", "*.py", "*.js", "*.ts", ".env.example"]
  commands: ["node", "npm", "python", "pip"]
  network: true
  destructive: false
---

Build an email automation: parse inbound messages into structured data, send templated mail, run
multi-step sequences with delays and exit conditions, and handle unsubscribes properly. Covers both
transactional automation (receipts, alerts, parsed-inbox workflows) and outbound sequences — with
deliverability and compliance (CAN-SPAM/GDPR) built in, not bolted on.

Steps:

1. **Classify the automation** (`$ARGUMENTS`)
   - **Inbound**: parse/route incoming email (extract order data, create tickets, file attachments)
   - **Transactional**: one event → one templated email (receipt, alert, notification)
   - **Sequence**: multi-email drip with delays, conditions, and exits (onboarding, follow-ups)
   - Confirm: sender domain, expected volume, and which mailbox/provider is involved (Gmail/Google Workspace, Outlook/M365, custom IMAP, or an ESP)

2. **Detect the stack and pick the transport**
   - `package.json` → Node: `nodemailer` (SMTP), provider SDKs (`@sendgrid/mail`, `resend`, `postmark`), `imapflow` + `mailparser` for inbound; Python: `smtplib`/provider SDKs for sending, `imap-tools` + `email` stdlib for inbound
   - Prefer an **ESP API** (SendGrid, Postmark, Resend, SES) over raw SMTP for anything beyond a handful of mails — you get bounce/complaint webhooks and suppression lists for free
   - **All credentials via env vars** (`SMTP_URL`, `SENDGRID_API_KEY`, `IMAP_PASSWORD`...) with an `.env.example`; for Gmail/M365 prefer OAuth or app passwords, never the account password

3. **Inbound parsing** (if applicable)
   - Choose the intake: IMAP polling (simple), provider push (Gmail API watch / Graph subscriptions), or an ESP inbound-parse webhook (most robust — email arrives as an HTTP POST)
   - Parse defensively: multipart bodies, HTML vs plain text, encodings, attachments; extract fields with anchored patterns, and route anything that doesn't parse to a `needs_review` folder/label instead of guessing
   - Make processing **idempotent** by Message-ID (store processed ids); mark-as-read/move only after successful processing so crashes don't lose mail

4. **Templates and sending**
   - Templates with explicit variables (Node: `handlebars`/`mjml` for HTML layout; Python: `jinja2`); always generate a **plain-text alternative** alongside HTML
   - Validate all variables are filled before send — a `Hi {{first_name}}` reaching a customer is worse than no email
   - Throttle sends to the provider's rate limit; log every send (recipient, template, message id, status) to a local store for audit and dedup — never email the same person the same template twice by accident

5. **Sequences** (if applicable)
   - Model as a state machine per recipient: `step`, `next_send_at`, `status` — stored in SQLite/DB, advanced by a scheduled runner (`/automation--scheduled-tasks`)
   - Define **exit conditions first**: reply received, goal completed, unsubscribed, bounced → stop the sequence immediately; check exits before every send
   - Sensible delays (days, not minutes), send within recipient business hours, cap total emails per sequence
   - Detecting replies requires inbound access (step 3) or an ESP events webhook — don't skip it, emailing someone who already replied burns trust

6. **Unsubscribe, compliance, deliverability**
   - Every non-transactional email: visible unsubscribe link **and** `List-Unsubscribe` + `List-Unsubscribe-Post` headers (required by Gmail/Yahoo for bulk senders); honor opt-outs immediately via a suppression list checked before every send
   - Include the sender's physical address in marketing mail (CAN-SPAM); only email people with a lawful basis (GDPR) — never scraped or purchased lists
   - Verify SPF, DKIM, DMARC on the sending domain before going live; warm up new domains slowly; process bounce/complaint webhooks into the suppression list
   - Test end-to-end with a seed inbox (send to yourself, check spam placement and rendering) before real recipients

**Notes:**
- Suppression list is sacred: check it before every single send, no exceptions, ever
- Prefer ESP webhooks (delivered/bounced/complained/opened) over guessing — wire them into the send log
- Keep templates in version control; keep recipient data out of it
- Sales outreach content itself belongs to `/sales--cold-outreach` if present — this skill builds the machinery
- Reports delivered by email? Build the report with `/automation--report-automation` and hand it to this pipeline

$ARGUMENTS
