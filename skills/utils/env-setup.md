---
description: Set up environment variables with .env files and validation
permissions:
  reads: ["**/*"]
  writes: [".env.example", "**/*"]
  commands: []
  network: false
  destructive: false
---

Set up environment variable management for the project.

Steps:
1. Scan the codebase for all environment variable usage:
   - `process.env.X` (Node.js)
   - `os.environ` / `os.getenv` (Python)
   - `os.Getenv` (Go)
   - `env::var` (Rust)
2. For each variable found, determine:
   - Name and description
   - Required or optional
   - Default value (if any)
   - Type (string, number, boolean, URL, etc.)
   - Which environment it's needed in (dev, staging, prod)
3. Generate:
   - `.env.example` with all variables (no real values, just descriptions)
   - Validation schema (Zod, joi, pydantic) that runs at startup
   - Type definitions for the config object
   - Config module that loads and validates env vars
4. Ensure:
   - `.env` is in `.gitignore`
   - `.env.example` is tracked in git
   - App fails fast with clear error on missing required vars
   - Sensitive vars are never logged

$ARGUMENTS
