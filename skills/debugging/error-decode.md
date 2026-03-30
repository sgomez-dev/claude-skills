---
description: Decode cryptic error codes and messages into actionable explanations
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["npm ls", "pip show", "go version", "node -v", "python --version", "rustc --version"]
  network: false
  destructive: false
---

Decode a cryptic error code or message into a clear, actionable explanation.

Steps:
1. Parse the error to extract:
   - Error code (e.g., ECONNREFUSED, E0308, TS2345, SIGABRT, errno 13)
   - Error message text
   - Source system (compiler, runtime, OS, framework, database, cloud provider)
2. Identify the error's origin:
   - **Compiler/type errors**: Type mismatches, syntax issues, missing imports
   - **OS/system errors**: Permission denied, file not found, socket errors, signal codes
   - **Database errors**: Constraint violations, deadlocks, connection pool exhaustion
   - **HTTP/Network**: Status codes, TLS errors, DNS failures, timeout patterns
   - **Framework-specific**: ORM errors, bundler errors, container runtime errors
   - **Cloud/infra**: AWS/GCP/Azure error codes, Kubernetes events, Terraform state errors
3. Check the project's dependency versions and configuration for known compatibility issues
4. Provide:
   - **Plain English translation**: What the error actually means
   - **Common causes**: Top 3 reasons this error occurs, ranked by likelihood
   - **Environment check**: Commands to verify the suspected cause
   - **Fix**: Step-by-step resolution with commands and code changes
   - **Prevention**: How to avoid this error in the future
5. If the error is ambiguous, ask clarifying questions about the environment

Error code or message: $ARGUMENTS
