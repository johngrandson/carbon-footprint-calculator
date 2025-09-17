import { baseOpenApiSpec } from './base-spec';
import { calculationExamples } from './examples/calculation.examples';

// Simplified OpenAPI spec for Fastify swagger
const openApiSpec = {
  ...baseOpenApiSpec,
  components: {
    schemas: {
      CalculationRequest: {
        type: 'object',
        required: ['activities'],
        properties: {
          activities: {
            type: 'array',
            description: 'List of user activities for carbon footprint calculation',
            items: {
              type: 'object',
              required: ['category', 'type', 'amount'],
              properties: {
                category: {
                  type: 'string',
                  enum: ['food', 'energy'],
                  description: 'Activity category'
                },
                type: {
                  type: 'string',
                  description: 'Specific activity type within the category'
                },
                amount: {
                  type: 'number',
                  minimum: 0,
                  description: 'Amount/quantity of the activity'
                }
              }
            }
          }
        }
      },
      CalculationResponse: {
        type: 'object',
        properties: {
          totalCarbonFootprint: {
            type: 'number',
            description: 'Total carbon footprint in kg CO2e'
          },
          categoryBreakdown: {
            type: 'object',
            description: 'Emissions breakdown by category'
          },
          dailyAverage: {
            type: 'number',
            description: 'Daily average emissions'
          },
          annualEstimate: {
            type: 'number',
            description: 'Annual emissions estimate'
          },
          activities: {
            type: 'array',
            description: 'Detailed results for each activity',
            items: {
              type: 'object',
              properties: {
                activity: { $ref: '#/components/schemas/CalculationRequest/properties/activities/items' },
                emissions: { type: 'number' },
                factor: { type: 'number' },
                factorUnit: { type: 'string' }
              }
            }
          },
          recommendations: {
            type: 'array',
            items: { type: 'string' }
          },
          calculatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ApiError: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          statusCode: { type: 'number' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Check the health status of the API service',
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
      }
    },
    '/api/calculate': {
      post: {
        tags: ['Calculation'],
        summary: 'Calculate carbon footprint',
        description: 'Calculate carbon footprint based on user activities and return detailed breakdown with emission factors.',
        requestBody: {
          required: true,
          description: 'Activities data for carbon footprint calculation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculationRequest' },
              examples: calculationExamples.calculateRequest
            }
          }
        },
        responses: {
          200: {
            description: 'Successful calculation with detailed breakdown',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CalculationResponse' },
                examples: calculationExamples.calculateResponse
              }
            }
          },
          400: {
            description: 'Invalid input data or validation errors',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                examples: { validation_error: calculationExamples.validationError }
              }
            }
          }
        }
      }
    }
  }
};

// Swagger configuration for Fastify
export const swaggerConfig = {
  spec: {
    mode: 'static' as const,
    specification: {
      document: openApiSpec as any
    }
  },
  ui: {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full' as const,
      deepLinking: false
    },
    staticCSP: true
  }
};

export { openApiSpec };