---
description: Generate a type-safe API client SDK from endpoint definitions
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a type-safe API client for the project's API.

Steps:
1. Find API endpoint definitions:
   - OpenAPI spec, route files, controllers
2. Generate a client with:
   - Type-safe methods for each endpoint
   - Request/response types
   - Proper error handling
   - Authentication header management
   - Base URL configuration
   - Request/response interceptors
3. Example output (TypeScript):
   ```typescript
   class ApiClient {
     async getUser(id: string): Promise<User> { ... }
     async createUser(data: CreateUserInput): Promise<User> { ... }
     async listUsers(params: ListParams): Promise<PaginatedResponse<User>> { ... }
   }
   ```
4. Include:
   - Retry logic for transient errors (5xx, network)
   - Request timeout configuration
   - Response caching headers support
   - Upload/download progress if needed
   - Cancellation support (AbortController)
5. Generate for the appropriate language/platform

API to generate client for: $ARGUMENTS
