export const quizExamples = {
  // Quiz start response
  startResponse: {
    summary: 'Quiz session started',
    description: 'New quiz session with first question',
    value: {
      sessionId: 'quiz_1705312200000_abc123',
      question: {
        id: 'diet_type',
        text: 'What best describes your diet?',
        type: 'single_choice',
        options: [
          'High meat consumption (meat multiple times per day)',
          'Moderate meat consumption (meat once per day)',
          'Low meat consumption (meat few times per week)',
          'Vegetarian (no meat, but dairy and eggs)',
          'Vegan (no animal products)'
        ],
        required: true
      }
    }
  },

  // Quiz answer request
  answerRequest: {
    summary: 'Submit quiz answer',
    description: 'Answer submission for current question',
    value: {
      sessionId: 'quiz_1705312200000_abc123',
      answer: 'Moderate meat consumption (meat once per day)'
    }
  },

  // Quiz answer response - next question
  answerResponseNext: {
    summary: 'Next question',
    description: 'Answer accepted, proceeding to next question',
    value: {
      completed: false,
      question: {
        id: 'food_source',
        text: 'How often do you buy local or organic food?',
        type: 'single_choice',
        options: [
          'Always (100% local/organic)',
          'Often (75% local/organic)',
          'Sometimes (50% local/organic)',
          'Rarely (25% local/organic)',
          'Never (0% local/organic)'
        ],
        required: true
      }
    }
  },

  // Quiz answer response - completed
  answerResponseCompleted: {
    summary: 'Quiz completed',
    description: 'All questions answered, ready for calculation',
    value: {
      completed: true,
      message: 'Quiz completed! Ready for calculation.'
    }
  },

  // Quiz calculation request
  calculateRequest: {
    summary: 'Calculate quiz results',
    description: 'Request calculation after completing quiz',
    value: {
      sessionId: 'quiz_1705312200000_abc123'
    }
  },

  // Quiz calculation response
  calculateResponse: {
    summary: 'Quiz calculation results',
    description: 'Carbon footprint calculation with AI recommendations',
    value: {
      sessionId: 'quiz_1705312200000_abc123',
      calculation: {
        totalCarbonFootprint: 367740,
        categoryBreakdown: {
          food: 532900,
          energy: 4950
        },
        dailyAverage: 1007.78,
        annualEstimate: 367740,
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
              type: 'mixed',
              amount: 12000
            },
            emissions: 5400,
            factor: 0.45,
            factorUnit: 'kg CO2e/kWh'
          }
        ],
        recommendations: [],
        calculatedAt: '2024-01-15T10:35:00.000Z'
      },
      aiResponse: 'Based on your carbon footprint calculation, here are personalized recommendations...',
      answers: {
        diet_type: 'Moderate meat consumption (meat once per day)',
        food_source: 'Sometimes (50% local/organic)',
        energy_source: 'Mixed grid electricity (standard utility)',
        monthly_kwh: '1000'
      }
    }
  },

  // Quiz status response
  statusResponse: {
    summary: 'Quiz session status',
    description: 'Current status of quiz session',
    value: {
      sessionId: 'quiz_1705312200000_abc123',
      completed: false,
      currentQuestion: {
        id: 'energy_source',
        text: 'What is your primary energy source?',
        type: 'single_choice',
        options: [
          'Renewable energy (solar, wind, hydro)',
          'Natural gas',
          'Coal-based electricity',
          'Nuclear power',
          'Mixed grid electricity (standard utility)'
        ],
        required: true
      }
    }
  }
};