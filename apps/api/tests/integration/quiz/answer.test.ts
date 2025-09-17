import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp, expectApiError } from '../../utils/test-setup';

describe('POST /api/quiz/answer', () => {
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

  it('should accept valid answer and return next question', async () => {
    const sessionId = await startQuizSession();

    const answerResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/answer',
      payload: {
        sessionId,
        answer: 'Vegetarian (no meat, but dairy and eggs)'
      }
    });

    expect(answerResponse.statusCode).toBe(200);
    const result = JSON.parse(answerResponse.payload);

    expect(result.completed).toBe(false);
    expect(result.question).toBeDefined();
    expect(result.question.id).toBe('food_source');
    expect(result.question.category).toBe('food');
  });

  it('should reject invalid answer', async () => {
    const sessionId = await startQuizSession();

    const answerResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/answer',
      payload: {
        sessionId,
        answer: 'Invalid diet type'
      }
    });

    expect(answerResponse.statusCode).toBe(400);
    const result = JSON.parse(answerResponse.payload);
    expectApiError(result, 400, 'Validation Error');
  });

  it('should return error for missing sessionId', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/answer',
      payload: {
        answer: 'Vegetarian (no meat, but dairy and eggs)'
      }
    });

    expect(response.statusCode).toBe(400);
    const result = JSON.parse(response.payload);
    expectApiError(result, 400, 'Validation Error');
    expect(result.message).toContain('sessionId and answer are required');
  });

  it('should return error for invalid sessionId', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/answer',
      payload: {
        sessionId: 'invalid_session_id',
        answer: 'Vegetarian (no meat, but dairy and eggs)'
      }
    });

    expect(response.statusCode).toBe(400);
    const result = JSON.parse(response.payload);
    expectApiError(result, 400, 'Validation Error');
    expect(result.message).toBe('Session not found');
  });
});
