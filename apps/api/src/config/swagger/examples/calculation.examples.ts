export const calculationExamples = {
  // Calculation request examples
  calculateRequest: {
    mixed_activities: {
      summary: 'Mixed food and energy activities',
      description: 'Example calculation with both food and energy activities',
      value: {
        activities: [
          {
            category: 'food',
            type: 'moderateMeat',
            amount: 365
          },
          {
            category: 'energy',
            type: 'mixedGrid',
            amount: 12000
          }
        ]
      }
    },
    vegetarian_renewable: {
      summary: 'Eco-friendly lifestyle',
      description: 'Vegetarian diet with renewable energy',
      value: {
        activities: [
          {
            category: 'food',
            type: 'vegetarian',
            amount: 365
          },
          {
            category: 'energy',
            type: 'renewable',
            amount: 8000
          }
        ]
      }
    },
    high_impact: {
      summary: 'High carbon footprint',
      description: 'High meat consumption with coal energy',
      value: {
        activities: [
          {
            category: 'food',
            type: 'highMeat',
            amount: 365
          },
          {
            category: 'energy',
            type: 'coal',
            amount: 15000
          }
        ]
      }
    }
  },

  // Calculation response examples
  calculateResponse: {
    mixed_activities: {
      summary: 'Successful calculation result',
      description: 'Carbon footprint calculation with breakdown and recommendations',
      value: {
        totalCarbonFootprint: 537850,
        categoryBreakdown: {
          food: 532900,
          energy: 4950
        },
        dailyAverage: 1473.56,
        annualEstimate: 537850,
        activities: [
          {
            activity: {
              category: 'food',
              type: 'moderateMeat',
              amount: 365
            },
            emissions: 532900,
            factor: 1460,
            factorUnit: 'kg CO2e/year or kg CO2e/kg'
          },
          {
            activity: {
              category: 'energy',
              type: 'mixedGrid',
              amount: 12000
            },
            emissions: 4950,
            factor: 0.45,
            factorUnit: 'kg CO2e/kWh'
          }
        ],
        recommendations: [],
        calculatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  },

  // Error response examples
  validationError: {
    summary: 'Validation error',
    description: 'Invalid request data with validation details',
    value: {
      error: 'Validation Error',
      message: 'Request validation failed',
      statusCode: 400,
      details: {
        validationErrors: [
          {
            field: 'activities.0.amount',
            message: 'Amount must be a positive number',
            value: -1
          }
        ]
      }
    }
  }
};