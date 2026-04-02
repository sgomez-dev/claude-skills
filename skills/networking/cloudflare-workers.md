---
description: Scaffold and deploy Cloudflare Workers for edge computing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "wrangler"]
  network: true
  destructive: false
---

Scaffold a Cloudflare Worker for the requested use case.

Steps:
1. Determine the Worker purpose:
   - API proxy / gateway
   - Request transformation / rewriting
   - A/B testing at the edge
   - Authentication / JWT validation
   - Geolocation-based routing
   - HTML rewriting (HTMLRewriter API)
   - Cron-triggered tasks
2. Generate project structure:

   **wrangler.toml** - Worker configuration
   - Name, route patterns, compatibility date
   - Environment-specific configs (staging, production)
   - KV namespace bindings if needed
   - D1 database bindings if needed
   - R2 bucket bindings if needed
   - Secrets references

   **src/index.ts** - Worker entry point
   - Typed request/env bindings
   - Router pattern (itty-router or manual)
   - Error handling with proper HTTP responses
   - CORS headers if serving API

3. Follow best practices:
   - Use `waitUntil()` for non-blocking async work
   - Implement proper error boundaries
   - Add request validation at the edge
   - Use `crypto.subtle` for crypto operations (not Node.js crypto)
   - Keep Worker size under 1MB compressed
   - Use ES modules format (not Service Worker syntax)
4. Include example `wrangler.toml` for dev and production environments
5. Add TypeScript types for bindings

$ARGUMENTS
