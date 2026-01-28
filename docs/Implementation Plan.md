# Implementation Plan

Step-by-step guide for deploying and extending MAD2026.

---

## Phase 1: Initial Setup (Completed)

### 1.1 Project Structure
- [x] Next.js 16 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS 4 setup
- [x] shadcn/ui components

### 1.2 Core Features
- [x] Chat API endpoint (`/api/chat`)
- [x] Recommendations API (`/api/recommendations`)
- [x] Health check endpoint (`/api/health`)
- [x] ChatWindow component
- [x] ThemePicker component

### 1.3 Infrastructure
- [x] Dockerfile (multi-stage build)
- [x] .dockerignore
- [x] next.config.ts (standalone output)

---

## Phase 2: Deployment Setup (Completed)

### 2.1 Deployment Scripts
- [x] `scripts/deploy.sh` - Parameterized deployment
- [x] `scripts/azure-config-personal.env`
- [x] `scripts/azure-config-hackathon.env`

### 2.2 Dockerfile Fix
- [x] Changed `npm ci --only=production` to `npm ci`
- [x] Verified build completes successfully

### 2.3 Windows Compatibility
- [x] Added `--no-logs` flag to avoid encoding issues
- [x] Build status check via JSON output

---

## Phase 3: Personal Deployment (Completed)

### 3.1 Azure Resources Created
- [x] Resource Group: `mad2026-personal-rg`
- [x] Container Registry: `mad2026personalacr`
- [x] Container Apps Environment: `mad2026-personal-env`
- [x] Container App: `mad2026-personal-app`

### 3.2 Deployment Verification
- [x] Image built and pushed to ACR
- [x] Container App running
- [x] External ingress configured
- [x] URL accessible: https://mad2026-personal-app.ambitiousforest-508153c5.eastus.azurecontainerapps.io/

---

## Phase 4: Hackathon Deployment (Pending)

### 4.1 Prerequisites
- [ ] Login to hackathon Azure account (`az login`)
- [ ] Verify ACR name availability (`az acr check-name --name mad2026hackathonacr`)
- [ ] Update `azure-config-hackathon.env` if needed

### 4.2 Deployment Steps
```bash
# 1. Login to hackathon account
az login

# 2. Verify correct account
az account show

# 3. Run deployment
./scripts/deploy.sh hackathon
```

### 4.3 Expected Resources
- Resource Group: `mad2026-hackathon-rg`
- Container Registry: `mad2026hackathonacr`
- Container Apps Environment: `mad2026-hackathon-env`
- Container App: `mad2026-hackathon-app`

---

## Phase 5: Feature Development (Future)

### 5.1 AI Integration
- [ ] Configure Azure OpenAI credentials
- [ ] Implement actual chat responses (replace placeholder)
- [ ] Add embedding generation for semantic search
- [ ] Connect RAG pipeline

### 5.2 Domain Customization
- [ ] Define domain-specific types in `src/lib/types.ts`
- [ ] Add domain data to `src/data/`
- [ ] Customize scoring rules in `src/lib/scoring.ts`
- [ ] Update UI components for domain

### 5.3 Authentication (Optional)
- [ ] Configure Supabase credentials
- [ ] Add auth middleware
- [ ] Protect API routes
- [ ] Add user profile management

---

## Phase 6: Production Hardening (Future)

### 6.1 CI/CD Pipeline
- [ ] GitHub Actions workflow for build
- [ ] Automated deployment on push to main
- [ ] Environment-specific deployments (dev/staging/prod)

### 6.2 Monitoring
- [ ] Application Insights integration
- [ ] Custom metrics for chat/recommendations
- [ ] Alerting rules

### 6.3 Security
- [ ] Azure Key Vault for secrets
- [ ] Managed Identity for ACR access
- [ ] Network isolation (VNet)

---

## Quick Reference

### Deploy to Personal
```bash
az login  # Use personal account
./scripts/deploy.sh personal
```

### Deploy to Hackathon
```bash
az login  # Use hackathon account
./scripts/deploy.sh hackathon
```

### Redeploy After Changes
```bash
# Build new image
az acr build --registry <acr-name> --image mad2026:latest . --no-logs

# Update container app
az containerapp update -n <app-name> -g <rg-name> --image <acr>.azurecr.io/mad2026:latest
```

### View Logs
```bash
az containerapp logs show -n <app-name> -g <rg-name> --follow
```

### Check Status
```bash
az containerapp show -n <app-name> -g <rg-name> --query "properties.runningStatus"
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [PRD.md](PRD.md) | Product requirements and features |
| [Architecture.md](Architecture.md) | System design and data flow |
| [Decisions.md](Decisions.md) | Technical decision records |
| [learnings.md](learnings.md) | Deployment learnings and troubleshooting |
| Implementation Plan.md | This file - step-by-step guide |
