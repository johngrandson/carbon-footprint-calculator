import { z } from 'zod';
import type { ValidationError } from '../schemas/api.schemas';

/**
 * Safe validation helper that returns both validation result and formatted errors
 * Used in calculation.controller.ts for request validation
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.errors.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    value: error.path.reduce((obj, key) => obj?.[key], data as any)
  }));

  return { success: false, errors };
}