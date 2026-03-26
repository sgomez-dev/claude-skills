---
description: Review and harden environment configuration and HTTP security headers
permissions:
  reads: ["**/*", ".env*", ".gitignore"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Review environment configuration and security headers.

Steps:
1. Check environment configuration:
   - .env files not in .gitignore? (CRITICAL)
   - Debug mode flags in production configs
   - Verbose error messages enabled
   - Default/weak credentials in configs
   - Unnecessary ports exposed
2. Check HTTP security headers:
   - `Strict-Transport-Security` (HSTS)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options` or CSP frame-ancestors
   - `X-XSS-Protection` (legacy but still useful)
   - `Referrer-Policy`
   - `Permissions-Policy` (camera, microphone, geolocation)
   - `Cache-Control` for sensitive pages
3. Check server configuration:
   - Server version headers removed
   - Directory listing disabled
   - Unnecessary HTTP methods disabled
   - HTTPS redirect in place
4. Generate a security headers configuration for the project's server/framework
5. Provide a before/after comparison

$ARGUMENTS
