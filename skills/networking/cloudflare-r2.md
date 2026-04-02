---
description: Set up Cloudflare R2 object storage with S3-compatible access
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Configure Cloudflare R2 storage for the project.

Steps:
1. Determine the use case:
   - Static asset storage (images, videos, files)
   - Backup storage
   - Data lake / log storage
   - User-uploaded content
2. Generate integration code:

   **Worker binding (recommended)**
   - R2 bucket binding in `wrangler.toml`
   - Upload, download, delete, and list operations
   - Presigned URLs for direct client uploads
   - Multipart upload for large files

   **S3-compatible API**
   - AWS SDK configuration pointing to R2 endpoint
   - Access key and secret key setup
   - Bucket operations with proper error handling

3. Implement common patterns:
   - Upload with content-type detection
   - Serve files through a Worker with caching headers
   - Generate presigned URLs for time-limited access
   - Image transformation pipeline (with Cloudflare Images if available)
   - Lifecycle rules for object expiration
4. Security considerations:
   - CORS configuration for direct browser uploads
   - Access control via Worker authentication
   - Bucket-level permissions
   - Never expose API tokens client-side
5. Add proper TypeScript types for R2 bindings

$ARGUMENTS
