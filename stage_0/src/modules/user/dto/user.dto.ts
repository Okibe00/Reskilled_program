export type UpdateUserDto = Partial<CreateUserDto>;
import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(2, 'Name is too short'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
