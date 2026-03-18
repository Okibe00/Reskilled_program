import { sendSuccess } from '../../common/utils/helper.res.js';
import { NextFunction, Request, Response } from 'express';
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

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateCommentDto;
      const result = await this.commentService.create(data);
      return sendSuccess(res, 201, 'Resource created', result);
    } catch (error: any) {
      return next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.commentId as string;
      const deletedComment = await this.commentService.delete(id);
      return sendSuccess(res, 200, 'Resource deleted', deletedComment);
    } catch (error: any) {
      return next(error);
    }
  }
  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = req.body as UpdateCommentDto;
      const updatedComment = await this.commentService.update(data, id);
      return sendSuccess(res, 200, 'Resource deleted', updatedComment);
    } catch (error: any) {
      return next(error);
    }
  }
  async findPaginatedComments(req: Request, res: Response, next: NextFunction) {
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
      return next(error);
    }
  }
  async findPaginatedReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const query = { ...req.query } as unknown as RepliesCommentQueryDto;
      const comments = await this.commentService.getPaginatedComments(
        query.commentId,
        query.page,
        query.limit
      );
      return sendSuccess(res, 200, 'success', comments);
    } catch (error: any) {
      return next(error);
    }
  }
}

export default new CommentController(commentService);
