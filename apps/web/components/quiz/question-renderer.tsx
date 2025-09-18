import React, { useEffect, useCallback } from 'react';

import type { QuizAnswerValue, QuizQuestion } from '@workspace/contracts';
import { FormProvider, useZodForm, z } from '@workspace/ui/hooks/use-zod-form';

import { QuizNumberField } from './fields/quiz-number-field';
import { QuizSelectField } from './fields/quiz-select-field';

export interface QuestionRendererProps {
  question: QuizQuestion;
  defaultValue?: QuizAnswerValue;
  onSubmit: (answer: QuizAnswerValue) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

function createValidationSchema(question: QuizQuestion) {
  if (question.type === 'number') {
    let schema = z.number({
      required_error: 'This field is required',
      invalid_type_error: 'Answer must be a number'
    });

    if (question.validation?.min !== undefined) {
      schema = schema.min(
        question.validation.min,
        `Value must be at least ${question.validation.min}`
      );
    }

    if (question.validation?.max !== undefined) {
      schema = schema.max(
        question.validation.max,
        `Value must be at most ${question.validation.max}`
      );
    }

    return z.object({ answer: schema });
  } else {
    // single_choice - validate that the selected option is valid
    const baseSchema = z.string();

    if (question.validation?.required !== false) {
      const requiredSchema = baseSchema.min(1, 'Please select an option');

      // Validate that the selected option is in the current question's options
      if (question.options && question.options.length > 0) {
        return z.object({
          answer: requiredSchema.refine(
            (value) => question.options!.includes(value),
            'Invalid option selected'
          )
        });
      }

      return z.object({ answer: requiredSchema });
    }

    // Optional field
    if (question.options && question.options.length > 0) {
      return z.object({
        answer: baseSchema.refine(
          (value) => !value || question.options!.includes(value),
          'Invalid option selected'
        )
      });
    }

    return z.object({ answer: baseSchema });
  }
}

export function QuestionRenderer({
  question,
  defaultValue,
  onSubmit,
  onBack,
  loading,
  error,
  className
}: QuestionRendererProps) {
  const schema = createValidationSchema(question);

  // Determine the initial value for the form
  const getInitialValue = useCallback(() => {
    const valueAsString = typeof defaultValue === 'string' || typeof defaultValue === 'number'
      ? String(defaultValue)
      : '';

    // For select questions, only use default if it's a valid option
    if (question.type === 'single_choice' && valueAsString) {
      const isValidOption = question.options?.includes(valueAsString);
      return isValidOption ? valueAsString : '';
    }

    return valueAsString;
  }, [defaultValue, question.type, question.options]);

  const form = useZodForm({
    schema,
    defaultValues: {
      answer: getInitialValue()
    }
  });

  // Reset form when question changes
  useEffect(() => {
    form.reset({ answer: getInitialValue() });
  }, [question.id, getInitialValue, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data.answer);
  });

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {question.question}
        </h2>
        {question.category && (
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            Category: {question.category}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {question.type === 'number' ? (
            <QuizNumberField
              name="answer"
              label="Your Answer"
              min={question.validation?.min}
              max={question.validation?.max}
              required={question.validation?.required !== false}
              disabled={loading}
            />
          ) : (
            <QuizSelectField
              name="answer"
              label="Your Choice"
              options={question.options || []}
              required={question.validation?.required !== false}
              disabled={loading}
            />
          )}

          <div className="flex justify-between space-x-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
