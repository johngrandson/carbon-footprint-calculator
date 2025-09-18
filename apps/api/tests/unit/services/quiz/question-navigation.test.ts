import { beforeEach, describe, expect, it } from 'vitest';

import { QuizService } from '../../../../src/services/quiz.service';

describe('QuizService - Question Navigation', () => {
  let quizService: QuizService;

  beforeEach(() => {
    quizService = new QuizService();
  });

  it('should progress through questions in correct order', () => {
    const sessionId = quizService.startSession();

    // First question: diet_type
    let currentQuestion = quizService.getCurrentQuestion(sessionId);
    expect(currentQuestion?.id).toBe('diet_type');

    // Submit answer and get next question: food_source
    let result = quizService.submitAnswer(
      sessionId,
      'Vegetarian (no meat, but dairy and eggs)'
    );
    expect(result.success).toBe(true);
    expect(result.nextQuestion?.id).toBe('food_source');

    // Submit answer and get next question: energy_source
    result = quizService.submitAnswer(
      sessionId,
      'Sometimes (50% local/organic)'
    );
    expect(result.success).toBe(true);
    expect(result.nextQuestion?.id).toBe('energy_source');

    // Submit answer and get final question: monthly_kwh
    result = quizService.submitAnswer(
      sessionId,
      'Mixed grid electricity (standard utility)'
    );
    expect(result.success).toBe(true);
    expect(result.nextQuestion?.id).toBe('monthly_kwh');

    // Submit final answer - quiz should be completed
    result = quizService.submitAnswer(sessionId, '500');
    expect(result.success).toBe(true);
    expect(result.completed).toBe(true);
    expect(result.nextQuestion).toBeUndefined();
  });

  it('should return null for completed session', () => {
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
    expect(currentQuestion).toBeUndefined();
    expect(quizService.isSessionCompleted(sessionId)).toBe(true);
  });

  it('should store all answers correctly', () => {
    const sessionId = quizService.startSession();

    quizService.submitAnswer(sessionId, 'Vegan (no animal products)');
    quizService.submitAnswer(sessionId, 'Always (100% local/organic)');
    quizService.submitAnswer(
      sessionId,
      'Renewable energy (solar, wind, hydro)'
    );
    quizService.submitAnswer(sessionId, '300');

    const answers = quizService.getSessionAnswers(sessionId);
    expect(answers).toEqual({
      diet_type: 'Vegan (no animal products)',
      food_source: 'Always (100% local/organic)',
      energy_source: 'Renewable energy (solar, wind, hydro)',
      monthly_kwh: '300'
    });
  });

  it('should maintain current question state correctly', () => {
    const sessionId = quizService.startSession();

    // Should start with first question
    expect(quizService.getCurrentQuestion(sessionId)?.id).toBe('diet_type');

    // After first answer, should move to second question
    quizService.submitAnswer(sessionId, 'Vegan (no animal products)');
    expect(quizService.getCurrentQuestion(sessionId)?.id).toBe('food_source');

    // After second answer, should move to third question
    quizService.submitAnswer(sessionId, 'Always (100% local/organic)');
    expect(quizService.getCurrentQuestion(sessionId)?.id).toBe('energy_source');

    // After third answer, should move to fourth question
    quizService.submitAnswer(
      sessionId,
      'Renewable energy (solar, wind, hydro)'
    );
    expect(quizService.getCurrentQuestion(sessionId)?.id).toBe('monthly_kwh');

    // After final answer, should return null (completed)
    quizService.submitAnswer(sessionId, '300');
    expect(quizService.getCurrentQuestion(sessionId)).toBeUndefined();
  });
});
