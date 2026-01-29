import { NextResponse } from 'next/server';
import {
  AppError,
  ClaudeExecutionError,
  ClaudeParseError,
  CoinbaseAPIError,
  SSHConnectionError,
  SSHTimeoutError,
  ValidationError,
} from '../errors';

const ERROR_MESSAGES: Record<string, string> = {
  SSH_CONNECTION: 'Analysis service unavailable',
  SSH_TIMEOUT: 'Analysis timed out',
  CLAUDE_EXECUTION: 'Analysis service error',
  CLAUDE_PARSE: 'Failed to parse analysis response',
};

export const handleApiError = (error: unknown): NextResponse => {
  if (error instanceof SSHConnectionError) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.SSH_CONNECTION, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof SSHTimeoutError) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.SSH_TIMEOUT, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof ClaudeExecutionError) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.CLAUDE_EXECUTION, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof ClaudeParseError) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.CLAUDE_PARSE, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof CoinbaseAPIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  // Log detailed error server-side, return generic message to client
  console.error('Unhandled error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
};
