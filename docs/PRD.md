# Product Requirements Document (PRD)

## MAD2026 - Hackathon Starter Kit

---

## Overview

MAD2026 is a production-ready Next.js starter template designed for rapid hackathon development. It provides pre-built patterns for AI-powered applications including chat interfaces, recommendation engines, and hybrid scoring systems.

---

## Goals

1. **Rapid Development** - Enable teams to start building features immediately without boilerplate setup
2. **AI-Ready** - Pre-configured integrations for Azure OpenAI and OpenAI APIs
3. **Production-Grade** - Docker containerization and Azure deployment ready out of the box
4. **Flexible Architecture** - Domain-agnostic design that can be adapted to any use case

---

## Target Users

- Hackathon participants needing a quick start
- Developers building AI-powered web applications
- Teams requiring chat and recommendation functionality

---

## Core Features

### 1. Chat Interface
- Streaming-ready chat API endpoint
- RAG (Retrieval-Augmented Generation) support
- Conversation history management
- Reusable ChatWindow component

### 2. Recommendation Engine
- Hybrid scoring system (rule-based + semantic)
- Configurable weights and thresholds
- Score breakdown reporting
- Quick mode for fast responses

### 3. UI Components
- shadcn/ui component library (Button, Card, Input, Badge, Dialog, Textarea, Skeleton)
- Theme picker with Tailwind CSS color schemes
- Responsive layout components (Header, Container)

### 4. Infrastructure
- Multi-stage Docker build optimized for production
- Azure Container Apps deployment scripts
- Health check endpoint
- Environment variable management

---

## Non-Goals

- Authentication system (use Supabase or your preferred provider)
- Database setup (bring your own)
- Specific domain logic (template is domain-agnostic)

---

## Success Metrics

- Time to first deployment < 30 minutes
- Build size optimized for container deployment
- Zero configuration needed for basic functionality

---

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.5 | React framework |
| React | 19.2.3 | UI library |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | - | Component library |
| lucide-react | - | Icons |

---

## Environment Variables

### Required for AI Features
- `AZURE_OPENAI_API_KEY` - Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint URL
- `AZURE_OPENAI_DEPLOYMENT` - Model deployment name

### Optional
- `OPENAI_API_KEY` - Alternative to Azure OpenAI
- `NEXT_PUBLIC_APP_NAME` - Application display name
- Supabase credentials for auth/database

---

## Deployment Targets

| Environment | Platform | Status |
|-------------|----------|--------|
| Personal | Azure Container Apps | Deployed |
| Hackathon | Azure Container Apps | Pending |

---

## Future Enhancements

- [ ] GitHub Actions CI/CD pipeline
- [ ] Terraform/Bicep infrastructure as code
- [ ] Additional AI model integrations
- [ ] WebSocket support for real-time features
