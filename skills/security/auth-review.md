---
description: Review authentication and authorization implementation for vulnerabilities
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Review the authentication and authorization system for security issues.

Steps:
1. Map the entire auth flow:
   - Registration → Email verification → Login → Session/Token → Logout
   - Password reset flow
   - OAuth/social login if present
2. Check authentication:
   - Password hashing (bcrypt/argon2 with proper rounds, NOT MD5/SHA)
   - Session management (secure cookies, httpOnly, sameSite, expiration)
   - JWT implementation (algorithm, expiration, refresh token rotation)
   - Brute force protection (rate limiting, account lockout)
   - MFA implementation if present
3. Check authorization:
   - Every protected route has auth middleware
   - Role-based access control is consistent
   - No IDOR (accessing other users' resources by changing IDs)
   - Privilege escalation is prevented
   - API keys have proper scoping
4. Check common mistakes:
   - Timing attacks on comparison (use constant-time compare)
   - Information leakage ("user not found" vs "wrong password")
   - Token stored in localStorage (XSS vulnerable)
   - CSRF protection on state-changing operations
5. Provide severity-rated findings with specific fixes

$ARGUMENTS
