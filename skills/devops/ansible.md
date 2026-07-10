---
description: Write Ansible playbooks with roles, idempotency, vault-encrypted secrets, inventories
permissions:
  reads: ["**/*"]
  writes: ["**/*.yml", "**/*.yaml", "ansible.cfg", "inventories/**", "roles/**", "group_vars/**", "host_vars/**", "playbooks/**", ".gitignore", "requirements.yml"]
  commands: ["ansible", "ansible-playbook", "ansible-vault", "ansible-lint", "ansible-galaxy", "ansible-inventory", "python", "pip"]
  network: false
  destructive: false
---

Create or refactor Ansible automation that is idempotent, role-structured, and safe with secrets.
Works for greenfield playbooks and for cleaning up an existing tangle of tasks into reusable roles
with proper inventories and vault-encrypted variables.

Steps:

1. **Detect the current state and target**
   - Look for existing Ansible files: `ansible.cfg`, playbooks, `roles/`, `inventories/`, `group_vars/`, `requirements.yml`; note the Ansible version if pinned
   - Identify what is being automated (from `$ARGUMENTS` or the repo): app deployment, server provisioning, config management — and the target OS family, since module choice depends on it
   - If starting fresh, confirm target environments (dev/staging/prod) and connection method (SSH user, become strategy) before scaffolding

2. **Structure inventories and variable precedence**
   - One inventory directory per environment: `inventories/<env>/hosts.yml` plus `inventories/<env>/group_vars/` — never a single flat hosts file with env suffixes
   - Put shared defaults in `group_vars/all.yml`, environment overrides in each env's group_vars, host quirks in `host_vars/` — document the precedence chain in a comment
   - Use meaningful groups by function (`webservers`, `db`) crossed with environment, not by hostname patterns

3. **Extract roles with clean interfaces**
   - One role per concern (e.g., `nginx`, `app_deploy`, `postgres`) with the standard layout: `tasks/`, `handlers/`, `templates/`, `defaults/`, `vars/`, `meta/`
   - Tunable values go in `defaults/main.yml` (lowest precedence, meant to be overridden); role-internal constants in `vars/main.yml`
   - Playbooks become thin: hosts, roles, and tags only — no loose task lists
   - Pin external roles/collections in `requirements.yml` with versions

4. **Enforce idempotency**
   - Prefer declarative modules (`template`, `lineinfile`, `package`, `service`, `file`) over `command`/`shell`; when `command` is unavoidable, add `creates:`/`removes:` or a `changed_when:` based on actual output
   - Restarts belong in handlers triggered by `notify`, never as unconditional tasks
   - Add `check_mode` support where feasible and verify: a second run of every playbook must report `changed=0` — treat any perpetual "changed" task as a bug to fix

5. **Encrypt secrets with ansible-vault**
   - Audit existing vars files for plaintext secrets (passwords, tokens, keys) and move them into vault-encrypted files, e.g. `group_vars/<env>/vault.yml`, referenced by plaintext vars (`db_password: "{{ vault_db_password }}"`) so `grep` still finds where a secret is *used*
   - Encrypt with a per-environment vault ID (`ansible-vault encrypt --vault-id prod@prompt`); configure `vault_identity_list` in `ansible.cfg`
   - Add the vault password file pattern to `.gitignore`; never commit vault passwords, only encrypted content
   - Add `no_log: true` on tasks that handle secret values so they don't leak into output

6. **Lint, verify, and document**
   - Run `ansible-lint` and fix findings; run `ansible-playbook --syntax-check` and `--check --diff` against a non-prod inventory as the dry run
   - Add tags (`setup`, `deploy`, `config`) so partial runs are possible
   - Deliver a short README section: how to run each playbook per environment, how vault passwords are supplied, and the idempotency guarantee (second run = no changes)

**Notes:**
- Never run playbooks against real hosts from this skill — set up and verify with `--syntax-check`/`--check` only; actual execution is the user's call
- `become: true` at the narrowest scope needed (task/block), not blanket at play level, unless everything genuinely needs root
- Avoid `ignore_errors: true` — use `failed_when:` with a real condition instead
- If the repo mixes Ansible with Terraform, keep the boundary clean: Terraform creates infrastructure, Ansible configures what exists — don't duplicate state in both

$ARGUMENTS
