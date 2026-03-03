import prisma from '../../config/database.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';

class UserService {
  async createUser(data: CreateUserDto) {
    return await prisma.user.create({
      data: data,
      select: { id: true, email: true, name: true },
    });
  }
  async updateUser(id: string, data: UpdateUserDto) {
    return await prisma.user.update({
      where: { id },
      data: data,
    });
  }
  async findAll() {
    return await prisma.user.findMany();
  }
  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }
}

export default new UserService();
