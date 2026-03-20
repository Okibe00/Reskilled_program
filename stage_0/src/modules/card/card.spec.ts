import { CardService } from './card.service.js';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { prismaMock } from '../../__mock__/prisma.mock.js';
import { eventManagerMock, mockLexoRankUtil } from '../../__mock__/utils.js';

const EVENTS = {
  CARD_MOVED: 'CARD_MOVED',
  CARD_CREATED: 'CARD_CREATED',
};

describe('CardService', () => {
  let service = new CardService(
    prismaMock,
    mockLexoRankUtil as any,
    eventManagerMock as any
  );

  it('should move a card and emit CARD_MOVED with the correct boardId', async () => {
    const moveDto = {
      cardId: 'c1',
      columnId: 'col-2',
      prevRank: 'rank-a',
      nextRank: 'rank-b',
    };

    const calculatedRank = 'rank-between';
    const updatedCard = {
      id: 'c1',
      columnId: 'col-2',
      rank: calculatedRank,
      column: { boardId: 'board-99' },
    };

    mockLexoRankUtil.calculateRank.mockReturnValue(calculatedRank);
    prismaMock.card.update.mockResolvedValue(updatedCard as any);

    const result = await service.moveCard(moveDto as any);
    expect(mockLexoRankUtil.calculateRank).toHaveBeenCalledWith(
      'rank-a',
      'rank-b'
    );

    expect(prismaMock.card.update).toHaveBeenCalled();

    expect(eventManagerMock.emit).toHaveBeenCalledWith(EVENTS.CARD_MOVED, {
      boardId: 'board-99',
      card: updatedCard,
    });

    expect(result).toEqual(updatedCard);
  });

  it('should compute a new rank for the first card in a column', async () => {
    prismaMock.card.findFirst.mockResolvedValue(null);
    mockLexoRankUtil.calculateRank.mockReturnValue('middle-rank');

    const rank = await service.computeNewCardRank({ columnId: 'empty-col' });

    expect(rank).toBe('middle-rank');
    expect(mockLexoRankUtil.calculateRank).toHaveBeenCalledWith(
      undefined,
      undefined
    );
  });

  it('should compute a rank after the last card in a column', async () => {
    const lastCard = { rank: 'last-rank-string' };
    prismaMock.card.findFirst.mockResolvedValue(lastCard as any);
    mockLexoRankUtil.calculateRank.mockReturnValue('new-bottom-rank');

    const rank = await service.computeNewCardRank({ columnId: 'filled-col' });

    expect(rank).toBe('new-bottom-rank');
    expect(mockLexoRankUtil.calculateRank).toHaveBeenCalledWith(
      'last-rank-string',
      undefined
    );
  });

  it('should handle cursor-based pagination and return a nextCursor', async () => {
    const paginatedDto = { columnId: 'uuid-1', limit: 2 };
    const mockCards = [
      { id: '1', rank: 'a' },
      { id: '2', rank: 'b' },
      { id: '3', rank: 'c' },
    ];

    prismaMock.card.findMany.mockResolvedValue(mockCards as any);

    const result = await service.getPaginatedCards(paginatedDto as any);

    expect(result.data).toHaveLength(2);
    expect(result.nextCursor).toBe('3');
    expect(prismaMock.card.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 3,
        orderBy: { rank: 'asc' },
      })
    );
  });

  it('should throw an error in assignTag if card is not found', async () => {
    prismaMock.card.findUnique.mockResolvedValue(null);

    await expect(service.assignTag('invalid-id', {} as any)).rejects.toThrow(
      'Failed to add tag'
    );
  });
});
