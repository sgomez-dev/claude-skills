---
description: Generate or optimize tsconfig.json for the project
permissions:
  reads: ["tsconfig.json", "package.json"]
  writes: ["tsconfig.json"]
  commands: []
  network: false
  destructive: false
---

Generate or optimize the TypeScript configuration.

Steps:
1. Detect project type:
   - Node.js backend (CommonJS or ESM)
   - React/Next.js frontend
   - Library/package
   - Monorepo
   - Full-stack
2. Generate optimized tsconfig.json:

   **Strict mode** (always recommended):
   ```json
   "strict": true,
   "noUncheckedIndexedAccess": true,
   "noImplicitOverride": true,
   "exactOptionalPropertyTypes": true
   ```

   **Module resolution** (based on project type):
   - Node.js: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`
   - Frontend: `"module": "ESNext"`, `"moduleResolution": "Bundler"`
   - Library: `"module": "ESNext"`, `"declaration": true`

   **Path aliases** (if monorepo or complex structure):
   ```json
   "paths": { "@/*": ["./src/*"] }
   ```

3. For monorepos: project references with composite builds
4. Explain non-obvious settings
5. If tsconfig exists, review and suggest improvements

$ARGUMENTS
