---
description: Diagnose network connectivity, latency, and routing issues
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["curl", "ping", "traceroute", "mtr", "nc", "openssl"]
  network: true
  destructive: false
---

Diagnose network connectivity or performance issues.

Steps:
1. Identify the symptoms:
   - Connection timeouts
   - High latency or intermittent slowness
   - Connection refused or reset
   - SSL/TLS handshake failures
   - DNS resolution failures
   - Partial or corrupted responses
2. Run layered diagnostics:

   **Layer 3 - Network connectivity**
   - `ping` for basic reachability and RTT
   - `traceroute`/`mtr` for path analysis and hop latency
   - Check for packet loss patterns

   **Layer 4 - Transport**
   - `nc -zv` for TCP port connectivity
   - Check for connection refused vs timeout (firewall vs no listener)
   - Verify expected ports are open

   **Layer 7 - Application**
   - `curl -vvv` for HTTP request/response details
   - Check response headers and status codes
   - `openssl s_client` for TLS negotiation details
   - Verify HTTP/2 and ALPN negotiation

3. Common issue patterns:
   - Firewall blocking (timeout vs reset)
   - MTU issues causing fragmentation
   - DNS returning wrong IP
   - CDN/proxy misconfiguration
   - Origin server overloaded
   - TLS version or cipher mismatch
4. Check Cloudflare-specific headers:
   - `cf-ray` for request tracing
   - `cf-cache-status` for cache behavior
   - `server: cloudflare` confirmation
5. Provide remediation steps and monitoring recommendations

$ARGUMENTS
