---
description: Create a mock API server for frontend development or testing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Create a mock API server for development.

Steps:
1. Identify the API endpoints to mock (from docs, types, or frontend code)
2. Generate mock server using appropriate tool:
   - MSW (Mock Service Worker) for frontend testing
   - json-server for quick REST API
   - Express/Fastify for custom mock logic
3. For each endpoint:
   - Realistic response data (use faker-like values)
   - Proper status codes
   - Simulate latency (realistic response times)
   - Support pagination, filtering, sorting
   - Error responses (400, 401, 404, 500)
4. Include:
   - Toggle between mock and real API (env variable)
   - Stateful mocking (POST creates, GET retrieves, DELETE removes)
   - WebSocket mocking if needed
   - Request logging for debugging
5. Generate seed data that covers:
   - Normal cases
   - Empty states
   - Error states
   - Loading states (delayed responses)

API to mock: $ARGUMENTS
