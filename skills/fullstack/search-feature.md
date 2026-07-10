---
description: Add search: engine choice (Postgres FTS/Meilisearch/Elastic), indexing, ranking, UI
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "docker-compose*.yml", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Add a production-grade search feature to the current app: pick the right engine for the data size
and query needs, build the indexing pipeline that keeps it in sync, tune ranking, and ship a search
UI with debounced-as-you-type results. Defaults to the simplest engine that meets the requirements —
most apps never need Elasticsearch.

Steps:

1. **Detect the stack and what needs searching** (`$ARGUMENTS`)
   - Identify framework, ORM, and primary database; check for existing search (a `search` route, `LIKE` queries, `tsvector` columns, a Meilisearch/Elastic/Typesense/Algolia client already installed) — extend, don't duplicate
   - Establish from input or the schema: which models/entities to search, which fields, rough row counts, and query needs (prefix/typo tolerance, facets/filters, multi-language, geo)

2. **Choose the engine and confirm the trade-off**
   - **Postgres FTS** (default when the DB is Postgres and rows < ~1M): zero new infra, transactional consistency for free, good ranking via `ts_rank`; weaker typo tolerance and faceting
   - **Meilisearch/Typesense**: instant typo-tolerant prefix search, easy facets, one small extra service to run — the sweet spot for user-facing product search
   - **Elasticsearch/OpenSearch**: only for large corpora, complex aggregations, or log/analytics-style queries — real operational cost, say so plainly
   - SQLite → FTS5; MySQL → FULLTEXT for basic needs, external engine beyond that. Present one recommendation with a one-line reason and confirm

3. **Model the index**
   - Define one search document per entity: searchable fields with weights (title > body > tags), filterable attributes, and the display fields the UI needs (avoid a second fetch per hit where the engine allows storing them)
   - **Security-first**: never index data the searcher may not see in a way that leaks it — include the tenant/owner/visibility attribute in every document and make filtering on it mandatory in the query layer, not optional
   - Postgres path: generated `tsvector` column with weighted `setweight` per field + GIN index, via a real migration

4. **Build the indexing pipeline**
   - Initial backfill: a batched, resumable command/task that indexes existing rows without loading the whole table into memory
   - Incremental sync: index on create/update/delete via the ORM's hooks or the app's service layer; for external engines, push through a queue/background job so a search-engine outage never fails a user write (see `/fullstack--background-jobs`)
   - Handle deletes and soft-deletes explicitly — stale documents that resurface deleted content are the classic search bug

5. **Query layer and ranking**
   - One server-side search function/endpoint: sanitized query input, mandatory visibility/tenant filter applied server-side, pagination, and rate limiting — never expose the engine's raw query DSL or admin key to the browser
   - Ranking: field weights first, then tie-breakers (recency, popularity) as a secondary sort or boost; for Postgres use `ts_rank_cd` with normalization, plus `pg_trgm` similarity as a fallback for short/typo'd queries
   - Return highlighted snippets where the engine supports it

6. **Search UI**
   - Debounced as-you-type input (~200-300 ms), request cancellation for stale queries, loading and empty states ("No results for X — try fewer words"), keyboard navigation on the results list
   - Match the app's existing frontend conventions and components; add facet/filter controls only for the attributes modeled in step 3
   - Escape all rendered highlights — highlighted snippets are a classic XSS vector

7. **Tests and handoff**
   - Tests: relevance smoke tests (known query → expected top hit), visibility filtering (user A never sees user B's private rows in results), delete removes from index, backfill idempotency
   - Run the suite; summarize: engine chosen and why, `.env.example` additions (engine URL/keys — server-side key never shipped to the client), the backfill command to run, and reindexing notes for future schema changes

**Notes:**
- Start with Postgres FTS unless a concrete requirement (typo tolerance, facets, scale) rules it out — an engine you don't run is an engine that can't page you
- The visibility filter belongs in one server-side choke point; audit every query path for it — search is the easiest place to leak private data
- Analyzer/language config matters: pick the right text search configuration (e.g., `spanish`) or the engine's language setting for non-English content
- Log queries with zero results (query text only, no user PII beyond what policy allows) — it's the best free source of ranking improvements
- Pairs with `/fullstack--admin-panel` for an admin reindex button and `/performance--` skills if search latency becomes the bottleneck

$ARGUMENTS
