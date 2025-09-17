// Re-export original types
export * from './types/calculation.types';
export * from './types/quiz.types';

// Re-export schemas (use namespace to avoid conflicts)
export * as ActivitySchemas from './schemas/activity.schemas';
export * as CalculationSchemas from './schemas/calculation.schemas';
export * as ApiSchemas from './schemas/api.schemas';

// Re-export validators
export * from './validators/index';

// Export common schemas directly for convenience
export {
  ActivitySchema,
  ActivityResultSchema
} from './schemas/activity.schemas';

export {
  CalculationRequestSchema,
  CalculationResponseSchema
} from './schemas/calculation.schemas';

export {
  ApiErrorSchema,
  ValidationErrorSchema
} from './schemas/api.schemas';