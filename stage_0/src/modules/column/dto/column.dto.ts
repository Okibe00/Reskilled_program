import { z } from 'zod';
export const UpdateColumnSchema = z.object({
  name: z.string().min(3, 'Name to short').optional(),
  positionIndex: z.int().min(1).optional(),
});

export const CreateColumnSchema = z.object({
  name: z.string().min(3, 'Name to short'),
  boardId: z.uuid(),
  positionIndex: z.int().min(1),
});

export const ColumnParamSchema = z.object({
  id: z.uuid(),
});
export type CreateColumnDto = z.infer<typeof CreateColumnSchema>;
export type UpdateColumnDto = z.infer<typeof UpdateColumnSchema>;
