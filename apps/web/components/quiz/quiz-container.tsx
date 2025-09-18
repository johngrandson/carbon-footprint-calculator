'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type {
  QuizQuestion,
  QuizAnswerValue,
  QuizAnswerResponse,
  QuizCalculationResponse
} from '@workspace/contracts';
import { QuestionRenderer } from './question-renderer';
import { QuizProgress } from './quiz-progress';

const DEFAULT_TOTAL_QUESTIONS = 4;
const API_ENDPOINTS = {
  START: '/quiz/start',
  ANSWER: '/quiz/answer',
  CALCULATE: '/quiz/calculate',
} as const;

export interface QuizContainerProps {
  sessionId?: string;
  apiBaseUrl?: string;
  onComplete: (result: QuizCalculationResponse) => void;
  onError?: (error: string) => void;
  onCategoryChange?: (category: string | null) => void;
  className?: string;
}

interface QuizState {
  sessionId: string | null;
  currentQuestion: QuizQuestion | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  completed: boolean;
}

export function QuizContainer({
  sessionId: initialSessionId,
  apiBaseUrl = '/api',
  onComplete,
  onError,
  onCategoryChange,
  className,
}: QuizContainerProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    sessionId: initialSessionId || null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    totalQuestions: 0,
    completed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start a new quiz session
  const startQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.START}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to start quiz: ${response.statusText}`);
      }

      const data = await response.json();

      setQuizState({
        sessionId: data.sessionId,
        currentQuestion: data.question,
        currentQuestionIndex: 1, // Backend is 0-indexed, UI shows 1-based
        totalQuestions: data.totalQuestions || DEFAULT_TOTAL_QUESTIONS,
        completed: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start quiz';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, onError]);

  // Calculate final results
  const calculateResults = useCallback(async () => {
    if (!quizState.sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.CALCULATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quizState.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate results: ${response.statusText}`);
      }

      const result: QuizCalculationResponse = await response.json();

      setQuizState(prev => ({
        ...prev,
        completed: true,
      }));

      onComplete(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [quizState.sessionId, apiBaseUrl, onComplete, onError]);

  // Submit an answer and get next question
  const submitAnswer = useCallback(async (answer: QuizAnswerValue) => {
    if (!quizState.sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.ANSWER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quizState.sessionId,
          answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to submit answer: ${response.statusText}`);
      }

      const data: QuizAnswerResponse = await response.json();

      if (data.completed) {
        // Quiz completed, get calculation
        await calculateResults();
      } else if (data.question) {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: data.question!,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }));
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit answer';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [quizState.sessionId, apiBaseUrl, onError, calculateResults]);

  // Initialize quiz
  useEffect(() => {
    if (!quizState.sessionId) {
      startQuiz();
    }
  }, [quizState.sessionId, startQuiz]);

  // Notify parent about category changes
  useEffect(() => {
    if (quizState.currentQuestion?.category) {
      onCategoryChange?.(quizState.currentQuestion.category);
    } else if (quizState.completed) {
      onCategoryChange?.(null);
    }
  }, [quizState.currentQuestion?.category, quizState.completed, onCategoryChange]);

  if (loading && !quizState.currentQuestion) {
    return (
      <div className={`text-center p-8 ${className || ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600 dark:text-gray-400">
          Starting your carbon footprint quiz...
        </div>
      </div>
    );
  }

  if (error && !quizState.currentQuestion) {
    return (
      <div className={`text-center p-8 ${className || ''}`}>
        <div className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizState.completed) {
    return (
      <div className={`text-center p-8 ${className || ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <div className="text-green-600 dark:text-green-400 text-xl font-semibold">
          Quiz Complete! 🎉
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calculating your carbon footprint...
        </p>
      </div>
    );
  }

  if (!quizState.currentQuestion) {
    return null;
  }

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${className || ''}`}>
      <QuizProgress
        currentStep={quizState.currentQuestionIndex}
        totalSteps={quizState.totalQuestions}
      />

      <QuestionRenderer
        question={quizState.currentQuestion}
        onSubmit={submitAnswer}
        loading={loading}
        error={error || undefined}
      />
    </div>
  );
}