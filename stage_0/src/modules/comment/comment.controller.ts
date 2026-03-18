import { sendError, sendSuccess } from '../../common/utils/helper.res.js';
import { Request, Response } from 'express';
import commentService from './comment.service.js';
import {
  CommentQueryParamDto,
  CreateCommentDto,
  RepliesCommentQueryDto,
  UpdateCommentDto,
} from './dto/comment.dto.js';

type commentServiceType = typeof commentService;
export class CommentController {
  constructor(private commentService: commentServiceType) {}

  async createComment(req: Request, res: Response) {
    try {
      const data = req.body as CreateCommentDto;
      const result = await this.commentService.create(data);
      return sendSuccess(res, 201, 'Resource created', result);
    } catch (error: any) {
      return sendError(
        res,
        400,
        'Failed to create  a resource',
        error.code,
        error
      );
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const id = req.query.commentId as string;
      const deletedComment = await this.commentService.delete(id);
      return sendSuccess(res, 200, 'Resource deleted', deletedComment);
    } catch (error: any) {
      return sendError(
        res,
        error.code,
        'Failed to delete a resource',
        error.code,
        error
      );
    }
  }
  async updateComment(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = req.body as UpdateCommentDto;
      const updatedComment = await this.commentService.update(data, id);
      return sendSuccess(res, 200, 'Resource deleted', updatedComment);
    } catch (error: any) {
      return sendError(
        res,
        error.code,
        'Failed to update resource',
        error.code,
        error
      );
    }
  }
  async findPaginatedComments(req: Request, res: Response) {
    try {
      const query = { ...req.query } as unknown as CommentQueryParamDto;
      const comments = await this.commentService.getPaginatedComments(
        query.cardId,
        query.page,
        query.limit,
        query.replyLimit
      );
      return sendSuccess(res, 200, 'success', comments);
    } catch (error: any) {
      return sendError(res, error.code, 'Failure', error);
    }
  }
  async findPaginatedReplies(req: Request, res: Response) {
    try {
      const query = { ...req.query } as unknown as RepliesCommentQueryDto;
      const comments = await this.commentService.getPaginatedComments(
        query.commentId,
        query.page,
        query.limit
      );
      return sendSuccess(res, 200, 'success', comments);
    } catch (error: any) {
      return sendError(res, error.code, 'Failure', error);
    }
  }
}

export default new CommentController(commentService);
