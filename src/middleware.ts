import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/api/analyze'];

const isSameOrigin = (request: NextRequest): boolean => {
  // Browser sends Sec-Fetch-Site header automatically
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin') return true;

  // Fallback: check Origin/Referer against host
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    const originHost = new URL(origin).host;
    return originHost === host;
  }

  return false;
};

export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Allow same-origin requests (browser frontend)
  if (isSameOrigin(request)) {
    return NextResponse.next();
  }

  // External requests require API key
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.API_SECRET_KEY;

  if (!expectedKey) {
    console.error('API_SECRET_KEY not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
