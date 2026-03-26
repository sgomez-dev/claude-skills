---
description: Generate a comprehensive .gitignore tailored to the project
permissions:
  reads: ["**/*", ".gitignore"]
  writes: [".gitignore"]
  commands: []
  network: false
  destructive: false
---

Generate a .gitignore file tailored to this project.

Steps:
1. Detect project technologies:
   - Languages (Node.js, Python, Go, Rust, Java, etc.)
   - Frameworks (React, Django, Rails, etc.)
   - Tools (Docker, Terraform, etc.)
   - IDEs (VS Code, IntelliJ, Vim, etc.)
   - OS (macOS, Windows, Linux)
2. Generate .gitignore with sections for each:
   - **Dependencies**: node_modules, venv, vendor
   - **Build outputs**: dist, build, .next, __pycache__
   - **Environment**: .env, .env.local (NOT .env.example)
   - **IDE**: .vscode/settings.json, .idea, *.swp
   - **OS**: .DS_Store, Thumbs.db
   - **Logs**: *.log, npm-debug.log
   - **Testing**: coverage/, .nyc_output
   - **Secrets**: *.pem, *.key, credentials.json
   - **Docker**: docker-compose.override.yml (if applicable, not always)
3. Add comments explaining each section
4. If .gitignore exists, merge (don't overwrite) - add missing entries

$ARGUMENTS
