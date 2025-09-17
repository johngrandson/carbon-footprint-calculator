import { FastifyInstance } from 'fastify';
import quizController from '../controllers/quiz.controller';

export const registerQuizRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(quizController, { prefix: '/api/quiz' });
};