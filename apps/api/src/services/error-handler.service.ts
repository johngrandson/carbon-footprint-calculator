import type { FastifyReply } from 'fastify';
import type { ApiError } from '@workspace/contracts';

export class ErrorHandlerService {
  /**
   * Creates a standardized API error response
   */
  static createApiError(
    statusCode: number,
    error: string,
    message: string
  ): ApiError {
    return {
      error,
      message,
      statusCode
    };
  }

  /**
   * Handles validation errors
   */
  static handleValidationError(
    reply: FastifyReply,
    message: string
  ): ApiError {
    reply.code(400);
    return this.createApiError(400, 'Validation Error', message);
  }

  /**
   * Handles not found errors
   */
  static handleNotFoundError(
    reply: FastifyReply,
    message: string
  ): ApiError {
    reply.code(404);
    return this.createApiError(404, 'Not Found', message);
  }

  /**
   * Handles internal server errors
   */
  static handleInternalError(
    reply: FastifyReply,
    message: string,
    logger?: { error: (message: string) => void }
  ): ApiError {
    if (logger) {
      logger.error(message);
    }
    reply.code(500);
    return this.createApiError(500, 'Internal Server Error', message);
  }

  /**
   * Handles quiz service specific errors
   */
  static handleQuizServiceError(
    reply: FastifyReply,
    message: string,
    logger?: { error: (message: string) => void }
  ): ApiError {
    if (logger) {
      logger.error(message);
    }
    reply.code(500);
    return this.createApiError(500, 'Quiz Service Error', message);
  }
}