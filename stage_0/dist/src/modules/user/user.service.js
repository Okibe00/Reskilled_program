import prisma from '../../config/database.js';
class UserService {
    async createUser(data) {
        return await prisma.user.create({
            data: data,
            select: { id: true, email: true, name: true },
        });
    }
    async updateUser(id, data) {
        return await prisma.user.update({
            where: { id },
            data: data,
        });
    }
    async findAll() {
        return await prisma.user.findMany();
    }
    async findById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
}
export default new UserService();
