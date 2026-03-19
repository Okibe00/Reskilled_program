import { ColumnService } from './column.service.js';
import { prismaMock } from '../../__mock__/prisma.mock.js';

describe('ColumnService Core Operations', () => {
  let service =  new ColumnService(prismaMock as any);

  it('should successfully create a new column via prisma.create', async () => {
    const dto = { name: 'To Do', boardId: 'uuid-board-123', positionIndex: 2 };
    const expectedOutput = { id: 'uuid-1', ...dto, createdAt: new Date(), updatedAt: new Date()};

    prismaMock.column.create.mockResolvedValue(expectedOutput as any);

    const result = await service.create(dto as any);

    expect(result).toEqual(expectedOutput);
    expect(prismaMock.column.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should update an existing column record with the provided data', async () => {
    const id = 'uuid-col-1';
    const updateDto = { name: 'In Progress' };
    const updatedColumn = { id, name: 'In Progress', boardId: 'uuid-123', positionIndex: 2 };

    prismaMock.column.update.mockResolvedValue(updatedColumn as any);

    const result = await service.update(id, updateDto as any);

    expect(result.name).toBe('In Progress');
    expect(prismaMock.column.update).toHaveBeenCalledWith({
      where: { id },
      data: updateDto,
    });
  });

  it('should remove a column record when delete is called', async () => {
    const id = 'uuid-col-2';
    prismaMock.column.delete.mockResolvedValue({ id } as any);

    const result = await service.delete(id);

    expect(result.id).toBe(id);
    expect(prismaMock.column.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});