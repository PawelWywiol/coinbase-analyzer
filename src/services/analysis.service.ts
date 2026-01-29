import { calculateMetrics, type TechnicalMetrics } from '@/lib/analysis';
import { analyzeWithClaude, fetchCryptoNews } from '@/lib/clients';
import type { Candle, Crypto, Timeframe } from '@/lib/types';

type CandlesPerTimeframe = Record<Timeframe, Candle[]>;
type MetricsPerTimeframe = Record<Timeframe, TechnicalMetrics>;

const TIMEFRAMES: Timeframe[] = ['1d', '7d', '1m', '3m', '6m', '1y', '5y'];

export const runAnalysis = async (
  crypto: Crypto,
  candlesPerTimeframe: CandlesPerTimeframe,
  weeklyProfitGoal: number,
) => {
  // Calculate metrics for all timeframes
  const metricsPerTimeframe = TIMEFRAMES.reduce((acc, tf) => {
    acc[tf] = calculateMetrics(candlesPerTimeframe[tf]);
    return acc;
  }, {} as MetricsPerTimeframe);

  // Fetch news in parallel
  const news = await fetchCryptoNews(crypto);

  // Run Claude analysis with all data
  const analysis = await analyzeWithClaude(crypto, metricsPerTimeframe, news, weeklyProfitGoal);

  return { analysis, metricsPerTimeframe };
};
