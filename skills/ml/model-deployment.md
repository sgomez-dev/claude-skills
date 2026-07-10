---
description: Deploy an ML model: serving pattern (batch/online), API, monitoring, drift detection
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["python", "pip", "docker"]
  network: false
  destructive: false
---

Take a trained model to production the right way — the correct serving pattern, a clean API, reproducible
packaging, and the monitoring that catches silent degradation before users do.

Steps:

1. **Choose the serving pattern** (`$ARGUMENTS`)
   - Detect the model framework and app stack from the repo
   - Decide batch (scheduled scoring to a table), online/real-time (low-latency API), or streaming — based on how
     fresh predictions must be and the request volume. Justify the choice.

2. **Package for reproducibility**
   Pin the model artifact + preprocessing + dependencies together (the training/serving skew bug lives in the gap
   between them). Version the model and the feature transformations as one unit. Containerize if the stack warrants it.

3. **Build the serving interface**
   For online: a clean prediction API with input validation, the SAME feature transforms used in training,
   sensible timeouts, and graceful degradation (fallback/default when the model errors). For batch: an idempotent
   scoring job (`/automation--scheduled-tasks`).

4. **Add monitoring**
   Track operational metrics (latency, error rate, throughput) AND model metrics: input feature distributions,
   prediction distribution, and — when labels arrive — live accuracy. Alert on drift, not just on 500s.

5. **Plan rollout and rollback**
   Ship behind a flag or shadow/canary the new model against the old on live traffic before full cutover.
   Keep the previous model one command away for rollback.

6. **Close the loop**
   Log predictions + outcomes for the next retraining cycle and for `/ml--model-evaluation`. Define the retrain
   trigger (drift threshold or cadence).

**Notes:**
- Training/serving skew is the classic production failure — share the exact preprocessing code, don't reimplement it
- A model with no monitoring degrades silently as the world drifts; ship monitoring with the model, not later
- Never log PII in prediction traces; apply the same data-handling rules as the rest of the system

$ARGUMENTS
