---
description: Generate infrastructure diagrams (Mermaid) from IaC and config files
permissions:
  reads: ["**/*.tf", "**/*.yaml", "**/*.yml", "**/*.json", "**/docker-compose*"]
  writes: ["*.md", "*.mmd"]
  commands: []
  network: false
  destructive: false
---

Generate an accurate, up-to-date infrastructure diagram from the actual IaC and config in the repo — so the
architecture picture matches reality instead of a stale drawing nobody updated.

Steps:

1. **Discover the infrastructure sources** (`$ARGUMENTS`)
   - Scan for Terraform, CloudFormation, Kubernetes manifests, docker-compose, Helm charts, and serverless configs
   - If multiple exist, ask which scope to diagram (whole system, one environment, or one service)

2. **Extract resources and relationships**
   Parse the definitions into components (compute, data stores, queues, load balancers, gateways, external
   services) and the connections between them (network routes, dependencies, data flow). Note trust/network boundaries.

3. **Choose the diagram type**
   Pick what serves the audience: a network/topology view (VPCs, subnets, security groups), a component/data-flow
   view, or a deployment view. Offer to produce more than one if the system warrants it.

4. **Generate the Mermaid diagram**
   Emit a Mermaid `graph`/`flowchart` (or `C4` context via Mermaid) with clear grouping (subgraphs per
   boundary/environment), labeled edges, and consistent icons/prefixes for resource types.

5. **Annotate and deliver**
   Write a markdown file with the diagram plus a short legend and a list of anything that couldn't be inferred
   from the files (manual resources, runtime config) so the gaps are explicit rather than silently missing.

**Notes:**
- The diagram is only as truthful as the IaC — call out resources created outside code
- Regenerate on infra changes so the picture stays current; keep the source Mermaid in the repo
- Complements `/docs--diagram` (code-level diagrams) and `/security--threat-model` (which reuses boundaries)

$ARGUMENTS
