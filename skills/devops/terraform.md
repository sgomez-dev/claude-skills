---
description: Generate Terraform infrastructure-as-code configurations
permissions:
  reads: ["**/*"]
  writes: ["*.tf", "*.tfvars.example"]
  commands: []
  network: false
  destructive: false
---

Generate Terraform configurations for the requested infrastructure.

Steps:
1. Understand the infrastructure requirements
2. Determine the cloud provider (AWS, GCP, Azure)
3. Generate Terraform files:

   **main.tf** - Core resources
   **variables.tf** - Input variables with descriptions and validation
   **outputs.tf** - Useful outputs (IPs, URLs, ARNs)
   **terraform.tf** - Provider and backend configuration
   **terraform.tfvars.example** - Example variable values

4. Follow best practices:
   - Use modules for reusable components
   - Remote state backend (S3, GCS, Azure Blob)
   - State locking (DynamoDB for AWS)
   - Proper tagging strategy
   - Least privilege IAM roles
   - Enable encryption at rest and in transit
   - Use data sources for existing resources
   - Terraform version constraints
5. Include:
   - VPC/networking setup
   - Security groups/firewall rules
   - Application infrastructure (ECS, GKE, App Service)
   - Database (RDS, Cloud SQL, etc.)
   - Monitoring and logging
6. Add comments explaining non-obvious decisions

$ARGUMENTS
