import prisma from '../../config/database.js';
import {
  CreateCardDto,
  UpdateCardDto,
  CreateTagDto,
  moveCardDto,
} from './dto/card.dto.js';
import { appEvents, EVENTS } from '../../common/events/event-emitter.js';
import { LexoRankUtil } from '../../common/utils/lexorank.utils.js';

class CardService {
  async moveCard(data: moveCardDto) {
    const { cardId, columnId, prevRank, nextRank } = data;
    const newRank = LexoRankUtil.calculateRank(prevRank, nextRank);

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: columnId,
        rank: newRank,
      },
      include: { column: { select: { boardId: true } } },
    });

    appEvents.emit(EVENTS.CARD_MOVED, {
      boardId: updatedCard.column.boardId,
      card: updatedCard,
    });

    return updatedCard;
  }

  async computeNewCardRank(data: any) {
    let newRank: string;

    const lastCard = await prisma.card.findFirst({
      where: { columnId: data.columnId },
      orderBy: { rank: 'desc' },
    });

    if (!lastCard) {
      newRank = LexoRankUtil.calculateRank(undefined, undefined);
    } else {
      newRank = LexoRankUtil.calculateRank(lastCard.rank, undefined);
    }
    return newRank;
  }
  async create(data: CreateCardDto) {
    const rank = await this.computeNewCardRank(data);

    const newCard = await prisma.card.create({
      data: { ...data, rank },
    });

    if (newCard) {
      const boardId = await prisma.column.findUnique({
        where: {
          id: newCard.columnId,
        },
        select: { boardId: true },
      });
      appEvents.emit(EVENTS.CARD_CREATED, { boardId, card: newCard });
    }
    return newCard;
  }

  async update(id: string, data: UpdateCardDto) {
    return prisma.card.update({
      where: { id },
      data: data,
    });
  }

  async assignTag(id: string, data: CreateTagDto) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (card) {
      const tag = await prisma.tag.create({
        data: data,
      });
      return prisma.card.update({
        where: { id },
        data: {
          tags: {
            connect: { id: tag.id },
          },
        },
      });
    }
    throw new Error('Failed to add tag');
  }

  async setDueDate(id: string, dueDate: string) {
    return prisma.card.update({
      where: { id },
      data: {
        dueDate: new Date(dueDate),
      },
    });
  }
  async delete(id: string) {
    return prisma.card.delete({
      where: { id },
    });
  }
  async getCardInColumn(id: string) {
    return prisma.card.findMany({
      where: { columnId: id },
      include: { tags: true },
    });
  }
}

export default new CardService();
