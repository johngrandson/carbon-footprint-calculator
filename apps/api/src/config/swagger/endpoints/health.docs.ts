export const healthEndpointDocs = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check endpoint',
      description: 'Check the health status of the API service',
      operationId: 'getHealth',
      responses: {
        200: {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'ok',
                    description: 'Health status of the service'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T10:30:00.000Z',
                    description: 'Current server timestamp'
                  }
                },
                required: ['status', 'timestamp']
              },
              example: {
                status: 'ok',
                timestamp: '2024-01-15T10:30:00.000Z'
              }
            }
          }
        }
      }
    }
  }
};