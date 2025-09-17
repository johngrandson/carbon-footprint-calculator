import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp, expectApiError } from '../../utils/test-setup';

describe('POST /api/quiz/calculate', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  async function completeQuizSession(): Promise<string> {
    // Start session
    const startResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });
    const { sessionId } = JSON.parse(startResponse.payload);

    // Answer all questions
    const answers = [
      'Vegetarian (no meat, but dairy and eggs)',
      'Sometimes (50% local/organic)',
      'Mixed grid electricity (standard utility)',
      '500'
    ];

    for (const answer of answers) {
      await app.inject({
        method: 'POST',
        url: '/api/quiz/answer',
        payload: { sessionId, answer }
      });
    }

    return sessionId;
  }

  async function startIncompleteSession(): Promise<string> {
    const startResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });
    const { sessionId } = JSON.parse(startResponse.payload);

    // Answer only first question
    await app.inject({
      method: 'POST',
      url: '/api/quiz/answer',
      payload: {
        sessionId,
        answer: 'Vegetarian (no meat, but dairy and eggs)'
      }
    });

    return sessionId;
  }

  it('should calculate results for completed quiz', async () => {
    const sessionId = await completeQuizSession();

    const calculateResponse = await app.inject({
      method: 'POST',
      url: '/api/quiz/calculate',
      payload: { sessionId }
    });

    expect(calculateResponse.statusCode).toBe(200);
    const result = JSON.parse(calculateResponse.payload);

    expect(result.sessionId).toBe(sessionId);
    expect(result.calculation).toBeDefined();
    expect(result.aiResponse).toBeDefined();
    expect(result.answers).toBeDefined();

    // Verify calculation structure
    expect(result.calculation.totalCarbonFootprint).toBeDefined();
    expect(typeof result.calculation.totalCarbonFootprint).toBe('number');

    // Verify AI response
    expect(typeof result.aiResponse).toBe('string');
    expect(result.aiResponse).toBe('Test AI response');

    // Verify answers
    expect(result.answers).toEqual({
      diet_type: 'Vegetarian (no meat, but dairy and eggs)',
      food_source: 'Sometimes (50% local/organic)',
      energy_source: 'Mixed grid electricity (standard utility)',
      monthly_kwh: '500'
    });
  });

  it('should return error for missing sessionId', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/calculate',
      payload: {}
    });

    expect(response.statusCode).toBe(400);
    const result = JSON.parse(response.payload);
    expectApiError(result, 400, 'Validation Error');
    expect(result.message).toBe('sessionId is required');
  });

  it('should return error for incomplete quiz', async () => {
    const sessionId = await startIncompleteSession();

    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/calculate',
      payload: { sessionId }
    });

    expect(response.statusCode).toBe(400);
    const result = JSON.parse(response.payload);
    expectApiError(result, 400, 'Validation Error');
    expect(result.message).toBe('Quiz not completed yet');
  });

  it('should return error for invalid sessionId', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/calculate',
      payload: { sessionId: 'invalid_session_id' }
    });

    expect(response.statusCode).toBe(400);
    const result = JSON.parse(response.payload);
    expectApiError(result, 400, 'Validation Error');
    expect(result.message).toBe('Quiz not completed yet');
  });
});
