import { Response } from 'express';
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode: string,
  details?: any
) => {
  console.error(details);
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details,
    },
  });
};
