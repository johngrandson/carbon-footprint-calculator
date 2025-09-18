// Re-export original types
export * from './types/calculation.types';
// Quiz types now generated from Zod schemas

// Re-export schemas (use namespace to avoid conflicts)
export * as ActivitySchemas from './schemas/activity.schemas';
export * as CalculationSchemas from './schemas/calculation.schemas';
export * as QuizSchemas from './schemas/quiz.schemas';
export * as ApiSchemas from './schemas/api.schemas';

// Re-export validators
export * from './validators/index';

// Export common schemas directly for convenience
export {
  ActivitySchema,
  ActivityResultSchema,
  type Activity,
  type ActivityResult
} from './schemas/activity.schemas';

export {
  CalculationRequestSchema,
  CalculationResponseSchema
} from './schemas/calculation.schemas';

export {
  QuizQuestionSchema,
  QuizAnswerRequestSchema,
  QuizStartResponseSchema,
  QuizAnswerResponseSchema,
  QuizCalculationRequestSchema,
  QuizCalculationResponseSchema,
  QuizStatusResponseSchema,
  QuizSessionSchema,
  QuizSubmissionResultSchema,
  // Export Zod-generated types
  type QuizQuestion,
  type QuizAnswerRequest,
  type QuizStartResponse,
  type QuizAnswerResponse,
  type QuizCalculationRequest,
  type QuizCalculationResponse,
  type QuizStatusResponse,
  type QuizAnswerValue,
  type QuizSession,
  type QuizSubmissionResult
} from './schemas/quiz.schemas';

export {
  ApiErrorSchema,
  ValidationErrorSchema,
  type ApiError
} from './schemas/api.schemas';

// Export OpenAPI specification and Swagger configuration
export { openApiDocument, swaggerConfig } from './schemas/openapi/index';
