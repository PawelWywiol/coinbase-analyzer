# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (turbopack)
pnpm build        # Production build
pnpm lint         # Biome lint + format (--write)
pnpm tsc          # Type check
pnpm test         # Run tests once
pnpm test:watch   # Watch mode
pnpm test:cov     # Coverage report
pnpm knip         # Find unused code
```

## Architecture

Next.js 16 full-stack app: Coinbase candlestick data + Claude AI technical analysis via SSH.

### Data Flow

```
Frontend (useAnalysis hook)
    ↓ fetch
GET /api/candles/[crypto] → candle.service → coinbase.ts (w/ cache + retry)
POST /api/analyze → analysis.service → calculateMetrics() + claude-client (SSH)
    ↓ response
AnalysisPanel (5 insight cards) + ChartPanel (lightweight-charts)
```

### Key Layers

| Layer | Location | Purpose |
|-------|----------|---------|
| API Routes | `src/app/api/` | Serverless endpoints |
| Services | `src/services/` | Business logic orchestration |
| Clients | `src/lib/clients/` | External integrations (Coinbase, Claude SSH) |
| Schemas | `src/lib/schemas/` | Zod validation |
| Transformers | `src/lib/transformers/` | Data mapping |

### Claude Integration

SSH-based: connects to remote host, executes `claude` CLI, parses JSON response. See `src/lib/clients/claude-client.ts`.

### Caching

File-based by default, memory fallback on serverless (Vercel/Lambda auto-detected). TTL varies by timeframe (60s-3600s).

### Security

- CSRF: Middleware checks `Sec-Fetch-Site` or Origin/Referer
- API key auth for external requests (`X-API-Key` header)
- CSP + security headers in `next.config.ts`

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5.9
- TailwindCSS 4 + DaisyUI 5
- Lightweight-Charts (TradingView)
- Zod 4 (validation)
- Vitest 4 + Testing Library
- Biome (lint/format)

## Config

- Path alias: `@/*` → `./src/*`
- Strict TypeScript
- Biome: 100 char lines, trailing commas
- Tests: jsdom environment, `*.test.{ts,tsx}` pattern
