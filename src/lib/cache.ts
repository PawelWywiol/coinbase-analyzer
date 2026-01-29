import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CACHE_TTL } from './config';
import type { Candle, Crypto, Timeframe } from './types';

const CACHE_DIR = join(process.cwd(), 'cache');
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// In-memory cache for serverless environments
const memoryCache = new Map<string, { data: Candle[]; timestamp: number }>();

const getCacheKey = (crypto: Crypto, timeframe: Timeframe): string => `${crypto}-${timeframe}`;

const ensureCacheDir = (): void => {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
};

const getCachePath = (crypto: Crypto, timeframe: Timeframe): string =>
  join(CACHE_DIR, `${crypto}-${timeframe}.json`);

const isFileExpired = (path: string, ttlSeconds: number): boolean => {
  if (!existsSync(path)) return true;
  const mtime = statSync(path).mtimeMs;
  const age = (Date.now() - mtime) / 1000;
  return age > ttlSeconds;
};

export const getCached = (crypto: Crypto, timeframe: Timeframe): Candle[] | null => {
  const key = getCacheKey(crypto, timeframe);
  const ttl = CACHE_TTL[timeframe];

  if (IS_SERVERLESS) {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    const age = (Date.now() - entry.timestamp) / 1000;
    return age <= ttl ? entry.data : null;
  }

  const path = getCachePath(crypto, timeframe);
  if (isFileExpired(path, ttl)) return null;

  try {
    const data = readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCache = (crypto: Crypto, timeframe: Timeframe, candles: Candle[]): void => {
  const key = getCacheKey(crypto, timeframe);

  if (IS_SERVERLESS) {
    memoryCache.set(key, { data: candles, timestamp: Date.now() });
    return;
  }

  ensureCacheDir();
  const path = getCachePath(crypto, timeframe);
  writeFileSync(path, JSON.stringify(candles), { mode: 0o600 });
};
