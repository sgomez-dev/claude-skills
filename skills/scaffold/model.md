---
description: Generate a data model with validation, serialization, and database integration
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a data model/entity.

Steps:
1. Detect the ORM/framework in use
2. Generate model with:

   **Schema definition**
   - All fields with proper types
   - Validation rules (required, min/max, pattern, enum)
   - Default values
   - Computed/virtual fields
   - Timestamps (createdAt, updatedAt)
   - Soft delete (deletedAt) if project uses it

   **Relationships**
   - belongsTo, hasMany, hasOne, manyToMany
   - Proper foreign keys
   - Cascade rules (onDelete, onUpdate)

   **Methods**
   - Instance methods for common operations
   - Static methods for queries (findByEmail, etc.)
   - Scopes/filters for common query patterns
   - toJSON serialization (exclude sensitive fields like password)

   **Validation**
   - Field-level validation
   - Custom validators
   - Cross-field validation

3. Generate migration if applicable
4. Generate factory/fixture for testing
5. Follow existing model patterns in the project

Model: $ARGUMENTS
