import { z } from 'zod';
export const UpdateCardSchema = z.object({
  title: z
    .string()
    .min(3, 'Title too short must be atleast 3 characters long')
    .optional(),
  content: z
    .string()
    .min(3, 'Content length is too short  must be atleast 3 characters long')
    .optional(),
  dueDate: z.coerce.date().optional(),
  positionIndex: z.int().min(1).optional(),
});
export const moveCardSchema = z.object({
  cardId: z.uuid(),
  columnId: z.uuid(),
  prevRank: z.string().optional(),
  nextRank: z.string().optional(),
});
export const CreateCardSchema = z.object({
  title: z.string().min(3, 'Name to short must be atleast 3 characters long'),
  content: z
    .string()
    .min(3, 'Content length is too short  must be atleast 3 characters long')
    .optional(),
  dueDate: z.coerce.date().optional(),
  positionIndex: z.int().min(1),
  columnId: z.uuid(),
  rank: z.string(),
});
export const CreateTagSchema = z.object({
  label: z.string().min(3, 'Label too short must be atleast 3 characters long'),
  colorHex: z.string().regex(/^#?[0-9A-Fa-f]{6}$/),
});

export const CardParamSchema = z.object({
  id: z.uuid(),
});
export type CreateCardDto = z.infer<typeof CreateCardSchema>;
export type UpdateCardDto = z.infer<typeof UpdateCardSchema>;
export type CreateTagDto = z.infer<typeof CreateTagSchema>;
export type CardParamDto = z.infer<typeof CardParamSchema>;
export type moveCardDto = z.infer<typeof moveCardSchema>;
