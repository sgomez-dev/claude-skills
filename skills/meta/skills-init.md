---
description: Scan your project and activate only the relevant skills with project-specific config
permissions:
  reads: ["package.json", "tsconfig.json", "requirements.txt", "pyproject.toml", "go.mod", "Cargo.toml", "Gemfile", "Dockerfile", "docker-compose.yml", ".github/workflows/**", "*.tf"]
  writes: [".claude/skills.config.json"]
  commands: []
  network: false
  destructive: false
---

Scan the current project to detect the tech stack and generate a skills configuration.

Steps:
1. Detect project technologies by checking for:
   - **Language**: package.json (JS/TS), requirements.txt/pyproject.toml (Python), go.mod (Go), Cargo.toml (Rust), Gemfile (Ruby)
   - **Framework**: Check dependencies for React, Next.js, Vue, Nuxt, Svelte, Express, Fastify, Django, FastAPI, Flask, Gin, etc.
   - **Test runner**: Jest, Vitest, Playwright, Cypress, pytest, Go testing
   - **ORM**: Prisma, TypeORM, Drizzle, Sequelize, SQLAlchemy, GORM
   - **CSS**: Tailwind, styled-components, CSS Modules, Sass
   - **Infra**: Dockerfile, docker-compose, K8s manifests, Terraform files, CI configs
   - **Package manager**: pnpm-lock.yaml, yarn.lock, bun.lockb, package-lock.json

2. Based on detection, recommend which skill categories are relevant:
   - Always relevant: git, code-quality, utils
   - Frontend detected: scaffold (component, hook), performance (bundle, lazy-load), accessibility, i18n
   - Backend detected: api, database, security, performance (cache, memory-leak)
   - Infra detected: devops (only matching tools - don't suggest k8s if not using k8s)
   - AI deps detected: ai

3. Generate a `.claude/skills.config.json` file:
```json
{
  "project": {
    "language": "typescript",
    "framework": "nextjs",
    "test_runner": "vitest",
    "orm": "prisma",
    "css": "tailwind",
    "package_manager": "pnpm"
  },
  "active_skills": [
    "git--commit",
    "git--pr-create",
    "testing--test-gen",
    "database--prisma-gen"
  ],
  "skill_context": {
    "testing--test-gen": "Use Vitest with React Testing Library. Follow existing test patterns in __tests__/",
    "scaffold--component": "React functional component with TypeScript. Use Tailwind for styling.",
    "database--migration": "Use Prisma migrations. Schema at prisma/schema.prisma"
  },
  "disabled_skills": [
    "devops--k8s",
    "devops--terraform",
    "scaffold--hook"
  ],
  "disabled_reasons": {
    "devops--k8s": "No Kubernetes config detected",
    "devops--terraform": "No Terraform files detected",
    "scaffold--hook": "Project uses Vue, not React"
  }
}
```

4. Present a summary to the user:
   ```
   Detected: TypeScript + Next.js + Prisma + Vitest + Tailwind

   Recommended: 42 of 90 skills
   Disabled:    48 skills (not relevant to this stack)

   Config saved to .claude/skills.config.json
   ```

5. Suggest adding the config to .gitignore or committing it for team use.

$ARGUMENTS
