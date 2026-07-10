---
description: Core Web Vitals - measure LCP/INP/CLS, diagnose causes, fix with code changes
permissions:
  reads: ["**/*"]
  writes: ["**/*.{js,jsx,ts,tsx,vue,svelte,astro,html,css}", "next.config.*", "vite.config.*", "nuxt.config.*"]
  commands: []
  network: false
  destructive: false
---

Improve Core Web Vitals — LCP (loading), INP (interactivity), CLS (layout stability) —
by adding measurement, diagnosing root causes in the actual code, and applying concrete
fixes. Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 at p75.

Steps:

1. **Detect the frontend stack and rendering model**
   - Framework: Next.js/Remix/Nuxt/SvelteKit/Astro/plain SPA/MPA — and rendering mode (SSR, SSG, CSR, streaming)
   - Existing measurement: `web-vitals` package, RUM/analytics wiring, Lighthouse CI config
   - Assets pipeline: image handling, font loading, bundler config, CDN hints in headers/meta

2. **Instrument measurement** (if not already present)
   - Add the `web-vitals` library reporting LCP, INP, CLS (plus TTFB, FCP as diagnostics) to the existing analytics endpoint, or `console`-based reporting for local work
   - Include attribution build (`web-vitals/attribution`) so reports name the LCP element, the INP interaction target, and the CLS-shifting nodes
   - If the user provides lab/field data (Lighthouse report, CrUX numbers) in `$ARGUMENTS`, use it to prioritize instead of guessing

3. **Diagnose LCP** — find the LCP element and walk its critical path in code:
   - Is the hero image/text discoverable in initial HTML? Look for: client-side-only rendering of the hero, images behind JS (CSS `background-image`, lazy-loaded LCP image), missing `preload`
   - Render-blocking resources: synchronous scripts in head, large CSS, font blocking (`font-display`), third-party tags
   - Server timing: SSR data fetching waterfalls, missing caching on the document response

4. **Diagnose INP** — find the slow interactions:
   - Long tasks on the main thread: heavy hydration, large component re-renders on input, synchronous state updates that render big trees, expensive event handlers without debouncing
   - Third-party scripts competing for the main thread
   - Rendering work after the interaction: layout thrash, large DOM updates without batching

5. **Diagnose CLS** — find what shifts:
   - Images/iframes/embeds without dimensions (`width`/`height` or `aspect-ratio`)
   - Content injected above existing content: banners, ads, cookie notices, late-loading fonts (FOUT swaps), skeleton→content size mismatches
   - Animations using layout properties (`top`/`left`) instead of `transform`

6. **Apply fixes in priority order** (biggest metric impact first) — concrete changes, e.g.:
   - LCP: `<link rel="preload">` / `fetchpriority="high"` on the LCP image, `loading="eager"` on it (never lazy), framework image component with priority flag, inline critical CSS, `font-display: swap` + preloaded font, move blocking scripts to `defer`
   - INP: split long tasks (`scheduler.yield`/`setTimeout` chunking, `startTransition` in React), memoize hot components, debounce input handlers, lazy-hydrate below-the-fold islands, code-split heavy routes
   - CLS: explicit dimensions/aspect-ratio on all media, reserve space for dynamic slots (min-height), `transform`-based animations, size-adjusted fallback fonts
   - For each fix: file changed, which vital it moves, and expected direction of impact

7. **Verify and hand off**
   - Re-run the measurement path available locally (dev server + the instrumented reporting, or Lighthouse if installed) and compare before/after where possible
   - Deliver a table: metric → root cause found → fix applied → file → how to confirm in the field (RUM/CrUX after deploy)

**Notes:**
- Field data (real users) trumps lab data — lab-only wins that don't move p75 field numbers are not done; say so explicitly
- Never lazy-load the LCP element; it is the single most common self-inflicted LCP regression
- Third-party scripts are frequently the top INP offender — recommend `async`/facade patterns/removal, but let the user decide on business-critical tags
- Don't add dependencies beyond `web-vitals` without asking; prefer platform primitives (preload, fetchpriority, aspect-ratio) over libraries

$ARGUMENTS
