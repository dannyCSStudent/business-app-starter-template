# Business App Starter Template

A full-stack CRM starter built as a Turborepo monorepo.

It includes:

- `apps/api`: FastAPI backend backed by Supabase/PostgREST
- `apps/web`: Next.js dashboard for CRM operations
- `apps/mobile`: Expo app for mobile CRM workflows
- `packages/types`: shared TypeScript domain models
- `packages/ui`: shared UI components

## Features

- client management with status, notes, contact details, and last-contact tracking
- activity logging, editing, and deletion
- tag creation, assignment, removal, and editing
- shared web and mobile CRM workflows
- mobile diagnostics for API and DB connectivity
- Supabase schema included in-repo via `apps/api/schema.sql`

## Tech Stack

- Turborepo
- pnpm workspaces
- FastAPI
- Supabase
- Next.js
- Expo / React Native
- TypeScript

## Repository Layout

```text
apps/
  api/       FastAPI application and Supabase schema
  mobile/    Expo mobile application
  web/       Next.js web dashboard
packages/
  types/     Shared TypeScript CRM models
  ui/        Shared UI components
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up the API

Create the Python virtual environment and install backend dependencies as needed for `apps/api`.

Apply the initial database schema in Supabase:

```sql
apps/api/schema.sql
```

Start the API:

```bash
cd apps/api
./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start the web app

```bash
cd apps/web
pnpm dev
```

If needed, set the API URL for web:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Start the mobile app

Create `apps/mobile/.env` with platform-specific API hosts:

```bash
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:8000
EXPO_PUBLIC_API_URL_WEB=http://localhost:8000
```

For a physical device, use your machine's LAN IP instead of `localhost`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.25:8000
```

Then run:

```bash
cd apps/mobile
pnpm dev
```

## Root Scripts

From the repository root:

```bash
pnpm dev
pnpm lint
pnpm check-types
pnpm build
```

## Mobile Connectivity Notes

The mobile app talks to the FastAPI backend, not directly to Supabase.

- Android emulator should use `http://10.0.2.2:8000`
- Expo web should use `http://localhost:8000`
- physical devices should use `http://<your-lan-ip>:8000`

The mobile app includes an in-app diagnostics card that shows:

- resolved API base URL
- API `/health` status
- DB `/health/db` status
- whether the screen is using live data or fallback data

## Current Product Surface

### Web

- CRM dashboard
- client filtering and activity filtering
- create, edit, and delete flows
- inline status, tag, contact, and activity actions

### Mobile

- client feed
- activity feed
- client detail workspace
- quick-actions modal for creating clients, logging activity, and managing tags
- inline editing for client details and activity notes

## Validation

The repository is currently validated with:

```bash
pnpm lint
pnpm check-types
```

## Notes

- The included schema and routes are intended as a strong starter, not a finished production CRM.
- Supabase credentials and environment setup are project-specific and should be supplied per deployment environment.
