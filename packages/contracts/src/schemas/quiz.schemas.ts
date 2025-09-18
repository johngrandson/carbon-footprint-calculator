import { z } from 'zod';
import { CalculationResponseSchema } from './calculation.schemas';
import { CategoryTypeSchema } from './activity.schemas';

// Quiz answer value schema
export const QuizAnswerValueSchema = z.union([z.string(), z.number()]);

// Quiz question schema
export const QuizQuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  category: CategoryTypeSchema,
  question: z.string().min(1, 'Question text is required'),
  type: z.enum(['single_choice', 'number']),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    required: z.boolean()
  }).optional()
});

// Quiz session schema
export const QuizSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  currentQuestionIndex: z.number().nonnegative(),
  answers: z.record(z.string(), QuizAnswerValueSchema),
  completed: z.boolean(),
  createdAt: z.string().datetime()
});

// Quiz answer request schema
export const QuizAnswerRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  answer: QuizAnswerValueSchema
});

// Quiz submission result schema
export const QuizSubmissionResultSchema = z.object({
  success: z.boolean(),
  nextQuestion: QuizQuestionSchema.optional(),
  completed: z.boolean().optional(),
  error: z.string().optional()
});

// Quiz start response schema
export const QuizStartResponseSchema = z.object({
  sessionId: z.string(),
  question: QuizQuestionSchema
});

// Quiz answer response schema
export const QuizAnswerResponseSchema = z.object({
  completed: z.boolean(),
  question: QuizQuestionSchema.optional(),
  message: z.string().optional()
});

// Quiz calculation request schema
export const QuizCalculationRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required')
});

// Quiz calculation response schema
export const QuizCalculationResponseSchema = z.object({
  sessionId: z.string(),
  calculation: CalculationResponseSchema,
  aiResponse: z.string(),
  answers: z.record(z.string(), QuizAnswerValueSchema)
});

// Quiz status response schema
export const QuizStatusResponseSchema = z.object({
  sessionId: z.string(),
  completed: z.boolean(),
  currentQuestion: QuizQuestionSchema.optional()
});

// Export inferred types
export type QuizAnswerValue = z.infer<typeof QuizAnswerValueSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizSession = z.infer<typeof QuizSessionSchema>;
export type QuizAnswerRequest = z.infer<typeof QuizAnswerRequestSchema>;
export type QuizSubmissionResult = z.infer<typeof QuizSubmissionResultSchema>;
export type QuizStartResponse = z.infer<typeof QuizStartResponseSchema>;
export type QuizAnswerResponse = z.infer<typeof QuizAnswerResponseSchema>;
export type QuizCalculationRequest = z.infer<typeof QuizCalculationRequestSchema>;
export type QuizCalculationResponse = z.infer<typeof QuizCalculationResponseSchema>;
export type QuizStatusResponse = z.infer<typeof QuizStatusResponseSchema>;