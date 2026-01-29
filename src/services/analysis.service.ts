import { calculateMetrics } from '@/lib/analysis';
import { analyzeWithClaude } from '@/lib/clients';
import type { Analysis, Candle, Crypto, Timeframe } from '@/lib/types';

export const runAnalysis = async (crypto: Crypto, timeframe: Timeframe, candles: Candle[]) => {
  const metrics = calculateMetrics(candles);
  const analysis = await analyzeWithClaude(crypto, timeframe, metrics);
  return { analysis, metrics };
};
