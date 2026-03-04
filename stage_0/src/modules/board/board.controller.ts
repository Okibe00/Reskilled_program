import { sendError, sendSuccess } from '../../common/utils/helper.res.js';
import { Request, Response } from 'express';
import boardService from './board.service.js';

class BoardController {
  async getUserBoard(req: Request, res: Response) {
    try {
      const id = req.user?.id as string;
      const boards = await boardService.findAllBoard(id);
      return sendSuccess(res, 200, 'Success', boards);
    } catch (error) {
      return sendError(res, 404, 'Failed', 'Not Found', error);
    }
  }

  async createBoard(req: Request, res: Response) {
    try {
      const board = await boardService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', board);
    } catch (error: any) {
      return sendError(
        res,
        400,
        'Failed to create resource',
        error.code,
        error
      );
    }
  }

  async deleteBoard(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const board = await boardService.delete(id);
      return sendSuccess(res, 200, 'Success', board);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
  async updateBoard(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedBoard = await boardService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedBoard);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
}
export default new BoardController();
