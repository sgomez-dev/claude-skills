---
description: Set up Cloudflare Zero Trust access policies and identity-aware proxy
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design a Cloudflare Zero Trust (Access) configuration for the application.

Steps:
1. Identify what needs protection:
   - Internal web applications
   - Admin panels and dashboards
   - Staging/preview environments
   - SSH and RDP access
   - API endpoints for internal services
2. Configure identity providers:
   - SSO integration (Google Workspace, Okta, Azure AD, GitHub)
   - One-time PIN (email-based) for external users
   - Service tokens for machine-to-machine access
3. Define access policies:

   **Application policies**
   - Allow rules by email domain, identity group, or IP range
   - Deny rules for specific conditions
   - Bypass rules for health checks and public endpoints
   - Purpose justification for sensitive apps

   **Network policies (Gateway)**
   - DNS filtering categories
   - HTTP inspection rules
   - Egress policies for controlled traffic

4. Configure application settings:
   - Session duration per application
   - CORS handling with Access headers
   - `Cf-Access-Jwt-Assertion` header validation in application code
   - Service token authentication for APIs
5. Generate validation middleware:
   - JWT verification for the application framework
   - Extract user identity from Access headers
   - Role mapping from identity provider groups

$ARGUMENTS
