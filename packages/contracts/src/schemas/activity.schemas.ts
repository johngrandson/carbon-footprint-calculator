import { z } from 'zod';

// Category type schema
export const CategoryTypeSchema = z.enum(['food', 'energy']);

// Food activity types
export const FoodActivityTypeSchema = z.enum([
  'highMeat',
  'moderateMeat',
  'lowMeat',
  'vegetarian',
  'localFood',
  'processedFood'
]);

// Energy activity types
export const EnergyActivityTypeSchema = z.enum([
  'coal',
  'naturalGas',
  'renewable',
  'mixedGrid',
  'nuclear',
  'oil',
  'propane',
  'electric',
  'wood'
]);

// Base activity schema
export const ActivitySchema = z.object({
  category: CategoryTypeSchema,
  type: z.string().min(1, 'Activity type is required'),
  amount: z.number().positive('Amount must be positive'),
  unit: z.string().optional()
});

// Food-specific activity schema with validation
export const FoodActivitySchema = ActivitySchema.extend({
  category: z.literal('food'),
  type: FoodActivityTypeSchema,
  amount: z.number().positive().describe('Amount for food calculation (e.g., days for diet patterns, kg for food items)')
});

// Energy-specific activity schema with validation
export const EnergyActivitySchema = ActivitySchema.extend({
  category: z.literal('energy'),
  type: EnergyActivityTypeSchema,
  amount: z.number().positive().describe('Energy consumption amount (typically kWh)')
});

// Union schema for typed activities
export const TypedActivitySchema = z.discriminatedUnion('category', [
  FoodActivitySchema,
  EnergyActivitySchema
]);

// Activity result schema
export const ActivityResultSchema = z.object({
  activity: ActivitySchema,
  emissions: z.number().nonnegative('Emissions cannot be negative'),
  factor: z.number().nonnegative('Factor cannot be negative'),
  factorUnit: z.string().min(1, 'Factor unit is required')
});

// Export inferred types
export type CategoryType = z.infer<typeof CategoryTypeSchema>;
export type FoodActivityType = z.infer<typeof FoodActivityTypeSchema>;
export type EnergyActivityType = z.infer<typeof EnergyActivityTypeSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type FoodActivity = z.infer<typeof FoodActivitySchema>;
export type EnergyActivity = z.infer<typeof EnergyActivitySchema>;
export type TypedActivity = z.infer<typeof TypedActivitySchema>;
export type ActivityResult = z.infer<typeof ActivityResultSchema>;