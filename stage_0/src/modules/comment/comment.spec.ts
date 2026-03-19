import { eventManagerMock } from '../../__mock__/utils.js';
import { EVENTS } from '../../common/events/event-emitter.js';
import { prismaMock } from '../../__mock__/prisma.mock.js';
import { CommentService } from './comment.service.js';

describe('CommentService', () => {
  let service: CommentService;
  service = new CommentService(prismaMock as any, eventManagerMock as any);

  describe('create', () => {
    it('should create a comment and emit an event', async () => {
      const mockDto = { content: 'Hello world', cardId: '1', userId: 'u1' };
      const mockCreatedComment = {
        id: 'UUID-1',
        ...mockDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.comment.create.mockResolvedValue(mockCreatedComment as any);

      const result = await service.create(mockDto as any);
      expect(result).toEqual(mockCreatedComment);
      expect(prismaMock.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockDto })
      );

      expect(eventManagerMock.emit).toHaveBeenCalledWith(
        EVENTS.COMMENT_ADDED,
        mockCreatedComment
      );
      expect(eventManagerMock.emit).toHaveBeenCalled();
    });
  });

  describe('getPaginatedComments', () => {
    it('should return comments with correct pagination meta', async () => {
      const cardId = 'card-123';
      const mockComments = [
        { id: 'uuid-1', content: 'First' },
      ];

      
      prismaMock.comment.findMany.mockResolvedValue(mockComments as any)
      prismaMock.comment.count.mockResolvedValue(1);

      const result = await service.getPaginatedComments(cardId, 1, 10);
      expect(result.comments).toHaveLength(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('delete', () => {
    it('should call prisma delete with the correct id', async () => {
      const id = 'comment-to-delete';
      prismaMock.comment.delete.mockResolvedValue({ id } as any);

      await service.delete(id);

      expect(prismaMock.comment.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
