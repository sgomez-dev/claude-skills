---
description: Design autoscaling: metrics, policies, warm pools, load-testing validation
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design an autoscaling strategy that keeps the service responsive under load and cheap when idle — scaling on
the right signals, avoiding flapping, and validated with a load test rather than hope.

Steps:

1. **Characterize the workload** (`$ARGUMENTS`)
   - Detect the platform from the repo/IaC (Kubernetes HPA, cloud ASG, serverless concurrency, PaaS)
   - Classify the traffic: steady, diurnal, spiky, or batch — and what "overloaded" means for this service (latency, queue depth)

2. **Choose the scaling signal**
   Pick the metric that actually predicts saturation: CPU is often wrong for I/O-bound apps — prefer request
   latency, queue length, in-flight requests, or a custom business metric. Justify the choice.

3. **Set policies and bounds**
   Define min/max instances, target value, scale-out and scale-in thresholds, and cooldowns. Make scale-out fast
   and scale-in slow to avoid flapping. Protect downstreams (a DB connection ceiling) from a scaled-out fleet.

4. **Handle cold starts**
   Address startup latency: warm pools/pre-provisioned concurrency, readiness probes, and scaling ahead of
   predictable peaks (scheduled scaling for known diurnal patterns). Estimate the cost of warm capacity.

5. **Validate with load testing**
   Design a load test (`/testing--load-testing`) that ramps to peak and beyond; observe whether scaling keeps
   latency within SLO, how fast it reacts, and whether it settles or oscillates. Tune thresholds from real data.

6. **Deliver**
   Provide the scaling config (HPA manifest / ASG policy / serverless settings), the chosen metric and bounds
   with rationale, a rough cost range at idle vs peak (labeled approximate), and the load-test results.

**Notes:**
- Scaling on CPU by default is the most common mistake — scale on what predicts user pain
- Autoscaling can't fix a bottleneck downstream; a scaled fleet hammering one DB just moves the failure
- Pair with `/cloud--disaster-recovery` (capacity during failover) and `/observability--slo-sli` (the target)

$ARGUMENTS
