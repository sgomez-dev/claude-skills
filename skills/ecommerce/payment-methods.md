---
description: Add payment methods: cards, wallets, BNPL, and local methods per market
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Add the payment methods that actually convert in each target market — cards, digital wallets, BNPL, and local
schemes — integrated through a provider so you never touch raw card data or take on undue PCI scope.

Steps:

1. **Detect the stack and target markets** (`$ARGUMENTS`)
   - Detect the e-commerce platform/provider from the repo (Shopify, Woo, Medusa, custom + Stripe/Adyen/Mollie, etc.)
   - Clarify the markets you sell to — payment preferences vary sharply by country (cards in the US, iDEAL in NL,
     SEPA/Klarna in the EU, PIX in BR, UPI in IN)

2. **Choose methods by market, not by default**
   Recommend the high-conversion methods per target market: cards + Apple/Google Pay broadly, plus the dominant
   local method(s). Adding the right local method often lifts conversion more than any checkout tweak.

3. **Integrate via the provider (never handle raw cards)**
   Use the provider's hosted fields / payment element / redirect flows so card data never touches your servers —
   this keeps you in the lightest PCI scope (SAQ A). Enable methods through the provider's config/API.

4. **Handle the full lifecycle**
   Wire authorization, capture, the asynchronous methods (many local/BNPL methods confirm later via webhook),
   refunds, and failures. Verify webhook signatures and treat the webhook — not the client redirect — as the
   source of truth for payment success (`/fullstack--payments-integration`).

5. **Get the UX and edge cases right**
   Show only methods available for the shopper's country/currency, handle currency and minor-unit correctly,
   surface clear errors, and make retry easy. Address 3-D Secure/SCA where required.

6. **Test**
   Use the provider's test methods/cards per scheme, including delayed-confirmation and failure scenarios, before
   enabling in production.

**Notes:**
- Never accept or store raw card numbers — always use the provider's hosted/element flows to stay in minimal PCI scope
- The webhook is the source of truth for payment status; the client redirect can be lost or spoofed
- Local payment methods are a conversion lever, not a nice-to-have, in non-US markets
- Pairs with `/ecommerce--checkout-flow` and `/fullstack--payments-integration`

$ARGUMENTS
