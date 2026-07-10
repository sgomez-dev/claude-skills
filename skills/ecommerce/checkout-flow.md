---
description: Build or audit an optimized checkout — guest flow, payment UX, error recovery
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design, build, or audit a checkout flow optimized for completion rate. Checkout is where stores
lose the most money: every extra field, surprise cost, or unrecoverable error is measurable
abandonment. This skill produces a checkout that minimizes friction, keeps the shopper's trust at
the moment they're most skeptical, and recovers gracefully when something fails.

Steps:

1. **Detect platform and current checkout**
   - Identify the stack: Shopify (checkout is hosted — focus shifts to cart→checkout hand-off and checkout extensibility), WooCommerce, Medusa, or custom (framework + payment SDK)
   - Map the existing flow if one exists: routes/templates from cart to confirmation, fields collected, payment integration, and any analytics events already firing
   - From `$ARGUMENTS`, note whether this is a build-from-scratch, an audit, or a specific fix

2. **Define the step structure**
   - Default to the shortest honest flow: **cart review → address & shipping → payment → confirmation** (single-page with sections or 3 steps max; show a progress indicator either way)
   - Show the full order summary — items, shipping, tax, total — on every step; surprise costs at the last step are the #1 stated abandonment reason
   - Make the primary button state what happens next ("Continue to payment", "Pay €42.90") — never a bare "Submit"

3. **Guest checkout and identity**
   - Guest checkout is the default path; account creation is an optional one-click offer *after* purchase (they already typed everything needed)
   - Email first field, validated inline — it enables `/ecommerce--abandoned-cart` recovery even if the shopper leaves at step 2
   - Autofill-friendly forms: correct `autocomplete` attributes, address autocomplete where available, no fields you don't strictly need (company, fax, "how did you hear about us" — cut them)

4. **Payment UX**
   - Integrate payments via provider components only (Stripe Elements/Checkout, Shopify Payments, PayPal SDK, hosted fields) — **raw card data must never touch your forms, server, or logs** (keeps you in PCI SAQ-A scope)
   - Show wallet buttons (Apple Pay / Google Pay / PayPal) *above* the card form — wallets skip the address form entirely for returning users
   - Inline card validation (brand detection, expiry format, Luhn) before submit, and a visible security cue near the pay button (lock icon, "Secured by <provider>")
   - For adding methods (BNPL, local methods), hand off to `/ecommerce--payment-methods`

5. **Error recovery**
   - Payment declined: keep all entered data, show a plain-language message with a next action ("Your card was declined — try another card or PayPal"), never a raw gateway code
   - Distinguish recoverable (declined, network timeout → retry) from non-recoverable (out of stock at capture → apologize, refund/release, suggest alternatives)
   - Guard against double-submit (disable button + idempotency keys on the payment call) and preserve state on refresh/back navigation
   - Session expiry or price/stock changes mid-checkout: re-validate before charging and tell the shopper exactly what changed

6. **Analytics and measurement**
   - Fire a standard funnel: `checkout_started`, `checkout_step_viewed`/`completed` per step, `payment_failed` (with error category, never card data), `purchase`
   - Match the store's existing analytics tool (GA4 ecommerce events, Shopify analytics, Segment) rather than introducing a new one
   - Deliver a short "what to watch" note: step-by-step drop-off, decline rate by payment method, and mobile vs desktop completion

7. **Verify end to end**
   - Walk the full flow with test cards: success, decline, 3DS challenge, wallet payment, and an interrupted session
   - Check mobile viewport, keyboard types (numeric for card/postal), and that confirmation shows order number, summary, and delivery expectation

**Notes:**
- Trust cues that measurably help: total visible at all times, accepted payment logos, clear returns/shipping links near the pay button — not badge walls
- Every field must justify its existence with a business need; phone number is only "required" if the carrier actually needs it
- 3D Secure/SCA is mandatory in EU markets — build the challenge flow in from the start, don't bolt it on
- Send order confirmation email immediately; the post-purchase silence gap is a trust killer
- On Shopify, customization lives in checkout extensibility/branding APIs — don't fight the hosted checkout, optimize the paths into it

$ARGUMENTS
