import { PrismaClient } from '@prisma/client';
import prisma from '../../config/database.js';
import { CreateBoardDto, FetchAllBoardDto, UpdateBoardDto } from './dto/board.dto.js';
class BoardService {
  constructor(private prisma: PrismaClient){}
  async create(data: CreateBoardDto) {
    return this.prisma.board.create({
      data: data,
    });
  }
  async update(id: string, data: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: data,
    });
  }
  async findAllBoard(id: string, query: FetchAllBoardDto) {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    return this.prisma.board.findMany({
      where: {
        userId: id,
      },
      take: limit,
      skip,
    });
  }
  async delete(id: string) {
    return this.prisma.board.delete({
      where: { id },
    });
  }
}

export default new BoardService(prisma);
