---
description: Generate docker-compose.yml for local development or production
permissions:
  reads: ["**/*"]
  writes: ["docker-compose.yml", "docker-compose.*.yml", ".env.example"]
  commands: []
  network: false
  destructive: false
---

Generate a docker-compose.yml for the project.

Steps:
1. Analyze project to identify required services:
   - Application server(s)
   - Database (PostgreSQL, MySQL, MongoDB, Redis)
   - Message queue (RabbitMQ, Kafka)
   - Cache (Redis, Memcached)
   - Search (Elasticsearch, Meilisearch)
   - Reverse proxy (Nginx, Traefik)
2. Generate docker-compose.yml with:
   - Proper service definitions
   - Health checks for all services
   - Volume mounts for data persistence
   - Network definitions for service isolation
   - Environment variables (with .env file reference)
   - Restart policies
   - Resource limits (memory, CPU)
   - Dependency ordering (depends_on with condition: service_healthy)
3. Create separate files if needed:
   - `docker-compose.yml` - base
   - `docker-compose.override.yml` - local dev overrides
   - `docker-compose.prod.yml` - production overrides
4. Generate the .env.example file with all required variables

$ARGUMENTS
