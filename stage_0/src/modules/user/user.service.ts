import { PrismaClient } from '@prisma/client';
import prisma from '../../config/database.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';

export class UserService {
  constructor(private prisma: PrismaClient) {}
  async createUser(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: data,
      select: { id: true, email: true, name: true },
    });
  }
  async updateUser(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: data,
    });
  }
  async findAll() {
    return await this.prisma.user.findMany();
  }
  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
  async deleteUser(id: string) {
    //delete associated boards, column, cards.
    return await this.prisma.user.delete({ where: { id } });
  }
}
export type UserServiceType = InstanceType<typeof  UserService>

export default new UserService(prisma);
