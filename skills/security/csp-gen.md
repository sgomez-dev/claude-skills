---
description: Generate and validate Content Security Policy headers
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a secure Content Security Policy for the application.

Steps:
1. Analyze the application to identify:
   - Inline scripts and styles used
   - External scripts (CDNs, analytics, etc.)
   - Image sources (CDN, user uploads, data URIs)
   - Font sources
   - API endpoints called from frontend
   - WebSocket connections
   - iframe embeds
2. Generate CSP directives:
   - `default-src 'self'` as baseline
   - `script-src` with specific origins (avoid `'unsafe-inline'` and `'unsafe-eval'`)
   - `style-src` with specific origins
   - `img-src` with specific origins
   - `connect-src` for API/WebSocket
   - `font-src` for web fonts
   - `frame-src` / `frame-ancestors` for iframe control
   - `form-action` to restrict form targets
   - `base-uri 'self'` to prevent base tag hijacking
   - `upgrade-insecure-requests` for HTTPS
3. Use nonces or hashes instead of `'unsafe-inline'` where possible
4. Suggest both `Content-Security-Policy` (enforcing) and `Content-Security-Policy-Report-Only` (testing)
5. Output in both meta tag and header format

$ARGUMENTS
