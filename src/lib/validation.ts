import { z } from 'zod/v4';
import { type Candle, CRYPTOS, type Crypto, TIMEFRAMES, type Timeframe } from './types';

const cryptoKeys = Object.keys(CRYPTOS) as [Crypto, ...Crypto[]];
const timeframeKeys = Object.keys(TIMEFRAMES) as [Timeframe, ...Timeframe[]];

const cryptoSchema = z.enum(cryptoKeys);
const timeframeSchema = z.enum(timeframeKeys);

const candleSchema = z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export const analyzeRequestSchema = z.object({
  crypto: cryptoSchema,
  timeframe: timeframeSchema,
  candles: z.array(candleSchema).min(1),
});

export interface AnalyzeRequest {
  crypto: Crypto;
  timeframe: Timeframe;
  candles: Candle[];
}

export const isCrypto = (value: unknown): value is Crypto =>
  typeof value === 'string' && value in CRYPTOS;
