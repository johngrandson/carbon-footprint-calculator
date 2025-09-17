import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Re-export all schemas with OpenAPI support
export * from '../activity.schemas';
export * from '../calculation.schemas';
export * from '../api.schemas';

// Re-export the enhanced zod for OpenAPI generation
export { z };