# Deployment Learnings

Lessons learned from deploying MAD2026 to Azure Container Apps.

---

## 1. Dockerfile: Dev Dependencies Required for Build

**Problem:** The original Dockerfile used `npm ci --only=production` which skipped dev dependencies. This caused `npm run build` to fail because TypeScript, Next.js CLI, and other build tools weren't installed.

**Solution:** Changed to `npm ci` (without `--only=production`) in the deps stage.

```dockerfile
# WRONG - missing dev dependencies for build
RUN npm ci --only=production

# CORRECT - includes all dependencies needed for build
RUN npm ci
```

**File:** `Dockerfile` line 8

---

## 2. Azure CLI Encoding Issue on Windows

**Problem:** Azure CLI on Windows throws a `UnicodeEncodeError` when streaming logs that contain Unicode characters (like warning symbols ⚠️). The error looks like:

```
ERROR: 'charmap' codec can't encode character '\u26a0' in position 0: character maps to <undefined>
```

This affects commands like:
- `az acr build` (when streaming build logs)
- `az acr task logs`

**Important:** The build may actually succeed even though the CLI shows an error! The error is just a display issue, not a build failure.

**Workarounds:**

### Option A: Use `--no-logs` flag (Recommended)
```bash
az acr build --registry <acr-name> --image <image>:<tag> . --no-logs
```
This suppresses log streaming and returns JSON output with build status.

### Option B: Check build status separately
```bash
# Run the build (may error due to encoding)
az acr build --registry <acr-name> --image <image>:<tag> .

# Check if build actually succeeded
az acr task list-runs --registry <acr-name> --query "[0].status" -o tsv
```

### Option C: Set UTF-8 encoding (PowerShell)
```powershell
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

---

## 3. ACR Name Requirements

- Must be **globally unique** across all of Azure
- **Lowercase, alphanumeric only** (no hyphens or special characters)
- 5-50 characters long

**Check availability before deploying:**
```bash
az acr check-name --name <proposed-name>
```

---

## 4. Deployment Commands Reference

### Full Deployment Sequence

```bash
# 1. Login to Azure
az login

# 2. Create Resource Group
az group create --name <rg-name> --location eastus

# 3. Create ACR
az acr create --resource-group <rg-name> --name <acr-name> --sku Basic --admin-enabled true

# 4. Build and push image (use --no-logs to avoid encoding issues)
az acr build --registry <acr-name> --image <image>:latest . --no-logs

# 5. Create Container Apps Environment
az containerapp env create --name <env-name> --resource-group <rg-name> --location eastus

# 6. Get ACR credentials
ACR_LOGIN_SERVER=$(az acr show --name <acr-name> --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name <acr-name> --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name <acr-name> --query "passwords[0].value" -o tsv)

# 7. Create Container App
az containerapp create \
  --name <app-name> \
  --resource-group <rg-name> \
  --environment <env-name> \
  --image "$ACR_LOGIN_SERVER/<image>:latest" \
  --registry-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 0 \
  --max-replicas 3
```

### Redeployment (after code changes)

```bash
# Rebuild image
az acr build --registry <acr-name> --image <image>:latest . --no-logs

# Update container app to use new image
az containerapp update --name <app-name> --resource-group <rg-name> --image <acr-server>/<image>:latest
```

---

## 5. Useful Diagnostic Commands

```bash
# Check Azure login status
az account show

# List ACR repositories
az acr repository list --name <acr-name> -o table

# Check recent build status
az acr task list-runs --registry <acr-name> --query "[0].{status:status,startTime:startTime}" -o table

# View Container App logs
az containerapp logs show -n <app-name> -g <rg-name> --follow

# Check Container App status
az containerapp show -n <app-name> -g <rg-name> --query "properties.runningStatus" -o tsv
```

---

## 6. Deployed Environments

| Environment | Resource Group | ACR | Container App | URL |
|-------------|----------------|-----|---------------|-----|
| Personal | mad2026-personal-rg | mad2026personalacr | mad2026-personal-app | https://mad2026-personal-app.ambitiousforest-508153c5.eastus.azurecontainerapps.io/ |
| Hackathon | mad2026-hackathon-rg | mad2026hackathonacr | mad2026-hackathon-app | *Not deployed yet* |

---

## 7. Config Files

- `scripts/deploy.sh` - Parameterized deployment script
- `scripts/azure-config-personal.env` - Personal Azure account config
- `scripts/azure-config-hackathon.env` - Hackathon Azure account config

---

## 8. Pre-Deployment Checklist

Before running deployment:

- [ ] Logged into correct Azure account (`az account show`)
- [ ] ACR name is available (`az acr check-name --name <name>`)
- [ ] Config file has correct values for the environment
- [ ] Dockerfile uses `npm ci` (not `npm ci --only=production`)
- [ ] Using `--no-logs` flag to avoid Windows encoding issues
