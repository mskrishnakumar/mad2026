# Azure Account Migration Guide

This guide helps you migrate the MAD2026 application from one Azure account to another personal Azure account.

## Quick Start

```bash
# 1. Generate seed data files
node scripts/generate-seed-data.js

# 2. Copy and configure environment
cp .env.migration.template .env.migration
# Edit .env.migration with your new Azure Storage connection string

# 3. Install dependencies (if not already)
npm install @azure/data-tables dotenv

# 4. Run migration
node scripts/seed-azure-tables.js
```

## Files Overview

| File | Purpose |
|------|---------|
| `scripts/generate-seed-data.js` | Generates JSON and CSV seed data files |
| `scripts/seed-azure-tables.js` | Seeds Azure Table Storage |
| `scripts/seed-data/*.json` | Generated JSON data files |
| `scripts/seed-data/*.csv` | Generated CSV data files |
| `.env.migration.template` | Template for migration environment |

## Step-by-Step Migration

### 1. Set Up New Azure Account

1. Create an Azure account at [portal.azure.com](https://portal.azure.com)
2. Create a new **Storage Account**:
   - Go to "Create a resource" > "Storage account"
   - Choose a unique name (e.g., `mad2026storage`)
   - Select region closest to you
   - Performance: Standard
   - Redundancy: LRS (cheapest) or GRS
3. After creation, go to **Access keys** and copy the connection string

### 2. Generate Seed Data

```bash
node scripts/generate-seed-data.js
```

This creates:
- `scripts/seed-data/students.json` - 60 mock students
- `scripts/seed-data/programmes.json` - 10 training programmes
- `scripts/seed-data/jobs.json` - 10 job listings
- `scripts/seed-data/centres.json` - 5 Magic Bus centres + config
- `scripts/seed-data/counsellors.json` - 5 counsellors
- CSV versions of the above for backward compatibility

### 3. Configure Environment

```bash
cp .env.migration.template .env.migration
```

Edit `.env.migration`:
```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
```

### 4. Run Migration

Seed all tables:
```bash
node scripts/seed-azure-tables.js
```

Seed specific table:
```bash
node scripts/seed-azure-tables.js --table=students
node scripts/seed-azure-tables.js --table=programmes
node scripts/seed-azure-tables.js --table=jobs
node scripts/seed-azure-tables.js --table=centres
node scripts/seed-azure-tables.js --table=counsellors
```

Clear and reseed:
```bash
node scripts/seed-azure-tables.js --clear
```

### 5. Update Application Environment

Create `.env.local` for the Next.js application:

```env
# Data Source
DATA_SOURCE=azure

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your_connection_string

# Google OAuth (register new app at console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

### 6. Deploy to Azure Container Apps (Optional)

1. Create Azure Container Registry:
   ```bash
   az acr create --name mad2026acr --resource-group your-rg --sku Basic
   ```

2. Build and push image:
   ```bash
   az acr build --registry mad2026acr --image mad2026:latest .
   ```

3. Create Container App:
   ```bash
   az containerapp create \
     --name mad2026-app \
     --resource-group your-rg \
     --environment your-env \
     --image mad2026acr.azurecr.io/mad2026:latest \
     --target-port 3000 \
     --ingress external
   ```

## Data Structure Reference

### Students Table
| Field | Type | Description |
|-------|------|-------------|
| id | string | STU0001, STU0002, etc. |
| name | string | Full name |
| age | string | Age in years |
| gender | string | Male/Female/Other |
| school | string | School name |
| grade | string | Education grade |
| contact_phone | string | Phone number |
| contact_email | string | Email address |
| education_level | string | 10th Pass, 12th Pass, etc. |
| status | string | Active/Matched/Placed/Onboarding |
| skills | string | Comma-separated skills |
| aspirations | string | Comma-separated aspirations |
| enrolled_date | string | ISO date |
| counsellor_id | string | CNSL001, etc. |

### Programmes Table
| Field | Type | Description |
|-------|------|-------------|
| id | string | PRG001, PRG002, etc. |
| name | string | Programme name |
| category | string | Retail/IT/Healthcare/etc. |
| description | string | Programme description |
| required_skills | string | Comma-separated skills |
| education_level | string | Required education |
| duration_months | string | Duration |
| certification | string | Certification type |
| employment_rate | string | Percentage |
| avg_salary | string | Monthly salary |

### Jobs Table
| Field | Type | Description |
|-------|------|-------------|
| id | string | JOB001, JOB002, etc. |
| title | string | Job title |
| company | string | Company name |
| location | string | City |
| industry | string | Industry sector |
| job_type | string | Full-time/Internship |
| required_skills | string | Comma-separated skills |
| education_level | string | Required education |
| salary_min | string | Minimum salary |
| salary_max | string | Maximum salary |
| openings | string | Number of openings |
| posted_date | string | ISO date |
| status | string | Active/Closed |

### Centres Table
| Field | Type | Description |
|-------|------|-------------|
| id | string | CTR001, CTR002, etc. |
| name | string | Centre name |
| address | string | Full address |
| latitude | number | GPS latitude |
| longitude | number | GPS longitude |
| pinCodes | array | Served PIN codes |
| capacity | number | Max enrollment |
| currentEnrollment | number | Current count |

## Troubleshooting

### "Connection string not found"
- Ensure `.env.migration` exists and has the correct connection string
- Check the connection string format matches Azure's format

### "Table already exists" errors
- This is normal - the script handles existing tables
- Use `--clear` flag to reset data

### "Seed data file not found"
- Run `node scripts/generate-seed-data.js` first to generate data files

### Authentication errors
- Verify your connection string is correct
- Check if your IP is allowed in Storage Account firewall settings

## Support

For issues with this migration:
1. Check the troubleshooting section above
2. Review Azure Storage Account logs
3. Open an issue on the repository

---
Generated for MAD2026 Hackathon Project
