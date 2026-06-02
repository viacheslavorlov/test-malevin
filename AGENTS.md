# AGENTS.md — test-malevin

## Stack

- **Monorepo**: Turborepo 2.9.14, Bun 1.3.9 (package manager)
- **apps/web**: Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui (button, card, input, table, select, dialog, label, sonner)
- **apps/api**: Elysia (Bun-native HTTP framework), runs on port 3001
- **Database**: SQLite via Drizzle ORM (`bun:sqlite` driver), stored in `apps/api/data.db`
- **Auth**: JWT (bcryptjs + @elysiajs/jwt)
- **packages/**: `@repo/eslint-config` (ESLint v9 flat config), `@repo/typescript-config` (shared tsconfigs)

## Commands

All at root via `turbo`:

| Command | What it does |
|---------|-------------|
| `bun run build` | `turbo run build` |
| `bun run dev` | `turbo run dev` (starts both apps) |
| `bun run lint` | `turbo run lint` — ESLint with `--max-warnings 0` |
| `bun run check-types` | `turbo run check-types` |
| `bun run format` | Prettier on `**/*.{ts,tsx,md}` |

Run on a single package: `bun run build --filter=web`, `bun run dev --filter=api`, etc.

## App quirks

- **web** `check-types` = `next typegen && tsc --noEmit` (must run together, in order)
- **web** `lint` uses `--max-warnings 0` — zero warnings allowed
- **api** `dev` = `bun run --watch src/index.ts` (uses Bun's built-in watch), also has `check-types` = `tsc --noEmit`
- **web** uses Tailwind CSS v4 (`@tailwindcss/postcss`), not v3 — no `tailwind.config.js`, use CSS-first config (`@import "tailwindcss"`)
- `packageManager`: `bun@1.3.9` — always use `bun` for installs/add/managing deps
- **web** tsconfig path alias: `"@/*": ["./app/*"]` — e.g. `@/components/ui/button` → `app/components/ui/button`
- **api** `package.json` uses `"module": "src/index.js"` — Elysia handles routing; no lint script exists for api

## Architecture

- **API entry**: `apps/api/src/index.ts` — creates Elysia app, runs migrations + seeds on startup
- **API routes**: auth (`/api/auth/*`), work-entries (`/api/work-entries/*`), work-types (`/api/work-types`), health (`/api/health`)
- **Web pages**: `/login`, `/register`, `/` (protected, main work log table)
- **DB schema**: `users`, `work_types` (pre-seeded with 15 types), `work_entries` — auto-created on first API start
- **No CI workflows**, no remote configured, no `.env` files (`.env.local` pattern is gitignored)
- No test suite exists (api has placeholder)

## Docker

```bash
docker compose up --build
```
- API data persisted via `api-data` named volume
- Set `JWT_SECRET` env var in docker-compose or `.env`
- Web uses `NEXT_PUBLIC_API_URL=http://localhost:3001` by default
