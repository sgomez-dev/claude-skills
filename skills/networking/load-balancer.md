---
description: Configure load balancing with health checks and failover policies
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["curl"]
  network: true
  destructive: false
---

Design a load balancing configuration for the application.

Steps:
1. Determine the load balancing requirements:
   - Number and location of origin servers
   - Traffic patterns (geographic distribution, peak hours)
   - Failover requirements (RTO, RPO)
   - Session affinity needs
2. Configure origin pools:

   **Pool definitions**
   - Primary pool with origin servers and weights
   - Fallback pools for disaster recovery
   - Per-origin health check settings

   **Health checks**
   - HTTP/HTTPS health check endpoints
   - Expected status codes and response body checks
   - Check interval, timeout, and unhealthy threshold
   - Health check headers (Host, authentication)

3. Select steering policy:
   - **Random**: Even distribution
   - **Weighted**: Proportional traffic split
   - **Geo**: Route to nearest pool by region
   - **Least connections**: Route to least loaded
   - **Off (failover)**: Primary with fallback
4. Configure advanced settings:
   - Session affinity (cookie-based, IP-based)
   - Adaptive routing for optimal paths
   - Failover latency threshold
   - Custom header passthrough
   - Zero-downtime failover
5. Generate configuration:
   - Cloudflare Load Balancer API/Terraform config
   - Equivalent Nginx upstream configuration
   - Kubernetes Ingress / Service alternatives

$ARGUMENTS
