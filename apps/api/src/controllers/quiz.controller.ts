import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import type {
  ApiError,
  QuizAnswerRequest,
  QuizAnswerResponse,
  QuizCalculationRequest,
  QuizCalculationResponse,
  QuizStartResponse,
  QuizStatusResponse
} from '@workspace/contracts';

import { AIService } from '../services/ai.service';
import { CalculationService } from '../services/calculation.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { QuizAnswerConverterService } from '../services/quiz-answer-converter.service';
import { QuizService } from '../services/quiz.service';

const quizController: FastifyPluginAsync = async (fastify) => {
  const quizService = new QuizService();
  const calculationService = new CalculationService();
  const aiService = new AIService();

  // Add a custom content parser for the start route to handle empty JSON
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'string' },
    async (request: FastifyRequest, payload: string) => {
      const body = payload.toString();
      if (body.trim() === '') {
        return {};
      }
      return JSON.parse(body);
    }
  );

  // POST /api/quiz/start - Start a new quiz session
  fastify.post<{
    Reply: QuizStartResponse | ApiError;
  }>('/start', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const sessionId = quizService.startSession();
      const question = quizService.getCurrentQuestion(sessionId);

      if (!question) {
        return ErrorHandlerService.handleInternalError(
          reply,
          'Failed to retrieve first question',
          fastify.log
        );
      }

      return {
        sessionId,
        question
      };
    } catch (error) {
      return ErrorHandlerService.handleQuizServiceError(
        reply,
        'Failed to start quiz session',
        fastify.log
      );
    }
  });

  // POST /api/quiz/answer - Submit an answer and get next question
  fastify.post<{
    Body: QuizAnswerRequest;
    Reply: QuizAnswerResponse | ApiError;
  }>('/answer', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId, answer } = request.body as QuizAnswerRequest;

      // Validate required fields
      if (!sessionId || answer === undefined) {
        return ErrorHandlerService.handleValidationError(
          reply,
          'sessionId and answer are required'
        );
      }

      // Submit answer to quiz service
      const result = quizService.submitAnswer(sessionId, answer);

      if (!result.success) {
        return ErrorHandlerService.handleValidationError(
          reply,
          result.error || 'Failed to submit answer'
        );
      }

      // Return completion status with optional next question
      return {
        completed: result.completed || false,
        question: result.nextQuestion,
        message: result.completed
          ? 'Quiz completed! Ready for calculation.'
          : undefined
      };
    } catch (error) {
      return ErrorHandlerService.handleQuizServiceError(
        reply,
        'Failed to submit answer',
        fastify.log
      );
    }
  });

  // POST /api/quiz/calculate - Calculate results and get AI recommendations
  fastify.post<{
    Body: QuizCalculationRequest;
    Reply: QuizCalculationResponse | ApiError;
  }>('/calculate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.body as QuizCalculationRequest;

      // Validate required fields
      if (!sessionId) {
        return ErrorHandlerService.handleValidationError(
          reply,
          'sessionId is required'
        );
      }

      // Check if quiz is completed
      if (!quizService.isSessionCompleted(sessionId)) {
        return ErrorHandlerService.handleValidationError(
          reply,
          'Quiz not completed yet'
        );
      }

      // Get quiz answers
      const answers = quizService.getSessionAnswers(sessionId);
      if (!answers) {
        return ErrorHandlerService.handleNotFoundError(
          reply,
          'Session not found'
        );
      }

      // Convert quiz answers to activities
      const activities =
        QuizAnswerConverterService.convertToActivities(answers);

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
      return ErrorHandlerService.handleQuizServiceError(
        reply,
        'Failed to calculate results',
        fastify.log
      );
    }
  });

  // GET /api/quiz/status/:sessionId - Get quiz status
  fastify.get<{
    Params: { sessionId: string };
    Reply: QuizStatusResponse | ApiError;
  }>(
    '/status/:sessionId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { sessionId } = request.params as { sessionId: string };

        const currentQuestion = quizService.getCurrentQuestion(sessionId);
        const completed = quizService.isSessionCompleted(sessionId);

        // Check if session exists
        if (!currentQuestion && !completed) {
          return ErrorHandlerService.handleNotFoundError(
            reply,
            'Session not found'
          );
        }

        return {
          sessionId,
          completed,
          currentQuestion: completed ? undefined : currentQuestion
        };
      } catch (error) {
        return ErrorHandlerService.handleQuizServiceError(
          reply,
          'Failed to get quiz status',
          fastify.log
        );
      }
    }
  );
};

export default quizController;
