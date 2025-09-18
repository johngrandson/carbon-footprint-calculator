import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Create registry for our OpenAPI document
const registry = new OpenAPIRegistry();

// Base OpenAPI specification
const baseSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Carbon Footprint Calculator API',
    description:
      'API for calculating carbon footprints from user activities and providing personalized sustainability recommendations through an interactive quiz system.',
    version: '1.0.0'
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Development server' }
  ],
  tags: [
    { name: 'Health', description: 'System health and monitoring endpoints' },
    {
      name: 'Calculation',
      description: 'Direct carbon footprint calculation endpoints'
    },
    {
      name: 'Quiz',
      description:
        'Interactive quiz endpoints for guided carbon footprint assessment'
    }
  ]
};

// Define all routes directly with inline schemas to avoid dependency issues
registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  summary: 'Health check endpoint',
  responses: {
    200: {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/calculate',
  tags: ['Calculation'],
  summary: 'Calculate carbon footprint',
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              activities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    category: { type: 'string' },
                    value: { type: 'number' },
                    unit: { type: 'string' }
                  }
                }
              },
              region: { type: 'string' }
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Calculation completed successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              totalCarbonFootprint: { type: 'number' },
              categoryBreakdown: { type: 'object' },
              dailyAverage: { type: 'number' },
              annualEstimate: { type: 'number' },
              activities: { type: 'array' },
              recommendations: { type: 'array', items: { type: 'string' } },
              calculatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    400: {
      description: 'Invalid input data',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/quiz/start',
  tags: ['Quiz'],
  summary: 'Start a new quiz session',
  responses: {
    200: {
      description: 'Quiz session started',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              currentQuestion: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  category: { type: 'string' },
                  question: { type: 'string' },
                  type: { type: 'string' },
                  options: { type: 'array' }
                }
              },
              totalQuestions: { type: 'number' },
              currentQuestionIndex: { type: 'number' }
            }
          }
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/quiz/answer',
  tags: ['Quiz'],
  summary: 'Submit quiz answer',
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' },
              questionId: { type: 'string' },
              answer: { type: 'string' }
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Answer submitted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              nextQuestion: { type: 'object' },
              isCompleted: { type: 'boolean' },
              progress: {
                type: 'object',
                properties: {
                  currentQuestionIndex: { type: 'number' },
                  totalQuestions: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/quiz/calculate',
  tags: ['Quiz'],
  summary: 'Calculate quiz results',
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sessionId: { type: 'string' }
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Calculation completed with AI recommendations',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              totalCarbonFootprint: { type: 'number' },
              categoryBreakdown: { type: 'object' },
              activities: { type: 'array' },
              recommendations: { type: 'array' },
              aiAnalysis: { type: 'string' }
            }
          }
        }
      }
    }
  }
});

// Generate the OpenAPI document
const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument(baseSpec);

// Define proper interface to match Fastify's expected structure
interface FastifySwaggerSpec {
  mode: 'static';
  specification: {
    document: Record<string, any>;
  };
}

interface FastifySwaggerUI {
  routePrefix: string;
  uiConfig: {
    docExpansion: 'full' | 'list' | 'none';
    deepLinking: boolean;
  };
  staticCSP: boolean;
}

// Properly typed Swagger configuration
export const swaggerConfig = {
  spec: {
    mode: 'static' as const,
    specification: {
      document: JSON.parse(JSON.stringify(openApiDocument)) // Serialize to plain object
    }
  } satisfies FastifySwaggerSpec,
  ui: {
    routePrefix: '/documentation',
    uiConfig: { docExpansion: 'full' as const, deepLinking: false },
    staticCSP: true
  } satisfies FastifySwaggerUI
};
