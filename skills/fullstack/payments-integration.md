---
description: Integrate payments - checkout, subscriptions, signed webhooks, customer portal
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Integrate a payment provider end-to-end: hosted checkout, subscription lifecycle, signature-verified
webhooks as the source of truth, and a customer billing portal. Defaults to Stripe but detects and
uses an existing provider (Paddle, Braintree, Lemon Squeezy, Mercado Pago...) if one is already wired.

Steps:

1. **Detect the stack and provider**
   - Identify framework, ORM, and any existing payment SDK or half-finished integration in the codebase
   - Default to Stripe unless another provider is installed or named in `$ARGUMENTS`; prefer the provider's official SDK and stack-specific package (e.g. `stripe` gem + Rails, `dj-stripe` option for Django, Laravel Cashier)
   - Check whether billing attaches to a user or an organization (look for org/tenant models — see `/fullstack--saas-starter`)

2. **Propose the billing model and confirm trade-offs**
   - **Checkout**: provider-hosted checkout page (recommended — less PCI surface, faster) vs embedded elements (more control, more work)
   - **Catalog**: define plans/prices in the provider dashboard and mirror locally vs code-first sync — recommend dashboard + local mirror table
   - Subscription shape: flat tiers, per-seat, usage-based — confirm from `$ARGUMENTS` before modeling

3. **Data model and migrations**
   - `customers` (billable entity ↔ provider customer id), `subscriptions` (provider id, price/plan, status, current_period_end, cancel_at_period_end), `plans`/`prices` mirror, and `webhook_events` (provider event id unique, payload, processed_at) for idempotency
   - Entitlements derive from subscription status — one `has_feature?/can_use()` helper the whole app calls, never scattered plan checks

4. **Checkout flow**
   - Server endpoint creates a checkout session (price id, success/cancel URLs, customer id, org/user reference in metadata) — amounts and prices are **never** trusted from the client
   - Success page shows a pending state until the webhook confirms; do not grant entitlements from the redirect alone

5. **Webhooks — the source of truth**
   - Endpoint that verifies the provider signature on the **raw** request body before any parsing; reject on mismatch
   - Idempotent handling: insert event id first (unique constraint), skip if seen; handle `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_failed` (dunning state) or provider equivalents
   - Process quickly and defer heavy work to background jobs (`/fullstack--background-jobs`); return 2xx only after durable recording

6. **Customer portal and entitlement gating**
   - Portal session endpoint (provider-hosted portal for card updates, plan changes, cancellation) linked from billing settings
   - Gate features via the entitlement helper in server-side middleware/policies; graceful downgrade behavior (read-only, banners) rather than data loss
   - Billing settings page: current plan, renewal date, payment status, upgrade/downgrade CTAs

7. **Tests, env vars, and summary**
   - Tests with the provider SDK mocked: checkout session creation, webhook signature rejection, idempotent replay (same event twice → one effect), each subscription status transition, entitlement gating allow/deny
   - Run the suite; summarize migrations, `.env.example` additions (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY` or provider equivalents), the provider dashboard steps (create products/prices, register webhook URL), and the CLI command to forward webhooks locally (e.g. `stripe listen`)

**Notes:**
- Never store card data — hosted checkout/elements keep you out of PCI scope; never trust prices, plan ids, or amounts from the client
- Webhooks are authoritative for entitlement state; the redirect/success page is only UX
- Use test-mode keys everywhere by default; the summary must flag which env vars need live keys at deploy
- Store money as integer minor units with an explicit currency column — never floats
- Pairs with `/fullstack--saas-starter` (billing stubs it leaves behind) and `/fullstack--feature-flags` (gradual paywall rollout)

$ARGUMENTS
