# MAD2026 - Hackathon Starter

A ready-to-use Next.js template with patterns from CareerAdvisor & ScholarshipFinder.

## Prerequisites

Install the required tools using Chocolatey (run PowerShell as Administrator):

```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install all prerequisites
choco install git nodejs-lts azure-cli gh typescript -y

# Verify installations
node --version      # Should show v20.x or higher
npm --version       # Should show 10.x or higher
gh --version        # GitHub CLI
az --version        # Azure CLI
tsc --version       # TypeScript compiler
```

### What Gets Installed

| Tool | Command | Purpose |
|------|---------|---------|
| Git | `git` | Version control |
| Node.js LTS | `node`, `npm` | JavaScript runtime & package manager |
| GitHub CLI | `gh` | GitHub operations from terminal |
| Azure CLI | `az` | Azure resource management |
| TypeScript | `tsc` | TypeScript compiler (global) |

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── chat/           # Chat endpoint (streaming ready)
│   │   ├── recommendations/# Hybrid scoring endpoint
│   │   └── health/         # Health check
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Container
│   └── ChatWindow.tsx      # Reusable chat component
├── lib/
│   ├── types.ts            # TypeScript definitions
│   ├── utils.ts            # Helper functions
│   ├── embeddings.ts       # Vector search utilities
│   ├── scoring.ts          # Recommendation scoring
│   └── openai.ts           # AI client setup
├── hooks/
│   └── useChat.ts          # Chat state management
├── services/
│   └── apiClient.ts        # HTTP client wrapper
├── context/
│   └── AppContext.tsx      # Global state
├── data/                   # JSON data files
└── constants/              # App constants
```

## Available Components

### UI Components (shadcn/ui)
- `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Textarea`

### Custom Components
- `ChatWindow` - Full chat interface with suggestions
- `Header` - Navigation header
- `Container` - Consistent layout wrapper

## API Endpoints

### POST /api/chat
Send chat messages. Configure AI provider in `src/lib/openai.ts`.

```typescript
// Request
{ message: string, context?: { userProfile?, conversationHistory? } }

// Response
{ id, role, content, createdAt }
```

### POST /api/recommendations
Get personalized recommendations with hybrid scoring.

```typescript
// Request
{ profile: object, quickMode?: boolean }

// Response
{ recommendations: [...], meta: { total, returned, mode, processingTimeMs } }
```

### GET /api/health
Health check endpoint.

## Patterns Used

### Hybrid Scoring
Combines rule-based eligibility checks with semantic similarity:
```typescript
finalScore = ELIGIBILITY_WEIGHT * eligibilityScore + SEMANTIC_WEIGHT * semanticScore
```

### RAG (Retrieval-Augmented Generation)
Chat responses are enhanced with relevant context:
1. Search for relevant items based on user query
2. Inject context into system prompt
3. Generate response with full context

### Quick Mode
Fast responses using only rule-based scoring (no AI calls).

## Adding AI Support

### Azure OpenAI
1. Uncomment the Azure section in `src/lib/openai.ts`
2. Install: `npm install @ai-sdk/azure ai openai`
3. Configure `.env.local` with your Azure credentials

### Supabase Auth
1. Install: `npm install @supabase/ssr`
2. Add a `src/lib/supabase.ts` client
3. Configure `.env.local` with Supabase credentials

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Docker & Azure Container Registry

### Prerequisites
```powershell
# Install Docker Desktop (via Chocolatey)
choco install docker-desktop -y

# Or download from https://www.docker.com/products/docker-desktop
```

### Build Docker Image Locally
```bash
# Build the image
docker build -t mad2026 .

# Run locally
docker run -p 3000:3000 mad2026

# Test at http://localhost:3000
```

### Deploy to Azure Container Registry (ACR)

#### 1. Create Azure Resources
```bash
# Login to Azure
az login

# Set variables
RESOURCE_GROUP="mad2026-rg"
ACR_NAME="mad2026acr"          # Must be globally unique, lowercase
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Enable admin access (for simple deployments)
az acr update --name $ACR_NAME --admin-enabled true
```

#### 2. Build & Push to ACR
```bash
# Login to ACR
az acr login --name $ACR_NAME

# Build and push using ACR Tasks (no local Docker needed)
az acr build --registry $ACR_NAME --image mad2026:latest .

# Or push from local Docker
docker tag mad2026 $ACR_NAME.azurecr.io/mad2026:latest
docker push $ACR_NAME.azurecr.io/mad2026:latest
```

#### 3. Deploy to Azure Container Apps
```bash
# Create Container Apps environment
az containerapp env create \
  --name mad2026-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Get ACR credentials
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Deploy container app
az containerapp create \
  --name mad2026-app \
  --resource-group $RESOURCE_GROUP \
  --environment mad2026-env \
  --image $ACR_NAME.azurecr.io/mad2026:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_NAME \
  --registry-password $ACR_PASSWORD \
  --env-vars NEXT_PUBLIC_APP_NAME="MAD2026"

# Get the app URL
az containerapp show --name mad2026-app --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv
```

#### 4. Update Deployment
```bash
# Rebuild and push new version
az acr build --registry $ACR_NAME --image mad2026:latest .

# Update container app
az containerapp update \
  --name mad2026-app \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/mad2026:latest
```

### Environment Variables in Azure
```bash
# Add environment variables
az containerapp update \
  --name mad2026-app \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    AZURE_OPENAI_API_KEY=secretref:openai-key \
    AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com

# For secrets, use --secrets flag
az containerapp update \
  --name mad2026-app \
  --resource-group $RESOURCE_GROUP \
  --secrets openai-key=your-actual-api-key
```

### Cleanup
```bash
# Delete all resources when done
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## Tips for Hackathon

1. **Start simple** - Get core features working first
2. **Use quick mode** - Faster responses while developing
3. **Prepare demo data** - Have pre-filled profiles ready
4. **Test happy path** - Make the main flow flawless
5. **Commit often** - Easy rollbacks save time

Good luck!
