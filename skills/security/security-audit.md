---
description: Comprehensive security audit scanning for OWASP Top 10 and common vulnerabilities
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Perform a comprehensive security audit of the codebase.

Steps:
1. Identify the tech stack and attack surface
2. Scan for OWASP Top 10 vulnerabilities:

   **A01 - Broken Access Control**
   - Missing auth checks on routes, IDOR vulnerabilities, privilege escalation

   **A02 - Cryptographic Failures**
   - Weak hashing (MD5, SHA1 for passwords), hardcoded keys, insecure random

   **A03 - Injection**
   - SQL injection, NoSQL injection, command injection, LDAP injection, XSS

   **A04 - Insecure Design**
   - Missing rate limiting, no account lockout, insecure password reset

   **A05 - Security Misconfiguration**
   - Debug mode in production, default credentials, verbose errors, CORS *

   **A06 - Vulnerable Components**
   - Outdated dependencies with known CVEs

   **A07 - Auth Failures**
   - Weak password policies, session fixation, missing MFA hooks

   **A08 - Data Integrity Failures**
   - Insecure deserialization, unsigned updates, CI/CD pipeline risks

   **A09 - Logging Failures**
   - Missing audit logs, sensitive data in logs, no alerting

   **A10 - SSRF**
   - Unvalidated URLs, internal network access

3. For each finding: severity (Critical/High/Medium/Low), file:line, description, fix

$ARGUMENTS
