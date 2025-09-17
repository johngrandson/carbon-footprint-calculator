import { FastifyInstance } from 'fastify';
import calculationController from '../controllers/calculation.controller';

export const registerCalculationRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(calculationController, { prefix: '/api' });
};