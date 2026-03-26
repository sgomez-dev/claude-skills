---
description: Scaffold a complete API endpoint with validation, auth, and error handling
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Scaffold a complete API endpoint.

Steps:
1. Detect the framework (Express, Fastify, FastAPI, Django REST, Go net/http, etc.)
2. Generate the endpoint with:

   **Route handler**
   - Proper HTTP method (GET, POST, PUT, PATCH, DELETE)
   - RESTful path naming
   - Request validation (body, params, query)
   - Authentication middleware
   - Authorization check (role/permission)
   - Business logic (or call to service layer)
   - Proper HTTP status codes
   - Structured response format

   **Validation schema**
   - Zod, Joi, Yup (Node.js)
   - Pydantic (Python)
   - Struct tags (Go)

   **Types/interfaces**
   - Request/response types
   - Error types

   **Tests**
   - Happy path test
   - Validation error test
   - Auth test (unauthorized, forbidden)
   - Not found test

3. Follow existing project patterns and conventions
4. Place files in the correct directories

Endpoint description: $ARGUMENTS
