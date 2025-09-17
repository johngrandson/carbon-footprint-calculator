import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestApp, expectValidSessionId } from '../../utils/test-setup';

describe('POST /api/quiz/start', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start a new quiz session and return first question', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.payload);

    // Should return session ID
    expectValidSessionId(result.sessionId);

    // Should return first question
    expect(result.question).toBeDefined();
    expect(result.question.id).toBe('diet_type');
    expect(result.question.category).toBe('food');
    expect(result.question.question).toBe('What best describes your diet?');
    expect(result.question.type).toBe('single_choice');
    expect(result.question.options).toHaveLength(5);
    expect(result.question.options).toContain(
      'Vegetarian (no meat, but dairy and eggs)'
    );
  });

  it('should generate unique session IDs for multiple starts', async () => {
    const response1 = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });

    const response2 = await app.inject({
      method: 'POST',
      url: '/api/quiz/start'
    });

    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);

    const result1 = JSON.parse(response1.payload);
    const result2 = JSON.parse(response2.payload);

    expect(result1.sessionId).not.toBe(result2.sessionId);
  });
});
