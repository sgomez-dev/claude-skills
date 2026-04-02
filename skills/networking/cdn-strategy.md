---
description: Design CDN caching strategy and cache rules for web applications
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl"]
  network: true
  destructive: false
---

Design a CDN caching strategy for the application.

Steps:
1. Analyze the application's content types:
   - Static assets (JS, CSS, images, fonts)
   - Dynamic HTML pages
   - API responses
   - User-generated content
   - Media files (video, audio)
2. Define cache rules:

   **Static assets**
   - Long Cache-Control (1 year) with content-hash filenames
   - `immutable` directive for hashed assets
   - Proper `Vary` headers

   **HTML pages**
   - Short TTL or `no-cache` with ETag validation
   - `stale-while-revalidate` for perceived performance
   - Different rules for authenticated vs anonymous users

   **API responses**
   - Cache GET requests by path + query params
   - `Surrogate-Key` or `Cache-Tag` headers for targeted purging
   - `private` for user-specific responses

3. Configure cache key customization:
   - Include/exclude query parameters
   - Device-type based caching (mobile vs desktop)
   - Cookie-based cache segmentation
   - Geographic cache variants
4. Implement cache purging strategy:
   - Tag-based purging on content updates
   - Prefix purging for bulk invalidation
   - Deploy-time full purge with cache warming
5. Generate CDN-compatible headers and configuration
   - Cloudflare Page Rules / Cache Rules
   - Surrogate-Control headers for CDN-only directives
   - Vary header management

$ARGUMENTS
