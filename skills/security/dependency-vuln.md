---
description: Check dependencies for known security vulnerabilities
permissions:
  reads: ["package.json", "requirements.txt", "go.mod", "Cargo.toml"]
  writes: []
  commands: ["npm audit", "pip audit", "cargo audit"]
  network: true
  destructive: false
---

Check all project dependencies for known security vulnerabilities.

Steps:
1. Detect package manager and run appropriate audit:
   - npm: `npm audit --json`
   - yarn: `yarn audit --json`
   - pnpm: `pnpm audit --json`
   - pip: `pip audit` or check against safety DB
   - go: `go list -m all` + check against vuln DB
   - cargo: `cargo audit` if available
2. For each vulnerability found:
   - Package name and version
   - CVE identifier
   - Severity (Critical/High/Medium/Low)
   - Description of the vulnerability
   - Affected version range
   - Fixed version (if available)
   - Whether it's a direct or transitive dependency
3. Provide remediation plan:
   - Direct deps: Upgrade to fixed version
   - Transitive deps: Override resolution or upgrade parent
   - No fix available: Assess risk and suggest mitigation
4. Prioritize by: exploitability + severity + whether it's in production code

$ARGUMENTS
