import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import type {
  ApiError,
  QuizAnswer,
  QuizCalculationRequest
} from '@workspace/contracts';

import { AIService } from '../services/ai.service';
import { CalculationService } from '../services/calculation.service';
import { QuizService } from '../services/quiz.service';

const quizController: FastifyPluginAsync = async (fastify) => {
  const quizService = new QuizService();
  const calculationService = new CalculationService();
  const aiService = new AIService();

  // POST /api/quiz/start - Start a new quiz session
  fastify.post<{
    Reply: { sessionId: string; question: any } | ApiError;
  }>('/start', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const sessionId = quizService.startSession();
      const question = quizService.getCurrentQuestion(sessionId);

      return {
        sessionId,
        question
      };
    } catch (error) {
      fastify.log.error('Failed to start quiz session');
      reply.code(500);
      return {
        error: 'Quiz Service Error',
        message: 'Failed to start quiz session',
        statusCode: 500
      };
    }
  });

  // POST /api/quiz/answer - Submit an answer and get next question
  fastify.post<{
    Body: QuizAnswer;
    Reply: any | ApiError;
  }>('/answer', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId, answer } = request.body as QuizAnswer;

      if (!sessionId || answer === undefined) {
        reply.code(400);
        return {
          error: 'Validation Error',
          message: 'sessionId and answer are required',
          statusCode: 400
        };
      }

      const result = quizService.submitAnswer(sessionId, answer);

      if (!result.success) {
        reply.code(400);
        return {
          error: 'Validation Error',
          message: result.error,
          statusCode: 400
        };
      }

      if (result.completed) {
        return {
          completed: true,
          message: 'Quiz completed! Ready for calculation.'
        };
      }

      return {
        completed: false,
        question: result.nextQuestion
      };
    } catch (error) {
      fastify.log.error('Failed to submit quiz answer');
      reply.code(500);
      return {
        error: 'Quiz Service Error',
        message: 'Failed to submit answer',
        statusCode: 500
      };
    }
  });

  // POST /api/quiz/calculate - Calculate results and get AI recommendations
  fastify.post<{
    Body: QuizCalculationRequest;
    Reply: any | ApiError;
  }>('/calculate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.body as QuizCalculationRequest;

      if (!sessionId) {
        reply.code(400);
        return {
          error: 'Validation Error',
          message: 'sessionId is required',
          statusCode: 400
        };
      }

      if (!quizService.isSessionCompleted(sessionId)) {
        reply.code(400);
        return {
          error: 'Validation Error',
          message: 'Quiz not completed yet',
          statusCode: 400
        };
      }

      const answers = quizService.getSessionAnswers(sessionId);
      if (!answers) {
        reply.code(404);
        return {
          error: 'Not Found',
          message: 'Session not found',
          statusCode: 404
        };
      }

      // Convert quiz answers to activities
      const activities = convertAnswersToActivities(answers);

      // Calculate carbon footprint
      const calculation = await calculationService.calculate({ activities });

      // Generate AI response with recommendations
      const aiResponse = await aiService.generateResponse(
        calculation,
        `User completed carbon footprint quiz with the following answers: ${JSON.stringify(answers)}`
      );

      return {
        sessionId,
        calculation,
        aiResponse,
        answers
      };
    } catch (error) {
      fastify.log.error('Failed to calculate quiz results');
      reply.code(500);
      return {
        error: 'Quiz Service Error',
        message: 'Failed to calculate results',
        statusCode: 500
      };
    }
  });

  // GET /api/quiz/status/:sessionId - Get quiz status
  fastify.get<{
    Params: { sessionId: string };
    Reply: any | ApiError;
  }>(
    '/status/:sessionId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { sessionId } = request.params as { sessionId: string };

        const currentQuestion = quizService.getCurrentQuestion(sessionId);
        const completed = quizService.isSessionCompleted(sessionId);

        if (!currentQuestion && !completed) {
          reply.code(404);
          return {
            error: 'Not Found',
            message: 'Session not found',
            statusCode: 404
          };
        }

        return {
          sessionId,
          completed,
          currentQuestion: completed ? null : currentQuestion
        };
      } catch (error) {
        fastify.log.error('Failed to get quiz status');
        reply.code(500);
        return {
          error: 'Quiz Service Error',
          message: 'Failed to get quiz status',
          statusCode: 500
        };
      }
    }
  );

  // Helper function to convert quiz answers to calculation activities
  function convertAnswersToActivities(answers: Record<string, any>) {
    const activities = [];

    // Convert diet type to food activity
    if (answers.diet_type) {
      const dietMap: Record<string, string> = {
        'High meat consumption (meat multiple times per day)': 'highMeat',
        'Moderate meat consumption (meat once per day)': 'moderateMeat',
        'Low meat consumption (meat few times per week)': 'lowMeat',
        'Vegetarian (no meat, but dairy and eggs)': 'vegetarian',
        'Vegan (no animal products)': 'vegetarian' // For now, treat vegan same as vegetarian
      };

      const dietType = dietMap[answers.diet_type];
      if (dietType) {
        activities.push({
          category: 'food' as const,
          type: dietType,
          amount: 365 // Annual calculation
        });
      }
    }

    // Convert energy source and consumption to energy activity
    if (answers.energy_source && answers.monthly_kwh) {
      const energyMap: Record<string, string> = {
        'Renewable energy (solar, wind, hydro)': 'renewable',
        'Natural gas': 'naturalGas',
        'Coal-based electricity': 'coal',
        'Nuclear power': 'nuclear',
        'Mixed grid electricity (standard utility)': 'mixed'
      };

      const energyType = energyMap[answers.energy_source];
      if (energyType) {
        activities.push({
          category: 'energy' as const,
          type: energyType,
          amount: Number(answers.monthly_kwh) * 12 // Convert to annual kWh
        });
      }
    }

    return activities;
  }
};

export default quizController;
