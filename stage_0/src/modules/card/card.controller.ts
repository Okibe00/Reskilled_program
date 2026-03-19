import { sendError, sendSuccess } from '../../common/utils/helper.res.js';
import { NextFunction, Request, Response } from 'express';
import cardService from './card.service.js';
import { moveCardDto, PaginatedCardDto } from './dto/card.dto.js';
import { nextTick } from 'node:process';

class CardController {
  async createCard(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.rank = '';
      const card = await cardService.create(req.body);
      return sendSuccess(res, 201, 'Resource Created', card);
    } catch (error: any) {
      return next(error);
    }
  }

  async moveCard(req: Request, res: Response, next: NextFunction) {
    try {
      const movedCard = await cardService.moveCard(req.query as moveCardDto);
      return sendSuccess(res, 200, 'Success', movedCard);
    } catch (error: any) {
      return next(error);
    }
  }
  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const card = await cardService.delete(id);
      return sendSuccess(res, 200, 'Success', card);
    } catch (error: any) {
      return next(error);
    }
  }
  async getCardInColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const card = await cardService.getCardInColumn(id);
      return sendSuccess(res, 200, 'Success', card);
    } catch (error: any) {
      return next(error);
    }
  }

  async updateCard(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.update(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return next(error);
    }
  }

  async assignTag(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.assignTag(id, req.body);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return next(error);
    }
  }

  async setDueDate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedCard = await cardService.setDueDate(id, req.body.dueDate);
      return sendSuccess(res, 200, 'Success', updatedCard);
    } catch (error: any) {
      return next(error);
    }
  }
  async getPaginatedCards(req: Request, res: Response, next: NextFunction) {
    try {
      const query = { ...req.query } as unknown as PaginatedCardDto;
      const cards = await cardService.getPaginatedCards(query);
      return sendSuccess(res, 200, 'Success', cards);
    } catch (error: any) {
      next(error);
    }
  }
}
export default new CardController();
