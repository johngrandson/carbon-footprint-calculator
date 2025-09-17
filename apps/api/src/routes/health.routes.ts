import { FastifyInstance } from 'fastify';

export const registerHealthRoutes = async (fastify: FastifyInstance) => {
  // Basic health check route
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
};