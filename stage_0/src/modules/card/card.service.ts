import prisma from '../../config/database.js';
import {
  CreateCardDto,
  UpdateCardDto,
  CreateTagDto,
  moveCardDto,
  PaginatedCardDto,
} from './dto/card.dto.js';
import {
  appEvents,
  appEventsType,
  EVENTS,
} from '../../common/events/event-emitter.js';
import {
  LexoRankUtil,
  LexoRankUtilType,
} from '../../common/utils/lexorank.utils.js';
import { PrismaClient } from '@prisma/client';

export class CardService {
  constructor(
    private prisma: PrismaClient,
    private LexoRankUtil: LexoRankUtilType,
    private eventManager: appEventsType
  ) {}
  async moveCard(data: moveCardDto) {
    const { cardId, columnId, prevRank, nextRank } = data;
    const newRank = this.LexoRankUtil.calculateRank(prevRank, nextRank);

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: columnId,
        rank: newRank,
        version: { increment: 1 },
      },
      include: { column: { select: { boardId: true } } },
    });

    this.eventManager.emit(EVENTS.CARD_MOVED, {
      boardId: updatedCard.column.boardId,
      card: updatedCard,
    });

    return updatedCard;
  }

  async computeNewCardRank(data: any) {
    let newRank: string;

    const lastCard = await this.prisma.card.findFirst({
      where: { columnId: data.columnId },
      orderBy: { rank: 'desc' },
    });

    if (!lastCard) {
      newRank = this.LexoRankUtil.calculateRank(undefined, undefined);
    } else {
      newRank = this.LexoRankUtil.calculateRank(lastCard.rank, undefined);
    }
    return newRank;
  }
  async create(data: CreateCardDto) {
    const rank = await this.computeNewCardRank(data);

    const newCard = await this.prisma.card.create({
      data: { ...data, rank },
    });

    if (newCard) {
      const boardId = await this.prisma.column.findUnique({
        where: {
          id: newCard.columnId,
        },
        select: { boardId: true },
      });
      this.eventManager.emit(EVENTS.CARD_CREATED, { boardId, card: newCard });
    }
    return newCard;
  }

  async update(id: string, data: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id, version: data.version },
      data: { ...data, version: { increment: 1 } },
    });
  }

  async assignTag(id: string, data: CreateTagDto) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (card) {
      const tag = await this.prisma.tag.create({
        data: data,
      });
      return this.prisma.card.update({
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
    return this.prisma.card.update({
      where: { id },
      data: {
        dueDate: new Date(dueDate),
      },
    });
  }
  async delete(id: string) {
    return this.prisma.card.delete({
      where: { id },
    });
  }
  async getCardInColumn(id: string) {
    return this.prisma.card.findMany({
      where: { columnId: id },
      include: { tags: true },
    });
  }
  async getPaginatedCards(data: PaginatedCardDto) {
    const { columnId, cursorId } = data;
    let limit: any = `${data.limit}`;
    limit = parseInt(limit);
    const cards = await this.prisma.card.findMany({
      where: { columnId },
      take: limit + 1,
      cursor: cursorId ? { id: cursorId } : undefined,
      orderBy: { rank: 'asc' },
    });

    let nextCursor: typeof cursorId | undefined = undefined;

    if (cards.length > limit) {
      const nextItem = cards.pop();
      nextCursor = nextItem!.id;
    }

    return { data: cards, nextCursor };
  }
}

export default new CardService(prisma, LexoRankUtil, appEvents);
