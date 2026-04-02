---
description: Diagnose and troubleshoot DNS resolution and propagation issues
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["dig", "nslookup", "host", "curl"]
  network: true
  destructive: false
---

Diagnose DNS resolution issues for the given domain or service.

Steps:
1. Gather information:
   - Domain name and expected behavior
   - Recent DNS changes made
   - Error symptoms (NXDOMAIN, timeout, wrong IP)
2. Run diagnostic checks:

   **Resolution checks**
   - Query authoritative nameservers directly
   - Compare results across public resolvers (1.1.1.1, 8.8.8.8, 9.9.9.9)
   - Check for NXDOMAIN vs SERVFAIL vs timeout
   - Verify record types (A, AAAA, CNAME, MX, TXT)

   **Propagation checks**
   - Compare TTL values across resolvers
   - Check if old cached records are still being served
   - Estimate remaining propagation time based on TTL

   **Chain validation**
   - Trace delegation from root to authoritative NS
   - Verify NS records at registrar match actual nameservers
   - Check for lame delegation
   - Validate DNSSEC chain of trust

3. Common issue diagnosis:
   - CNAME at zone apex (not allowed by RFC)
   - Conflicting record types (CNAME + A/MX)
   - Missing or incorrect glue records
   - TTL too high causing slow updates
   - Registrar nameserver mismatch
4. Provide remediation steps with specific record changes
5. Suggest monitoring for ongoing DNS health

$ARGUMENTS
