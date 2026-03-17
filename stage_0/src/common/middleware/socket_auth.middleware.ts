import { Socket } from 'socket.io';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
  };
}

export const socketAuthMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    socket.user = decoded;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};
