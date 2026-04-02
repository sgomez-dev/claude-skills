---
description: Configure and audit Cloudflare DNS records and settings
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl", "dig", "nslookup"]
  network: true
  destructive: false
---

Configure or audit DNS records for a Cloudflare-managed domain.

Steps:
1. Determine the DNS task:
   - Initial domain setup and migration
   - Add/update DNS records
   - Audit existing configuration
   - Troubleshoot resolution issues
2. Generate DNS record configurations:

   **Essential records**
   - A/AAAA records for root and subdomains
   - CNAME records for aliases (flattened at root)
   - MX records for email delivery
   - TXT records (SPF, DKIM, DMARC, domain verification)

   **Proxy settings**
   - Identify which records should be proxied (orange cloud) vs DNS-only (gray cloud)
   - Proxied: web traffic (HTTP/HTTPS)
   - DNS-only: MX, non-HTTP services, SSH

3. Email authentication:
   - SPF: `v=spf1 include:_spf.google.com ~all` (adapt to provider)
   - DKIM: provider-specific selector records
   - DMARC: `v=DMARC1; p=quarantine; rua=mailto:...`
4. Verify configuration:
   - Use `dig` or `nslookup` to confirm propagation
   - Check for conflicting records
   - Verify DNSSEC status
   - Confirm CAA records for certificate issuance
5. Document all records in a structured table format

$ARGUMENTS
