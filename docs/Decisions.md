# Architecture Decision Records (ADR)

Documentation of key technical decisions made for MAD2026.

---

## ADR-001: Multi-Environment Deployment Strategy

**Date:** 2026-01-28

**Status:** Accepted

**Context:**
Need to deploy the same application to two different Azure accounts (hackathon and personal) while maintaining a single codebase.

**Decision:**
Use a parameterized deployment script with environment-specific config files.

**Structure:**
```
scripts/
├── deploy.sh                    # Single parameterized script
├── azure-config-hackathon.env   # Hackathon account settings
└── azure-config-personal.env    # Personal account settings
```

**Alternatives Considered:**
1. **Separate deployment scripts** - Rejected due to code duplication
2. **CI/CD with environment variables** - Deferred for simplicity
3. **Terraform/Bicep IaC** - Deferred, overkill for current needs

**Consequences:**
- Single source of truth for deployment logic
- Easy to add new environments
- Requires manual Azure CLI login switching

---

## ADR-002: ACR Build with --no-logs Flag

**Date:** 2026-01-28

**Status:** Accepted

**Context:**
Azure CLI on Windows throws `UnicodeEncodeError` when streaming ACR build logs containing Unicode characters (warning symbols).

**Decision:**
Use `--no-logs` flag with `az acr build` and check build status from JSON output.

**Implementation:**
```bash
BUILD_RESULT=$(az acr build \
    --registry "$ACR_NAME" \
    --image "$IMAGE_NAME:latest" \
    . \
    --no-logs \
    --query "status" -o tsv)

if [ "$BUILD_RESULT" != "Succeeded" ]; then
    exit 1
fi
```

**Consequences:**
- No real-time build log streaming
- Build errors require separate log query
- Works reliably on Windows

---

## ADR-003: Full Dependency Installation in Docker Build

**Date:** 2026-01-28

**Status:** Accepted

**Context:**
Original Dockerfile used `npm ci --only=production` which excluded dev dependencies. Build stage requires TypeScript, Next.js CLI, and other dev tools.

**Decision:**
Changed to `npm ci` (without `--only=production`) in the deps stage.

**Before:**
```dockerfile
RUN npm ci --only=production  # Missing dev deps
```

**After:**
```dockerfile
RUN npm ci  # All dependencies for build
```

**Consequences:**
- Larger intermediate build layer
- Final production image unchanged (uses standalone output)
- Build completes successfully

---

## ADR-004: Hybrid Scoring System

**Date:** 2026-01-28

**Status:** Inherited (from original template)

**Context:**
Recommendation system needs to balance explicit rules (eligibility criteria) with semantic understanding (user intent matching).

**Decision:**
Combine rule-based and semantic scoring with configurable weights.

**Formula:**
```
finalScore = 0.6 × eligibilityScore + 0.4 × semanticScore
```

**Rationale:**
- Rule-based: Handles hard requirements (eligibility, constraints)
- Semantic: Captures nuance and user preferences
- 60/40 split prioritizes explicit criteria while allowing flexibility

**Consequences:**
- Predictable, explainable recommendations
- Requires both scoring functions to be implemented
- Weights can be tuned per use case

---

## ADR-005: Next.js Standalone Output

**Date:** 2026-01-28

**Status:** Inherited (from original template)

**Context:**
Docker images should be as small as possible for fast deployment and lower costs.

**Decision:**
Use Next.js `output: "standalone"` configuration.

**Configuration:**
```typescript
// next.config.ts
const nextConfig = {
  output: "standalone"
};
```

**Consequences:**
- Minimal production image (~100MB vs ~500MB)
- Includes only necessary node_modules
- Server runs with `node server.js`

---

## ADR-006: Container Apps Consumption Tier

**Date:** 2026-01-28

**Status:** Accepted

**Context:**
Need cost-effective hosting for hackathon and personal projects.

**Decision:**
Use Azure Container Apps with Consumption workload profile.

**Configuration:**
```bash
--cpu 0.5
--memory 1.0Gi
--min-replicas 0    # Scale to zero when idle
--max-replicas 3    # Handle traffic spikes
```

**Consequences:**
- Pay only for actual usage
- Cold starts when scaling from zero
- Sufficient for demo/hackathon workloads

---

## ADR-007: shadcn/ui Component Library

**Date:** 2026-01-28

**Status:** Inherited (from original template)

**Context:**
Need accessible, customizable UI components that work with Tailwind CSS.

**Decision:**
Use shadcn/ui with Radix UI primitives.

**Included Components:**
- Button, Card, Input, Badge
- Dialog, Textarea, Skeleton

**Consequences:**
- Components are copied into codebase (not npm dependency)
- Full customization control
- Consistent with Tailwind theming

---

## ADR-008: Environment-Based Configuration

**Date:** 2026-01-28

**Status:** Accepted

**Context:**
Different deployments need different configuration values (resource names, regions, app names).

**Decision:**
Use `.env` files for Azure deployment config, loaded by deploy script.

**Structure:**
```bash
# azure-config-*.env
RESOURCE_GROUP="mad2026-*-rg"
LOCATION="eastus"
ACR_NAME="mad2026*acr"
CONTAINER_APP_ENV="mad2026-*-env"
CONTAINER_APP_NAME="mad2026-*-app"
IMAGE_NAME="mad2026"
ENV_VARS="NEXT_PUBLIC_APP_NAME=MAD2026-*"
```

**Consequences:**
- Easy to understand and modify
- No secrets in config files (just resource names)
- Secrets managed separately via Azure
