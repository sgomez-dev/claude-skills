---
description: Configure reverse proxy setups with Cloudflare, Nginx, or Caddy
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Configure a reverse proxy for the application.

Steps:
1. Determine the reverse proxy requirements:
   - Backend services and their ports
   - Domain and path routing rules
   - TLS termination point
   - WebSocket support needed
   - Load balancing across backends
2. Generate configuration for the target platform:

   **Cloudflare Worker proxy**
   - Route-based origin selection
   - Header manipulation (Host, X-Forwarded-For)
   - Request/response transformation
   - Error page customization

   **Nginx**
   - `proxy_pass` with upstream blocks
   - `proxy_set_header` for proper forwarding
   - WebSocket upgrade handling
   - Buffering and timeout settings

   **Caddy**
   - Caddyfile with `reverse_proxy` directive
   - Automatic HTTPS
   - Health checks and failover
   - Header manipulation

3. Common proxy patterns:
   - Path-based routing (`/api` -> backend, `/` -> frontend)
   - Subdomain-based routing
   - WebSocket proxying with connection upgrade
   - gRPC proxying with HTTP/2
   - Sticky sessions for stateful backends
4. Security considerations:
   - Restrict origin access to proxy IPs only
   - Forward real client IP (X-Forwarded-For, CF-Connecting-IP)
   - Set proper `Host` header to prevent host header attacks
   - Rate limiting at the proxy layer
5. Include both development and production configurations

$ARGUMENTS
