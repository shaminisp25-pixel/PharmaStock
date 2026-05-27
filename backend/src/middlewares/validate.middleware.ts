import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';

export const validate = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Build validation object dynamically - only include non-empty objects
      const validateData: any = {};
      
      // Only validate body for methods that typically have bodies
      if (['POST', 'PATCH', 'PUT'].includes(req.method) && Object.keys(req.body).length > 0) {
        validateData.body = req.body;
      }
      
      // Include query params if they exist
      if (Object.keys(req.query).length > 0) {
        validateData.query = req.query;
      }
      
      // Include path params if they exist
      if (Object.keys(req.params).length > 0) {
        validateData.params = req.params;
      }

      // Only parse if there's something to validate
      if (Object.keys(validateData).length > 0) {
        await schema.parseAsync(validateData);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        throw new ApiError(422, 'Validation failed', errors);
      }
      next(err);
    }
  };
