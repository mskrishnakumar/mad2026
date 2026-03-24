# Mission Possible — Digital Youth Mobilisation Platform

A digital-first, AI-powered platform for youth mobilisation, skilling, and job placements across India's underserved communities. Built by **Team Mission Possible** (Barclays volunteers) for **Make a Difference 2026**, in partnership with **Magic Bus India Foundation**.

> **Live Solution Blueprint:** Run the app and visit `/overview` for an interactive walkthrough of the solution design, goals, and roadmap.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Three Portals](#three-portals)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Documentation](#documentation)

---

## Problem Statement

Magic Bus empowers young people aged 18–25 through skilling and job placement programmes. The current process faces critical bottlenecks:

| Challenge | Detail |
|-----------|--------|
| **60-day onboarding** | Manual paper-based registration and screening |
| **Manual screening** | Fragmented eligibility checks and engagement |
| **Low channel visibility** | Resources misallocated, no data on what works |
| **High dropout risk** | During mobilisation and post-placement phases |

---

## Solution Overview

Mission Possible transforms the manual 60-day process into a seamless digital experience, organised around **four goals**:

### 1. Predict & Identify
- AI-powered **risk scoring engine** (7 research-backed factors) flags at-risk students early
- **Dashboard analytics** with dropout prediction indicators and pipeline stage tracking
- **Smart programme matching** using hybrid rule-based + semantic scoring

### 2. Automate Onboarding
- **Digital registration** with guided multi-step forms
- **Aadhar card validation** using Verhoeff algorithm + document upload
- **AI chatbot assistant** for guided onboarding support (RAG-ready)
- Automated programme eligibility checks and recommendations

### 3. Optimise Channels
- **Progressive Web App (PWA)** — mobile-first, installable, works offline
- **Multi-language support** — Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati + more via Azure Translator
- **Interactive centre map** — Leaflet-based, shows nearest Magic Bus centres
- Responsive design for any device (phone, tablet, desktop)

### 4. Improve Outcomes
- **Hybrid scoring algorithm** for job-to-student matching
- **Volunteer mentor assignment** with availability tracking
- **Post-placement student progress monitoring**
- **Resume Builder** — students create professional resumes with live preview and PDF export

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Azure Container Apps                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Next.js 16 Application                      │  │
│  │                                                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │  │
│  │  │  3 Portals   │  │  17+ API     │  │   Service Layer    │  │  │
│  │  │  Student     │  │  Routes      │  │   Risk Scoring     │  │  │
│  │  │  Counsellor  │  │  /students   │  │   Hybrid Matching  │  │  │
│  │  │  Volunteer   │  │  /jobs       │  │   Dashboard Stats  │  │  │
│  │  │              │  │  /programmes │  │   Alert Engine     │  │  │
│  │  │              │  │  /volunteers │  │   Translation      │  │  │
│  │  │              │  │  /translate  │  │   Aadhar Validator  │  │  │
│  │  │              │  │  /alerts     │  │                    │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────────────┘  │  │
│  │                           │                                   │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │              Data Abstraction Layer                     │   │  │
│  │  │     Local CSV  ←→  DATA_SOURCE env  ←→  Azure Tables   │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Azure Table    │  │  Azure Blob     │  │  Azure          │
│  Storage        │  │  Storage        │  │  Translator     │
│  (Students,     │  │  (Aadhar docs,  │  │  (8+ Indian     │
│   Jobs,         │  │   Resumes,      │  │   languages)    │
│   Programmes,   │  │   Certificates) │  │                 │
│   Volunteers)   │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Data Flow

```
User → React UI → Next.js API Route → Service Layer → Data Layer → Azure Storage
                                           │
                                           ├── Risk Calculator (7-factor model)
                                           ├── Hybrid Scorer (rule-based + semantic)
                                           ├── Azure Translator (multi-language)
                                           └── Aadhar Validator (Verhoeff algorithm)
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | App Router, SSR, Server Components |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI | Accessible, responsive components |
| **Maps** | Leaflet, react-leaflet | Interactive centre location mapping |
| **PDF** | html2canvas, jsPDF | Resume Builder PDF export |
| **Storage** | Azure Table Storage | Structured data (students, jobs, programmes, volunteers) |
| **Files** | Azure Blob Storage | Documents (Aadhar scans, resumes, certificates) |
| **Translation** | Azure Translator | Real-time multi-language support (8+ Indian languages) |
| **AI (ready)** | Azure OpenAI / Foundry Models | Chat, embeddings, semantic scoring (prepared, not yet activated) |
| **Hosting** | Azure Container Apps | Containerised deployment with auto-scaling |
| **CI/CD** | GitHub Actions | Automated build & deploy on push to master |
| **Container** | Docker (multi-stage) | Production-optimised image (Node.js 20 Alpine) |
| **PWA** | Service Worker, Manifest | Installable mobile app, offline support |

---

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── api/                       # 17+ API routes
│   │   ├── students/              # Student CRUD, stats, risk scores
│   │   ├── student-registrations/ # Student self-signup processing
│   │   ├── jobs/                  # Job listings and matching
│   │   ├── programmes/            # Training programme management
│   │   ├── volunteers/            # Volunteer signup and management
│   │   ├── mentor-assignments/    # Mentor-student pairing
│   │   ├── student-progress/      # Mentee interaction tracking
│   │   ├── alerts/                # Student alert management
│   │   ├── translate/             # Azure Translator integration
│   │   ├── validate-aadhar/       # Aadhar document verification
│   │   ├── chat/                  # AI chat endpoint (streaming)
│   │   ├── recommendations/       # Hybrid scoring endpoint
│   │   ├── centres/               # Magic Bus centre data
│   │   ├── seed/                  # Database seeding
│   │   ├── storage/               # File upload operations
│   │   └── health/                # Health check
│   ├── student/                   # Student portal pages
│   ├── counsellor/                # Counsellor portal pages
│   ├── volunteer/                 # Volunteer portal pages
│   ├── overview/                  # Solution Blueprint page
│   ├── layout.tsx                 # Root layout with PWA registration
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Header, Sidebar, Container
│   ├── student/                   # AadharUpload component
│   ├── resume/                    # Resume Builder (builder, preview, steps)
│   ├── map/                       # Leaflet centre mapping
│   ├── translation/               # Language selector
│   ├── counsellor/dashboard/      # Dashboard subcomponents
│   ├── ChatWindow.tsx             # Reusable AI chat interface
│   └── PWARegister.tsx            # PWA service worker registration
├── lib/
│   ├── types/                     # Domain-specific TypeScript types
│   ├── utils/                     # Risk calculator, helpers
│   ├── validation/                # Aadhar validator (Verhoeff algorithm)
│   ├── hooks/                     # useTranslation (multi-language)
│   ├── azure-tables.ts            # Azure Table Storage client
│   ├── azure-storage.ts           # Azure Blob Storage client
│   ├── openai.ts                  # Azure OpenAI config (ready for activation)
│   ├── data-source.ts             # Data source abstraction (local/Azure)
│   ├── embeddings.ts              # Vector search utilities
│   └── scoring.ts                 # Hybrid recommendation scoring
├── services/
│   ├── studentService.ts          # Student data operations
│   ├── studentTableService.ts     # Student Azure Table operations
│   ├── jobService.ts              # Job matching service
│   ├── jobTableService.ts         # Job Azure Table operations
│   ├── programmeService.ts        # Programme management
│   ├── programmeTableService.ts   # Programme Azure Table operations
│   ├── dashboardService.ts        # Analytics & statistics
│   ├── riskScoreService.ts        # Risk score calculations
│   └── alertService.ts            # Alert management
├── hooks/
│   └── useChat.ts                 # Chat state management
├── context/
│   └── AppContext.tsx              # Global application state
├── data/
│   └── centres.ts                 # Magic Bus centre coordinates
└── constants/                     # Application constants
```

---

## Three Portals

### Student Portal (`/student/`)
For youth aged 18–25:
- Register with guided multi-step form (profile, education, skills, aspirations, connectivity)
- Aadhar card verification (upload or manual entry with Verhoeff validation)
- Browse and filter upskilling programmes with eligibility matching
- Explore matched job opportunities
- Build professional resumes with live preview, colour schemes, and PDF export
- Track progress, notifications, and mentor assignment status
- AI chat support for help and guidance

### Counsellor Portal (`/counsellor/`)
For Magic Bus staff:
- **Dashboard** — real-time analytics: student pipeline stages, risk distribution, engagement channels, referral sources
- **At-risk panel** — highlighted students with critical risk scores (85+) and alert management
- **Student onboarding** — guided digital signup with Aadhar verification
- **Programme & job matching** — hybrid scoring algorithm with transparent score breakdowns
- **Mentor assignment** — pair volunteer mentors with placed students
- **Student directory** — search, filter by stage/risk, view detailed profiles

### Volunteer Portal (`/volunteer/`)
For Barclays mentors:
- Quick signup with support type selection (post-placement mentoring, follow-up support)
- Demo mode with pre-filled profiles for testing
- Set availability schedule
- View assigned students and track mentee progress (calls, meetings, follow-ups, notes)
- Post-placement support tracking

---

## Key Features

### Risk Scoring Engine
Research-backed dropout prediction model with 7 weighted factors:

| Factor | Weight | Rationale |
|--------|--------|-----------|
| First week attendance | 25 pts | Strongest predictor of dropout |
| Connectivity (internet/mobile) | 20 pts | Digital access barrier |
| Distance from centre | 15 pts | Geographic barrier |
| First-gen graduate status | 10 pts | Family support gaps |
| Engagement (30-day logins) | 10 pts | Behavioural indicator |
| Contact resistance | 10 pts | Counsellor outreach response |
| Quiz score | 10 pts | Academic performance |

**Risk levels:** Low (0–39) · Medium (40–64) · High (65–84) · Critical (85–100)

### Hybrid Recommendation Scoring
Smart matching for programmes and jobs:
```
finalScore = (ELIGIBILITY_WEIGHT × eligibilityScore) + (SEMANTIC_WEIGHT × semanticScore)
```
- **Rule-based scoring** — eligibility checks (education level, skills match)
- **Semantic scoring** — vector embeddings (programme descriptions vs student aspirations)
- **Score breakdown** — transparent component-wise display for counsellors

### Multi-Language Translation
- 8+ Indian languages via Azure Translator (Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, and more)
- Real-time translation across all portal UIs
- Client-side caching to reduce API calls
- Graceful fallback to English on failure

### Resume Builder
- Multi-step guided form (education, experience, skills, languages)
- Real-time live preview as the student fills in data
- Selectable colour schemes
- PDF download via html2canvas + jsPDF

### Aadhar Validation
- Verhoeff algorithm checksum validation (12-digit identity number)
- Image upload with format/size validation (JPEG, PNG, WEBP; 10KB–5MB)
- Masked display format (XXXX XXXX 1234)
- Demo mode with hardcoded test numbers for development

---

## API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | List students (search, filter by stage/risk) |
| `GET` | `/api/students?stats=true` | Student statistics |
| `GET` | `/api/students?stats=extended` | Extended dashboard stats (engagement, referrals, risk) |
| `GET` | `/api/students?atRisk=true` | Students with high risk scores (>70) |
| `GET` | `/api/students/[id]` | Individual student profile |
| `POST` | `/api/students` | Create student (requires `DATA_SOURCE=azure-table`) |
| `POST` | `/api/student-registrations` | Student self-signup |

### Jobs & Programmes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List job openings |
| `POST` | `/api/jobs` | Create job posting |
| `GET` | `/api/programmes` | List training programmes |
| `POST` | `/api/programmes` | Create programme |

### Volunteers & Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/volunteers` | List volunteers (filter by status) |
| `POST` | `/api/volunteers` | Volunteer signup |
| `PUT` | `/api/volunteers` | Update volunteer profile |
| `GET` | `/api/mentor-assignments` | Mentor-student pairings |
| `POST` | `/api/mentor-assignments` | Assign mentor to student |
| `GET` | `/api/student-progress` | Mentee progress tracking |
| `POST` | `/api/student-progress` | Log interaction with student |

### Alerts & Support
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts` | Student alerts (unread count, filter by severity) |
| `PATCH` | `/api/alerts` | Mark alert as read |
| `POST` | `/api/translate` | Real-time translation via Azure Translator |
| `POST` | `/api/validate-aadhar` | Aadhar image validation |
| `POST` | `/api/chat` | AI chat endpoint (streaming ready) |
| `POST` | `/api/recommendations` | Hybrid scoring for recommendations |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/centres` | Magic Bus centre data |
| `POST` | `/api/seed` | Seed database with sample data |
| `POST` | `/api/storage` | File upload/storage operations |

---

## Data Models

### Core Entities

**Student** — Core profile with education level, skills, aspirations, status (Active/Matched/Placed/Onboarding), and counsellor assignment.

**StudentRegistration** — Self-signup data including connectivity info (internet, mobile type, preferred communication), eligibility checks, document verification status, and centre selection.

**StudentExtended** — Dashboard view combining student profile with pipeline stage, risk factors, risk score, engagement data, and referral source.

**Programme** — Training course with required skills, education level, duration, certification, employment rate, and average salary.

**Job** — Placement opportunity with required skills, education level, salary range, industry, and openings count.

**Volunteer** — Mentor profile with support types, status (pending/approved/active), and assigned students.

**MentorAssignment** — Links a volunteer to a student with assignment date and status.

**StudentProgress** — Interaction log (call, meeting, follow-up, note) between volunteer and student.

**StudentAlert** — System-generated alerts (high risk, dropout warning, missed session, no login) with severity and read status.

**MagicBusCentre** — Centre data with coordinates, serving pin codes, capacity, and current enrolment.

**RiskScore** — Calculated score (0–100) with risk level, component breakdown, and last calculated timestamp.

---

## Getting Started

### Prerequisites

| Tool | Command | Purpose |
|------|---------|---------|
| Node.js LTS | `node` (v20+) | JavaScript runtime |
| npm | `npm` (v10+) | Package manager |
| Git | `git` | Version control |
| Azure CLI | `az` | Azure resource management (only needed for cloud features) |
| Docker | `docker` | Container builds (optional — only needed for Docker deployment) |

### Option A: Quick Start (No Azure — Mock Data)

The fastest way to get running. The app ships with seeded mock data (60 students with risk scores, alerts, pipeline stages, engagement analytics) so most features work without any external services.

```bash
# 1. Clone the repository
git clone https://github.com/mskrishnakumar/mad2026.git
cd mad2026

# 2. Install dependencies
npm install

# 3. Create a minimal environment file
cp .env.example .env.local
```

Edit `.env.local` — you only need these two lines:

```bash
DATA_SOURCE=local
NEXT_PUBLIC_APP_NAME=Mission Possible
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**What works without Azure credentials:**

| Feature | Route | Notes |
|---------|-------|-------|
| Landing page | `/` | Hero, role selection, testimonials |
| Solution Blueprint | `/overview` | Full interactive solution walkthrough |
| Counsellor Dashboard | `/counsellor/dashboard` | 60 seeded students, risk scores, alerts, pipeline analytics |
| Student Portal UI | `/student/*` | Registration forms, resume builder, programme/job browsing |
| Volunteer Portal | `/volunteer/*` | Signup, demo mode with pre-filled profiles |
| Centre Location Map | Embedded in portals | Interactive Leaflet map with all Magic Bus centres |
| Risk Scoring Engine | Dashboard | Full 7-factor scoring with breakdowns |
| Resume Builder | `/student/resume` | Multi-step form, live preview, PDF export |

**What requires Azure credentials:**

| Feature | Required Environment Variables |
|---------|-------------------------------|
| Multi-language translation | `AZURE_TRANSLATOR_KEY`, `AZURE_TRANSLATOR_ENDPOINT`, `AZURE_TRANSLATOR_REGION` |
| Document uploads (Aadhar scans, resumes) | `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER_NAME` |
| Cloud data persistence | `AZURE_TABLE_STORAGE_CONNECTION_STRING` |
| AI chat & smart matching | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT` |

### Option B: Full Setup (With Azure Services)

For the complete experience with translation, document storage, cloud persistence, and AI features:

```bash
# 1. Clone and install
git clone https://github.com/mskrishnakumar/mad2026.git
cd mad2026
npm install

# 2. Create environment file with Azure credentials
cp .env.example .env.local
```

Edit `.env.local` with all credentials (see [Environment Variables](#environment-variables) section below for the full list).

```bash
# 3. Start the development server
npm run dev
```

```bash
# 4. Seed the database with sample data (in a separate terminal)
curl -X POST http://localhost:3000/api/seed
```

Open [http://localhost:3000](http://localhost:3000) — all features are now available.

### Running a Production Build Locally

```bash
npm run build
npm run start
# App runs at http://localhost:3000 in production mode
```

### Running with Docker

```bash
docker build -t mad2026 .
docker run -p 3000:3000 --env-file .env.local mad2026
# App runs at http://localhost:3000
```

### Available Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Ensure Node.js v20+ is installed (`node --version`) |
| Port 3000 already in use | Stop the other process, or run `npm run dev -- -p 3001` |
| Translation not working | Check `AZURE_TRANSLATOR_KEY` is set in `.env.local` |
| Students page shows empty | Set `DATA_SOURCE=local` for mock data, or `DATA_SOURCE=azure-table` + run the seed endpoint |
| Build errors on Windows | Use PowerShell or Git Bash; run `npm ci` if `package-lock.json` exists |
| Docker build fails | Ensure Docker Desktop is running and you have sufficient disk space |

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# ── Data Source ──
DATA_SOURCE=azure-table              # 'azure-table' or 'local' (CSV fallback)

# ── Azure Table Storage (structured data) ──
AZURE_TABLE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...

# ── Azure Blob Storage (documents) ──
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=usethisone

# ── Azure Translator (multi-language) ──
AZURE_TRANSLATOR_KEY=your-translator-key
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION=global

# ── Azure OpenAI (optional — AI chat, embeddings) ──
AZURE_OPENAI_API_KEY=your-openai-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small

# ── App Configuration ──
NEXT_PUBLIC_APP_NAME=Mission Possible
```

**Note:** Set `DATA_SOURCE=local` to run without Azure credentials using local CSV data files.

---

## Deployment

### Docker (Local)

```bash
docker build -t mad2026 .
docker run -p 3000:3000 mad2026
```

### Azure Container Apps (Production)

#### 1. Create Azure Resources

```bash
az login

RESOURCE_GROUP="mad2026-rg"
ACR_NAME="mad2026acr"        # Must be globally unique, lowercase
LOCATION="eastus"

az group create --name $RESOURCE_GROUP --location $LOCATION
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic
az acr update --name $ACR_NAME --admin-enabled true
```

#### 2. Build & Push

```bash
az acr login --name $ACR_NAME
az acr build --registry $ACR_NAME --image mad2026:latest .
```

#### 3. Deploy

```bash
az containerapp env create \
  --name mad2026-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

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
  --env-vars NEXT_PUBLIC_APP_NAME="Mission Possible"
```

#### 4. Update Deployment

```bash
az acr build --registry $ACR_NAME --image mad2026:latest .
az containerapp update \
  --name mad2026-app \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/mad2026:latest
```

### CI/CD (GitHub Actions)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys on push to `main`/`master`. Configure these GitHub repository variables:

| Variable | Example |
|----------|---------|
| `ACR_NAME` | `mad2026acr` |
| `ACR_LOGIN_SERVER` | `mad2026acr.azurecr.io` |
| `RESOURCE_GROUP` | `mad2026-rg` |
| `CONTAINER_APP_NAME` | `mad2026-app` |

And this secret:
| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS` | Azure service principal credentials JSON |

### Cleanup

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## Roadmap

### Phase 1 — Production Readiness & Pilot Launch
- Review solution design with Magic Bus leads and technology teams
- Extensive end-to-end and integration testing across all portals
- Full authentication system with role-based access, email verification, and password recovery
- Fine-tune AI smart matching with real programme and job outcome data
- SMS/WhatsApp notification integration

### Phase 2 — Advanced Analytics & AI
- AI Interview Coach — mock interview practice with feedback
- A/B testing for engagement channels
- ML model training on real student data
- Predictive churn/dropout modelling

### Phase 3 — Scale & Expand
- Multi-centre deployment across India
- Employer integration — direct job posting portal and placement pipeline
- Integration with government skill databases
- Operational transfer and handover to Magic Bus technology team

---

## Documentation

Additional documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document |
| [Architecture.md](docs/Architecture.md) | System design and architecture diagrams |
| [Decisions.md](docs/Decisions.md) | Technology choice justifications |
| [Implementation Plan.md](docs/Implementation%20Plan.md) | Development roadmap |
| [learnings.md](docs/learnings.md) | Lessons learned during development |
| [AZURE_TRANSLATOR_SETUP.md](docs/AZURE_TRANSLATOR_SETUP.md) | Azure Translator setup guide |

---

## Important Notes for the Winning Team

1. **AI Coding Agents** — This solution was largely built using AI coding agents for faster time to market. Thorough code review and testing is recommended before production use.

2. **Authentication** — The current auth is placeholder-only (login UI exists but doesn't enforce access). Implementing full authentication (Supabase recommended) with role-based access control is a Phase 1 priority.

3. **Data Source Toggle** — Set `DATA_SOURCE=local` in `.env.local` to run with local CSV data without Azure credentials. Set `DATA_SOURCE=azure-table` for cloud storage.

4. **Demo Mode** — Several features have demo/test modes (Aadhar validation, volunteer signup) with hardcoded test data. These should be removed or gated before production.

5. **Azure OpenAI** — The AI chat and embedding integrations are wired up but not yet activated. Uncomment and configure the Azure OpenAI credentials in `.env.local` to enable.

6. **Solution Blueprint** — Visit `/overview` in the running app for a visual walkthrough of the solution design, goals mapping, tech stack rationale, and roadmap.

---

*Built by Barclays volunteers for Make a Difference 2026, in partnership with Magic Bus India Foundation.*
