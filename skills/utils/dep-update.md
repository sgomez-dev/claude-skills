---
description: Safely update project dependencies with breaking change detection
permissions:
  reads: ["package.json", "requirements.txt", "go.mod"]
  writes: ["package.json", "*.lock"]
  commands: ["npm update", "npm outdated", "pip install"]
  network: true
  destructive: false
---

Update project dependencies safely.

Steps:
1. Detect package manager (npm, yarn, pnpm, pip, go, cargo)
2. Check for outdated packages:
   - `npm outdated` / `yarn outdated` / equivalent
3. Categorize updates:
   - 🟢 **Patch** (1.2.3 → 1.2.4): Bug fixes, safe to update
   - 🟡 **Minor** (1.2.3 → 1.3.0): New features, usually safe
   - 🔴 **Major** (1.2.3 → 2.0.0): Breaking changes, review needed
4. For each major update:
   - Check the CHANGELOG/release notes for breaking changes
   - Identify code that uses the changed APIs
   - Suggest migration steps
5. Update strategy:
   - Update all patches first
   - Update minors in batch
   - Update majors one at a time
   - Run tests after each batch
6. Generate the update commands
7. Run tests to verify nothing broke

$ARGUMENTS
