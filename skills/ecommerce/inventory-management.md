---
description: Implement inventory — stock tracking, reservations, low-stock alerts, multi-location
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Implement reliable inventory management: per-SKU stock tracking, reservations that prevent
overselling, low-stock alerting, and multi-location support where warranted. Inventory bugs are
trust bugs — overselling means cancellation emails, and phantom "out of stock" means silent lost
revenue — so correctness under concurrency matters more here than in almost any other store code.

Steps:

1. **Detect platform and current inventory handling**
   - Identify the stack: Shopify (InventoryLevel/InventoryItem per location — configure, don't rebuild), Medusa (inventory + stock-location modules), WooCommerce (per-product stock fields), or custom schema
   - Find how stock is currently read and written: where checkout decrements, whether anything reserves, what happens on refund/cancel
   - From `$ARGUMENTS`, note scale and needs: SKU count, order volume, single warehouse vs multiple locations/stores, pre-orders or backorders

2. **Model stock correctly**
   - Track per **variant/SKU**, never per product; core quantities: `on_hand` (physically there), `reserved` (committed to open orders), `available = on_hand − reserved` — storefront and APIs must always show *available*
   - Record every change as an immutable **stock movement** (delta, reason: sale, return, adjustment, transfer, correction; reference, actor, timestamp) — the audit trail is what makes discrepancies debuggable
   - Explicit flags per SKU: `track_inventory` (services/digital goods may not), `allow_backorder`, optional `safety_stock` buffer to absorb count drift

3. **Implement reservations to prevent overselling**
   - Reserve at **order placement** (payment authorized), release on cancellation/expiry, convert to a real decrement on fulfillment; optionally reserve during checkout with a short TTL (10-20 min) for high-demand drops
   - Make the decrement race-safe: atomic conditional update (`UPDATE ... SET reserved = reserved + n WHERE available >= n` style) or the platform's reservation API — never read-then-write in application code
   - Re-validate availability at payment capture; if stock vanished mid-checkout, fail *before* charging and route through the checkout's error recovery (`/ecommerce--checkout-flow`)

4. **Low-stock alerts and replenishment signals**
   - Per-SKU (or per-category default) `low_stock_threshold`; when *available* crosses it, notify via the channel the team already uses — email, Slack webhook, or a dashboard flag — including SKU, location, current level, and recent sales velocity
   - Fire on transition (crossing the threshold), not on every check, to avoid alert fatigue; auto-resolve when replenished
   - Surface scarcity to shoppers only when true and useful ("Only 3 left") — fake scarcity destroys trust and is illegal in several markets

5. **Multi-location (if needed)**
   - Add locations only when physically real (warehouses, retail stores, 3PL, dropship): stock levels and movements become per-location; transfers are paired movements
   - Define a fulfillment routing rule — nearest-to-customer, cheapest, or priority order — and keep it simple and documented; split shipments only if the business accepts the cost
   - Storefront availability = sum of sellable locations (exclude returns/damage quarantine); optionally expose per-store pickup availability

6. **Sync, reconciliation, and verification**
   - Reconciliation path for physical counts: cycle-count adjustment creates a correction movement, never a raw overwrite of `on_hand`
   - If external systems exist (POS, 3PL, ERP, marketplace), define the single **source of truth** per SKU and sync direction — bidirectional ad-hoc sync is how stores end up overselling
   - Test the ugly paths: two concurrent checkouts for the last unit, cancel-after-reserve, refund-after-fulfillment, negative-stock prevention; then summarize the model and hand off to `/ecommerce--shipping-setup` for fulfillment

**Notes:**
- Overselling one unit costs more trust than "out of stock" costs revenue — when in doubt, reserve conservatively
- Never expose `on_hand` publicly; competitors scrape it and it leaks operational info — expose availability states or capped counts
- Keep inventory writes out of the storefront request path where possible: place order → reserve synchronously; everything else (movements, alerts, sync) can be async
- Returns restock only after inspection — an automatic restock-on-refund silently sells damaged goods
- On Shopify/Medusa, prefer configuring the native inventory system over building a parallel one; parallel systems always drift

$ARGUMENTS
