---
description: Audit hardcoded secrets, migrate to a vault/secret manager, plan rotation
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Move secrets out of code and config into a proper secret manager, with a rotation plan — closing the most
common and most damaging security gap without breaking deployments.

Steps:

1. **Find the secrets** (`$ARGUMENTS`)
   - Detect the stack, hosting, and any existing secret tooling from the repo
   - Scan for hardcoded secrets in code, config, CI files, and `.env` committed to git (run/leverage `/security--secrets-scan`)
   - Check git history — a secret removed from HEAD but present in history is still leaked

2. **Triage and contain**
   List each secret found with severity and blast radius. For anything real and exposed, the FIRST action is
   rotation/revocation (a committed secret is compromised), not just deletion from the file. Flag these clearly.

3. **Choose a secret manager**
   Pick and justify based on the platform: cloud secret manager (AWS/GCP/Azure), HashiCorp Vault,
   Doppler/1Password, or the platform's built-in encrypted env vars. Consider access control and audit needs.

4. **Migrate**
   Move secrets into the manager, replace code references with runtime lookups (or injected env), and delete the
   plaintext. Ensure local dev, CI, and prod each resolve secrets appropriately. Never print secrets in logs.

5. **Plan rotation and access**
   Define rotation cadence (and automate it where the manager supports it), least-privilege access per
   environment/service, and an audit trail. Document what to do when a secret leaks.

6. **Verify**
   Re-scan to confirm no plaintext secrets remain in code or history-going-forward, and that the app still boots
   with secrets resolved from the manager.

**Notes:**
- A secret ever committed to git must be rotated, not just removed — treat it as compromised
- `.gitignore` the `.env` and provide a `.env.example` with placeholder keys (`/utils--env-setup`)
- Purging git history (BFG/filter-repo) is destructive and rewrites commits — confirm with the team first

$ARGUMENTS
