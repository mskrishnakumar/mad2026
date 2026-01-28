# Architecture

## MAD2026 System Architecture

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Container Apps                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js Application                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Pages     │  │    API      │  │   Components    │   │  │
│  │  │  /          │  │  /chat      │  │   ChatWindow    │   │  │
│  │  │  /chat      │  │  /recommend │  │   ThemePicker   │   │  │
│  │  │             │  │  /health    │  │   Layout        │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  │                           │                               │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │                    Libraries                         │ │  │
│  │  │  scoring.ts │ embeddings.ts │ openai.ts │ utils.ts  │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │   Azure OpenAI    │
                    │   (or OpenAI)     │
                    └───────────────────┘
```

---

## Directory Structure

```
mad2026/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   ├── chat/route.ts     # Chat endpoint (streaming)
│   │   │   ├── recommendations/route.ts  # Hybrid scoring
│   │   │   └── health/route.ts   # Health check
│   │   ├── chat/page.tsx         # Chat demo page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── skeleton.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Container.tsx
│   │   ├── ChatWindow.tsx        # Reusable chat component
│   │   └── ThemePicker.tsx       # Color theme selector
│   │
│   ├── lib/
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── utils.ts              # Helper functions
│   │   ├── embeddings.ts         # Vector search utilities
│   │   ├── scoring.ts            # Recommendation scoring
│   │   ├── openai.ts             # AI client setup
│   │   └── env.ts                # Environment validation
│   │
│   ├── hooks/
│   │   └── useChat.ts            # Chat state management
│   │
│   ├── services/
│   │   └── apiClient.ts          # HTTP client wrapper
│   │
│   ├── context/
│   │   └── AppContext.tsx        # Global state management
│   │
│   └── data/                     # JSON data files
│
├── scripts/
│   ├── deploy.sh                 # Parameterized deployment
│   ├── azure-config-personal.env # Personal Azure config
│   └── azure-config-hackathon.env # Hackathon Azure config
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md           # This file
│   ├── Decisions.md
│   ├── Implementation Plan.md
│   └── learnings.md
│
├── Dockerfile                    # Multi-stage Docker build
├── .dockerignore
├── next.config.ts                # Next.js config (standalone output)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## API Endpoints

### POST /api/chat

Chat endpoint with RAG support.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "userProfile": { ... },
  "context": "optional RAG context"
}
```

**Response:** Streaming text or JSON

### POST /api/recommendations

Hybrid recommendation endpoint.

**Request:**
```json
{
  "userProfile": { ... },
  "items": [ ... ],
  "options": {
    "quickMode": false,
    "maxResults": 10
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "item": { ... },
      "score": 85,
      "breakdown": {
        "eligibility": 90,
        "semantic": 75
      }
    }
  ],
  "metrics": { ... }
}
```

### GET /api/health

Health check endpoint for container orchestration.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T00:00:00Z"
}
```

---

## Scoring System

The recommendation engine uses a hybrid approach:

```
finalScore = (eligibilityWeight × eligibilityScore) + (semanticWeight × semanticScore)
```

**Default Configuration:**
- Eligibility Weight: 60%
- Semantic Weight: 40%
- Minimum Score: 40
- Max Results: 10

```typescript
// src/lib/scoring.ts
interface ScoringConfig {
  eligibilityWeight: number;  // 0.6
  semanticWeight: number;     // 0.4
  minScore: number;           // 40
  maxResults: number;         // 10
}
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Subscription                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Resource Group (mad2026-*-rg)             │ │
│  │                                                         │ │
│  │  ┌──────────────────┐    ┌──────────────────────────┐  │ │
│  │  │ Azure Container  │    │ Container Apps           │  │ │
│  │  │ Registry (ACR)   │───▶│ Environment              │  │ │
│  │  │                  │    │                          │  │ │
│  │  │ mad2026:latest   │    │  ┌────────────────────┐  │  │ │
│  │  └──────────────────┘    │  │  Container App     │  │  │ │
│  │                          │  │  (mad2026-*-app)   │  │  │ │
│  │                          │  │                    │  │  │ │
│  │                          │  │  Port: 3000        │  │  │ │
│  │                          │  │  CPU: 0.5          │  │  │ │
│  │                          │  │  Memory: 1Gi       │  │  │ │
│  │                          │  │  Replicas: 0-3     │  │  │ │
│  │                          │  └────────────────────┘  │  │ │
│  │                          └──────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Docker Build Stages

```dockerfile
# Stage 1: deps - Install dependencies
FROM node:20-alpine AS deps
# Installs ALL dependencies (including dev) for build

# Stage 2: builder - Build application
FROM node:20-alpine AS builder
# Copies deps, builds Next.js standalone output

# Stage 3: runner - Production image
FROM node:20-alpine AS runner
# Minimal image with only built assets
# Runs as non-root user (nextjs:nodejs)
# Exposes port 3000
```

**Build Output:**
- Standalone server (`server.js`)
- Static assets (`.next/static`)
- Public files (`public/`)

---

## Data Flow

### Chat Flow
```
User Input → ChatWindow → useChat Hook → /api/chat → Azure OpenAI → Response → UI Update
```

### Recommendation Flow
```
User Profile → /api/recommendations → scoring.ts → Hybrid Score → Sorted Results → UI
                                         │
                                         ├── Rule-based (60%)
                                         └── Semantic (40%) → embeddings.ts → Vector Match
```

---

## Security Considerations

1. **Non-root container** - Runs as UID 1001
2. **Environment secrets** - Managed via Azure Container Apps secrets
3. **No hardcoded credentials** - All secrets via environment variables
4. **Input validation** - API endpoints validate request payloads
