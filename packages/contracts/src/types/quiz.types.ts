import type { CalculationResponse, CategoryType } from './calculation.types';

// Quiz answer value types
export type QuizAnswerValue = string | number;

// Simplified quiz interfaces for our current implementation
export interface QuizQuestion {
  id: string;
  category: CategoryType;
  question: string;
  type: 'single_choice' | 'number';
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    required: boolean;
  };
}

export interface QuizSession {
  sessionId: string;
  currentQuestionIndex: number;
  answers: Record<string, QuizAnswerValue>;
  completed: boolean;
  createdAt: Date;
}

export interface QuizAnswer {
  sessionId: string;
  answer: QuizAnswerValue;
}

export interface QuizSubmissionResult {
  success: boolean;
  nextQuestion?: QuizQuestion;
  completed?: boolean;
  error?: string;
}

export interface QuizCalculationRequest {
  sessionId: string;
}

export interface QuizCalculationResponse {
  sessionId: string;
  calculation: CalculationResponse;
  aiResponse: string;
  answers: Record<string, QuizAnswerValue>;
}
