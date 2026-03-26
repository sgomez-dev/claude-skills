---
description: Generate realistic seed data for development and testing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate seed data for the database.

Steps:
1. Read the schema (from ORM models, migrations, or SQL)
2. Generate seed data that:
   - Covers all tables with proper foreign key relationships
   - Uses realistic data (real-looking names, emails, addresses)
   - Includes edge cases (long strings, special characters, null optionals)
   - Has enough variety (not just "Test User 1", "Test User 2")
   - Respects constraints (unique, check, enum values)
   - Creates a usable development environment
3. Data categories:
   - **Admin users**: Default admin account with known credentials
   - **Regular users**: 10-20 varied user profiles
   - **Reference data**: Countries, categories, statuses, etc.
   - **Transactional data**: Orders, posts, comments with realistic patterns
   - **Edge cases**: Empty fields, maximum lengths, unicode
4. Generate in the project's seed format:
   - ORM seed files (Prisma, Sequelize, TypeORM, Django fixtures)
   - SQL INSERT statements
   - JSON fixtures
5. Make seeds idempotent (safe to run multiple times)

Schema/scope: $ARGUMENTS
