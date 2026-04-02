---
description: Audit and configure SSL/TLS certificates and HTTPS settings
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["openssl", "curl"]
  network: true
  destructive: false
---

Audit or configure SSL/TLS for the application.

Steps:
1. Assess the current TLS setup:
   - Certificate validity and expiration
   - Certificate chain completeness
   - TLS protocol versions enabled
   - Cipher suite configuration
   - HSTS header presence and max-age
2. Check for common issues:
   - Mixed content (HTTP resources on HTTPS pages)
   - Insecure TLS versions (TLS 1.0, 1.1)
   - Weak cipher suites (RC4, 3DES, export ciphers)
   - Missing intermediate certificates
   - Certificate name mismatch
   - Expired or soon-to-expire certificates
3. Generate secure configuration:

   **Cloudflare SSL settings**
   - SSL mode: Full (Strict) recommended
   - Minimum TLS version: 1.2
   - Automatic HTTPS rewrites
   - Always Use HTTPS
   - Opportunistic Encryption
   - TLS 1.3 enabled

   **Origin server**
   - Cloudflare Origin CA certificate generation
   - Authenticated origin pulls (mutual TLS)
   - Strict Transport Security headers

4. Certificate automation:
   - Let's Encrypt with auto-renewal (certbot/acme.sh)
   - Cloudflare Origin CA for origin-to-edge
   - Certificate monitoring and alerting
5. Verify configuration with `openssl s_client` and `curl -vI`

$ARGUMENTS
