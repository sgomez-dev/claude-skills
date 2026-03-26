---
description: Generate a CONTRIBUTING.md guide for open source projects
permissions:
  reads: ["**/*"]
  writes: ["CONTRIBUTING.md"]
  commands: []
  network: false
  destructive: false
---

Generate a comprehensive CONTRIBUTING.md based on the project.

Steps:
1. Analyze project structure, tooling, and conventions
2. Generate CONTRIBUTING.md with:

   ## How to Contribute
   - Reporting bugs (issue template)
   - Suggesting features
   - Code contributions

   ## Development Setup
   - Prerequisites (Node version, Python version, etc.)
   - Fork and clone instructions
   - Install dependencies
   - Run the project locally
   - Run tests

   ## Code Standards
   - Code style (detected from linter configs)
   - Commit message convention (detected from history)
   - Branch naming convention
   - PR requirements

   ## Pull Request Process
   - How to create a PR
   - What reviewers look for
   - CI checks that must pass
   - How merging works

   ## Code of Conduct
   - Link to or include CoC

3. Tailor to the actual project tooling (not generic advice)

$ARGUMENTS
