import { beforeEach, describe, expect, it } from 'vitest';

import { QuizService } from '../../../../src/services/quiz.service';

describe('QuizService - Answer Validation', () => {
  let quizService: QuizService;
  let sessionId: string;

  beforeEach(() => {
    quizService = new QuizService();
    sessionId = quizService.startSession();
  });

  describe('Single Choice Questions', () => {
    it('should accept valid diet type options', () => {
      const validOptions = [
        'High meat consumption (meat multiple times per day)',
        'Moderate meat consumption (meat once per day)',
        'Low meat consumption (meat few times per week)',
        'Vegetarian (no meat, but dairy and eggs)',
        'Vegan (no animal products)'
      ];

      validOptions.forEach((option) => {
        const newSessionId = quizService.startSession();
        const result = quizService.submitAnswer(newSessionId, option);
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid food source options', () => {
      const sessionId = quizService.startSession();
      // Navigate to food_source question
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );

      const validOptions = [
        'Always (100% local/organic)',
        'Often (75% local/organic)',
        'Sometimes (50% local/organic)',
        'Rarely (25% local/organic)',
        'Never (0% local/organic)'
      ];

      validOptions.forEach((option) => {
        const newSessionId = quizService.startSession();
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        const result = quizService.submitAnswer(newSessionId, option);
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid energy source options', () => {
      const sessionId = quizService.startSession();
      // Navigate to energy_source question
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(sessionId, 'Sometimes (50% local/organic)');

      const validOptions = [
        'Renewable energy (solar, wind, hydro)',
        'Natural gas',
        'Coal-based electricity',
        'Nuclear power',
        'Mixed grid electricity (standard utility)'
      ];

      validOptions.forEach((option) => {
        const newSessionId = quizService.startSession();
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        quizService.submitAnswer(newSessionId, 'Sometimes (50% local/organic)');
        const result = quizService.submitAnswer(newSessionId, option);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid choice options', () => {
      const invalidOptions = [
        'Invalid diet type',
        '',
        'pescatarian',
        'VEGETARIAN',
        123,
        null,
        undefined
      ];

      invalidOptions.forEach((option) => {
        const newSessionId = quizService.startSession();
        const result = quizService.submitAnswer(newSessionId, option);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid option selected');
      });
    });

    it('should handle case sensitivity correctly', () => {
      const incorrectCaseOptions = [
        'vegetarian (no meat, but dairy and eggs)',
        'VEGAN (NO ANIMAL PRODUCTS)',
        'Vegan (No Animal Products)'
      ];

      incorrectCaseOptions.forEach((option) => {
        const newSessionId = quizService.startSession();
        const result = quizService.submitAnswer(newSessionId, option);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid option selected');
      });
    });
  });

  describe('Number Questions', () => {
    beforeEach(() => {
      // Navigate to the monthly_kwh question (numeric question)
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(sessionId, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        sessionId,
        'Mixed grid electricity (standard utility)'
      );
    });

    it('should accept valid numeric values', () => {
      const validValues = ['0', '100', '500', '2500', '5000'];

      validValues.forEach((value) => {
        const newSessionId = quizService.startSession();
        // Navigate to numeric question
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        quizService.submitAnswer(newSessionId, 'Sometimes (50% local/organic)');
        quizService.submitAnswer(
          newSessionId,
          'Mixed grid electricity (standard utility)'
        );

        const result = quizService.submitAnswer(newSessionId, value);
        expect(result.success).toBe(true);
      });
    });

    it('should accept numeric values as numbers', () => {
      const numericValues = [0, 100, 500, 2500, 5000];

      numericValues.forEach((value) => {
        const newSessionId = quizService.startSession();
        // Navigate to numeric question
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        quizService.submitAnswer(newSessionId, 'Sometimes (50% local/organic)');
        quizService.submitAnswer(
          newSessionId,
          'Mixed grid electricity (standard utility)'
        );

        const result = quizService.submitAnswer(newSessionId, value);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid numeric values', () => {
      const invalidValues = ['abc', 'null', '12.5.3', 'infinity'];

      invalidValues.forEach((value) => {
        const result = quizService.submitAnswer(sessionId, value);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Answer must be a number');
      });

      // Empty string is handled differently (required validation)
      const result = quizService.submitAnswer(sessionId, '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Answer is required');
    });

    it('should enforce minimum boundary', () => {
      const belowMin = ['-1', '-100', '-0.1'];

      belowMin.forEach((value) => {
        const newSessionId = quizService.startSession();
        // Navigate to numeric question
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        quizService.submitAnswer(newSessionId, 'Sometimes (50% local/organic)');
        quizService.submitAnswer(
          newSessionId,
          'Mixed grid electricity (standard utility)'
        );

        const result = quizService.submitAnswer(newSessionId, value);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Answer must be at least 0');
      });
    });

    it('should enforce maximum boundary', () => {
      const aboveMax = ['5001', '10000', '5000.1'];

      aboveMax.forEach((value) => {
        const newSessionId = quizService.startSession();
        // Navigate to numeric question
        quizService.submitAnswer(
          newSessionId,
          'Vegetarian (no meat, but dairy and eggs)'
        );
        quizService.submitAnswer(newSessionId, 'Sometimes (50% local/organic)');
        quizService.submitAnswer(
          newSessionId,
          'Mixed grid electricity (standard utility)'
        );

        const result = quizService.submitAnswer(newSessionId, value);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Answer must be at most 5000');
      });
    });

    it('should accept boundary values', () => {
      // Test minimum boundary (0)
      const newSessionId1 = quizService.startSession();
      quizService.submitAnswer(
        newSessionId1,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(newSessionId1, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        newSessionId1,
        'Mixed grid electricity (standard utility)'
      );
      let result = quizService.submitAnswer(newSessionId1, '0');
      expect(result.success).toBe(true);

      // Test maximum boundary (5000)
      const newSessionId2 = quizService.startSession();
      quizService.submitAnswer(
        newSessionId2,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(newSessionId2, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        newSessionId2,
        'Mixed grid electricity (standard utility)'
      );
      result = quizService.submitAnswer(newSessionId2, '5000');
      expect(result.success).toBe(true);
    });
  });
});
