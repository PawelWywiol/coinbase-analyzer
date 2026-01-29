import { z } from 'zod/v4';

const signalsSchema = z.object({
  action: z.enum(['buy', 'sell', 'hold']),
  confidence: z.number().min(1).max(10),
  reasoning: z.string(),
});

const riskAssessmentSchema = z.object({
  level: z.enum(['low', 'medium', 'high']),
  factors: z.array(z.string()),
});

const predictionSchema = z.object({
  shortTerm: z.string(),
  mediumTerm: z.string(),
  longTerm: z.string(),
});

const strategySchema = z.object({
  weeklyTarget: z.number(),
  recommendedPosition: z.string(),
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit: z.number(),
  reasoning: z.string(),
});

const potentialProfitSchema = z.object({
  daily: z.string(),
  weekly: z.string(),
  risk: z.string(),
});

const newsImpactSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  keyEvents: z.array(z.string()),
});

export const claudeAnalysisSchema = z.object({
  trend: z.enum(['bullish', 'bearish', 'sideways']),
  strength: z.number().min(1).max(10),
  signals: signalsSchema,
  riskAssessment: riskAssessmentSchema,
  prediction: predictionSchema,
  bestTimeframe: z.enum(['1d', '7d', '1m', '3m', '6m', '1y', '5y']),
  strategy: strategySchema,
  potentialProfit: potentialProfitSchema,
  marketSummary: z.string(),
  newsImpact: newsImpactSchema,
});

export type ClaudeAnalysisResult = z.infer<typeof claudeAnalysisSchema>;
