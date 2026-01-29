import { describe, expect, it } from 'vitest';
import { analyzeRequestSchema, isCrypto } from './validation';

describe('analyzeRequestSchema', () => {
  it('should validate correct request', () => {
    const valid = {
      crypto: 'BTC',
      weeklyProfitGoal: 1000,
    };

    const result = analyzeRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid crypto', () => {
    const invalid = {
      crypto: 'INVALID',
      weeklyProfitGoal: 1000,
    };

    const result = analyzeRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should use default weeklyProfitGoal if not provided', () => {
    const minimal = { crypto: 'BTC' };

    const result = analyzeRequestSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.weeklyProfitGoal).toBe(1000);
    }
  });

  it('should reject weeklyProfitGoal less than 1', () => {
    const invalid = {
      crypto: 'BTC',
      weeklyProfitGoal: 0,
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
