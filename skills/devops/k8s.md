---
description: Generate Kubernetes manifests for deploying the application
permissions:
  reads: ["**/*"]
  writes: ["k8s/**", "*.yaml"]
  commands: []
  network: false
  destructive: false
---

Generate Kubernetes manifests for the project.

Steps:
1. Analyze the application requirements
2. Generate manifests:

   **Deployment**
   - Proper resource requests and limits
   - Liveness and readiness probes
   - Rolling update strategy
   - Pod anti-affinity for HA
   - Security context (non-root, read-only filesystem)

   **Service**
   - ClusterIP for internal, LoadBalancer/NodePort for external
   - Proper port naming

   **ConfigMap / Secret**
   - Non-sensitive config in ConfigMap
   - Sensitive data in Secret (base64)
   - Mount as env vars or files as appropriate

   **Ingress**
   - TLS termination
   - Path-based routing
   - Rate limiting annotations

   **HPA (Horizontal Pod Autoscaler)**
   - CPU/memory-based scaling
   - Min/max replicas

   **PVC (if stateful)**
   - Proper storage class
   - Access modes

3. Follow best practices:
   - Namespace isolation
   - Network policies
   - Pod disruption budgets
   - Resource quotas
4. Output as separate YAML files or Kustomize structure

$ARGUMENTS
