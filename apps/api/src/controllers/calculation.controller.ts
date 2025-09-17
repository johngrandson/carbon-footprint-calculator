import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import type {
  ApiError,
  CalculationRequest,
  CalculationResponse
} from '@workspace/contracts';
import { CalculationRequestSchema, safeValidate } from '@workspace/contracts';

import { CalculationService } from '../services/calculation.service';

const calculationController: FastifyPluginAsync = async (fastify) => {
  const calculationService = new CalculationService();

  // POST /api/calculate
  fastify.post<{
    Body: CalculationRequest;
    Reply: CalculationResponse | ApiError;
  }>('/calculate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validate request using Zod schema
      const validation = safeValidate(CalculationRequestSchema, request.body);

      if (!validation.success) {
        reply.code(400);

        return {
          error: 'Validation Error',
          message: 'Invalid request data',
          statusCode: 400,
          details: { validationErrors: validation.errors }
        };
      }

      const calculationRequest = validation.data;

      // Calculate emissions
      const result = await calculationService.calculate(calculationRequest);

      return result;
    } catch (error) {
      fastify.log.error('Calculation error');
      reply.code(500);

      return {
        error: 'Calculation Error',
        message: 'Failed to calculate carbon footprint',
        statusCode: 500
      };
    }
  });
};

export default calculationController;
