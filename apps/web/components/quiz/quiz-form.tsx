'use client';

import React, { useState, useCallback } from 'react';
import type { QuizCalculationResponse } from '@workspace/contracts';
import { QuizContainer } from './quiz-container';
import { QuizResults } from './quiz-results';

interface QuizFormProps {
  onCategoryChange?: (category: string | null) => void;
}

export function QuizForm({ onCategoryChange }: QuizFormProps): React.JSX.Element {
  const [quizResult, setQuizResult] = useState<QuizCalculationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuizComplete = useCallback((result: QuizCalculationResponse) => {
    setQuizResult(result);
    setError(null);
  }, []);

  const handleQuizError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleStartNew = useCallback(() => {
    setQuizResult(null);
    setError(null);
  }, []);

  if (quizResult) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="w-full max-w-none mx-auto">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <QuizResults
              result={quizResult}
              onStartNew={handleStartNew}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Carbon Footprint Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Answer a few questions to calculate your environmental impact
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/95 border border-red-200 rounded-md dark:bg-red-900/30 dark:border-red-800 backdrop-blur-sm">
            <p className="text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <QuizContainer
            onComplete={handleQuizComplete}
            onError={handleQuizError}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </div>
  );
}