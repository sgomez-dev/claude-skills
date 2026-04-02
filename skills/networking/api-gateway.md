---
description: Design API gateway configuration with rate limiting, auth, and routing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design an API gateway configuration for the application.

Steps:
1. Analyze the API architecture:
   - Microservices and their endpoints
   - Public vs internal APIs
   - Authentication mechanisms (API keys, JWT, OAuth)
   - Rate limiting requirements per consumer tier
2. Generate gateway configuration:

   **Route definitions**
   - Path-based routing to backend services
   - Version prefixing (`/v1/`, `/v2/`)
   - Method-level routing
   - Request/response transformation

   **Authentication layer**
   - API key validation at the edge
   - JWT verification and claims extraction
   - OAuth 2.0 token introspection
   - Pass identity context to backends via headers

   **Rate limiting**
   - Per-key or per-IP rate limits
   - Tiered limits (free, pro, enterprise)
   - Sliding window or token bucket algorithm
   - Custom response headers (X-RateLimit-*)

   **Request pipeline**
   - Input validation and sanitization
   - Request size limits
   - Timeout per route
   - Circuit breaker for unhealthy backends

3. Choose implementation:
   - Cloudflare Worker as gateway
   - Kong / KrakenD configuration
   - AWS API Gateway / GCP Endpoints
   - Custom middleware stack
4. Add observability:
   - Request logging with trace IDs
   - Latency metrics per route
   - Error rate monitoring
   - Usage analytics per API key
5. Generate OpenAPI spec reflecting the gateway routes

$ARGUMENTS
