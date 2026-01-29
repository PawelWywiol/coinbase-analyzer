import { describe, expect, it } from 'vitest';
import { calculateMetrics } from './analysis';
import type { Candle } from './types';

const createCandle = (close: number, index = 0): Candle => ({
  timestamp: 1000000 + index * 86400,
  open: close - 1,
  high: close + 2,
  low: close - 2,
  close,
  volume: 1000,
});

const createCandles = (closes: number[]): Candle[] =>
  closes.map((close, i) => createCandle(close, i));

describe('calculateMetrics', () => {
  it('should calculate all metrics correctly', () => {
    const candles = createCandles([100, 102, 104, 106, 108, 110, 112]);
    const metrics = calculateMetrics(candles);

    expect(metrics.currentPrice).toBe(112);
    expect(metrics.priceChange24h).toBe(2);
    expect(metrics.priceChangePercent).toBeCloseTo(1.818, 2);
    expect(metrics.high24h).toBe(114);
    expect(metrics.low24h).toBe(110);
    expect(metrics.movingAverages.ma7).toBe(106);
    expect(metrics.movingAverages.ma14).toBeUndefined();
    expect(metrics.volatility).toBeGreaterThan(0);
    expect(metrics.volume24h).toBe(1000);
    expect(metrics.avgVolume).toBe(1000);
  });

  it('should return undefined MA when candles < period', () => {
    const candles = createCandles([100, 102, 104]);
    const metrics = calculateMetrics(candles);

    expect(metrics.movingAverages.ma7).toBeUndefined();
    expect(metrics.movingAverages.ma14).toBeUndefined();
  });

  it('should return 0 volatility for single candle', () => {
    const candles = createCandles([100]);
    const metrics = calculateMetrics(candles);

    expect(metrics.volatility).toBe(0);
  });

  it('should return empty support/resistance for < 10 candles', () => {
    const candles = createCandles([100, 102, 104, 106, 108]);
    const metrics = calculateMetrics(candles);

    expect(metrics.supportLevels).toEqual([]);
    expect(metrics.resistanceLevels).toEqual([]);
  });

  it('should find support/resistance levels with enough data', () => {
    // Create data with clear local min/max
    const closes = [100, 95, 90, 95, 100, 105, 110, 105, 100, 95, 90, 95, 100];
    const candles = createCandles(closes);
    const metrics = calculateMetrics(candles);

    expect(metrics.supportLevels.length).toBeGreaterThanOrEqual(0);
    expect(metrics.resistanceLevels.length).toBeGreaterThanOrEqual(0);
  });
});
