---
description: Configure Cloudflare Pages for static site and JAMstack deployments
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "wrangler"]
  network: true
  destructive: false
---

Set up a Cloudflare Pages deployment for the project.

Steps:
1. Detect the framework:
   - Next.js, Nuxt, Astro, SvelteKit, Remix
   - React (CRA/Vite), Vue, Angular
   - Static site generators (Hugo, Jekyll, Eleventy)
2. Generate configuration:

   **Build settings**
   - Framework preset or custom build command
   - Output directory
   - Root directory (for monorepos)
   - Environment variables (build-time)

   **_redirects / _headers files**
   - SPA fallback: `/* /index.html 200`
   - Custom redirects (301, 302)
   - Security headers (CSP, HSTS, X-Frame-Options)
   - Cache-Control for static assets

   **Functions (if needed)**
   - `/functions/` directory for server-side logic
   - API routes with proper typed bindings
   - Middleware for auth/logging

3. Configure `wrangler.toml` for Pages if using advanced features
4. Set up preview deployments:
   - Branch-based preview URLs
   - Environment variables per branch
   - Access policies for staging
5. Optimize for performance:
   - Asset optimization settings
   - Early hints configuration
   - Custom cache rules

$ARGUMENTS
