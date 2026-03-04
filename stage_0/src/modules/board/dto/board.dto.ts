import { z } from 'zod';
export const UpdateBoardSchema = z.object({
  title: z.string().min(3, 'Name to short').optional(),
  description: z.string().min(2, 'description is too short').optional(),
});

export const CreateBoardSchema = z.object({
  title: z.string().min(3, 'Name to short'),
  userId: z.uuid(),
  description: z.string().min(3, 'description is too short').optional(),
});

export const BoardParamSchema = z.object({
  id: z.uuid(),
});
export type CreateBoardDto = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardDto = z.infer<typeof UpdateBoardSchema>;