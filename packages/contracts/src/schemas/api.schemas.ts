import { z } from 'zod';

// Validation error schema
export const ValidationErrorSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  message: z.string().min(1, 'Error message is required'),
  value: z.any().optional()
});

// Base API error schema
export const ApiErrorSchema = z.object({
  error: z.string().min(1, 'Error type is required'),
  message: z.string().min(1, 'Error message is required'),
  statusCode: z.number().int().min(400).max(599, 'Invalid HTTP status code'),
  details: z.record(z.string(), z.any()).optional()
});

// API validation error schema
export const ApiValidationErrorSchema = ApiErrorSchema.extend({
  validationErrors: z.array(ValidationErrorSchema).min(1, 'At least one validation error is required')
});

// Success response wrapper schema
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string().datetime().optional()
  });

// Error response wrapper schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorSchema,
  timestamp: z.string().datetime().optional()
});

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('success', [
    SuccessResponseSchema(dataSchema),
    ErrorResponseSchema
  ]);

// Export inferred types
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiValidationError = z.infer<typeof ApiValidationErrorSchema>;
export type SuccessResponse<T> = {
  success: true;
  data: T;
  timestamp?: string;
};
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;