import { Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const globalErrorHandler = (err: any, res: Response) => {
  // console.log(err)
  // 1. Handle Zod Validation Errors
  if (err instanceof ZodError) {
  console.log('errorrorrorro zod')
    return res.status(400).json({
      status: 'fail',
      errors: err.issues.map((e) => ({ path: e.path[1], message: e.message })),
    });
  }

  // 2. Handle Prisma Unique Constraint Errors (e.g., Duplicate Email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('dsdsdsdsdd prisma');
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: err.message,
      });
    }
    console.log('errrrrrrr')
    return res.status(500).json({
      status: 'error',
      message: 'Internal Ser Error',
    });
  }

  // 3. Fallback for everything else
  console.error("catch error trigger");
  return res.status(err.status || 500).json({
    status: 'error',
    code: err.code,
    message: err.message || 'Internaler Error',
  });
};
