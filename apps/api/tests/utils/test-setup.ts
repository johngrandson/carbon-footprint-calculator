import Fastify, { FastifyInstance } from 'fastify';
import { expect, vi } from 'vitest';

import quizController from '../../src/controllers/quiz.controller';

// Mock OpenAI to avoid needing API key in tests
vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test AI response' } }]
        })
      }
    }
  }))
}));

export async function createTestApp(): Promise<FastifyInstance> {
  const app = Fastify();
  app.register(quizController, { prefix: '/api/quiz' });
  await app.ready();
  return app;
}

export function expectValidSessionId(sessionId: string): void {
  expect(sessionId).toBeDefined();
  expect(typeof sessionId).toBe('string');
  expect(sessionId).toMatch(/^quiz_\d+_[a-z0-9]+$/);
}

export function expectValidQuizQuestion(question: any): void {
  expect(question).toBeDefined();
  expect(question.id).toBeDefined();
  expect(question.category).toBeDefined();
  expect(question.question).toBeDefined();
  expect(question.type).toBeDefined();
}

export function expectApiError(
  result: any,
  statusCode: number,
  error: string
): void {
  expect(result.error).toBe(error);
  expect(result.statusCode).toBe(statusCode);
}
