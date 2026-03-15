import { ErrorRequestHandler, NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      errors: err.issues.map((e) => ({ message: e.message })),
    });
  }

  // 2. Handle Prisma Unique Constraint Errors (e.g., Duplicate Email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }

  // 3. Fallback for everything else
  return res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Interner  server Error',
  });
};
