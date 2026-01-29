import { z } from 'zod/v4';
import { API } from './config';
import { CoinbaseAPIError } from './errors';
import { transformCoinbaseCandles } from './transformers';
import {
  type Candle,
  type CoinbaseCandle,
  CRYPTOS,
  type Crypto,
  TIMEFRAMES,
  type Timeframe,
} from './types';

const FETCH_TIMEOUT_MS = 30_000;

const coinbaseCandleSchema = z.array(
  z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]),
);

const fetchWithRetry = async (url: string, retries = API.RETRY_COUNT): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) return res;
      if (res.status === API.RATE_LIMIT_STATUS) {
        await new Promise((r) => setTimeout(r, API.RETRY_DELAY_MS * (i + 1)));
        continue;
      }
      throw new CoinbaseAPIError(`API error: ${res.status}`, res.status);
    } catch (e) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === 'AbortError') {
        throw new CoinbaseAPIError('Request timeout', 504);
      }
      throw e;
    }
  }
  throw new CoinbaseAPIError('Max retries exceeded', 503);
};

export const fetchCandles = async (crypto: Crypto, timeframe: Timeframe): Promise<Candle[]> => {
  const productId = CRYPTOS[crypto];
  const config = TIMEFRAMES[timeframe];
  const end = Math.floor(Date.now() / 1000);
  const start = end - config.duration;

  const url = `${API.BASE_URL}/products/${productId}/candles?granularity=${config.granularity}&start=${start}&end=${end}`;
  const res = await fetchWithRetry(url);

  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new CoinbaseAPIError('Invalid response content type', 500);
  }

  const json = await res.json();
  const result = coinbaseCandleSchema.safeParse(json);

  if (!result.success) {
    throw new CoinbaseAPIError('Invalid response structure from Coinbase', 500);
  }

  const data: CoinbaseCandle[] = result.data;
  return transformCoinbaseCandles(data);
};
