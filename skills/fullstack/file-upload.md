---
description: File uploads - presigned direct-to-S3/R2 flow, validation, progress, thumbnails
permissions:
  reads: ["**/*"]
  writes: ["src/**", "app/**", "apps/**", "lib/**", "server/**", "config/**", "db/**", "database/**", "migrations/**", "prisma/**", "resources/**", "templates/**", "tests/**", "test/**", "spec/**", "package.json", "requirements.txt", "pyproject.toml", "Gemfile", "composer.json", ".env.example"]
  commands: ["package manager installs (npm/pnpm/yarn/pip/composer/bundle — these require network)", "migration generators", "project test runner"]
  network: false
  destructive: false
---

Implement a production file-upload feature: direct-to-storage uploads via presigned URLs (S3, R2,
GCS, or any S3-compatible bucket), server-side validation, upload progress, and thumbnail/derivative
generation. Uses the framework's own attachment layer when it has one instead of reinventing it.

Steps:

1. **Detect the stack and existing storage**
   - Identify framework, ORM, and any storage already wired (ActiveStorage, django-storages, Laravel Flysystem, an S3 client, `AWS_*`/`R2_*` vars in `.env.example`)
   - Read `$ARGUMENTS` for what's being uploaded (avatars, documents, video...) — size and type drive the flow
   - Prefer the framework-native attachment system (ActiveStorage direct uploads, Flysystem, django-storages) and fill only its gaps

2. **Propose the flow and confirm trade-offs**
   - **Direct-to-storage (recommended)**: client asks your API for a presigned PUT/POST, uploads straight to the bucket, then confirms — server never proxies bytes; required for large files and serverless
   - **Through-server**: acceptable only for small files on classic hosting where simplicity wins; state the size ceiling
   - **Provider**: use what the repo/infra already points to; default S3-compatible so R2/MinIO work with the same code
   - Multipart upload for files over ~100 MB if `$ARGUMENTS` implies large media

3. **Data model and migrations**
   - `attachments` (or extend the framework's table): owner (user/record polymorphic per stack convention), storage key, original filename, content_type, byte_size, checksum, `status` (`pending` → `uploaded` → `processed`), timestamps
   - Storage keys are **server-generated and random** (e.g. `uploads/{uuid}`), never derived from the client filename; keep the original name as display metadata only

4. **Presign endpoint (server-side validation first)**
   - Authenticated endpoint that validates *before* signing: allowed content types (allowlist, not blocklist), max size (enforced in the presigned policy, not just checked client-side), and that the user may attach to the target record
   - Create the `pending` attachment row, return the signed URL + key; short expiry (minutes) on the signature

5. **Client upload with progress**
   - Upload with progress events (XHR/fetch streams or the stack's JS helper), cancel support, and retry on transient failure
   - Client-side pre-checks (type/size) as UX only — the policy and the confirm step are the real gate
   - On completion, call a **confirm endpoint**: server verifies the object exists in the bucket (HEAD), size and content type match what was signed, then flips status to `uploaded`

6. **Serving and thumbnails**
   - Buckets stay **private**; serve via short-lived signed GET URLs or the framework's redirect controller — public-read only if `$ARGUMENTS` explicitly says the content is public
   - Derivatives (thumbnails, previews) generated in a background job on confirm (see `/fullstack--background-jobs`): resize, strip EXIF/GPS metadata, store under separate keys; images re-encoded server-side (never trust the uploaded bytes to match the extension)
   - Set `Content-Disposition` correctly — force download for user-supplied HTML/SVG or anything that could execute in the app's origin

7. **Tests, env vars, and summary**
   - Tests: presign rejects disallowed type/oversize/unauthorized target, confirm rejects a missing or mismatched object, orphaned `pending` rows get cleaned by a sweep job, signed GET denied for another user's private file
   - Run the suite; summarize migrations, bucket CORS config to apply (allow the app origin only, PUT/POST + relevant headers), and `.env.example` additions (`STORAGE_BUCKET`, `STORAGE_REGION`, `STORAGE_ENDPOINT` for R2/MinIO, access key pair)

**Notes:**
- Never trust client-supplied content type or filename; sanitize display names, detect real type from bytes when it matters
- Lock CORS on the bucket to the app's origins; never wildcard with credentials
- Virus scanning: if `$ARGUMENTS` mentions user-shared documents, add an async scan step before files become downloadable by others
- Cleanup path: deleting the record must delete or lifecycle-expire the object; add a scheduled sweep for stale `pending` uploads
- Pairs with `/fullstack--background-jobs` (processing) and `/fullstack--multi-tenancy` (tenant-scoped keys/prefixes)

$ARGUMENTS
