---
description: Implement lazy loading for routes, components, images, and modules
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Implement lazy loading to improve initial load performance.

Steps:
1. Identify lazy loading opportunities:

   **Route-based code splitting**
   - React: `React.lazy()` + `Suspense`
   - Vue: `defineAsyncComponent` or dynamic `import()`
   - Next.js: `dynamic()` import
   - Identify routes that aren't needed on initial load

   **Component-level splitting**
   - Heavy components (editors, charts, maps)
   - Below-the-fold components
   - Modal/dialog content
   - Tab content not visible by default

   **Image lazy loading**
   - Add `loading="lazy"` to off-screen images
   - Use Intersection Observer for custom behavior
   - Implement blur-up placeholder pattern
   - Use srcset for responsive images

   **Module-level splitting**
   - Heavy libraries imported only in specific features
   - Dynamic `import()` for conditionally needed code

2. Implement with proper loading states (skeleton/spinner)
3. Implement error boundaries for failed lazy loads
4. Preload critical resources with `<link rel="preload">`

Target: $ARGUMENTS
