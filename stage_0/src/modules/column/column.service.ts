import prisma from '../../config/database.js';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto.js';
class ColumnService {
  async create(data: CreateColumnDto) {
    return prisma.column.create({
      data: data,
    });
  }
  
  async update(id: string, data: UpdateColumnDto) {
    return prisma.column.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    return prisma.column.delete({
      where: { id },
    });
  }
}

export default new ColumnService();
