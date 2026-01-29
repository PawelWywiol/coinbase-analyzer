import type { Candle } from './types';

export interface TechnicalMetrics {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  movingAverages: {
    ma7?: number;
    ma14?: number;
    ma30?: number;
    ma90?: number;
    ma180?: number;
    ma365?: number;
  };
  volatility: number;
  supportLevels: number[];
  resistanceLevels: number[];
  volume24h: number;
  avgVolume: number;
}

const calculateMA = (candles: Candle[], period: number): number | undefined => {
  if (candles.length < period) return undefined;
  const slice = candles.slice(-period);
  const sum = slice.reduce((acc, c) => acc + c.close, 0);
  return sum / period;
};

const calculateVolatility = (candles: Candle[]): number => {
  if (candles.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const ret = (candles[i].close - candles[i - 1].close) / candles[i - 1].close;
    returns.push(ret);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + (r - mean) ** 2, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  // Annualized volatility (assuming daily data) * 100 for percentage
  return stdDev * Math.sqrt(365) * 100;
};

const findSupportResistance = (
  candles: Candle[],
): {
  support: number[];
  resistance: number[];
} => {
  if (candles.length < 10) return { support: [], resistance: [] };

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);

  // Simple pivot points: local minima/maxima
  const support: number[] = [];
  const resistance: number[] = [];

  for (let i = 2; i < candles.length - 2; i++) {
    // Local minimum (support)
    if (
      lows[i] < lows[i - 1] &&
      lows[i] < lows[i - 2] &&
      lows[i] < lows[i + 1] &&
      lows[i] < lows[i + 2]
    ) {
      support.push(lows[i]);
    }
    // Local maximum (resistance)
    if (
      highs[i] > highs[i - 1] &&
      highs[i] > highs[i - 2] &&
      highs[i] > highs[i + 1] &&
      highs[i] > highs[i + 2]
    ) {
      resistance.push(highs[i]);
    }
  }

  // Return top 3 most recent
  return {
    support: support.slice(-3).sort((a, b) => b - a),
    resistance: resistance.slice(-3).sort((a, b) => a - b),
  };
};

export const calculateMetrics = (candles: Candle[]): TechnicalMetrics => {
  const current = candles[candles.length - 1];
  const prev24h = candles.length > 1 ? candles[candles.length - 2] : current;

  const { support, resistance } = findSupportResistance(candles);

  return {
    currentPrice: current.close,
    priceChange24h: current.close - prev24h.close,
    priceChangePercent: ((current.close - prev24h.close) / prev24h.close) * 100,
    high24h: current.high,
    low24h: current.low,
    movingAverages: {
      ma7: calculateMA(candles, 7),
      ma14: calculateMA(candles, 14),
      ma30: calculateMA(candles, 30),
      ma90: calculateMA(candles, 90),
      ma180: calculateMA(candles, 180),
      ma365: calculateMA(candles, 365),
    },
    volatility: calculateVolatility(candles),
    supportLevels: support,
    resistanceLevels: resistance,
    volume24h: current.volume,
    avgVolume: candles.reduce((a, c) => a + c.volume, 0) / candles.length,
  };
};
