---
description: Generate API documentation from route handlers and controllers
permissions:
  reads: ["**/*"]
  writes: ["docs/**"]
  commands: []
  network: false
  destructive: false
---

Generate comprehensive API documentation from the codebase.

Steps:
1. Find all API routes/endpoints in the project (Express routes, FastAPI paths, etc.)
2. For each endpoint, document:
   - **Method & Path**: `GET /api/users/:id`
   - **Description**: What this endpoint does
   - **Authentication**: Required auth (Bearer, API key, none)
   - **Parameters**:
     - Path params with types
     - Query params with types and defaults
     - Request body schema (with example)
   - **Response**: Status codes with response body examples
     - 200: Success response
     - 400: Validation errors
     - 401/403: Auth errors
     - 404: Not found
     - 500: Server errors
   - **Example**: curl command or fetch example
3. Group endpoints by resource/domain
4. Output in the requested format (Markdown, OpenAPI YAML, or both)
5. Include rate limiting, pagination, and versioning info if applicable

Scope: $ARGUMENTS
