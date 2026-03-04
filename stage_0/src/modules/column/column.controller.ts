import { sendError, sendSuccess } from '../../common/utils/helper.res.js';
import { Request, Response } from 'express';
import columnService from './column.service.js';

class ColumnController {
  async createColumn(req: Request, res: Response) {
    try {
      const column = await columnService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', column);
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

  async deleteColumn(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const column = await columnService.delete(id);
      return sendSuccess(res, 200, 'Success', column);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
  
  async updateColumn(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedColumn = await columnService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedColumn);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
}
export default new ColumnController();
