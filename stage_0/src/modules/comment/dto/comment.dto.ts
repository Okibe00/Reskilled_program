import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(3, 'Content length is too short  must be atleast 3 characters long'),
  userId: z.uuid(),
  parentId: z.uuid().optional(),
  cardId: z.uuid(),
});

export const UpdateCommentSchema = CreateCommentSchema.partial();
export const CommentParamSchema = z.object({
  id: z.uuid(),
});
export const CommentQuerySchema = z.object({
  parentId: z.uuid().optional(),
  cardId: z.uuid(),
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  replyLimit: z.coerce.number().int().min(1),
});
export const RepliesCommentQuerySchema = CommentQuerySchema.pick({
  page: true,
  limit: true,
}).extend({
  commentId: z.uuid(),
});
export const deleteCommentQuerySchema = RepliesCommentQuerySchema.pick({
  commentId: true,
});

export type DeleteCommentQueryDto = z.infer<typeof deleteCommentQuerySchema>;
export type RepliesCommentQueryDto = z.infer<typeof RepliesCommentQuerySchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
export type CommentParamDto = z.infer<typeof CommentParamSchema>;
export type CommentQueryParamDto = z.infer<typeof CommentQuerySchema>;
