import { getCached, setCache } from '@/lib/cache';
import { fetchCandles } from '@/lib/coinbase';
import type { Candle, Crypto, Timeframe } from '@/lib/types';
import { TIMEFRAMES } from '@/lib/types';

const getCandlesWithCache = async (crypto: Crypto, timeframe: Timeframe): Promise<Candle[]> => {
  const cached = getCached(crypto, timeframe);
  if (cached) return cached;

  const candles = await fetchCandles(crypto, timeframe);
  setCache(crypto, timeframe, candles);
  return candles;
};

export const getAllTimeframesWithCache = async (
  crypto: Crypto,
): Promise<Record<Timeframe, Candle[]>> => {
  const timeframes = Object.keys(TIMEFRAMES) as Timeframe[];
  const results: Record<Timeframe, Candle[]> = {} as Record<Timeframe, Candle[]>;

  await Promise.all(
    timeframes.map(async (tf) => {
      results[tf] = await getCandlesWithCache(crypto, tf);
    }),
  );

  return results;
};
