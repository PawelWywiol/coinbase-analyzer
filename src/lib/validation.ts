import { z } from 'zod/v4';
import { CRYPTOS, type Crypto } from './types';

const cryptoKeys = Object.keys(CRYPTOS) as [Crypto, ...Crypto[]];
const cryptoSchema = z.enum(cryptoKeys);

export const analyzeRequestSchema = z.object({
  crypto: cryptoSchema,
  weeklyProfitGoal: z.number().min(1).default(1000),
});

export interface AnalyzeRequest {
  crypto: Crypto;
  weeklyProfitGoal: number;
}

export const isCrypto = (value: unknown): value is Crypto =>
  typeof value === 'string' && value in CRYPTOS;
