---
description: Design or review database schema with proper normalization and indexing
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design or review a database schema.

Steps:
1. Understand the domain and data requirements
2. Design/review tables with:
   - **Proper normalization**: 3NF as default, denormalize only with justification
   - **Primary keys**: UUID vs auto-increment (consider distributed systems)
   - **Foreign keys**: All relationships have proper FK constraints
   - **Data types**: Most appropriate type for each column (avoid VARCHAR for everything)
   - **Constraints**: NOT NULL, UNIQUE, CHECK where appropriate
   - **Indexes**: On FKs, unique columns, frequent query patterns
   - **Timestamps**: created_at, updated_at on all tables
   - **Soft deletes**: deleted_at if needed (vs hard deletes)
3. Common patterns:
   - Polymorphic associations (avoid - use separate tables or junction tables)
   - JSON columns (use sparingly, only for truly unstructured data)
   - Enum columns (DB enum vs string vs reference table)
   - Audit logging (separate audit table vs triggers)
4. Generate:
   - SQL CREATE TABLE statements
   - ER diagram (Mermaid)
   - Migration files for the project's ORM

Requirements: $ARGUMENTS
