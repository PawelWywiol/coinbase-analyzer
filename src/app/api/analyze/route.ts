import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api';
import { ValidationError } from '@/lib/errors';
import { type AnalyzeRequest, analyzeRequestSchema } from '@/lib/validation';
import { runAnalysis } from '@/services';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = analyzeRequestSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request body');
    }

    const { crypto, timeframe, candles } = result.data as AnalyzeRequest;
    const { analysis, metrics } = await runAnalysis(crypto, timeframe, candles);

    return NextResponse.json({ analysis, metrics });
  } catch (error) {
    return handleApiError(error);
  }
};
