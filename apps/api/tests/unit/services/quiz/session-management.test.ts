import { beforeEach, describe, expect, it } from 'vitest';

import { QuizService } from '../../../../src/services/quiz.service';

describe('QuizService - Session Management', () => {
  let quizService: QuizService;

  beforeEach(() => {
    quizService = new QuizService();
  });

  it('should generate unique session IDs', () => {
    const sessionId1 = quizService.startSession();
    const sessionId2 = quizService.startSession();

    expect(sessionId1).not.toBe(sessionId2);
    expect(sessionId1).toMatch(/^quiz_\d+_[a-z0-9]+$/);
    expect(sessionId2).toMatch(/^quiz_\d+_[a-z0-9]+$/);
  });

  it('should create new session with initial state', () => {
    const sessionId = quizService.startSession();
    const currentQuestion = quizService.getCurrentQuestion(sessionId);

    expect(currentQuestion).toBeDefined();
    expect(currentQuestion?.id).toBe('diet_type');
    expect(quizService.isSessionCompleted(sessionId)).toBe(false);
  });

  it('should return null for non-existent session', () => {
    const currentQuestion = quizService.getCurrentQuestion('invalid_session');

    expect(currentQuestion).toBeNull();
  });

  it('should handle multiple concurrent sessions', () => {
    const sessionId1 = quizService.startSession();
    const sessionId2 = quizService.startSession();

    // Submit different answers to different sessions
    const result1 = quizService.submitAnswer(
      sessionId1,
      'Vegetarian (no meat, but dairy and eggs)'
    );
    const result2 = quizService.submitAnswer(
      sessionId2,
      'Vegan (no animal products)'
    );

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    // Verify sessions maintain separate state
    const answers1 = quizService.getSessionAnswers(sessionId1);
    const answers2 = quizService.getSessionAnswers(sessionId2);

    expect(answers1?.diet_type).toBe(
      'Vegetarian (no meat, but dairy and eggs)'
    );
    expect(answers2?.diet_type).toBe('Vegan (no animal products)');
  });

  it('should return null for answers of non-existent session', () => {
    const answers = quizService.getSessionAnswers('invalid_session');
    expect(answers).toBeNull();
  });

  it('should return false for completion check of non-existent session', () => {
    const isCompleted = quizService.isSessionCompleted('invalid_session');
    expect(isCompleted).toBe(false);
  });
});
