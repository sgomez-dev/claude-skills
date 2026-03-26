---
description: Analyze and optimize slow SQL queries or ORM queries
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Optimize the specified database queries.

Steps:
1. Read the query (SQL or ORM code)
2. Analyze for common performance issues:
   - **Missing indexes**: Columns in WHERE, JOIN, ORDER BY without indexes
   - **N+1 queries**: Loops that execute a query per iteration
   - **SELECT ***: Fetching all columns when only a few are needed
   - **Full table scans**: Missing WHERE clause or unindexed filters
   - **Subquery vs JOIN**: Correlated subqueries that could be JOINs
   - **LIKE '%pattern%'**: Leading wildcard prevents index use
   - **OR conditions**: Consider UNION ALL instead
   - **Implicit conversions**: Type mismatch preventing index use
   - **Missing LIMIT**: Unbounded queries on large tables
   - **Unnecessary DISTINCT**: Usually indicates a join problem
3. Suggest optimizations:
   - Add specific indexes (with index type: B-tree, GIN, GiST)
   - Rewrite query structure
   - Add eager loading for N+1 (include, preload, joinedload)
   - Use pagination (cursor-based for large datasets)
   - Consider materialized views for complex aggregations
4. Show EXPLAIN ANALYZE output interpretation if available

Query: $ARGUMENTS
