---
description: Implement Cloudflare Workers KV for edge key-value storage
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npx", "wrangler"]
  network: true
  destructive: false
---

Set up Cloudflare Workers KV for edge key-value storage.

Steps:
1. Determine the KV use case:
   - Configuration / feature flags
   - Session storage
   - URL shortener mappings
   - Cached API responses
   - User preferences
   - Static asset metadata
2. Generate implementation:

   **wrangler.toml bindings**
   - KV namespace binding for preview and production
   - Multiple namespaces if needed (config, cache, sessions)

   **Key design patterns**
   - Consistent key naming convention (e.g., `user:{id}:profile`)
   - Key prefix strategy for listing/filtering
   - Metadata usage for secondary attributes
   - Expiration TTL per use case

   **Data access helpers**
   - Typed get/put/delete/list wrappers
   - JSON serialization with proper typing
   - Bulk operations for data migration
   - Cache patterns with TTL and stale-while-revalidate

3. Handle KV consistency model:
   - Eventually consistent reads (up to 60s propagation)
   - Design for read-heavy workloads
   - Avoid KV for data requiring strong consistency (use D1 or Durable Objects)
   - Use metadata for lightweight secondary data
4. Implement error handling for KV operations
5. Include migration script for seeding initial data

$ARGUMENTS
