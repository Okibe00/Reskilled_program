import { ErrorRequestHandler, NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Global Error Handler] ${req.method} ${req.originalUrl} -`, err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      code: 'VALIDATION_ERROR',
      errors: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string | string[] | undefined) || [];
      
      if (target.includes('rank') || target.includes('columnId_rank')) {
        return res.status(409).json({
          status: 'error',
          code: 'CONCURRENCY_CONFLICT',
          message: 'Another user modified this list at the exact same time. Please refresh and try again.',
        });
      }

      return res.status(409).json({
        status: 'error',
        code: 'DUPLICATE_DATA',
        message: 'A conflict occurred. This data already exists.',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND_OR_STALE',
        message: 'The requested record was not found, or it was recently modified by another user. Your changes could not be saved.',
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_RELATION',
        message: 'The requested operation failed because a related record does not exist (e.g., assigning a card to a non-existent column).',
      });
    }

    return res.status(500).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'A database operation failed.',
    });
  }

  return res.status(err.status || 500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
  });
};