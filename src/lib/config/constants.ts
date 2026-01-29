import type { Timeframe } from '../types';

export const API = {
  BASE_URL: 'https://api.exchange.coinbase.com',
  MAX_CONCURRENT: 3,
  RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
  RATE_LIMIT_STATUS: 429,
} as const;

export const SSH = {
  CONNECT_TIMEOUT_MS: 10_000,
  COMMAND_TIMEOUT_MS: 60_000,
} as const;

export const CACHE_TTL: Record<Timeframe, number> = {
  '1d': 60,
  '7d': 300,
  '1m': 900,
  '3m': 1800,
  '6m': 3600,
  '1y': 3600,
  '5y': 3600,
};

export const CHART = {
  HEIGHT: 400,
  COLORS: {
    TEXT: '#9ca3af',
    GRID: '#374151',
    UP: '#22c55e',
    DOWN: '#ef4444',
    VOLUME: '#6366f1',
    UP_TRANSPARENT: '#22c55e50',
    DOWN_TRANSPARENT: '#ef444450',
  },
  VOLUME_SCALE_MARGINS: { top: 0.8, bottom: 0 },
} as const;
