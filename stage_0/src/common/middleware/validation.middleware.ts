import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateUser =
  (schema: ZodType, object: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (object === 'body') {
        await schema.parseAsync(req.body);
      } else if (object ===  'param') {
        await schema.parseAsync(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
