---
description: Optimize and clean up package.json - scripts, dependencies, metadata
permissions:
  reads: ["package.json", "**/*"]
  writes: ["package.json"]
  commands: []
  network: false
  destructive: false
---

Optimize and clean up package.json.

Steps:
1. Read current package.json
2. Check and fix:

   **Scripts**
   - Essential scripts exist: dev, build, test, lint, format
   - Scripts are consistent (e.g., `test:unit`, `test:e2e`, `test:coverage`)
   - Pre/post scripts for automation (prebuild, postinstall)
   - No deprecated or broken scripts

   **Dependencies**
   - devDependencies vs dependencies correct (test/build tools in dev)
   - No duplicate functionality (two HTTP clients, two date libs)
   - Unused dependencies removed
   - Version ranges appropriate (^ for most, exact for critical)

   **Metadata**
   - name, version, description, license filled in
   - repository, bugs, homepage URLs correct
   - engines field specifying Node.js version
   - files field for published packages (or .npmignore)
   - main, module, types, exports for libraries

   **Configuration**
   - Move tool configs to their own files (eslint → .eslintrc, prettier → .prettierrc)
   - Keep package.json clean

3. Suggest scripts that are missing but commonly needed
4. Detect and flag security issues (postinstall scripts from deps)

$ARGUMENTS
