import prisma from '../../config/database.js';
import { CreateCardDto, UpdateCardDto, CreateTagDto } from './dto/card.dto.js';
import { appEvents, EVENTS } from '../../common/events/event-emitter.js';
class CardService {
  async create(data: CreateCardDto) {
    const newCard = await prisma.card.create({
      data: data,
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
