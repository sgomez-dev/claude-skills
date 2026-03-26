---
description: Generate a new tested skill with permission manifest from a natural language description
permissions:
  reads: ["skills/**", "template/**", "scripts/**"]
  writes: ["skills/**"]
  commands: []
  network: false
  destructive: false
---

Create a new skill from a natural language description, complete with permission manifest and test file.

Steps:
1. Understand what the user wants the skill to do from their description
2. Detect the current project's tech stack to tailor the skill
3. Determine the appropriate category (git, testing, security, etc.)

4. Generate three files:

   **a) The skill file: `skills/<category>/<name>.md`**
   ```markdown
   ---
   description: <concise description for command palette>
   permissions:
     reads: [<files/patterns this skill needs to read>]
     writes: [<files/patterns this skill may create or modify>]
     commands: [<shell commands this skill may run>]
     network: <true if skill involves API/network calls>
     destructive: <true if skill can delete or overwrite data>
   ---

   <Clear, step-by-step instructions tailored to this project's stack>

   $ARGUMENTS
   ```

   **b) The test file: `skills/<category>/<name>.test.yaml`**
   ```yaml
   skill: <name>
   category: <category>
   tests:
     - name: "<scenario description>"
       trigger_prompts:
         - "<natural language that should activate this skill>"
         - "<another way to ask for this>"
       assertions:
         - has_steps: true
         - output_format: "<expected format>"
         - no_destructive_commands: <true if permissions.destructive is false>
     - name: "edge case: <edge case>"
       input: "<edge case arguments>"
       assertions:
         - handles_gracefully: true
   ```

5. Validate the generated skill:
   - Frontmatter has description and permissions
   - Steps are numbered and specific
   - $ARGUMENTS is included
   - Permissions match what the instructions actually do
   - Test file covers happy path + at least one edge case

6. Present the files for review before saving:
   ```
   Generated skill: api--rest-to-graphql
   Category: api
   Permissions: reads [src/routes/**], writes [src/graphql/**], network: false
   Tests: 3 scenarios

   Save to skills/api/rest-to-graphql.md? [Y/n]
   ```

7. After saving, suggest running `./scripts/test-runner.sh` to validate

Description of skill to create: $ARGUMENTS
