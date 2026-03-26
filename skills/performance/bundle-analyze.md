---
description: Analyze JavaScript bundle size and suggest optimizations
permissions:
  reads: ["**/*", "package.json"]
  writes: []
  commands: ["npm run build"]
  network: false
  destructive: false
---

Analyze and optimize JavaScript bundle size.

Steps:
1. Check build configuration (webpack, vite, esbuild, rollup)
2. Analyze bundle by:
   - Running build with analysis flag if available
   - Checking package.json for heavy dependencies
   - Looking for barrel exports that prevent tree shaking
3. Identify optimization opportunities:
   - **Code splitting**: Routes that could be lazy loaded
   - **Tree shaking**: Ensure imports are specific (`import { x }` not `import *`)
   - **Heavy dependencies**: Replace with lighter alternatives
     - moment.js → date-fns or dayjs
     - lodash → lodash-es or native methods
     - axios → native fetch
   - **Duplicate dependencies**: Multiple versions of same package
   - **Polyfills**: Unnecessary polyfills for modern browsers
   - **Dead code**: Imported but unused exports
   - **Dynamic imports**: Large libraries loaded upfront that could be dynamic
4. Generate specific code changes to reduce bundle
5. Estimate size savings for each suggestion

$ARGUMENTS
