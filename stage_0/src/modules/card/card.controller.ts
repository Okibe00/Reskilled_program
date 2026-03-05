import { sendError, sendSuccess } from '../../common/utils/helper.res.js';
import { Request, Response } from 'express';
import cardService from './card.service.js';

class CardController {
  async createCard(req: Request, res: Response) {
    try {
      const card = await cardService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', card);
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

  async deleteCard(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const card = await cardService.delete(id);
      return sendSuccess(res, 200, 'Success', card);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
  async getCardInColumn(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const card = await cardService.getCardInColumn(id);
      return sendSuccess(res, 200, 'Success', card);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }

  async updateCard(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }

  async assignTag(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.assignTag(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }

  async setDueDate(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.setDueDate(id, req.body.dueDate);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return sendError(res, 500, 'Failed', error);
    }
  }
}
export default new CardController();
