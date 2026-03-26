---
description: Generate optimized Nginx configuration
permissions:
  reads: ["**/*"]
  writes: ["nginx.conf", "nginx/**"]
  commands: []
  network: false
  destructive: false
---

Generate an optimized Nginx configuration for the project.

Steps:
1. Determine the use case:
   - Reverse proxy for app server
   - Static file serving (SPA)
   - Load balancer
   - API gateway
2. Generate nginx.conf with:

   **Performance**
   - Worker processes and connections
   - Gzip compression with proper types
   - Static file caching with Cache-Control headers
   - Keepalive connections
   - Buffer sizes

   **Security**
   - SSL/TLS configuration (TLS 1.2+, strong ciphers)
   - Security headers (HSTS, X-Frame-Options, CSP)
   - Rate limiting
   - Request size limits
   - Hide server version
   - Block common exploit paths

   **Routing**
   - Proxy pass to upstream servers
   - WebSocket support if needed
   - SPA fallback (try_files $uri /index.html)
   - API path routing

   **SSL**
   - Let's Encrypt / certbot compatible
   - HTTP to HTTPS redirect
   - OCSP stapling

3. Include separate configs for development and production
4. Add comments explaining each directive

$ARGUMENTS
