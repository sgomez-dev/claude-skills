---
description: Debug failures across microservices using distributed tracing and request correlation
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl", "kubectl logs", "kubectl get", "docker logs", "grpcurl"]
  network: true
  destructive: false
---

Debug failures that span multiple microservices by tracing requests end-to-end across service boundaries.

Steps:
1. Map the service topology involved in the failing request:
   - Read service definitions: docker-compose.yml, k8s manifests, service mesh config
   - Identify the request path: API gateway → service A → service B → database/cache
   - Map inter-service communication: REST, gRPC, message queues, events
   - Identify shared dependencies: databases, caches, auth services, config servers
2. Establish the request correlation:
   - Find the trace ID / correlation ID / request ID propagation:
     - HTTP headers: X-Request-ID, X-Trace-ID, traceparent (W3C), X-B3-TraceId (Zipkin)
     - gRPC metadata, message queue headers
   - If no tracing exists, identify timestamp-based correlation opportunities
   - Check OpenTelemetry/Jaeger/Zipkin/Datadog APM instrumentation in the code
3. Trace the request through each service hop:
   - For each service in the chain:
     a. Read the handler code for the incoming request
     b. Identify all outgoing calls (HTTP clients, gRPC stubs, queue publishers)
     c. Check error handling: Is the upstream error propagated? Swallowed? Transformed?
     d. Check timeouts: Is each hop's timeout shorter than the caller's timeout?
     e. Check retries: Could retries cause duplicate side effects?
     f. Check circuit breakers: Is a breaker open, causing fast-fail?
4. Identify the failure pattern:
   **Cascade failure**: One service down takes others with it
   - Missing circuit breakers, no bulkhead isolation, retry storms

   **Timeout chain**: Outer timeout expires before inner completes
   - Timeout budget not decreasing per hop, missing deadline propagation

   **Data inconsistency**: Services disagree on state
   - Eventual consistency gap, missing saga compensation, split-brain

   **Partial failure**: Some calls succeed, others fail, no rollback
   - Missing distributed transaction, no idempotency keys, no compensation

   **Version skew**: Services running incompatible versions
   - Breaking API change, missing field in newer protobuf, schema drift
5. Provide the fix:
   - Code changes per affected service with exact file locations
   - Proper error propagation and context cancellation across boundaries
   - Timeout budget propagation pattern
   - Idempotency and retry safety improvements
6. Add observability:
   - OpenTelemetry span creation for uncovered code paths
   - Custom span attributes for debugging context
   - Service dependency health checks
   - Distributed tracing dashboard query for this failure pattern

Failing request or trace ID: $ARGUMENTS
