---
description: Generate GraphQL schema with types, queries, mutations, and resolvers
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a GraphQL schema for the specified domain.

Steps:
1. Understand the data model and operations needed
2. Generate GraphQL schema:
   ```graphql
   type User {
     id: ID!
     email: String!
     posts: [Post!]!
   }

   type Query {
     user(id: ID!): User
     users(first: Int, after: String): UserConnection!
   }

   type Mutation {
     createUser(input: CreateUserInput!): User!
     updateUser(id: ID!, input: UpdateUserInput!): User!
   }
   ```
3. Include:
   - Proper nullability (`!` for non-null)
   - Input types for mutations (separate from output types)
   - Connection/pagination types (Relay-style cursor pagination)
   - Enum types for fixed sets
   - Interface types for polymorphism
   - Custom scalars (DateTime, JSON, etc.)
4. Generate resolvers with:
   - DataLoader for N+1 prevention
   - Auth directives or middleware
   - Input validation
   - Error handling with proper GraphQL errors
5. Follow existing project conventions

Requirements: $ARGUMENTS
