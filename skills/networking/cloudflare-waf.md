---
description: Configure Cloudflare WAF rules and firewall policies
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design Cloudflare WAF (Web Application Firewall) rules for the project.

Steps:
1. Assess the application's threat surface:
   - Public-facing endpoints vs internal APIs
   - User input points (forms, file uploads, API bodies)
   - Authentication endpoints (login, registration)
   - Admin panels and sensitive routes
2. Generate WAF rule configurations:

   **Custom rules (Firewall Rules)**
   - Rate limiting on authentication endpoints
   - Block requests from known-bad ASNs or countries (if applicable)
   - Challenge suspicious User-Agent patterns
   - Block access to sensitive paths (`.env`, `.git`, `wp-admin`)
   - Protect API endpoints with token validation

   **Managed rulesets**
   - OWASP Core Ruleset configuration
   - Cloudflare Managed Ruleset tuning
   - Override specific rules that cause false positives

   **Rate limiting rules**
   - Per-IP rate limits for API endpoints
   - Session-based rate limiting for login
   - Graduated response (log, challenge, block)

3. Configure security levels:
   - Bot fight mode settings
   - Browser integrity check
   - Challenge passage TTL
   - Security level per path
4. Generate Terraform/API configuration for version control
5. Include testing strategy to verify rules don't block legitimate traffic

$ARGUMENTS
