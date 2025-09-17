import 'dotenv/config';

import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { swaggerConfig } from './config/swagger';
import { registerRoutes } from './routes';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

// Register Swagger plugins
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
    console.log(`📊 Calculate at http://${host}:${port}/api/calculate`);
    console.log(`📚 Documentation at http://${host}:${port}/documentation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
