---
description: Set up Cloudflare D1 serverless SQLite database
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "wrangler"]
  network: true
  destructive: false
---

Configure Cloudflare D1 database for the project.

Steps:
1. Determine the data requirements:
   - Schema design based on application needs
   - Read/write patterns and expected volume
   - Relationship complexity
2. Generate database setup:

   **Schema migrations**
   - `migrations/` directory with numbered SQL files
   - CREATE TABLE statements with proper types
   - Indexes for common query patterns
   - Foreign keys and constraints

   **wrangler.toml bindings**
   - D1 database binding configuration
   - Preview vs production database IDs
   - Migration settings

3. Generate data access layer:
   - Prepared statements (never raw string interpolation)
   - CRUD operations with proper error handling
   - Batch operations using `db.batch()`
   - Transaction support where needed
   - Typed query results with TypeScript
4. Follow D1 best practices:
   - Keep individual queries fast (SQLite single-writer)
   - Use batch operations to reduce round trips
   - Index columns used in WHERE and JOIN clauses
   - Avoid large BLOBs (use R2 instead)
   - Use `RETURNING` clauses for insert/update
5. Include seed data script for development

$ARGUMENTS
