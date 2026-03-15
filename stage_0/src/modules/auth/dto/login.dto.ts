import { z } from 'zod';
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
