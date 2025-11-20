# DIY Ski Assessment System (滑雪教學評量系統)

This is a Monorepo managed by [Turbo](https://turbo.build/) and [pnpm](https://pnpm.io/).

## Tech Stack

- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo
- **Database**: PostgreSQL + Prisma (located in `packages/database`)
- **Backend**: NestJS (located in `apps/api`)
- **Frontend**: Next.js (located in `apps/web`)

## Directory Structure

```
.
├── apps
│   ├── api          # NestJS Backend Service
│   └── web          # Next.js Frontend Application
├── packages
│   └── database     # Shared Prisma Client & Schema
├── docker-compose.yml # Local development infrastructure
└── pnpm-workspace.yaml
```

## Deployment (Zeabur)

### API Service (`apps/api`)
- **Type**: Docker
- **Dockerfile**: `apps/api/Dockerfile`
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string

### Web Service (`apps/web`)
- **Type**: Next.js
- **Build Command**: `pnpm build` (handled by Zeabur's Next.js preset)
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: URL of the API service

## Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start infrastructure (Postgres + Redis):
   ```bash
   docker-compose up -d
   ```

3. Generate Prisma Client:
   ```bash
   pnpm db:generate
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```
