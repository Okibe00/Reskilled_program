import { PrismaClient } from '@prisma/client';
import prisma from '../../config/database.js';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto.js';

export class ColumnService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateColumnDto) {
    return this.prisma.column.create({
      data: data,
    });
  }

  async update(id: string, data: UpdateColumnDto) {
    return this.prisma.column.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    return this.prisma.column.delete({
      where: { id },
    });
  }
}

export default new ColumnService(prisma);
