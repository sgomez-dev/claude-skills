---
description: Review and fix CORS configuration for security
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl"]
  network: true
  destructive: false
---

Review the CORS (Cross-Origin Resource Sharing) configuration.

Steps:
1. Find CORS configuration in the codebase:
   - Express: `cors()` middleware
   - FastAPI: `CORSMiddleware`
   - Django: `django-cors-headers`
   - Nginx: `Access-Control-*` headers
2. Check for security issues:
   - `Access-Control-Allow-Origin: *` with credentials (CRITICAL - browsers block this but check)
   - Overly permissive origin lists
   - Reflecting the Origin header without validation
   - Missing `Access-Control-Allow-Methods` restrictions
   - `Access-Control-Allow-Headers` too broad
   - `Access-Control-Max-Age` too long
   - Missing `Access-Control-Expose-Headers` control
3. Verify per-environment configuration:
   - Development: localhost origins
   - Staging: staging domains only
   - Production: production domains only
4. Suggest secure configuration based on actual needs
5. Test with curl to verify headers

$ARGUMENTS
