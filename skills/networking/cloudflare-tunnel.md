---
description: Configure Cloudflare Tunnel to expose local services securely
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["cloudflared"]
  network: true
  destructive: false
---

Set up a Cloudflare Tunnel to securely expose local services.

Steps:
1. Determine the tunnel use case:
   - Expose local web server to the internet
   - Self-hosted application (Nextcloud, Gitea, etc.)
   - Development environment sharing
   - SSH access without public IP
   - Multiple services behind one tunnel
2. Generate tunnel configuration:

   **config.yml**
   - Tunnel UUID and credentials path
   - Ingress rules mapping hostnames to local services
   - Origin server configuration (TLS, HTTP/2, keep-alive)
   - Catch-all 404 rule

   **Example ingress rules**
   ```yaml
   ingress:
     - hostname: app.example.com
       service: http://localhost:3000
     - hostname: api.example.com
       service: http://localhost:8080
     - hostname: ssh.example.com
       service: ssh://localhost:22
     - service: http_status:404
   ```

3. DNS configuration:
   - CNAME records pointing to tunnel UUID
   - Automatic DNS via `cloudflared tunnel route dns`
4. Access policies (Cloudflare Zero Trust):
   - Authentication requirements per hostname
   - IP-based allow/deny rules
   - Service tokens for API access
5. Deployment options:
   - Systemd service file for Linux
   - Docker container configuration
   - Kubernetes deployment manifest

$ARGUMENTS
