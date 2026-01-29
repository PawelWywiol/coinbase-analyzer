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

export const claudeAnalysisSchema = z.object({
  trend: z.enum(['bullish', 'bearish', 'sideways']),
  strength: z.number().min(1).max(10),
  signals: signalsSchema,
  riskAssessment: riskAssessmentSchema,
  prediction: predictionSchema,
});

export type ClaudeAnalysisResult = z.infer<typeof claudeAnalysisSchema>;
