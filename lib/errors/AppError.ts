import { NextResponse } from 'next/server';

/**
 * Standard MedLens Base Application Error Class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class AIProcessingError extends AppError {
  constructor(message = 'AI Extraction service error') {
    super(message, 500, 'AI_PROCESSING_ERROR');
  }
}

/**
 * Uniform API Error Response Handler
 * Converts AppError or unknown exceptions into standardized JSON responses.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof ValidationError && error.details ? { details: error.details } : {})
        }
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : 'An unexpected server error occurred';
  console.error('[API Error Handler Handler Captured Exception]:', error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred' : message
      }
    },
    { status: 500 }
  );
}
