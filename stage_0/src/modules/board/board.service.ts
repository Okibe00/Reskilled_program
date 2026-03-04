import prisma from '../../config/database.js';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto.js';
class BoardService {
  async create(data: CreateBoardDto) {
    return prisma.board.create({
      data: data,
    });
  }
  async update(id: string, data: UpdateBoardDto) {
    return prisma.board.update({
      where: { id },
      data: data,
    });
  }
  //todo: pagination required
  async findAllBoard(id: string) {
    return prisma.board.findMany({
      where: {
        userId: id,
      },
    });
  }
  async delete(id: string) {
    return prisma.board.delete({
      where: { id },
    });
  }
}

export default new BoardService();
