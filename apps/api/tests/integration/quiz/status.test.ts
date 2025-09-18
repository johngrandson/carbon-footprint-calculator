import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp, expectApiError } from '../../utils/test-setup';

describe('GET /api/quiz/status/:sessionId', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  async function startQuizSession(): Promise<string> {
    const startResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });
    const { sessionId } = JSON.parse(startResponse.payload);
    return sessionId;
  }

  it('should return quiz status for valid session', async () => {
    const sessionId = await startQuizSession();

    const statusResponse = await app.inject({
      method: 'GET',
      url: `/api/quiz/status/${sessionId}`
    });

    expect(statusResponse.statusCode).toBe(200);
    const result = JSON.parse(statusResponse.payload);

    expect(result.sessionId).toBe(sessionId);
    expect(result.completed).toBe(false);
    expect(result.currentQuestion).toBeDefined();
    expect(result.currentQuestion.id).toBe('diet_type');
  });

  it('should return completed status with undefined currentQuestion when quiz is complete', async () => {
    const sessionId = await startQuizSession();

    // Answer all quiz questions to complete the quiz
    const questions = [
      { answer: 'High meat consumption (meat multiple times per day)' },
      { answer: 'Always (100% local/organic)' },
      { answer: 'Renewable energy (solar, wind, hydro)' },
      { answer: 500 }
    ];

    for (const question of questions) {
      await app.inject({
        method: 'POST',
        url: '/api/quiz/answer',
        payload: {
          sessionId,
          answer: question.answer
        }
      });
    }

    // Check status after completion
    const statusResponse = await app.inject({
      method: 'GET',
      url: `/api/quiz/status/${sessionId}`
    });

    expect(statusResponse.statusCode).toBe(200);
    const result = JSON.parse(statusResponse.payload);

    expect(result.sessionId).toBe(sessionId);
    expect(result.completed).toBe(true);
    expect(result.currentQuestion).toBeUndefined();
  });

  it('should return 404 for invalid session', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/quiz/status/invalid_session_id'
    });

    expect(response.statusCode).toBe(404);
    const result = JSON.parse(response.payload);
    expectApiError(result, 404, 'Not Found');
  });
});
