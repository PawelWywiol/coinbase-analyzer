export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class CoinbaseAPIError extends AppError {
  constructor(message: string, statusCode = 502) {
    super(message, 'COINBASE_API_ERROR', statusCode);
    this.name = 'CoinbaseAPIError';
  }
}

export class SSHConnectionError extends AppError {
  constructor(message: string) {
    super(message, 'SSH_CONNECTION', 503);
    this.name = 'SSHConnectionError';
  }
}

export class SSHTimeoutError extends AppError {
  constructor(message: string) {
    super(message, 'SSH_TIMEOUT', 504);
    this.name = 'SSHTimeoutError';
  }
}

export class ClaudeExecutionError extends AppError {
  constructor(message: string) {
    super(message, 'CLAUDE_EXECUTION', 502);
    this.name = 'ClaudeExecutionError';
  }
}

export class ClaudeParseError extends AppError {
  constructor(message: string) {
    super(message, 'CLAUDE_PARSE', 500);
    this.name = 'ClaudeParseError';
  }
}
