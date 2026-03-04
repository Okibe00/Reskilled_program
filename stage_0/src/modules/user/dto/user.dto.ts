import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name is too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const UpdateUserSchema = z.object({
  email: z.email('Invalid email address').optional(),
  name: z.string().min(2, 'Name is too short').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
});
export const userParamSchema = z.object({
  id: z.uuid(),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = Partial<CreateUserDto>;
