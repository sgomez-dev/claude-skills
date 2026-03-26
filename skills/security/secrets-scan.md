---
description: Scan codebase for leaked secrets, API keys, tokens, and credentials
permissions:
  reads: ["**/*", ".git/**"]
  writes: []
  commands: ["git log"]
  network: false
  destructive: false
---

Scan the codebase for accidentally committed secrets.

Steps:
1. Search all files for patterns matching:
   - **API Keys**: AWS, GCP, Azure, Stripe, Twilio, SendGrid patterns
   - **Tokens**: JWT tokens, OAuth tokens, Bearer tokens
   - **Passwords**: password=, passwd=, pwd= in config files
   - **Connection strings**: Database URLs with credentials
   - **Private keys**: RSA, SSH, PGP private keys
   - **Cloud credentials**: AWS_SECRET_ACCESS_KEY, GOOGLE_APPLICATION_CREDENTIALS
   - **Generic secrets**: High-entropy strings in code (not test files)
2. Check for secrets in:
   - Source code files
   - Config files (.env, .yaml, .json, .toml, .ini)
   - Docker files and docker-compose
   - CI/CD configs (.github/workflows, .gitlab-ci.yml)
   - Documentation and READMEs
   - Git history (check recent commits for removed but committed secrets)
3. For each finding:
   - File and line number
   - Type of secret
   - Severity (Critical if it looks like a real credential)
   - Remediation: rotate the key, add to .gitignore, use env vars
4. Suggest .gitignore additions and pre-commit hooks to prevent future leaks

$ARGUMENTS
