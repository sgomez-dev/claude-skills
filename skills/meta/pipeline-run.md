---
description: Run a multi-skill pipeline - chain skills together for end-to-end workflows
permissions:
  reads: ["pipelines/**", "skills/**"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Execute a skill pipeline that chains multiple skills together in sequence with quality gates.

Steps:
1. If a pipeline name is provided, read the pipeline definition from `pipelines/<name>.yaml`
2. If no name provided, list available pipelines and let the user choose
3. Parse the pipeline definition:
   - `steps`: Ordered list of skills to execute
   - `gate`: Conditions that must pass before proceeding to next step
   - `on_failure`: What to do if a step fails (abort, skip, ask)
   - `shared_context`: Data passed between steps

4. For each step in the pipeline:
   a. Announce: "Step N/M: Running <skill-name>..."
   b. Execute the skill's instructions
   c. Capture the output/findings as shared context
   d. Evaluate the quality gate:
      - If gate passes → proceed to next step
      - If gate fails → execute on_failure action
   e. Show progress: "Step N/M: PASSED | FAILED | SKIPPED"

5. After all steps, show pipeline summary:
   ```
   Pipeline: feature-complete
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Step 1: code-quality--review    PASSED  (3 warnings, 0 critical)
   Step 2: security--security-audit PASSED  (0 findings)
   Step 3: testing--test-gen       PASSED  (12 tests generated)
   Step 4: git--commit             PASSED  (feat(auth): add login flow)
   Step 5: git--pr-create          PASSED  (PR #42 created)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Result: 5/5 steps passed
   ```

6. If any step had warnings, list them at the end as "items to address later"

Pipeline: $ARGUMENTS
