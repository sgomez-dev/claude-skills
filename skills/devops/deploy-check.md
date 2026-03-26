---
description: Pre-deployment checklist - verify everything before shipping
permissions:
  reads: ["**/*"]
  writes: []
  commands: ["npm test", "npm audit", "git status"]
  network: false
  destructive: false
---

Run a comprehensive pre-deployment checklist.

Steps:
1. **Code Quality**
   - [ ] All tests pass (`npm test`, `pytest`, etc.)
   - [ ] No linting errors
   - [ ] No TypeScript/type errors
   - [ ] No console.log/print debugging left
   - [ ] No TODO/FIXME/HACK comments on changed lines

2. **Security**
   - [ ] No hardcoded secrets or credentials
   - [ ] Dependencies have no critical vulnerabilities
   - [ ] Environment variables properly configured
   - [ ] API endpoints have proper auth

3. **Database**
   - [ ] Migrations are reversible
   - [ ] No destructive migrations without data backup plan
   - [ ] Indexes added for new queries

4. **Performance**
   - [ ] No N+1 queries introduced
   - [ ] Large data sets are paginated
   - [ ] New assets are optimized

5. **Compatibility**
   - [ ] API changes are backwards compatible (or version bumped)
   - [ ] Breaking changes are documented
   - [ ] Feature flags for risky changes

6. **Monitoring**
   - [ ] New features have logging
   - [ ] Error tracking captures new failure modes
   - [ ] Alerts configured for critical paths

7. **Rollback**
   - [ ] Deployment is reversible
   - [ ] Rollback procedure documented

Check each item against actual code and report status.

$ARGUMENTS
