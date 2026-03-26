---
description: Generate Entity Relationship Diagram from database schema or ORM models
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Generate an ER diagram from the project's database schema.

Steps:
1. Find schema definition:
   - ORM models (Prisma schema, SQLAlchemy models, TypeORM entities, Django models)
   - Migration files
   - SQL schema files
2. Extract entities and relationships:
   - Tables → entities
   - Foreign keys → relationships (1:1, 1:N, M:N)
   - Junction tables → M:N relationships
3. Generate Mermaid ER diagram:
   ```mermaid
   erDiagram
     USER ||--o{ ORDER : places
     USER {
       uuid id PK
       string email UK
       string name
       timestamp created_at
     }
     ORDER ||--|{ ORDER_ITEM : contains
     ORDER {
       uuid id PK
       uuid user_id FK
       decimal total
       enum status
     }
   ```
4. Include:
   - All columns with types
   - PK, FK, UK markers
   - Relationship cardinality
   - Logical grouping for large schemas
5. Also output a text summary of all relationships

$ARGUMENTS
