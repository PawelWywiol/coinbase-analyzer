import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api';
import { ValidationError } from '@/lib/errors';
import { type AnalyzeRequest, analyzeRequestSchema } from '@/lib/validation';
import { runAnalysis } from '@/services';
import { getAllTimeframesWithCache } from '@/services/candle.service';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = analyzeRequestSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request body');
    }

    const { crypto, weeklyProfitGoal } = result.data as AnalyzeRequest;

    // Fetch all timeframes in parallel
    const candlesPerTimeframe = await getAllTimeframesWithCache(crypto);

    // Run analysis with all data
    const { analysis, metricsPerTimeframe } = await runAnalysis(
      crypto,
      candlesPerTimeframe,
      weeklyProfitGoal,
    );

    return NextResponse.json({ analysis, metricsPerTimeframe });
  } catch (error) {
    return handleApiError(error);
  }
};
