import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api';
import type { Crypto } from '@/lib/types';
import { isCrypto } from '@/lib/validation';
import { getAllTimeframesWithCache } from '@/services';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ crypto: string }> },
) => {
  try {
    const { crypto: cryptoParam } = await params;
    const cryptoUpper = cryptoParam.toUpperCase();

    if (!isCrypto(cryptoUpper)) {
      return NextResponse.json({ error: 'Invalid cryptocurrency symbol' }, { status: 400 });
    }

    const crypto: Crypto = cryptoUpper;
    const timeframes = await getAllTimeframesWithCache(crypto);

    return NextResponse.json({ crypto, timeframes });
  } catch (error) {
    return handleApiError(error);
  }
};
