---
description: Build secure webhook receivers with signature verification and retry handling
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Build a secure webhook receiver endpoint.

Steps:
1. Determine the webhook source:
   - Stripe, GitHub, Slack, Twilio, SendGrid
   - Cloudflare notifications
   - Custom webhook sender
   - Generic webhook with HMAC signature
2. Generate webhook handler:

   **Signature verification**
   - HMAC-SHA256 verification (Stripe, GitHub, generic)
   - Timestamp validation to prevent replay attacks
   - Raw body parsing (before JSON middleware)
   - Constant-time comparison for signatures

   **Request processing**
   - Event type routing / dispatch
   - Idempotency handling (store processed event IDs)
   - Async processing with queue for heavy work
   - Proper 200 response before processing (avoid timeouts)

   **Error handling**
   - Return 200 for received events (even if processing fails)
   - Queue failed events for retry
   - Dead letter queue for permanently failed events
   - Logging with event ID for debugging

3. Detect the framework and generate appropriate code:
   - Express / Fastify (Node.js)
   - FastAPI / Flask (Python)
   - Go net/http
   - Cloudflare Worker
4. Security considerations:
   - Verify source IP ranges if available
   - Rate limit the endpoint
   - Validate payload schema
   - Never trust webhook data without verification
5. Include tests with example payloads from the provider

$ARGUMENTS
