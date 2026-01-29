# Coinbase Analyzer

AI-powered crypto technical analysis using Coinbase data + Claude AI.

## Features

- Real-time candlestick charts (TradingView lightweight-charts)
- Technical metrics: MA, volatility, support/resistance
- AI analysis via Claude (trend, signals, risk assessment, predictions)
- Multi-crypto: BTC, ETH, LINK, LTC, DOT
- Timeframes: 1d, 7d, 1m, 3m, 6m, 1y, 5y

## Setup

```bash
pnpm install
cp .env.example .env.local
```

## Environment Variables

```env
# Claude SSH (for AI analysis)
CLAUDE_SSH_HOST=      # SSH host running Claude CLI
CLAUDE_SSH_USER=      # SSH username
CLAUDE_SSH_PATH=      # Path to claude binary

# API Auth (for external requests)
API_SECRET_KEY=       # Required for X-API-Key header auth
```

## Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm test       # Run tests
pnpm lint       # Lint + format
```

## Tech Stack

Next.js 16 · React 19 · TypeScript · TailwindCSS · DaisyUI · Vitest · Biome

## Architecture

```
/api/candles/[crypto]  →  Coinbase API (cached)
/api/analyze           →  Claude AI via SSH
```

See [CLAUDE.md](./CLAUDE.md) for detailed architecture.
