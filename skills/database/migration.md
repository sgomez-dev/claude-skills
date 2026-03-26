---
description: Generate database migration files for schema changes
permissions:
  reads: ["**/*"]
  writes: ["migrations/**", "prisma/migrations/**"]
  commands: []
  network: false
  destructive: false
---

Generate a database migration for the requested schema change.

Steps:
1. Detect the migration tool in use:
   - Prisma, Knex, TypeORM, Sequelize (Node.js)
   - Alembic, Django migrations (Python)
   - golang-migrate, goose (Go)
   - ActiveRecord (Ruby)
   - Raw SQL migrations
2. Understand the requested change:
   - Create table, alter table, add column, drop column
   - Add index, add constraint, add foreign key
   - Data migration (transform existing data)
3. Generate migration with:
   - **Up migration**: Apply the change
   - **Down migration**: Reverse the change (ALWAYS reversible)
   - Proper column types for the database (PostgreSQL, MySQL, SQLite)
   - NOT NULL constraints with defaults for existing data
   - Indexes on foreign keys and frequently queried columns
4. Safety checks:
   - Adding NOT NULL to existing column? Need default value
   - Dropping column? Ensure no code references it
   - Renaming? Consider a two-phase migration
   - Large table? Consider online schema change tools
5. Test the migration against current schema

Change: $ARGUMENTS
