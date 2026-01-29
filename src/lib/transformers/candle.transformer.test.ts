import { describe, expect, it } from 'vitest';
import type { CoinbaseCandle } from '../types';
import { transformCoinbaseCandles } from './candle.transformer';

describe('transformCoinbaseCandles', () => {
  it('should transform tuple to object and sort by timestamp', () => {
    const raw: CoinbaseCandle[] = [
      [300, 100, 110, 105, 108, 1000],
      [100, 90, 100, 95, 98, 800],
      [200, 95, 105, 100, 103, 900],
    ];

    const result = transformCoinbaseCandles(raw);

    expect(result).toHaveLength(3);
    expect(result[0].timestamp).toBe(100);
    expect(result[1].timestamp).toBe(200);
    expect(result[2].timestamp).toBe(300);

    expect(result[0]).toEqual({
      timestamp: 100,
      low: 90,
      high: 100,
      open: 95,
      close: 98,
      volume: 800,
    });
  });

  it('should handle empty array', () => {
    expect(transformCoinbaseCandles([])).toEqual([]);
  });
});
