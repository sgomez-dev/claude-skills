---
description: Set up shipping — zones, rates, carrier integration, tracking notifications
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Set up shipping for a store: geographic zones, a rate strategy shoppers understand, carrier
integration for labels and live rates, and tracking notifications that keep customers from writing
"where is my order?" emails. Shipping cost and delivery uncertainty are top abandonment drivers —
the goal is rates shown early, promises the store can keep, and proactive communication after the
buy button.

Steps:

1. **Detect platform and shipping context**
   - Identify the stack: Shopify (shipping profiles/zones/rates natively, carrier-calculated rates via CarrierService), WooCommerce (zones + method plugins), Medusa (fulfillment providers + shipping options), or custom
   - Read existing shipping config/code: zones defined, rates hardcoded anywhere, any carrier SDK already present, how fulfillment status is stored
   - From `$ARGUMENTS`, note: ship-from locations, destination markets, product profile (weight/dims, oversized, perishable), and order volume (drives carrier choice)

2. **Define shipping zones**
   - Group destinations by cost/logistics reality, not just geography: e.g. domestic, neighboring region (EU), rest of world — start with the fewest zones that price honestly
   - Per zone declare: available service levels (standard/express), delivery promise as a **date range** shoppers see ("Arrives Jul 15-18" converts better than "3-5 business days"), and restrictions (no batteries/liquids to X, no PO boxes for courier)
   - Explicitly decide what happens to unsupported destinations: hidden at address entry, not discovered at the last checkout step

3. **Choose the rate strategy per zone**
   - **Flat rate**: simple, predictable — right default for uniform catalogs
   - **Free over threshold**: the strongest conversion lever; set threshold slightly above current AOV and advertise progress in the cart ("€12 away from free shipping")
   - **Live carrier rates**: for heavy/varied catalogs where flat rates would over/undercharge — requires accurate per-variant weights and dimensions from the catalog (`/ecommerce--product-catalog`)
   - **Table rates** (by weight/price bands): middle ground when live rates aren't available
   - Keep the choice honest: shipping shown in cart and at checkout step 1, never first revealed at payment (`/ecommerce--checkout-flow`)

4. **Integrate carriers**
   - Prefer a multi-carrier aggregator (Shippo, EasyPost, ShipStation, Sendcloud) over N direct carrier APIs — one integration, many carriers, easier to switch
   - Implement the fulfillment path: order → validate/normalize address → purchase label (rate shop across services) → store tracking number + carrier + label URL on the fulfillment record
   - Sandbox credentials in `.env.example` (placeholders only), production keys via the platform's secret management; make label purchase idempotent per fulfillment so retries don't buy duplicate labels
   - On Shopify, fulfillment apps often cover this — integrate with what the merchant already uses before writing custom code

5. **Tracking notifications**
   - Notify on the events customers actually care about: **shipped** (with tracking link and ETA), **out for delivery**, **delivered**, and **exception/delay** (proactive apology + new ETA beats a support ticket)
   - Drive events from carrier webhooks (aggregators normalize these) rather than polling; update order status so "My orders" and support see the same truth
   - Use the store's existing email/notification infrastructure; keep messages short, branded, and containing order number, items, tracking link, and destination — nothing that requires logging in to read

6. **Verify end to end**
   - Test with sandbox: order in each zone, rate shown matches label cost expectation, address validation catches a bad address, webhook updates status, notifications fire once (not per webhook retry)
   - Edge cases: multi-item order splitting across locations (`/ecommerce--inventory-management` routing), oversized item forcing a service, free-shipping threshold combined with a discount code
   - Summarize zones, rates, carrier setup, and the notification matrix

**Notes:**
- Never promise what fulfillment can't keep: pad the delivery range with realistic handling time; a kept 5-day promise beats a broken 2-day one
- Show a delivery estimate on the product page for the shopper's likely destination — it removes uncertainty before the cart
- International: be explicit about duties/taxes (DDP vs DDU) at checkout; surprise customs fees generate chargebacks and one-star reviews
- Address validation at entry (autocomplete + carrier validation) is the cheapest fix for the most expensive failure: undeliverable packages
- Log every carrier API interaction (request id, cost, response) — rate disputes and lost-package claims are won with records

$ARGUMENTS
