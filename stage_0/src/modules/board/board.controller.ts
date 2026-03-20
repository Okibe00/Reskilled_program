import { sendSuccess } from '../../common/utils/helper.res.js';
import { NextFunction, Request, Response } from 'express';
import boardService from './board.service.js';
import { FetchAllBoardDto, FetchAllBoardSchema } from './dto/board.dto.js';

class BoardController {
  async getUserBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id as string;
      const query = FetchAllBoardSchema.parse(req.query);
      const boards = await boardService.findAllBoard(id, query);
      return sendSuccess(res, 200, 'Success', boards);
    } catch (error: any) {
      return next(error);
    }
  }

  async createBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await boardService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', board);
    } catch (error: any) {
      return next(error);
    }
  }

  async deleteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const board = await boardService.delete(id);
      return sendSuccess(res, 200, 'Success', board);
    } catch (error: any) {
      return next(error);
    }
  }
  async updateBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedBoard = await boardService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedBoard);
    } catch (error: any) {
      return next(error);
    }
  }
}
export default new BoardController();
