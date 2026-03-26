---
description: Set up or optimize monorepo with workspaces, shared configs, and build pipeline
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "npx turbo"]
  network: true
  destructive: false
---

Set up or optimize a monorepo.

Steps:
1. Detect or choose monorepo tool:
   - npm/yarn/pnpm workspaces
   - Turborepo for build orchestration
   - Nx for advanced task running
2. Set up structure:
   ```
   packages/
   ├── shared/        # Shared types, utils
   ├── ui/           # Shared UI components
   ├── config/       # Shared ESLint, TSConfig, Prettier
   ├── api/          # Backend service
   └── web/          # Frontend app
   ```
3. Configure:
   - Workspace definitions in root package.json
   - Shared TypeScript config (base tsconfig extended by packages)
   - Shared ESLint config (as a package)
   - Shared Tailwind/CSS config
   - Internal package references
4. Build pipeline:
   - Task dependencies (build shared → build app)
   - Caching (skip unchanged packages)
   - Parallel execution
5. CI/CD:
   - Affected-only testing (only test changed packages)
   - Independent versioning per package
   - Dependency graph visualization
6. Common scripts from root:
   - `dev` - start all services
   - `build` - build in dependency order
   - `test` - test affected packages
   - `lint` - lint all packages

$ARGUMENTS
