---
description: Create a semantic version release with tag, changelog, and GitHub release
permissions:
  reads: [".git/**", "CHANGELOG.md"]
  writes: ["CHANGELOG.md"]
  commands: ["git tag", "git describe", "git log", "gh release create"]
  network: true
  destructive: false
---

Create a new release following semantic versioning.

Steps:
1. Check the latest tag with `git describe --tags --abbrev=0` or `git tag --sort=-v:refname`
2. Analyze commits since last tag to determine version bump:
   - BREAKING CHANGE → major bump
   - feat → minor bump
   - fix/perf → patch bump
3. Generate release notes from commits since last tag
4. Ask for confirmation on the version number
5. Update CHANGELOG.md with the new version section
6. Create a git tag with `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
7. If requested, create a GitHub release with `gh release create`

User can override the version: $ARGUMENTS
