import { prismaMock } from '../../__mock__/prisma.mock.js';
import { BoardService } from './board.service.js';

describe('BoardService: CRUD and User Board Management', () => {
  let service = new BoardService(prismaMock);

  it('should create a new board record', async () => {
    const dto = { title: 'Project Alpha',description: 'project about lagos rent crisis', userId: 'uuid-user-1' };
    const expectedBoard = {
      id: 'b-1',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.board.create.mockResolvedValue(expectedBoard as any);

    const result = await service.create(dto as any);

    expect(result).toEqual(expectedBoard);
    expect(prismaMock.board.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should update board details by ID', async () => {
    const id = 'b-1';
    const updateDto = { title: 'Project Beta' };
    const updatedBoard = { id, title: 'Project Beta', userId: 'user-1' };

    prismaMock.board.update.mockResolvedValue(updatedBoard as any);

    const result = await service.update(id, updateDto as any);

    expect(result.title).toBe('Project Beta');
    expect(prismaMock.board.update).toHaveBeenCalledWith({
      where: { id },
      data: updateDto,
    });
  });

  it('should fetch paginated boards for a specific user', async () => {
    const userId = 'user-123';
    const query = { limit: 5, page: 2 };
    const mockBoards = [
      { id: 'b-1', title: 'Board 1' },
      { id: 'b-2', title: 'Board 2' },
    ];

    prismaMock.board.findMany.mockResolvedValue(mockBoards as any);

    const result = await service.findAllBoard(userId, query as any);

    expect(prismaMock.board.findMany).toHaveBeenCalledWith({
      where: { userId },
      take: 5,
      skip: 5,
    });
    expect(result).toEqual(mockBoards);
  });

  it('should delete a board record', async () => {
    const id = 'b-delete';
    prismaMock.board.delete.mockResolvedValue({ id } as any);

    const result = await service.delete(id);

    expect(result.id).toBe(id);
    expect(prismaMock.board.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
