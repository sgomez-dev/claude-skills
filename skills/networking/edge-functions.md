---
description: Build edge functions for request/response manipulation and routing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Build edge functions for request and response manipulation.

Steps:
1. Determine the edge function use case:
   - URL rewriting and redirects
   - Header manipulation (add, remove, modify)
   - A/B testing and feature flags
   - Geolocation-based content
   - Bot detection and filtering
   - Authentication at the edge
   - Response transformation (HTML rewriting, JSON patching)
2. Choose the platform and generate code:

   **Cloudflare Workers**
   - `fetch` event handler
   - `HTMLRewriter` for streaming HTML transforms
   - `Request`/`Response` API usage

   **Vercel Edge Functions**
   - `next/server` middleware
   - Edge Runtime compatible code

   **Deno Deploy**
   - `Deno.serve()` pattern
   - Standard Web APIs

3. Implement common patterns:
   - URL normalization (trailing slashes, lowercase)
   - Geographic redirects based on `cf.country` or headers
   - Inject analytics scripts via HTML rewriting
   - Add security headers to all responses
   - Token validation before reaching origin
   - Response caching with custom keys
4. Handle edge cases:
   - Streaming responses (don't buffer entire body)
   - Binary content passthrough
   - WebSocket upgrade handling
   - Large request bodies
5. Follow existing project patterns and conventions

$ARGUMENTS
