---
description: Generate or update OpenAPI/Swagger specification from code
permissions:
  reads: ["**/*"]
  writes: ["openapi.yaml", "swagger.yaml"]
  commands: []
  network: false
  destructive: false
---

Generate an OpenAPI 3.0 specification from the codebase.

Steps:
1. Scan for all API endpoints (routes, controllers, handlers)
2. For each endpoint extract:
   - HTTP method and path
   - Request parameters (path, query, header)
   - Request body schema
   - Response schemas for each status code
   - Authentication requirements
3. Generate OpenAPI 3.0 YAML with:
   - info (title, description, version)
   - servers (from environment configs)
   - paths (all endpoints)
   - components/schemas (reusable models)
   - securitySchemes (auth methods)
   - tags (logical grouping)
4. Validate the generated spec structure
5. Include realistic examples in schemas
6. If an existing openapi.yaml exists, update it rather than overwriting

$ARGUMENTS
