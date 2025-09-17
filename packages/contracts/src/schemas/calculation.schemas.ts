import { z } from 'zod';
import { ActivitySchema, ActivityResultSchema, CategoryTypeSchema } from './activity.schemas';

// Calculation request schema
export const CalculationRequestSchema = z.object({
  activities: z.array(ActivitySchema).min(1, 'At least one activity is required'),
  region: z.string().optional()
});

// Calculation response schema
export const CalculationResponseSchema = z.object({
  totalCarbonFootprint: z.number().nonnegative('Total footprint cannot be negative'),
  categoryBreakdown: z.record(z.string(), z.number().nonnegative()),
  dailyAverage: z.number().nonnegative('Daily average cannot be negative'),
  annualEstimate: z.number().nonnegative('Annual estimate cannot be negative'),
  activities: z.array(ActivityResultSchema),
  recommendations: z.array(z.string()),
  calculatedAt: z.string().datetime('Invalid datetime format')
});

// Emission factor schema
export const EmissionFactorSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  category: CategoryTypeSchema,
  type: z.string().min(1, 'Type is required'),
  factor: z.number().nonnegative('Factor cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().min(1, 'Description is required'),
  source: z.string().optional()
});

// Activity type info schema
export const ActivityTypeSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  unit: z.string().min(1, 'Unit is required'),
  category: CategoryTypeSchema,
  examples: z.array(z.string()).optional()
});

// Category info schema
export const CategoryInfoSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  activities: z.array(ActivityTypeSchema)
});

// Response schemas
export const EmissionFactorsResponseSchema = z.object({
  factors: z.array(EmissionFactorSchema),
  categories: z.array(z.string()),
  lastUpdated: z.string().datetime('Invalid datetime format')
});

export const CategoriesResponseSchema = z.object({
  categories: z.array(CategoryInfoSchema)
});

export const ActivitiesResponseSchema = z.object({
  activities: z.array(ActivityTypeSchema),
  category: CategoryTypeSchema.optional()
});

// Export inferred types
export type CalculationRequest = z.infer<typeof CalculationRequestSchema>;
export type CalculationResponse = z.infer<typeof CalculationResponseSchema>;
export type EmissionFactor = z.infer<typeof EmissionFactorSchema>;
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type CategoryInfo = z.infer<typeof CategoryInfoSchema>;
export type EmissionFactorsResponse = z.infer<typeof EmissionFactorsResponseSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
export type ActivitiesResponse = z.infer<typeof ActivitiesResponseSchema>;