import 'dotenv/config';

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';

import { swaggerConfig } from '@workspace/contracts';

import { registerRoutes } from './routes';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

// Register Swagger plugins using contracts-generated config
await fastify.register(swagger, swaggerConfig.spec);
await fastify.register(swaggerUi, swaggerConfig.ui);

// Register all routes using the new router system
await registerRoutes(fastify);

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 API running at http://${host}:${port}`);
    console.log(`📚 Documentation at http://${host}:${port}/documentation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
