import { beforeEach, describe, expect, it } from 'vitest';

import { QuizService } from '../../../../src/services/quiz.service';

describe('QuizService - Error Handling', () => {
  let quizService: QuizService;

  beforeEach(() => {
    quizService = new QuizService();
  });

  describe('Invalid Session Scenarios', () => {
    it('should handle invalid session ID for answer submission', () => {
      const result = quizService.submitAnswer('invalid_session', 'some_answer');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session not found');
    });

    it('should handle empty session ID', () => {
      const result = quizService.submitAnswer('', 'some_answer');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session not found');
    });

    it('should handle null session ID', () => {
      const result = quizService.submitAnswer(null as any, 'some_answer');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session not found');
    });

    it('should handle undefined session ID', () => {
      const result = quizService.submitAnswer(undefined as any, 'some_answer');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session not found');
    });
  });

  describe('Completed Quiz Scenarios', () => {
    it('should prevent answers after completion', () => {
      const sessionId = quizService.startSession();

      // Complete the quiz
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(sessionId, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        sessionId,
        'Mixed grid electricity (standard utility)'
      );
      quizService.submitAnswer(sessionId, '500');

      // Try to submit another answer
      const result = quizService.submitAnswer(sessionId, 'extra_answer');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Quiz already completed');
    });

    it('should return null for current question after completion', () => {
      const sessionId = quizService.startSession();

      // Complete the quiz
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(sessionId, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        sessionId,
        'Mixed grid electricity (standard utility)'
      );
      quizService.submitAnswer(sessionId, '500');

      const currentQuestion = quizService.getCurrentQuestion(sessionId);
      expect(currentQuestion).toBeNull();
    });

    it('should still return answers after completion', () => {
      const sessionId = quizService.startSession();

      // Complete the quiz
      quizService.submitAnswer(
        sessionId,
        'Vegetarian (no meat, but dairy and eggs)'
      );
      quizService.submitAnswer(sessionId, 'Sometimes (50% local/organic)');
      quizService.submitAnswer(
        sessionId,
        'Mixed grid electricity (standard utility)'
      );
      quizService.submitAnswer(sessionId, '500');

      const answers = quizService.getSessionAnswers(sessionId);
      expect(answers).not.toBeNull();
      expect(answers).toEqual({
        diet_type: 'Vegetarian (no meat, but dairy and eggs)',
        food_source: 'Sometimes (50% local/organic)',
        energy_source: 'Mixed grid electricity (standard utility)',
        monthly_kwh: '500'
      });
    });
  });

  describe('Malformed Data Scenarios', () => {
    it('should handle object as answer', () => {
      const sessionId = quizService.startSession();
      const result = quizService.submitAnswer(sessionId, {
        invalid: 'object'
      } as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });

    it('should handle array as answer', () => {
      const sessionId = quizService.startSession();
      const result = quizService.submitAnswer(sessionId, [
        'invalid',
        'array'
      ] as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });

    it('should handle boolean as answer for choice question', () => {
      const sessionId = quizService.startSession();
      const result = quizService.submitAnswer(sessionId, true as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });

    it('should handle function as answer', () => {
      const sessionId = quizService.startSession();
      const result = quizService.submitAnswer(sessionId, (() => {}) as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });
  });

  describe('Edge Case Scenarios', () => {
    it('should handle whitespace-only answers', () => {
      const sessionId = quizService.startSession();
      const result = quizService.submitAnswer(sessionId, '   ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });

    it('should handle extremely long string answers', () => {
      const sessionId = quizService.startSession();
      const longString = 'a'.repeat(10000);
      const result = quizService.submitAnswer(sessionId, longString);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });

    it('should handle special characters in answers', () => {
      const sessionId = quizService.startSession();
      const specialChars = '!@#$%^&*()[]{}|\\:";\'<>?,./';
      const result = quizService.submitAnswer(sessionId, specialChars);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid option selected');
    });
  });

  describe('Numeric Question Edge Cases', () => {
    let sessionId: string;

    beforeEach(() => {
      sessionId = quizService.startSession();
      // Navigate to numeric question
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

    it('should handle decimal values correctly', () => {
      const result = quizService.submitAnswer(sessionId, '500.5');
      expect(result.success).toBe(true);
    });

    it('should handle scientific notation', () => {
      const result = quizService.submitAnswer(sessionId, '1e3');
      expect(result.success).toBe(true);
    });

    it('should reject infinity', () => {
      const result = quizService.submitAnswer(sessionId, 'Infinity');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Answer must be at most 5000');
    });

    it('should reject NaN string', () => {
      const result = quizService.submitAnswer(sessionId, 'NaN');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Answer must be a number');
    });

    it('should handle leading/trailing spaces in numbers', () => {
      const result = quizService.submitAnswer(sessionId, '  500  ');
      expect(result.success).toBe(true);
    });

    it('should handle numbers with leading zeros', () => {
      const result = quizService.submitAnswer(sessionId, '0500');
      expect(result.success).toBe(true);
    });
  });
});
