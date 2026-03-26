---
description: Scaffold a complete full-stack feature across frontend, backend, and database
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Scaffold a complete full-stack feature end-to-end.

Steps:
1. Understand the feature requirements
2. Generate all layers:

   **Database layer**
   - Migration for new tables/columns
   - Model/entity definition
   - Seed data for development

   **Backend API**
   - Route definition
   - Controller with request validation
   - Service layer with business logic
   - Repository/data access layer
   - Error handling
   - API tests

   **Frontend**
   - API client methods (typed)
   - State management (store/context/hooks)
   - UI components:
     - List/index view
     - Detail view
     - Create/edit form
     - Delete confirmation
   - Loading, error, and empty states
   - Form validation

   **Integration**
   - E2E test for the complete flow
   - API documentation update

3. Follow all existing project conventions
4. Ensure proper error handling at every layer
5. Include optimistic updates if applicable

Feature: $ARGUMENTS
