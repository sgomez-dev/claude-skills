---
description: Scaffold an e-commerce store — platform choice, catalog, cart, and checkout shell
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install*", "npm create*", "npx *", "pnpm *", "yarn *", "shopify *", "composer *"]
  network: true
  destructive: false
---

Scaffold a working e-commerce store foundation: help choose the right platform for the business,
then generate the storefront skeleton — product catalog pages, cart, and a checkout entry point —
following the chosen platform's conventions. The goal is a store a developer can run locally and a
shopper could trust: fast pages, clear product info, and no dead ends between "browse" and "buy".

Steps:

1. **Detect existing stack and context**
   - Inspect the repo: `package.json` / `composer.json` / lockfiles, framework configs (Next.js, Nuxt, Remix, Astro, Laravel), and any existing commerce code (Shopify theme structure, `medusa-config`, WooCommerce plugin, Stripe/commerce SDK imports)
   - If a platform is already present, **extend it** — do not scaffold a competing one
   - From `$ARGUMENTS` and the repo, note: product type (physical/digital/subscriptions), expected catalog size, team skills, and whether a headless frontend is desired

2. **Choose (or confirm) the platform**
   - Present a short recommendation with trade-offs, then confirm before scaffolding:
     - **Shopify** (hosted): fastest to revenue, PCI handled, less backend control — theme (Liquid) or headless via Storefront API + Hydrogen
     - **Medusa** (open source, Node): full control, self-hosted, good for custom logic — Medusa backend + Next.js starter
     - **WooCommerce**: already-WordPress teams, content-heavy stores
     - **Custom** (framework + Stripe/commerce APIs): only when requirements genuinely don't fit a platform — say so honestly if they do
   - State the recommendation in one paragraph with the single strongest reason and the main risk

3. **Scaffold the foundation**
   - Use the platform's official generator where one exists (`npm create @medusajs/app`, `shopify theme init`, Hydrogen/Next commerce starters) instead of hand-rolling boilerplate
   - Set up environment config with `.env.example` (API keys as placeholders — never commit real secrets) and a `README` section: how to run, where products live, how checkout is wired

4. **Build the catalog layer**
   - Product listing page (grid, image, price, availability) and product detail page (gallery, variant selector, price, add-to-cart, trust elements: shipping/returns summary)
   - Category/collection navigation and basic search or filtering appropriate to catalog size
   - Seed 5-10 realistic sample products with variants so the store is demoable immediately
   - For deeper modeling (options, attributes, media), point to `/ecommerce--product-catalog`

5. **Wire cart and checkout entry**
   - Persistent cart (server-side or platform cart API — not just localStorage), with quantity update, remove, and a visible subtotal everywhere the cart is shown
   - Mini-cart or cart drawer so adding an item never navigates the shopper away from browsing
   - Checkout hand-off: platform-hosted checkout (Shopify) or a checkout route stub — full flow belongs to `/ecommerce--checkout-flow`, payments to `/ecommerce--payment-methods`

6. **Verify and hand off**
   - Run the dev server, confirm: home → category → product → add to cart → cart → checkout entry works end to end
   - Summarize what was scaffolded, the platform decision and why, and the recommended next skills: `/ecommerce--checkout-flow`, `/ecommerce--shipping-setup`, `/ecommerce--inventory-management`

**Notes:**
- Never handle raw card data in scaffolded code — checkout must use the provider's hosted checkout, Elements, or hosted fields (PCI SAQ-A scope)
- Prefer boring platform conventions over clever abstractions; a store that follows Shopify/Medusa docs is maintainable by any hire
- Performance is conversion: image optimization, lazy loading below the fold, and no blocking third-party scripts from day one
- Mobile first — most store traffic is mobile; verify the browse-to-cart path on a small viewport
- If the user's requirements clearly fit a hosted platform, say so even if a custom build sounds more fun

$ARGUMENTS
