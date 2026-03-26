---
description: Generate or update Prisma schema from requirements or existing database
permissions:
  reads: ["prisma/**", "**/*"]
  writes: ["prisma/schema.prisma"]
  commands: ["npx prisma generate", "npx prisma migrate"]
  network: false
  destructive: false
---

Generate or update a Prisma schema.

Steps:
1. If creating new: understand data requirements from user
2. If updating: read existing `prisma/schema.prisma`
3. Generate Prisma schema with:
   - Proper model definitions with all fields
   - Correct field types (`String`, `Int`, `DateTime`, `Json`, etc.)
   - Relations with `@relation` directive
   - Unique constraints with `@@unique`
   - Indexes with `@@index`
   - Default values (`@default(uuid())`, `@default(now())`)
   - Enums for fixed sets of values
   - `@@map` for table name mapping if needed
4. Best practices:
   - Use `uuid` or `cuid` for IDs (not autoincrement for distributed)
   - Always have `createdAt` and `updatedAt`
   - Define explicit relation names for clarity
   - Add `@@index` on frequently filtered columns
   - Use `Json` sparingly
5. Generate the migration command and client generation command

Requirements: $ARGUMENTS
