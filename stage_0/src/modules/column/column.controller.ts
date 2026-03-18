import { sendSuccess } from '../../common/utils/helper.res.js';
import { NextFunction, Request, Response } from 'express';
import columnService from './column.service.js';

class ColumnController {
  async createColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const column = await columnService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', column);
    } catch (error: any) {
      return next(error);
    }
  }

  async deleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const column = await columnService.delete(id);
      return sendSuccess(res, 200, 'Success', column);
    } catch (error: any) {
      return next(error);
    }
  }

  async updateColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedColumn = await columnService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedColumn);
    } catch (error: any) {
      return next(error);
    }
  }
}
export default new ColumnController();
