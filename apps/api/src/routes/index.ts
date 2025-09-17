import { FastifyInstance } from 'fastify';
import { registerHealthRoutes } from './health.routes';
import { registerCalculationRoutes } from './calculation.routes';
import { registerQuizRoutes } from './quiz.routes';

export const registerRoutes = async (fastify: FastifyInstance) => {
  await registerHealthRoutes(fastify);
  await registerCalculationRoutes(fastify);
  await registerQuizRoutes(fastify);
};