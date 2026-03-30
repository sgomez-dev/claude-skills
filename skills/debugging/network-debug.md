---
description: Debug HTTP, WebSocket, gRPC, and network connectivity issues
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl", "wget", "nc", "nslookup", "dig", "ping", "traceroute", "openssl s_client", "netstat", "ss", "lsof -i"]
  network: true
  destructive: false
---

Debug network communication issues across HTTP, WebSocket, gRPC, DNS, TLS, and TCP/UDP layers.

Steps:
1. Classify the network issue:
   **Connection failures**:
   - ECONNREFUSED: Service not running or wrong port
   - ETIMEDOUT: Firewall, security group, or routing issue
   - ECONNRESET: Server or proxy forcibly closed connection
   - DNS resolution failure: Wrong hostname, DNS cache, /etc/hosts

   **TLS/SSL errors**:
   - Certificate expired, self-signed, wrong CN/SAN
   - Protocol mismatch (TLS version incompatibility)
   - Certificate chain incomplete (missing intermediate CA)

   **HTTP issues**:
   - 4xx errors: Auth failures, CORS, wrong content-type, rate limiting
   - 5xx errors: Server crash, timeout, bad gateway (proxy misconfiguration)
   - Redirect loops, missing headers, cookie issues

   **WebSocket/streaming**:
   - Upgrade handshake failure
   - Unexpected disconnects (proxy timeout, keep-alive misconfiguration)
   - Message framing issues

   **gRPC**:
   - Status codes (UNAVAILABLE, DEADLINE_EXCEEDED, UNIMPLEMENTED)
   - Protobuf serialization mismatches
   - HTTP/2 specific issues (GOAWAY, stream reset)
2. Read the application's network code:
   - HTTP client configuration (timeouts, retries, headers, base URLs)
   - API endpoint definitions (routes, middleware, interceptors)
   - Proxy/load balancer configuration (nginx, envoy, HAProxy)
3. Generate diagnostic commands:
   - `curl -v` to inspect full request/response headers
   - `openssl s_client` to verify TLS certificates
   - `dig`/`nslookup` for DNS resolution
   - `netstat`/`ss` for connection state
   - `tcpdump`/`wireshark` filter suggestions for packet capture
4. Trace the request path end-to-end:
   - Client → proxy/LB → server → upstream services → database
   - Identify where the request fails or gets modified
5. Provide the fix:
   - Code changes (headers, timeouts, retry logic, error handling)
   - Infrastructure changes (security groups, CORS config, proxy settings)
   - Certificate fixes (renewal, chain completion, trust store updates)

Network issue description: $ARGUMENTS
