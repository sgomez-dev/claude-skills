---
description: Generate or optimize a production-ready Dockerfile
permissions:
  reads: ["**/*"]
  writes: ["Dockerfile", ".dockerignore"]
  commands: []
  network: false
  destructive: false
---

Generate an optimized, production-ready Dockerfile.

Steps:
1. Analyze the project: language, framework, build process, dependencies
2. Generate a multi-stage Dockerfile:
   ```
   # Stage 1: Dependencies
   - Use specific version tags (not :latest)
   - Use slim/alpine variants where possible
   - Copy only dependency files first (package.json, go.mod, etc.)
   - Install dependencies (leverage layer caching)

   # Stage 2: Build
   - Copy source code
   - Run build step

   # Stage 3: Production
   - Use minimal base image
   - Copy only built artifacts
   - Set non-root user
   - Add health check
   - Set proper CMD (not npm start - use node directly)
   ```
3. Optimize for:
   - **Layer caching**: Most-changed layers last
   - **Image size**: Multi-stage builds, .dockerignore
   - **Security**: Non-root user, no secrets in layers, minimal base
   - **Reproducibility**: Pinned versions, lock files
4. Generate `.dockerignore` file
5. Add labels (maintainer, version, description)
6. If Dockerfile exists, compare and suggest improvements

$ARGUMENTS
