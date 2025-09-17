export const baseOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Carbon Footprint Calculator API',
    description: 'API for calculating carbon footprints from user activities and providing personalized sustainability recommendations through an interactive quiz system.',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@carboncalc.app'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'System health and monitoring endpoints'
    },
    {
      name: 'Calculation',
      description: 'Direct carbon footprint calculation endpoints'
    },
    {
      name: 'Quiz',
      description: 'Interactive quiz system for guided carbon footprint assessment'
    }
  ],
  components: {
    securitySchemes: {
      // Future: API key authentication if needed
    }
  }
};