---
description: Audit project dependencies for security, size, maintenance status, and alternatives
permissions:
  reads: ["package.json", "requirements.txt", "go.mod", "Cargo.toml"]
  writes: []
  commands: ["npm audit", "pip audit"]
  network: true
  destructive: false
---

Perform a comprehensive audit of project dependencies.

Steps:
1. Read package.json/requirements.txt/go.mod/Cargo.toml (detect project type)
2. For each dependency, evaluate:
   - **Security**: Check for known vulnerabilities (`npm audit`, `pip audit`, etc.)
   - **Maintenance**: Last publish date, open issues count, GitHub stars trend
   - **Size**: Bundle impact for frontend deps (can check with bundlephobia mentally)
   - **Necessity**: Is it actually used? Could it be replaced with native APIs?
   - **License**: Compatible with project license?
   - **Duplicates**: Multiple packages doing the same thing?
3. Flag:
   - 🔴 Dependencies with known CVEs
   - 🟡 Unmaintained packages (> 2 years no release)
   - 🟡 Heavy dependencies with lightweight alternatives
   - 🔵 Dependencies that could be replaced with native code
4. Suggest alternatives where appropriate
5. Generate a priority list of actions

$ARGUMENTS
