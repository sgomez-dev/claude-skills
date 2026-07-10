---
description: Build abandoned cart recovery — detection, email sequence, incentive logic
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Implement abandoned cart recovery: detect when a shopper leaves items behind, run a short, well-timed
email/notification sequence that brings them back to a pre-filled checkout, and apply incentives
only when they actually change the outcome. Roughly 7 in 10 carts are abandoned; a recovery flow is
usually the highest-ROI email a store sends — but a pushy or discount-happy one trains customers to
abandon on purpose.

Steps:

1. **Detect platform and existing pieces**
   - Identify the stack: Shopify (abandoned checkout data + native/Klaviyo flows — configure rather than rebuild), WooCommerce (cart session + plugin or custom cron), Medusa/custom (own cart persistence + job scheduler + email service)
   - Find what exists: is the cart persisted server-side with a timestamp? Is an email identity captured pre-purchase? Is there an email sending setup (transactional provider, templates)?
   - From `$ARGUMENTS`, note AOV, purchase-consideration length (impulse vs researched), and any existing marketing-email tooling to integrate with instead of duplicating

2. **Define detection**
   - A cart is *abandoned* when: it has items + a reachable identity (email captured at checkout step 1 — see `/ecommerce--checkout-flow` — or a logged-in customer) + no activity for a threshold (default 1 hour; shorten for impulse goods, lengthen for considered purchases) + no completed order
   - Track cart state transitions (`active → abandoned → recovered | expired`) with timestamps; a cart returns to `active` on any interaction
   - Only shoppers with a lawful basis to contact enter the flow: marketing consent or, where the legal team confirms it applies, legitimate interest for an in-progress transaction — record which basis; skip everyone else

3. **Build the recovery link**
   - Signed, non-guessable token URL that restores the exact cart and lands the shopper as deep in checkout as their data allows (email/address pre-filled)
   - Re-validate on landing: current prices and stock; if something changed, say so plainly instead of silently swapping
   - Expire tokens with the cart, and never include payment data in the link or email

4. **Design the sequence (default 3 touches, then stop)**
   - **#1, ~1-4h**: plain reminder — cart contents with images, one clear CTA back to checkout, no discount. Subject states the fact ("You left 2 items in your cart"). Often the highest converter alone
   - **#2, ~24h**: remove doubt, not add pressure — answer the likely objection: shipping cost/returns policy, reviews or social proof for the exact items, support contact
   - **#3, ~48-72h**: final touch; this is the only slot where an incentive *may* appear (see step 5). Honest scarcity only ("still in stock" / "low stock" only if true)
   - Stop conditions checked before every send: purchase completed, cart emptied, unsubscribe, or a newer abandoned cart superseding this one (never two parallel sequences to one person)

5. **Incentive logic**
   - Default to **no discount**: reminders recover a meaningful share for free, and predictable discounts teach abandonment
   - If enabled, gate it: only in touch #3, only above a minimum cart value, single-use expiring code, capped percentage, and **exclude repeat abandoners** (e.g. >1 recovered-with-discount in 90 days) to break the training loop
   - Prefer non-margin incentives first where they fit: free shipping over threshold, free returns emphasis
   - Make thresholds config (env/settings), not hardcoded — merchandising will want to tune them

6. **Measure and verify**
   - Track per touch: sent, opened where measurable, clicked, recovered (order attributed within an attribution window, e.g. 5 days), revenue, and discount cost — recovery *rate* without discount cost is a vanity metric
   - Test end to end: abandon with a test email → receive #1 at the right delay → link restores cart → purchase stops the sequence; also test unsubscribe and the superseding-cart case
   - Summarize the flow, config knobs, and metrics to watch; suggest `/ecommerce--checkout-flow` fixes if abandonment concentrates on one step

**Notes:**
- Email capture timing decides recovery reach — email as the first checkout field is the single biggest lever
- Compliance is non-negotiable: honor unsubscribes across the whole sequence immediately, include sender identity and unsubscribe link (CAN-SPAM/GDPR/ePrivacy), and don't email carts from markets requiring opt-in without it
- Send from the transactional-quality domain/IP with proper SPF/DKIM — a recovery email in spam is a no-op
- Tone: helpful assistant, not stalker; reference the items, never the shopper's browsing behavior
- On Shopify, prefer configuring the native/Klaviyo flow to writing custom infrastructure — build custom only on Medusa/custom stacks

$ARGUMENTS
