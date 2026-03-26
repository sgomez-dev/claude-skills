---
description: Generate a professional README.md for the project
permissions:
  reads: ["**/*"]
  writes: ["README.md"]
  commands: []
  network: false
  destructive: false
---

Generate a comprehensive and professional README.md.

Steps:
1. Analyze the project: language, framework, purpose, structure
2. Check for existing docs, package.json description, LICENSE, etc.
3. Generate README with these sections:

   # Project Name
   One-line description + badges (build, coverage, license, npm version)

   ## Features
   Bullet list of key features

   ## Quick Start
   Minimal steps to get running (install + first use)

   ## Installation
   Detailed installation for all package managers/methods

   ## Usage
   Code examples for common use cases

   ## API Reference (if library)
   Brief overview linking to full docs

   ## Configuration
   Environment variables, config files, options

   ## Development
   How to set up dev environment, run tests, contribute

   ## Architecture (if complex)
   Brief overview of project structure

   ## FAQ
   Common questions and answers

   ## Contributing
   Link to CONTRIBUTING.md or brief guidelines

   ## License
   License type and link

4. Match the tone to the project (formal for enterprise, friendly for OSS)

$ARGUMENTS
