import React from 'react';

export interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  showStepNumbers?: boolean;
  className?: string;
}

export function QuizProgress({
  currentStep,
  totalSteps,
  showStepNumbers = true,
  className
}: QuizProgressProps) {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className={`w-full space-y-2 ${className || ''}`}>
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      {showStepNumbers && (
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            Question {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      )}
    </div>
  );
}
