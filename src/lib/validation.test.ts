import { describe, expect, it } from 'vitest';
import { analyzeRequestSchema, isCrypto } from './validation';

describe('analyzeRequestSchema', () => {
  it('should validate correct request', () => {
    const valid = {
      crypto: 'BTC',
      timeframe: '1d',
      candles: [{ timestamp: 1, open: 1, high: 2, low: 0, close: 1.5, volume: 100 }],
    };

    const result = analyzeRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid crypto', () => {
    const invalid = {
      crypto: 'INVALID',
      timeframe: '1d',
      candles: [{ timestamp: 1, open: 1, high: 2, low: 0, close: 1.5, volume: 100 }],
    };

    const result = analyzeRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty candles array', () => {
    const invalid = {
      crypto: 'BTC',
      timeframe: '1d',
      candles: [],
    };

    const result = analyzeRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid timeframe', () => {
    const invalid = {
      crypto: 'BTC',
      timeframe: '2w',
      candles: [{ timestamp: 1, open: 1, high: 2, low: 0, close: 1.5, volume: 100 }],
    };

    const result = analyzeRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('isCrypto', () => {
  it('should return true for valid cryptos', () => {
    expect(isCrypto('BTC')).toBe(true);
    expect(isCrypto('ETH')).toBe(true);
    expect(isCrypto('LINK')).toBe(true);
  });

  it('should return false for invalid values', () => {
    expect(isCrypto('INVALID')).toBe(false);
    expect(isCrypto(123)).toBe(false);
    expect(isCrypto(null)).toBe(false);
  });
});
