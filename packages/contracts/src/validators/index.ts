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

  const errors: ValidationError[] = result.error.errors.map((error) => {
    // Navigate through the path to get the value that caused the error
    let currentValue: unknown = data;
    for (const key of error.path) {
      if (currentValue && typeof currentValue === 'object' && key in currentValue) {
        currentValue = (currentValue as Record<string | number, unknown>)[key];
      } else {
        currentValue = undefined;
        break;
      }
    }

    return {
      field: error.path.join('.'),
      message: error.message,
      value: currentValue
    };
  });

  return { success: false, errors };
}