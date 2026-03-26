---
description: Generate middleware for authentication, logging, validation, etc.
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate middleware for the project's web framework.

Steps:
1. Detect the framework (Express, Fastify, Koa, Django, FastAPI, Go net/http)
2. Generate middleware for the requested purpose:

   **Authentication**
   - Verify JWT/session token
   - Extract user from token
   - Attach user to request context
   - Handle expired tokens

   **Authorization**
   - Role-based access control
   - Permission checking
   - Resource ownership verification

   **Validation**
   - Request body validation
   - Query parameter validation
   - Path parameter validation
   - Return 400 with structured errors

   **Logging**
   - Request/response logging
   - Correlation ID generation
   - Duration tracking
   - Exclude sensitive data from logs

   **Rate Limiting**
   - Token bucket or sliding window
   - Per-user or per-IP limiting
   - Customizable limits per route

   **Error Handling**
   - Centralized error handler
   - Structured error responses
   - Don't leak stack traces in production

3. Include types and tests

Middleware type: $ARGUMENTS
