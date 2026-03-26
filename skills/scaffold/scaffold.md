---
description: Scaffold a complete project structure from scratch
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pip install"]
  network: true
  destructive: false
---

Scaffold a new project or feature module.

Steps:
1. Understand the requirements: language, framework, purpose
2. Generate a complete project structure:

   **Backend API**
   ```
   src/
   ├── config/        # Environment, database, app config
   ├── controllers/   # Route handlers
   ├── middleware/     # Auth, validation, error handling
   ├── models/        # Database models
   ├── routes/        # Route definitions
   ├── services/      # Business logic
   ├── utils/         # Shared utilities
   └── index.ts       # Entry point
   tests/
   ├── unit/
   ├── integration/
   └── fixtures/
   ```

   **Frontend App**
   ```
   src/
   ├── components/    # Shared components
   ├── pages/         # Route pages
   ├── hooks/         # Custom hooks
   ├── services/      # API clients
   ├── store/         # State management
   ├── types/         # TypeScript types
   └── utils/         # Utilities
   ```

3. Include essential config files:
   - TypeScript config, linter config, formatter config
   - Docker setup, CI/CD pipeline
   - Environment variable template
   - Git hooks (husky + lint-staged)
4. Install dependencies
5. Ensure `npm run dev` / equivalent works

Project type: $ARGUMENTS
